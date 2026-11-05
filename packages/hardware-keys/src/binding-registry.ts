import type {NativeKeyBinding} from "@nyc-tron/ui/components/shell/keyboard-map";
import type {Subscription} from "./key-source.ts";

/**
 * Union of the bindings every mounted hook asked for, pushed to the native
 * module as one list. Two hooks never clobber each other's registrations,
 * and the first one registered keeps the title the iPad overlay shows.
 */
export function createBindingRegistry(push:(bindings:NativeKeyBinding[])=>void){
  const sets=new Map<symbol,readonly NativeKeyBinding[]>();
  const flush=()=>{
    const merged=new Map<string,NativeKeyBinding>();
    for(const list of sets.values())for(const b of list)if(!merged.has(b.binding))merged.set(b.binding,b);
    push([...merged.values()]);
  };
  return {
    register(bindings:readonly NativeKeyBinding[]):Subscription{
      const token=Symbol("bindings");
      sets.set(token,bindings);
      flush();
      let live=true;
      return {remove(){if(!live)return;live=false;sets.delete(token);flush();}};
    },
  };
}
