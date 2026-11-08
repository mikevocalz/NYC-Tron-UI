/**
 * Long-task scheduling (N-13): a cooperative FIFO queue for cancellable
 * decode, export and render work supplied by the host.
 *
 * JavaScript is single-threaded: this scheduler cannot preempt synchronous
 * work. Tasks run one at a time in submission order, each task yields at its
 * own {@linkcode TaskContext.checkpoint} boundaries, and cancellation is
 * observed there. Native decode offload, worker threads and true
 * cancellation of codec work stay with the engine/host; this module owns
 * ordering, queue bounds, progress delivery and settled results.
 */

/** Thrown by {@linkcode TaskContext.throwIfCancelled} and surfaced as the
 * rejection of a task cancelled before or during its run. */
export class TaskCancelledError extends Error {
  readonly taskId:string;
  constructor(taskId:string){
    super(`Task ${taskId} was cancelled`);
    this.name="TaskCancelledError";
    this.taskId=taskId;
  }
}

/** Per-task controls handed to the work function. */
export interface TaskContext {
  /** Stable scheduler-assigned id, also on the {@linkcode ScheduledTask}. */
  readonly id:string;
  /** Label the consumer submitted with, for logs and telemetry. */
  readonly label:string;
  /** True once {@linkcode LongTaskScheduler.cancel} or {@linkcode LongTaskScheduler.close} ran. */
  isCancelled():boolean;
  /** Synchronous cancellation check; throws {@linkcode TaskCancelledError}. */
  throwIfCancelled():void;
  /** Yields to the event loop, then throws {@linkcode TaskCancelledError} if cancelled.
   * Long tasks must call this between units of work. */
  checkpoint():Promise<void>;
  /** Reports bounded progress, 0..1, to the task's `onProgress`. Values are
   * clamped and non-finite values are ignored. */
  reportProgress(fraction:number):void;
}

export interface ScheduledTask<T> {
  readonly id:string;
  readonly label:string;
  /** Settles with the work result, or rejects with {@linkcode TaskCancelledError}
   * for cancellation and the work's own error otherwise. Never rejects before
   * the task ran or was cancelled. */
  readonly done:Promise<T>;
  /** Queued tasks reject immediately; a running task observes cancellation at
   * its next checkpoint. Returns false for unknown or settled ids. */
  cancel():boolean;
  /** "queued" | "running" | "done" | "failed" | "cancelled" */
  readonly state:"queued"|"running"|"done"|"failed"|"cancelled";
}

export interface SubmitOptions {
  /** Stable consumer id used for cancellation and telemetry. Generated when absent. */
  readonly id?:string;
  readonly label?:string;
  /** Called with clamped 0..1 progress as the task reports it. */
  readonly onProgress?:(fraction:number)=>void;
}

export interface SchedulerStats {
  readonly queued:number;
  readonly running:number;
  readonly settled:number;
  readonly cancelled:number;
  readonly failed:number;
}

export interface LongTaskScheduler {
  /** Enqueues work behind earlier submissions (FIFO). Throws RangeError
   * when the pending bound is reached; the work never runs. */
  submit<T>(work:(context:TaskContext)=>Promise<T>,options?:SubmitOptions):ScheduledTask<T>;
  /** Cancels a queued or running task by id. */
  cancel(id:string):boolean;
  stats():SchedulerStats;
  /** Rejects every queued task, marks running tasks cancelled, then resolves
   * once running work has settled. Later submits reject. Idempotent. */
  close():Promise<void>;
}

export interface SchedulerOptions {
  /** Maximum tasks waiting or running at once. @default 256 */
  readonly maxPending?:number;
  /** Task id prefix for generated ids. @default "task" */
  readonly idPrefix?:string;
}

interface Entry {
  id:string;
  label:string;
  state:"queued"|"running"|"done"|"failed"|"cancelled";
  cancelled:boolean;
  onProgress?:(fraction:number)=>void;
  work:(context:TaskContext)=>Promise<unknown>;
  resolve:(value:unknown)=>void;
  reject:(error:unknown)=>void;
}

const MAX_PENDING_DEFAULT=256;
let nextGeneratedId=0;

/** Yields one macrotask so input and other hosts get a turn between tasks. */
function yieldToHost():Promise<void>{
  return new Promise(resolve=>setTimeout(resolve,0));
}

/**
 * Creates a scheduler. One task runs at a time; the runner yields to the
 * event loop before each start so a long queue cannot starve input handling.
 */
