export {createPlatformSpeechRecognizer,SPEECH_MODULE_NAME} from "./platform.native.ts";
export {createSpeechConsent,createSpeechRecognizer,SpeechError,toSpeechError,normalizeSpeechStart,toSpeechRecognizerProbe,toSpeechSessionEvent,toSpeechSessionStart,
  SPEECH_ERROR_CODES,MAX_SPEECH_LOCALE_LENGTH,MAX_SPEECH_HINTS,MAX_SPEECH_HINT_LENGTH,MAX_SPEECH_SESSIONS,DEFAULT_SPEECH_SESSION_MS,
  MAX_SPEECH_WORDS,MAX_SPEECH_WORD_CHARS,MAX_SPEECH_TEXT_CHARS} from "./recognizer.ts";
export type {NormalizedSpeechStart,SpeechConsent,SpeechConsentController,SpeechConsentOptions,SpeechErrorCode,SpeechRecognitionSession,
  SpeechRecognizer,SpeechRecognizerNative,SpeechRecognizerOptions,SpeechRecognizerProbe,SpeechSessionEvent,SpeechStartNative,SpeechStartOptions,
  SpeechWord} from "./recognizer.ts";
