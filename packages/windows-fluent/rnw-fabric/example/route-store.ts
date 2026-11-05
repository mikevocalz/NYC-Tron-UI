import {createStore} from "zustand/vanilla";

export const destinations = [
  {id:"home",label:"Home"},
  {id:"workspace",label:"Workspace"},
  {id:"disabled",label:"Unavailable",disabled:true},
] as const;
export interface NavigationState {
  selectedId:string;
  pendingId:string|null;
  paneOpen:boolean;
  settingsOpen:boolean;
  status:string;
  nativeError:string|null;
  requestRoute:(id:string)=>void;
  acceptRoute:()=>void;
  rejectRoute:()=>void;
  setPaneOpen:(open:boolean)=>void;
  openSettings:()=>void;
  closeSettings:()=>void;
  reportNativeError:(error:Error)=>void;
}
export function createNavigationStore() {
 return createStore<NavigationState>((set,get)=>({
  selectedId:"home",pendingId:null,paneOpen:true,settingsOpen:false,status:"Home",nativeError:null,
  requestRoute:(id)=>{
   const destination=destinations.find(item=>item.id===id);
   if(!destination||("disabled" in destination&&destination.disabled)||id===get().selectedId)return;
   set({pendingId:id,status:"Awaiting app approval: "+destination.label});
  },
  acceptRoute:()=>{
   const id=get().pendingId;
   if(id!==null)set({selectedId:id,pendingId:null,status:"Committed route: "+id});
  },
  rejectRoute:()=>set({pendingId:null,status:"Navigation rejected; current route retained"}),
  setPaneOpen:(paneOpen)=>set({paneOpen}),
  openSettings:()=>set({settingsOpen:true}),
  closeSettings:()=>set({settingsOpen:false}),
  reportNativeError:(error)=>set({nativeError:error.message}),
 }));
}
