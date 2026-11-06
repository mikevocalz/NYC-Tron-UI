export {createPlatformMediaDecoder,MEDIA_DECODER_MODULE_NAME} from "./platform.web.ts";
export {createMediaDecoder,MediaDecodeError,toMediaDecodeError,normalizeFrameOptions,normalizeAudioOptions,fitWithin,
  MEDIA_DECODE_ERROR_CODES,MAX_DECODE_DURATION_US,MAX_FRAME_EDGE,DEFAULT_FRAME_EDGE,MIN_SAMPLE_RATE,MAX_SAMPLE_RATE} from "./decoder.ts";
export type {DecodeAudioOptions,DecodeFrameOptions,DecodedAudio,DecodedFrame,DecodedPcm,MediaDecodeErrorCode,
  MediaDecoder,MediaDecoderNative,MediaProbe} from "./decoder.ts";
