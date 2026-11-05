import {createDocuments,type Documents} from "./documents.ts";

export {DOCUMENTS_MODULE_NAME} from "../module-names.ts";

type WebNavigator={share?(data:{title?:string;text?:string;url?:string}):Promise<void>;canShare?(data:object):boolean};

/**
 * Web picks files through `@nyc-tron/ui`'s FilePicker (it hands over `File`
 * objects), so `pick` resolves [] here and there is no open-in-place.
 * `share` uses the Web Share API where the browser has it: text plus at most
 * one http(s) URL. It resolves false when the browser cannot share or the
 * person dismisses the sheet.
 */
export function createPlatformDocuments():Documents{
  const base=createDocuments(null);
  return {
    ...base,
    async share({uris=[],text,title}){
      const nav=(globalThis as {navigator?:WebNavigator}).navigator;
      const url=uris.find(u=>/^https?:\/\//.test(u));
      if(!nav?.share||(!text&&!url))return false;
      const data={...(title?{title}:{}),...(text?{text}:{}),...(url?{url}:{})};
      if(nav.canShare&&!nav.canShare(data))return false;
      try{await nav.share(data);return true;}catch{return false;}
    },
  };
}
