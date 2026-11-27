/**
 * Registry behind `PortalHost` and `Portal`. Framework-free: React reads it
 * through `useSyncExternalStore`, and every snapshot getter returns the same
 * value until that part of the registry changes.
 *
 * Rules:
 * - Entries render in the order they were first added to a host. Updating an
 *   entry's content keeps its place.
 * - Several hosts may share a name. The most recently registered one is
 *   active and draws the entries; when it unregisters, the previous one takes
 *   over. A screen can mount its own "root" host this way.
 * - Removing an entry or a host that is not registered does nothing.
 */
export interface PortalEntry<Node> {readonly key:string;readonly node:Node}

export interface PortalStore<Node=unknown> {
  /** Adds the entry, or replaces its content in place when `key` is already in `host`. */
  set(host:string,key:string,node:Node):void;
  remove(host:string,key:string):void;
  /** Current entries for `host`, in insertion order. Same array until they change. */
  entries(host:string):readonly PortalEntry<Node>[];
  /** Registers a host and returns its unregister function. */
  registerHost(host:string):()=>void;
  /** True while at least one host with this name is registered. */
  hasHost(host:string):boolean;
  /** True when `token` (from {@linkcode PortalStore.hostToken}) is the active host for `host`. */
  isActiveHost(host:string,token:symbol):boolean;
  /**
   * Registers a host under `token` (a fresh symbol when omitted) and returns
   * it with the unregister function. A caller that creates the token before
   * registering can read {@linkcode PortalStore.isActiveHost} from its first
   * render. Registering a token that is already registered moves it to the top.
   */
  hostToken(host:string,token?:symbol):{token:symbol;unregister:()=>void};
  subscribe(listener:()=>void):()=>void;
}

const EMPTY:readonly never[]=Object.freeze([]);

function checkName(kind:string,value:string):void{
  if(typeof value!=="string"||value.length===0)throw new RangeError(`Portal ${kind} must be a non-empty string`);
}

/** Creates an empty {@linkcode PortalStore}. */
export function createPortalStore<Node=unknown>():PortalStore<Node>{
  const contents=new Map<string,Map<string,Node>>();
  const snapshots=new Map<string,readonly PortalEntry<Node>[]>();
  const hosts=new Map<string,symbol[]>();
  const listeners=new Set<()=>void>();
  const emit=()=>{for(const listener of [...listeners])listener();};
  const invalidate=(host:string)=>{snapshots.delete(host);emit();};

  const hostToken=(host:string,token:symbol=Symbol(host))=>{
    checkName("host name",host);
    const list=(hosts.get(host)??[]).filter(t=>t!==token);
    hosts.set(host,[...list,token]);
    emit();
    let done=false;
    return {token,unregister:()=>{
      if(done)return;done=true;
      const next=(hosts.get(host)??[]).filter(t=>t!==token);
      if(next.length)hosts.set(host,next);else hosts.delete(host);
      emit();
    }};
  };

  return {
    set(host,key,node){
      checkName("host name",host);checkName("key",key);
      let map=contents.get(host);
      if(!map){map=new Map();contents.set(host,map);}
      if(map.has(key)&&Object.is(map.get(key),node))return;
      // Map.set on an existing key keeps its original position.
      map.set(key,node);
      invalidate(host);
    },
    remove(host,key){
      const map=contents.get(host);
      if(!map||!map.delete(key))return;
      if(map.size===0)contents.delete(host);
      invalidate(host);
    },
    entries(host){
      const cached=snapshots.get(host);
      if(cached)return cached;
      const map=contents.get(host);
      const next=map?Object.freeze([...map].map(([key,node])=>Object.freeze({key,node}))):EMPTY;
      snapshots.set(host,next);
      return next;
    },
    registerHost(host){return hostToken(host).unregister;},
    hostToken,
    hasHost(host){return (hosts.get(host)?.length??0)>0;},
    isActiveHost(host,token){const list=hosts.get(host);return !!list&&list[list.length-1]===token;},
    subscribe(listener){listeners.add(listener);return ()=>{listeners.delete(listener);};},
  };
}