export function createLongTaskScheduler(options:SchedulerOptions={}):LongTaskScheduler{
  const maxPending=options.maxPending??MAX_PENDING_DEFAULT;
  if(!Number.isSafeInteger(maxPending)||maxPending<1)throw new RangeError("maxPending must be a positive integer");
  const prefix=options.idPrefix??"task";
  const queue:Entry[]=[];
  let running:Entry|undefined;
  // Shifted from the queue, yielded, not yet marked running: still cancellable.
  let pending:Entry|undefined;
  let closed=false;
  let closedPromise:Promise<void>|undefined;
  let settledCount=0,cancelledCount=0,failedCount=0;
  let pumping:Promise<void>|undefined;

  function settle(entry:Entry,state:"done"|"failed"|"cancelled",error?:unknown,value?:unknown):void{
    if(entry.state!=="queued"&&entry.state!=="running")return;
    entry.state=state;
    settledCount++;
    if(state==="cancelled")cancelledCount++;
    if(state==="failed")failedCount++;
    if(state==="done")entry.resolve(value);
    else entry.reject(state==="cancelled"?new TaskCancelledError(entry.id):error);
    if(running===entry)running=undefined;
    void pump();
  }

  async function run(entry:Entry):Promise<void>{
    const context:TaskContext={
      id:entry.id,
      label:entry.label,
      isCancelled:()=>entry.cancelled||closed,
      throwIfCancelled(){
        if(entry.cancelled||closed)throw new TaskCancelledError(entry.id);
      },
      async checkpoint(){
        await yieldToHost();
        if(entry.cancelled||closed)throw new TaskCancelledError(entry.id);
      },
      reportProgress(fraction:number){
        if(!Number.isFinite(fraction))return;
        entry.onProgress?.(Math.min(1,Math.max(0,fraction)));
      },
    };
    try{
      const value=await entry.work(context);
      // A task that finished without observing cancellation still reports
      // cancelled when close() raced its last await; document state stays
      // with the consumer either way.
      if(entry.cancelled||closed)settle(entry,"cancelled");
      else settle(entry,"done",undefined,value);
    }catch(error){
      settle(entry,entry.cancelled||closed?"cancelled":"failed",error);
    }
  }

  async function pump():Promise<void>{
    if(pumping)return pumping;
    pumping=(async()=>{
      for(;;){
        const next=queue.shift();
        if(!next)break;
        if(next.state!=="queued")continue;
        if(closed||next.cancelled){settle(next,"cancelled");continue;}
        // Yield before each start: submit() returns first and queued work
        // never runs inside the caller's synchronous stack.
        pending=next;
        await yieldToHost();
        pending=undefined;
        if(next.state!=="queued"||closed||next.cancelled){if(next.state==="queued")settle(next,"cancelled");continue;}
        next.state="running";
        running=next;
        await run(next);
      }
    })().finally(()=>{pumping=undefined;});
    return pumping;
  }

  return{
    submit<T>(work:(context:TaskContext)=>Promise<T>,taskOptions:SubmitOptions={}):ScheduledTask<T>{
      if(closed){
        let rejectClosed!:(error:unknown)=>void;
        const done=new Promise<T>((_res,rej)=>{rejectClosed=rej;});
        done.catch(()=>{});
        rejectClosed(new Error("Scheduler is closed"));
        return {id:"",label:taskOptions.label??"",state:"cancelled",done,cancel:()=>false};
      }
      const id=taskOptions.id??`${prefix}-${++nextGeneratedId}`;
      if(queue.some(e=>e.id===id)||pending?.id===id||running?.id===id)
        throw new Error(`Duplicate task id "${id}"`);
      if(queue.length+(pending?1:0)+(running?1:0)>=maxPending)
        throw new RangeError(`Scheduler pending bound reached (${maxPending})`);
      let resolve!:(value:T)=>void,reject!:(error:unknown)=>void;
      const done=new Promise<T>((res,rej)=>{resolve=res;reject=rej;});
      // Consumers may not await every task; keep rejections observed.
      done.catch(()=>{});
      const entry:Entry={
        id,label:taskOptions.label??id,state:"queued",cancelled:false,
        onProgress:taskOptions.onProgress,work:work as Entry["work"],
        resolve:resolve as (value:unknown)=>void,reject,
      };
      queue.push(entry);
      void pump();
      const task:ScheduledTask<T>={
        id,label:entry.label,
        done,
        state:entry.state,
        cancel:()=>{
          if(entry.state==="done"||entry.state==="failed"||entry.state==="cancelled")return false;
          entry.cancelled=true;
          if(entry.state==="queued")settle(entry,"cancelled");
          return true;
        },
      };
      // `state` is a snapshot at submit time; expose live state through done.
      Object.defineProperty(task,"state",{get:()=>entry.state});
      return task;
    },
    cancel(id:string):boolean{
      const entry=queue.find(e=>e.id===id)??pending??(running?.id===id?running:undefined);
      if(!entry)return false;
      entry.cancelled=true;
      if(entry.state==="queued")settle(entry,"cancelled");
      return true;
    },
    stats():SchedulerStats{
      return{
        queued:queue.length+(pending?1:0),
        running:running?1:0,
        settled:settledCount,
        cancelled:cancelledCount,
        failed:failedCount,
      };
    },
    close(){
      // Queued work rejects at once; a running task observes cancellation at
      // its next checkpoint, so close() resolves when it next yields. A task
      // that never checkpoints keeps the scheduler open — cooperative
      // cancellation cannot preempt synchronous work.
      closedPromise??=(async()=>{
        closed=true;
        for(const entry of queue.splice(0))if(entry.state==="queued")settle(entry,"cancelled");
        if(running)running.cancelled=true;
        while(pumping)await pumping.catch(()=>{});
      })();
      return closedPromise;
    },
  };
}
