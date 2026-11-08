import {
  toMediaEncodeError,toMediaEncoderProbe,
  type EncodeRequest,type MediaEncoder,type MediaEncoderProbe,
} from "./encoder.ts";
import { encodeWebCodecsMp4 } from "./webcodecs-mp4.web.ts";

export {MEDIA_ENCODER_MODULE_NAME} from "../module-names.ts";

/** Codec strings probed through WebCodecs `isConfigSupported`; baseline H.264/AAC. */
const VIDEO_CODEC="avc1.42001f";
const AUDIO_CODEC="mp4a.40.2";

async function supportedVideo():Promise<boolean>{
  try{return typeof VideoEncoder!=="undefined"&&(await VideoEncoder.isConfigSupported(
    {codec:VIDEO_CODEC,width:64,height:64,bitrate:1_000_000,framerate:30})).supported===true;}
  catch{return false;}
}
async function supportedAudio():Promise<boolean>{
  try{return typeof AudioEncoder!=="undefined"&&(await AudioEncoder.isConfigSupported(
    {codec:AUDIO_CODEC,sampleRate:48_000,numberOfChannels:2,bitrate:128_000})).supported===true;}
  catch{return false;}
}

async function probe():Promise<MediaEncoderProbe>{
  const [video,audio]=await Promise.all([supportedVideo(),supportedAudio()]);
  return toMediaEncoderProbe({container:"mp4",video,audio});
}

const guarded=<A extends unknown[],T>(run:(...args:A)=>Promise<T>)=>async(...args:A):Promise<T>=>{
  try{return await run(...args);}catch(error){throw toMediaEncodeError(error);}
};

/**
 * {@linkcode MediaEncoder} on web: WebCodecs through unmodified Mediabunny
 * 1.65.2 (MPL-2.0, see THIRD_PARTY.md), muxed to a faststart MP4 held in
 * memory and returned as a `data:` URL. Requires `VideoEncoder`/`AudioEncoder`;
 * browsers without WebCodecs reject with "unsupported-format".
 */
export function createPlatformMediaEncoder():MediaEncoder{
  return {
    isAvailable:typeof document!=="undefined"&&(typeof VideoEncoder!=="undefined"||typeof AudioEncoder!=="undefined"),
    probe:guarded(probe),
    encode:guarded((request:EncodeRequest,options?:{signal?:AbortSignal})=>encodeWebCodecsMp4(request,options?.signal)),
    clearCache:async()=>{},
  };
}
