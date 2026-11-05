import {findNativeModule} from "../native-module.ts";
import {createDocuments,type Documents,type DocumentsNative} from "./documents.ts";

/** Name both platforms register the documents module under. */
export const DOCUMENTS_MODULE_NAME="NYCTronDocuments";

/**
 * {@linkcode Documents} over UIDocumentPickerViewController and
 * UIActivityViewController on iOS, ACTION_OPEN_DOCUMENT and the share
 * chooser on Android.
 */
export function createPlatformDocuments():Documents{
  return createDocuments(findNativeModule<DocumentsNative>(DOCUMENTS_MODULE_NAME));
}
