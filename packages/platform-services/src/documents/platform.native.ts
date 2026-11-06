import {findNativeModule} from "../native-module.ts";
import {DOCUMENTS_MODULE_NAME} from "../module-names.ts";
import {createDocuments,type Documents,type DocumentsNative} from "./documents.ts";

export {DOCUMENTS_MODULE_NAME} from "../module-names.ts";

/**
 * {@linkcode Documents} over UIDocumentPickerViewController and
 * UIActivityViewController on iOS, ACTION_OPEN_DOCUMENT and the share
 * chooser on Android.
 */
export function createPlatformDocuments():Documents{
  return createDocuments(findNativeModule<DocumentsNative>(DOCUMENTS_MODULE_NAME));
}
