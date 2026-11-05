/*
 * Portions ported from ProCraft for Android,
 * https://github.com/artcraft-android/procraft-android
 * android/app/src/main/java/io/github/artcraftandroid/procraft/ui/LayersPanel.kt
 * at commit c2f7518d03141c746a365f90d8df05a44ddef002 (`Thumb` and `checker`:
 * the thumbnail drawn fitted inside its box, small drawings shown with their
 * pixels unsmoothed, and the 6 dp transparency checkerboard behind it).
 *
 * Copyright (c) 2026 ArtCraft Team and the ProCraft contributors.
 * Licensed under the MIT License or the Apache License, Version 2.0, at your option.
 * See licenses/ProCraft-LICENSE-MIT.txt, licenses/ProCraft-LICENSE-APACHE.txt and
 * licenses/ProCraft-NOTICE.txt.
 *
 * Modified for NYC-Tron UI on 2026-11-05: rewritten from Kotlin/Compose to
 * TypeScript as pure functions; the checker colors come from theme tokens, the
 * cell grows on large thumbnails so the view count stays bounded, unsmoothed
 * pixels are produced by an integer nearest-neighbour upscale, and an
 * async loader, a small LRU cache with stale-while-revalidate, a PNG encoder
 * and loading/empty/error states were added.
 */

/**
 * Straight (non-premultiplied) RGBA pixels, 4 bytes per pixel, row-major from
 * the top-left. This is the decoded form of the engine's `layerThumbnail`,
 * `maskThumbnail`, `artboardThumbnail` and `renderRegion` results.
 * @see {@linkcode rasterFromBase64}
 */
export interface RasterPixels {
  readonly width:number;
  readonly height:number;
  readonly pixels:Uint8Array;
}

/**
 * Loads a preview for `id` no larger than `max` pixels on its longer edge.
 * Rejecting shows the "couldn't render" state; resolving with a fully
 * transparent raster shows the empty state.
 * @see {@linkcode ThumbnailSource}
 */
export type ThumbnailLoader=(id:string,max:number)=>Promise<RasterPixels>;

/**
 * What a `LayerThumbnail` draws. `pixels` is already in hand; `loader` is
 * fetched once per `id` + `revision` + size and cached. Bump `revision`
 * whenever the content changes: the previous preview stays on screen until the
 * new one arrives.
 */
export type ThumbnailSource=
  |{readonly kind:"pixels";readonly raster:RasterPixels}
  |{readonly kind:"loader";readonly id:string;readonly revision:number;readonly load:ThumbnailLoader};

/** A preview ready to draw. `uri` is a PNG data URI; `empty` means every pixel is transparent. */
export interface ThumbnailImage {
  readonly uri:string;
  readonly width:number;
  readonly height:number;
  readonly empty:boolean;
}

/**
 * Where a loader-backed thumbnail is. `stale` is the last preview of the same
 * id at an older revision, drawn while the new one loads or after it fails.
 * @see {@linkcode ThumbnailCache.get}
 */
export type ThumbnailState=
  |{readonly status:"loading";readonly stale?:ThumbnailImage}
  |{readonly status:"ready";readonly image:ThumbnailImage}
  |{readonly status:"error";readonly message:string;readonly stale?:ThumbnailImage};

/** Engine edge limit for `layerThumbnail` and friends (`max 1..1024`). */
export const THUMBNAIL_MAX_EDGE=1024;
/** ProCraft's checkerboard cell, 6 dp. */
export const CHECKER_CELL=6;
/** Checker cells per axis never exceed this, so a large preview stays a few hundred views. */
export const CHECKER_MAX_CELLS=16;
/** Small drawings are scaled up with whole-pixel blocks to at most this edge. */
const UPSCALE_LIMIT=512;

/** Throws a RangeError unless `raster` has positive whole dimensions and exactly width*height*4 bytes. */
export function validateRaster(raster:RasterPixels):void{
  const {width,height,pixels}=raster;
  if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1)
    throw new RangeError(`Raster size must be whole and positive: ${width}x${height}`);
  if(!(pixels instanceof Uint8Array)||pixels.length!==width*height*4)
    throw new RangeError(`Raster needs ${width*height*4} RGBA bytes, got ${pixels?.length}`);
}

const B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_INDEX=new Map([...B64].map((c,i)=>[c,i]));

