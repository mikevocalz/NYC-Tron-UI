/**
 * What the document is doing right now, as shown by {@linkcode StatusBar}.
 * Each state carries only the facts that state has.
 */
export type StatusActivity=
  | {readonly kind:"idle"}
  | {readonly kind:"saving"}
  | {readonly kind:"rendering";
      /** 0..1 when the renderer reports it; omit for indeterminate work. */
      readonly progress?:number;
      readonly label?:string}
  | {readonly kind:"recording";
      /** Time since recording began, from the recorder's clock. */
      readonly elapsedMs:number}
  | {readonly kind:"error";readonly message:string};

/** Singular and plural nouns for a selection count, e.g. layer/layers. */
export interface SelectionNoun {
  readonly one:string;
  readonly other:string;
}

/** Zoom percentage as display text: whole numbers, one decimal below 10%. */
export function formatZoom(percent:number):string{
  if(!Number.isFinite(percent)||percent<=0)throw new RangeError("Invalid zoom");
  return (percent<10?Number(percent.toFixed(1)):Math.round(percent))+"%";
}

/** The next preset above (`1`) or below (`-1`) `value`, or `value` at either end. */
export function stepZoom(value:number,presets:readonly number[],direction:1|-1):number{
  const sorted=[...new Set(presets.filter(p=>Number.isFinite(p)&&p>0))].sort((a,b)=>a-b);
  if(!sorted.length)return value;
  if(direction>0)return sorted.find(p=>p>value+1e-9)??value;
  return [...sorted].reverse().find(p=>p<value-1e-9)??value;
}

/** "No selection", "1 layer selected", "12 layers selected". */
export function selectionSummary(count:number,noun:SelectionNoun={one:"item",other:"items"}):string{
  if(!Number.isInteger(count)||count<0)throw new RangeError("Invalid selection count");
  if(count===0)return "No selection";
  return `${count} ${count===1?noun.one:noun.other} selected`;
}

/** Elapsed time as m:ss, or h:mm:ss from one hour. */
export function formatElapsed(ms:number):string{
  if(!Number.isFinite(ms)||ms<0)throw new RangeError("Invalid elapsed time");
  const total=Math.floor(ms/1000);
  const h=Math.floor(total/3600),m=Math.floor(total/60)%60,s=total%60;
  const pad=(n:number)=>String(n).padStart(2,"0");
  return h?`${h}:${pad(m)}:${pad(s)}`:`${m}:${pad(s)}`;
}

/**
 * Text a screen reader announces when the activity changes. The recording
 * clock and render percentage are left out so they are not re-announced on
 * every tick; the progress bar exposes the percentage on demand.
 */
export function activityAnnouncement(activity:StatusActivity):string{
  switch(activity.kind){
    case "idle":return "";
    case "saving":return "Saving";
    case "recording":return "Recording";
    case "error":return activity.message;
    case "rendering":return activity.label??"Rendering";
  }
}

/** Render progress as a whole percentage, or undefined when indeterminate. Throws outside 0..1. */
export function progressPercent(progress:number|undefined):number|undefined{
  if(progress===undefined)return undefined;
  if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError("Invalid render progress");
  return Math.round(progress*100);
}
