import {findNativeModule} from "../native-module.ts";
import {MEDIA_ENCODER_MODULE_NAME} from "../module-names.ts";
import {createMediaEncoder,type MediaEncoder,type MediaEncoderNative} from "./encoder.ts";

export {MEDIA_ENCODER_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode MediaEncoder} over AVAssetWriter on iOS and MediaCodec +
 * MediaMuxer on Android: H.264 video and AAC audio into a faststart MP4.
 * Sources are raw RGBA8 frames and interleaved PCM files the host wrote.
 */
export function createPlatformMediaEncoder():MediaEncoder{
  return createMediaEncoder(findNativeModule<MediaEncoderNative>(MEDIA_ENCODER_MODULE_NAME));
}
