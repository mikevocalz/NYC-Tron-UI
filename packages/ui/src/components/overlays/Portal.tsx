import {Fragment,createContext,useContext,useId,useLayoutEffect,useRef,useSyncExternalStore,
  type ComponentRef,type ReactNode,type Ref} from "react";
import {View,type ViewProps} from "react-native";
import {createPortalStore,type PortalStore} from "./portal-store.ts";
import {joinClasses} from "../styles.ts";
export {createPortalStore,type PortalStore,type PortalEntry} from "./portal-store.ts";

/**
 * Dependency-free portals for toasts, sheets and other layers that must draw
 * above the screen without an RN `Modal` (which takes focus and blocks the
 * page). Dialog does not use this; it keeps `Modal`, which already portals.
 *
 * Place one `PortalHost` as the last child of the app's root view. A
 * `Portal` anywhere below sends its children there.
 *
 * Limits, by design:
 * - Portaled children render inside the host's tree, so React context from
 *   the `Portal`'s own position (a theme provider below the host, for
 *   example) does not reach them. Put such providers above the host.
 * - With no host of that name mounted, `Portal` renders its children in
 *   place. When a host mounts later, they move to it and remount, so local
 *   state in them resets.
 */

const defaultStore:PortalStore<ReactNode>=createPortalStore<ReactNode>();
const PortalContext=createContext<PortalStore<ReactNode>>(defaultStore);

/** Props for {@linkcode PortalProvider}. */
export interface PortalProviderProps {
  /** A store to share; created once per provider when omitted. */
  store?:PortalStore<ReactNode>;
  children?:ReactNode;
}

/**
 * Optional. Without it, hosts and portals share one module-level store. Use a
 * provider to keep separate roots (tests, embedded apps, multiple windows)
 * from drawing into each other.
 */
export function PortalProvider({store,children}:PortalProviderProps){
  const own=useRef<PortalStore<ReactNode>|null>(null);
  if(!store&&!own.current)own.current=createPortalStore<ReactNode>();
  return <PortalContext.Provider value={store??own.current!}>{children}</PortalContext.Provider>;
}

/** Props for {@linkcode PortalHost}. */
export interface PortalHostProps extends Omit<ViewProps,"children"> {
  ref?:Ref<ComponentRef<typeof View>>;
  /** Host name that portals target. @default "root" */
  name?:string;
  /**
   * Cover the parent with an absolutely positioned layer that lets touches
   * through where nothing is drawn. Set false to lay the host out inline.
   * @default true
   */
  fill?:boolean;
  className?:string;
  /** Accepted for API consistency. The host has no default visual classes, so it changes nothing. */
  unstyled?:boolean;
}

const FILL={position:"absolute",top:0,right:0,bottom:0,left:0} as const;

/**
 * Draws every `Portal` that targets `name`, in the order they first mounted.
 * When several hosts share a name, the most recently mounted one draws.
 */
export function PortalHost({ref,name="root",fill=true,className,unstyled:_unstyled,style,...rest}:PortalHostProps){
  const store=useContext(PortalContext);
  // One token for this host's lifetime, so the active check works from the first render.
  const token=useRef<symbol|null>(null);
  if(!token.current)token.current=Symbol("PortalHost");
  const own=token.current;
  useLayoutEffect(()=>store.hostToken(name,own).unregister,[store,name,own]);
  const active=useSyncExternalStore(store.subscribe,()=>store.isActiveHost(name,own),()=>false);
  const entries=useSyncExternalStore(store.subscribe,()=>store.entries(name),()=>store.entries(name));
  return (
    <View {...rest} ref={ref}
      // box-none: the layer itself never takes a touch; its children do.
      style={[fill?FILL:undefined,{pointerEvents:"box-none"},style]}
      {...{className:joinClasses(className)}}>
      {active?entries.map(entry=><Fragment key={entry.key}>{entry.node}</Fragment>):null}
    </View>
  );
}

/** Props for {@linkcode Portal}. */
export interface PortalProps {
  /** Name of the `PortalHost` to draw into. @default "root" */
  host?:string;
  children?:ReactNode;
}

/**
 * Sends `children` to the named `PortalHost`. Updates keep the portal's place
 * in the host; unmounting removes it. Renders `children` in place when no
 * host with that name is mounted.
 */
export function Portal({host="root",children}:PortalProps){
  const store=useContext(PortalContext);
  const key=useId();
  const present=useSyncExternalStore(store.subscribe,()=>store.hasHost(host),()=>false);
  // Declared before the set effect so a host change removes the old entry first.
  useLayoutEffect(()=>{
    if(!present)return;
    return ()=>store.remove(host,key);
  },[store,host,key,present]);
  useLayoutEffect(()=>{
    if(present)store.set(host,key,children);
  },[store,host,key,present,children]);
  return present?null:<>{children}</>;
}