/** Standard base64 with padding. Works the same on Hermes, JSC and browsers. */
export function encodeBase64(bytes:Uint8Array):string{
  let out="";
  for(let i=0;i<bytes.length;i+=3){
    const a=bytes[i]!,b=bytes[i+1],c=bytes[i+2];
    const n=(a<<16)|((b??0)<<8)|(c??0);
    out+=B64[(n>>18)&63]!+B64[(n>>12)&63]!+(b===undefined?"=":B64[(n>>6)&63]!)+(c===undefined?"=":B64[n&63]!);
  }
  return out;
}

/** Decodes standard base64; whitespace is ignored. @throws RangeError on any other character. */
export function decodeBase64(text:string):Uint8Array{
  const clean=text.replace(/\s+/g,"").replace(/=+$/,"");
  const out=new Uint8Array(Math.floor(clean.length*3/4));
  let bits=0,acc=0,o=0;
  for(const ch of clean){
    const v=B64_INDEX.get(ch);
    if(v===undefined)throw new RangeError("Invalid base64 character: "+ch);
    acc=(acc<<6)|v;bits+=6;
    if(bits>=8){bits-=8;out[o++]=(acc>>bits)&255;}
  }
  return out.subarray(0,o);
}

/**
 * Turns an engine thumbnail result (`{width,height,pixels_b64}`) into
 * {@linkcode RasterPixels}, so a loader can be a one-line adapter.
 */
export function rasterFromBase64(result:{readonly width:number;readonly height:number;readonly pixels_b64:string}):RasterPixels{
  const raster={width:result.width,height:result.height,pixels:decodeBase64(result.pixels_b64)};
  validateRaster(raster);
  return raster;
}

/** True when the raster has no visible pixel (every alpha is 0). */
export function isRasterEmpty(raster:RasterPixels):boolean{
  const p=raster.pixels;
  for(let i=3;i<p.length;i+=4)if(p[i]!==0)return false;
  return true;
}

const CRC_TABLE=(()=>{
  const t=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}
  return t;
})();
function crc32(bytes:Uint8Array,start:number,end:number):number{
  let c=0xffffffff;
  for(let i=start;i<end;i++)c=CRC_TABLE[(c^bytes[i]!)&255]!^(c>>>8);
  return (c^0xffffffff)>>>0;
}

/**
 * Encodes RGBA pixels as a PNG (8-bit RGBA, no filtering, stored deflate
 * blocks). Uncompressed on purpose: thumbnails are small, every platform's
 * image decoder reads it, and no zlib dependency is needed.
 */
export function encodePng(raster:RasterPixels):Uint8Array{
  validateRaster(raster);
  const {width,height,pixels}=raster;
  const stride=width*4+1;
  const raw=new Uint8Array(stride*height);
  for(let y=0;y<height;y++)raw.set(pixels.subarray(y*width*4,(y+1)*width*4),y*stride+1);
  const blocks=Math.max(1,Math.ceil(raw.length/65535));
  const zlibLength=2+raw.length+blocks*5+4;
  const out=new Uint8Array(8+25+12+zlibLength+12);
  const view=new DataView(out.buffer);
  out.set([137,80,78,71,13,10,26,10],0);
  let o=8;
  const chunk=(type:string,length:number,write:(at:number)=>void)=>{
    view.setUint32(o,length);
    for(let i=0;i<4;i++)out[o+4+i]=type.charCodeAt(i);
    write(o+8);
    view.setUint32(o+8+length,crc32(out,o+4,o+8+length));
    o+=12+length;
  };
  chunk("IHDR",13,at=>{view.setUint32(at,width);view.setUint32(at+4,height);out.set([8,6,0,0,0],at+8);});
  chunk("IDAT",zlibLength,at=>{
    out[at]=0x78;out[at+1]=0x01;
    let w=at+2;
    for(let b=0;b<blocks;b++){
      const part=raw.subarray(b*65535,Math.min(raw.length,(b+1)*65535));
      out[w]=b===blocks-1?1:0;
      view.setUint16(w+1,part.length,true);
      view.setUint16(w+3,(~part.length)&0xffff,true);
      out.set(part,w+5);
      w+=5+part.length;
    }
    let s1=1,s2=0;
    for(let i=0;i<raw.length;i++){s1=(s1+raw[i]!)%65521;s2=(s2+s1)%65521;}
    view.setUint32(w,((s2<<16)|s1)>>>0);
  });
  chunk("IEND",0,()=>{});
  return out;
}

