import {useEffect,useLayoutEffect,useRef,type ComponentRef} from "react";
import {I18nManager,Platform,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../styles.ts";
import {nodeIsRTL,rovingTarget,shellKey} from "./shell-keys.ts";
import {documentTabLabel,validateDocumentTabs,type DocumentTab} from "./document-tabs-model.ts";

export type {DocumentTab} from "./document-tabs-model.ts";
export {activeAfterClose,moveDocument} from "./document-tabs-model.ts";

/** Props for {@linkcode DocumentTabBar}. */
export interface DocumentTabBarProps extends Omit<ViewProps,"children"> {
  /** Workspace identity/revision cancel obsolete document actions. */
  scope?:string;revision?:string|number;disabled?:boolean;
  documents:readonly DocumentTab[];
  /** The focused document. A value matching no tab selects none. */
  activeId:string|undefined;
  onActivate:(id:string)=>void;
  /**
   * Close was requested from the close button, Delete, or a screen-reader
   * action. The app confirms unsaved changes and picks the next active tab
   * (see {@linkcode activeAfterClose}).
   */
  onClose?:(id:string)=>void;
  /** Move `id` to `toIndex`. Without it the tabs cannot be reordered. */
  onReorder?:(id:string,toIndex:number)=>void;
  /** Accessible name of the tab list. @default "Open documents" */
  label?:string;
  className?:string;
  tabClassName?:string;
  unstyled?:boolean;
}

/**
 * Controlled tab strip for open documents. Each tab shows an unsaved-changes
 * marker and its own 44pt close button. On web the active tab is the Tab
 * stop; arrows (flipped in RTL), Home and End move between tabs,
 * Ctrl+Shift+Arrow (Cmd on Apple keyboards) reorders, and Delete closes.
 * Screen readers get activate, close and move actions. The strip scrolls
 * horizontally and keeps the active tab in view on narrow panes.
 */
export function DocumentTabBar({
  scope="documents",revision=0,disabled=false,documents,activeId,onActivate,onClose,onReorder,label="Open documents",
  className,tabClassName,unstyled=false,style,...rest
}:DocumentTabBarProps){
  validateDocumentTabs(documents);
  const styled=!unstyled;
  const boundary=JSON.stringify([scope,revision,disabled]);
  const committed=useRef<{boundary:string;documents:readonly DocumentTab[];onActivate:typeof onActivate;onClose:typeof onClose;onReorder:typeof onReorder}|null>(null);
  useLayoutEffect(()=>{committed.current={boundary,documents,onActivate,onClose,onReorder};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const current=()=>!disabled&&committed.current?.boundary===boundary?committed.current:null;
  const activate=(id:string)=>{const p=current();if(p?.documents.some(d=>d.id===id))p.onActivate(id);};
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const offsets=useRef(new Map<string,{x:number;width:number}>());
  const scroller=useRef<ComponentRef<typeof ScrollView>>(null);
  const viewport=useRef(0);
  const active=documents.findIndex(d=>d.id===activeId);
  const stop=active>=0?active:0;
  useEffect(()=>{
    const at=activeId?offsets.current.get(activeId):undefined;
    if(!at||!viewport.current)return;
    scroller.current?.scrollTo({x:Math.max(0,at.x+at.width/2-viewport.current/2),animated:false});
  },[activeId,documents]);

  const focusAt=(i:number)=>(refs.current[i] as unknown as {focus?:()=>void}|null)?.focus?.();
  const move=(id:string,delta:-1|1)=>{
    const p=current();if(!p?.onReorder)return;
    const index=p.documents.findIndex(d=>d.id===id),to=index+delta;
    if(index<0||to<0||to>=p.documents.length)return;
    p.onReorder(id,to);
  };
  const close=(doc:DocumentTab)=>{const p=current(),subject=p?.documents.find(d=>d.id===doc.id);if(subject&&subject.closable!==false)p?.onClose?.(subject.id);};
  const onKeyDown=(i:number)=>(event:unknown)=>{
    if(!current())return;
    const k=shellKey(event);
    const rtl=nodeIsRTL(k.target)||I18nManager.isRTL;
    const doc=documents[i]!;
    if((k.ctrlKey||k.metaKey)&&k.shiftKey&&(k.key==="ArrowLeft"||k.key==="ArrowRight")){
      k.preventDefault();
      move(doc.id,(k.key==="ArrowRight")!==rtl?1:-1);
      return;
    }
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    if(k.key==="Delete"){k.preventDefault();close(doc);return;}
    const next=rovingTarget(i,k.key,documents.map(()=>false),"horizontal",rtl);
    if(next===null)return;
    k.preventDefault();
    focusAt(next);
    activate(documents[next]!.id);
  };

  return <View {...rest} {...{className:joinClasses("min-w-0",styled&&"border-b border-border bg-surface-sunken",className)}} style={style}>
    <ScrollView ref={scroller} horizontal showsHorizontalScrollIndicator={false}
      onLayout={e=>{viewport.current=e.nativeEvent.layout.width;}}
      contentContainerStyle={{flexDirection:"row",alignItems:"stretch",paddingHorizontal:4,gap:2}}>
      <View accessibilityRole="tablist" accessibilityLabel={label} style={{flexDirection:"row",gap:2}}>
        {documents.map((doc,i)=>{
          const selected=i===active;
          const closable=!!onClose&&doc.closable!==false;
          const actions=[
            {name:"activate",label:"Show "+doc.title},
            ...(closable?[{name:"close",label:"Close "+doc.title}]:[]),
            ...(onReorder&&i>0?[{name:"moveEarlier",label:"Move earlier"}]:[]),
            ...(onReorder&&i<documents.length-1?[{name:"moveLater",label:"Move later"}]:[]),
          ];
          return <View key={doc.id}
            onLayout={e=>offsets.current.set(doc.id,{x:e.nativeEvent.layout.x,width:e.nativeEvent.layout.width})}
            {...{className:joinClasses(styled&&"rounded-t-control",styled&&(selected?"bg-surface-raised border-x border-t border-border":"bg-transparent"),tabClassName)}}
            style={{flexDirection:"row",alignItems:"center",maxWidth:240,marginTop:4}}>
            <Pressable ref={node=>{refs.current[i]=node;}} accessibilityRole="tab"
              accessibilityLabel={documentTabLabel(doc)} disabled={disabled} accessibilityState={{selected,disabled}} aria-selected={selected}
              accessibilityActions={actions}
              onAccessibilityAction={event=>{
                const name=event.nativeEvent.actionName;
                if(name==="activate")activate(doc.id);
                if(name==="close")close(doc);
                if(name==="moveEarlier")move(doc.id,-1);
                if(name==="moveLater")move(doc.id,1);
              }}
              onPress={()=>activate(doc.id)}
              {...(Platform.OS==="web"?{onKeyDown:onKeyDown(i),tabIndex:!disabled&&i===stop?0:-1}:{})}
              {...{className:joinClasses("min-h-11 flex-row items-center gap-2",styled&&"rounded-control px-3 focus-visible:ring-2 focus-visible:ring-focus")}}
              style={{flexShrink:1}}>
              {doc.dirty?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent")}}
                style={{width:8,height:8,borderRadius:4,borderWidth:4}}/>:null}
              <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(selected?"text-text font-semibold":"text-text-muted"))}}
                style={{flexShrink:1}}>{doc.title}</Text>
            </Pressable>
            {closable?<Pressable accessibilityRole="button" accessibilityLabel={"Close "+doc.title}
              disabled={disabled} onPress={()=>close(doc)}
              // The tab carries the close action for keyboards and screen readers.
              {...(Platform.OS==="web"?{tabIndex:-1}:{accessibilityElementsHidden:true,importantForAccessibility:"no-hide-descendants" as const})}
              {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control hover:bg-surface-sunken")}}>
              <CloseGlyph styled={styled}/>
            </Pressable>:null}
          </View>;
        })}
      </View>
    </ScrollView>
  </View>;
}

function CloseGlyph({styled}:{styled:boolean}){
  // Bars are top borders so forced-colors mode keeps them.
  const bar=joinClasses(styled&&"border-text-muted");
  return <View pointerEvents="none" style={{width:12,height:12,alignItems:"center",justifyContent:"center"}}>
    <View {...{className:bar}} style={{position:"absolute",width:14,height:0,borderTopWidth:1.5,transform:[{rotate:"45deg"}]}}/>
    <View {...{className:bar}} style={{position:"absolute",width:14,height:0,borderTopWidth:1.5,transform:[{rotate:"-45deg"}]}}/>
  </View>;
}
