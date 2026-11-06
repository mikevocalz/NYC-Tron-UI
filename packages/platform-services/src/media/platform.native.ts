import {findNativeModule} from "../native-module.ts";
import {MEDIA_DECODER_MODULE_NAME} from "../module-names.ts";
import {createMediaDecoder,type MediaDecoder,type MediaDecoderNative} from "./decoder.ts";

export {MEDIA_DECODER_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode MediaDecoder} over AVAssetImageGenerator and AVAssetReader on
 * iOS, and MediaExtractor/MediaCodec on Android.
 * Frames and PCM are written to the app's caches directory.
 */
export function createPlatformMediaDecoder():MediaDecoder{
  return createMediaDecoder(findNativeModule<MediaDecoderNative>(MEDIA_DECODER_MODULE_NAME));
}
