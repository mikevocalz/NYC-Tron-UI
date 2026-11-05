/**
 * Display-only min/max extrema math adapted from the user's Nitro Forge
 * draft media-ui WaveformLane/PR #25. Source PCM remains in the audio engine;
 * never average transients away or fake signal data.
 */
export interface WaveformPeak { readonly min:number; readonly max:number }
export interface WaveformBar { readonly top:number; readonly height:number }
export function normalizePeak(p:WaveformPeak):WaveformPeak{
 if(!Number.isFinite(p.min)||!Number.isFinite(p.max)||p.min>p.max)
   throw new RangeError("Invalid min/max waveform extrema");
 return {min:Math.min(1,Math.max(-1,p.min)),max:Math.min(1,Math.max(-1,p.max))};
}
export function resamplePeaks(peaks:readonly WaveformPeak[],columns:number):WaveformPeak[]{
 if(!Number.isInteger(columns)||columns<1||columns>4096)
   throw new RangeError("Waveform columns must be within 1..4096");
 if(!peaks.length)return Array.from({length:columns},()=>({min:0,max:0}));
 const valid=peaks.map(normalizePeak);
 return Array.from({length:columns},(_,index)=>{
   const start=Math.floor(index*valid.length/columns);
   const end=Math.max(start+1,Math.ceil((index+1)*valid.length/columns));
   let min=1,max=-1;
   for(let i=start;i<Math.min(end,valid.length);i++){
     const p=valid[i]!;min=Math.min(min,p.min);max=Math.max(max,p.max);
   }
   return {min,max};
 });
}
export function peaksToBars(peaks:readonly WaveformPeak[],height:number):WaveformBar[]{
 if(!Number.isFinite(height)||height<=0||height>8192)
  throw new RangeError("Waveform height outside valid range");
 return peaks.map(raw=>{
   const p=normalizePeak(raw);
   const top=((1-p.max)/2)*height;
   const bottom=((1-p.min)/2)*height;
   return {top,height:Math.max(1,bottom-top)};
 });
}
