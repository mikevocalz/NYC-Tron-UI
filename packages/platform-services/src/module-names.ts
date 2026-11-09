// Names both platforms register the Expo modules under. Kept free of
// runtime imports so contract tests can read them on plain Node.

/** Haptics (N-05). */
export const HAPTICS_MODULE_NAME="NYCTronHaptics";
/** Documents and sharing (N-12). */
export const DOCUMENTS_MODULE_NAME="NYCTronDocuments";
/** Audio session lifecycle (N-17). */
export const PLAYBACK_SESSION_MODULE_NAME="NYCTronPlaybackSession";
/** Media frame and audio decoding (N-19). */
export const MEDIA_DECODER_MODULE_NAME="NYCTronMediaDecoder";
/** Media encoding to MP4 (H.264 + AAC). */
export const MEDIA_ENCODER_MODULE_NAME="NYCTronMediaEncoder";
/** Streaming speech recognition (SFSpeechRecognizer / SpeechRecognizer / SpeechRecognition). */
export const SPEECH_MODULE_NAME="NYCTronSpeech";
/** Audio device playback and capture (AVAudioEngine / AudioTrack+AudioRecord / AudioWorklet). */
export const AUDIO_DEVICE_MODULE_NAME="NYCTronAudioDevice";