/**
 * Integer nearest-neighbour upscale so a small drawing shows crisp pixels when
 * drawn into a larger box (ProCraft draws thumbnails with no filtering). The
 * factor fills `targetEdge` without exceeding it or 512 px; 1 returns the input.
 */
export function upscaleNearest(raster:RasterPixels,targetEdge:number):RasterPixels{
  validateRaster(raster);
  const edge=Math.max(raster.width,raster.height);
  const factor=Math.floor(Math.min(targetEdge,UPSCALE_LIMIT)/edge);
  if(!Number.isFinite(factor)||factor<=1)return raster;
  const w=raster.width*factor,h=raster.height*factor;
  const out=new Uint8Array(w*h*4);
  const src=raster.pixels;
  for(let y=0;y<h;y++){
    const sy=Math.floor(y/factor);
    for(let x=0;x<w;x++){
      const s=(sy*raster.width+Math.floor(x/factor))*4,d=(y*w+x)*4;
      out[d]=src[s]!;out[d+1]=src[s+1]!;out[d+2]=src[s+2]!;out[d+3]=src[s+3]!;
    }
  }
  return {width:w,height:h,pixels:out};
}

/** Ready-to-draw image for a raster at a display box of `targetEdge` device pixels. */
export function rasterToImage(raster:RasterPixels,targetEdge=0):ThumbnailImage{
  const empty=isRasterEmpty(raster);
  const drawn=targetEdge>0?upscaleNearest(raster,targetEdge):raster;
  return {uri:"data:image/png;base64,"+encodeBase64(encodePng(drawn)),width:raster.width,height:raster.height,empty};
}

/** The engine `max` to request for a box of `width` x `height` points at `pixelRatio`. */
export function thumbnailRequestMax(width:number,height:number,pixelRatio:number):number{
  if(![width,height,pixelRatio].every(Number.isFinite)||width<=0||height<=0||pixelRatio<=0)
    throw new RangeError("Invalid thumbnail box");
  return Math.min(THUMBNAIL_MAX_EDGE,Math.max(1,Math.ceil(Math.max(width,height)*pixelRatio)));
}

/** Rectangle of a `srcWidth` x `srcHeight` image fitted (contain) and centred in a box. */
export function fitContain(srcWidth:number,srcHeight:number,boxWidth:number,boxHeight:number){
  if(![srcWidth,srcHeight,boxWidth,boxHeight].every(n=>Number.isFinite(n)&&n>0))throw new RangeError("Invalid fit sizes");
  const scale=Math.min(boxWidth/srcWidth,boxHeight/srcHeight);
  const r=(n:number)=>Math.round(n*1000)/1000+0;
  const width=srcWidth*scale,height=srcHeight*scale;
  return {x:r((boxWidth-width)/2),y:r((boxHeight-height)/2),width:r(width),height:r(height)};
}

/**
 * The darker checkerboard cells for a box, in points. Cells are 6pt (ProCraft),
 * growing on large boxes so neither axis has more than 16.
 */
export function checkerCells(width:number,height:number):{cell:number;cells:{x:number;y:number}[]}{
  const cell=Math.max(CHECKER_CELL,Math.ceil(Math.max(width,height)/CHECKER_MAX_CELLS));
  const cells:{x:number;y:number}[]=[];
  for(let row=0;row*cell<height;row++)for(let col=0;col*cell<width;col++)
    if((row+col)%2===1)cells.push({x:col*cell,y:row*cell});
  return {cell,cells};
}

/** Spoken description of a thumbnail: the label plus what is (not) shown. */
export function thumbnailAccessibilityLabel(label:string,state:ThumbnailState):string{
  if(state.status==="error")return label+", couldn't render preview";
  if(state.status==="loading")return label+(state.stale?", updating preview":", loading preview");
  return label+(state.image.empty?", empty":"");
}

/**
 * Small LRU of loaded previews keyed by id + revision + size, shared by every
 * thumbnail that uses it. Returned snapshots are stable objects, so it can back
 * `useSyncExternalStore` directly.
 * @see {@linkcode createThumbnailCache}
 */
