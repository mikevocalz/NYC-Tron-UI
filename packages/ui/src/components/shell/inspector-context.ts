import {createContext} from "react";
import type {StoreApi} from "zustand/vanilla";
import type {InspectorRegistryState} from "./inspector-model.ts";

/** Provided by {@linkcode InspectorPanel} to its sections and rows. */
export interface InspectorPanelContextValue {
  readonly query:string;
  readonly registry:StoreApi<InspectorRegistryState>;
}
/** Provided by {@linkcode InspectorSection} to nested sections and rows. */
export interface InspectorSectionContextValue {
  /** Ids of this section and every section around it, outermost first. */
  readonly path:readonly string[];
  /** True when this section or one around it is switched off. */
  readonly disabled:boolean;
  readonly depth:number;
}

export const InspectorPanelContext=createContext<InspectorPanelContextValue|undefined>(undefined);
export const InspectorSectionContext=createContext<InspectorSectionContextValue>({path:[],disabled:false,depth:0});