export interface ThumbnailCache {
  /** Current state for a key. Never starts a load; a key not seen yet reads as loading. */
  get(id:string,revision:number,max:number):ThumbnailState;
  /** Starts the load if this key has none in flight or finished. Safe to call on every render. */
  request(id:string,revision:number,max:number,load:ThumbnailLoader):void;
  /** Forgets a failed key so the next {@linkcode ThumbnailCache.request} loads again. */
  retry(id:string,revision:number,max:number):void;
  /** Called after any state change. Returns the unsubscribe function. */
  subscribe(listener:()=>void):()=>void;
  /** Bytes of data URIs currently held. */
  readonly byteSize:number;
  /** Drops every entry except loads in flight. */
  clear():void;
}

type Entry={state:ThumbnailState;bytes:number;inFlight:boolean};

/**
 * Creates a {@linkcode ThumbnailCache}. Eviction is least-recently-read once
 * there are more than `capacity` entries or `maxBytes` of data URIs; loads in
 * flight are never evicted.
 */
export function createThumbnailCache({capacity=96,maxBytes=8*1024*1024}:{capacity?:number;maxBytes?:number}={}):ThumbnailCache{
  if(!Number.isSafeInteger(capacity)||capacity<1||!(maxBytes>0))throw new RangeError("Invalid thumbnail cache limits");
  const entries=new Map<string,Entry>();
  const latest=new Map<string,{revision:number;image:ThumbnailImage}>();
  const listeners=new Set<()=>void>();
  let bytes=0;
  const keyOf=(id:string,revision:number,max:number)=>`${max}\u0000${revision}\u0000${id}`;
  const emit=()=>{for(const l of [...listeners])l();};
  const evict=()=>{
    for(const [key,entry] of entries){
      if(entries.size<=capacity&&bytes<=maxBytes)break;
      if(entry.inFlight)continue;
      entries.delete(key);bytes-=entry.bytes;
    }
  };
  const staleFor=(id:string,revision:number)=>{
    const last=latest.get(id);
    return last&&last.revision<revision?last.image:undefined;
  };
  const touch=(key:string,entry:Entry)=>{entries.delete(key);entries.set(key,entry);};
  const entryFor=(key:string,id:string,revision:number):Entry=>{
    const found=entries.get(key);
    if(found){touch(key,found);return found;}
    const stale=staleFor(id,revision);
    const entry:Entry={state:stale?{status:"loading",stale}:{status:"loading"},bytes:0,inFlight:false};
    entries.set(key,entry);
    evict();
    return entry;
  };
  return {
    get(id,revision,max){
      return entryFor(keyOf(id,revision,max),id,revision).state;
    },
    request(id,revision,max,load){
      const key=keyOf(id,revision,max);
      const entry=entryFor(key,id,revision);
      if(entry.inFlight||entry.state.status!=="loading")return;
      entry.inFlight=true;
      const settle=(state:ThumbnailState,size:number)=>{
        const current=entries.get(key);
        if(current!==entry)return;
        entry.inFlight=false;entry.state=state;entry.bytes=size;bytes+=size;
        evict();emit();
      };
      Promise.resolve().then(()=>load(id,max)).then(raster=>{
        validateRaster(raster);
        const image=rasterToImage(raster,max);
        const last=latest.get(id);
        if(!last||last.revision<=revision)latest.set(id,{revision,image});
        settle({status:"ready",image},image.uri.length);
      },(error:unknown)=>{
        const message=error instanceof Error?error.message:String(error);
        const stale=staleFor(id,revision);
        settle(stale?{status:"error",message,stale}:{status:"error",message},0);
      });
    },
    retry(id,revision,max){
      const key=keyOf(id,revision,max);
      const entry=entries.get(key);
      if(entry?.state.status!=="error")return;
      entries.delete(key);
      emit();
    },
    subscribe(listener){listeners.add(listener);return ()=>{listeners.delete(listener);};},
    get byteSize(){return bytes;},
    clear(){
      for(const [key,entry] of entries)if(!entry.inFlight){entries.delete(key);bytes-=entry.bytes;}
      latest.clear();
      emit();
    },
  };
}

/** The cache every `LayerThumbnail` uses unless it is given its own. */
export const sharedThumbnailCache:ThumbnailCache=createThumbnailCache();
