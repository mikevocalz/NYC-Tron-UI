import {useEffect,useLayoutEffect,useRef,useId,type ComponentRef} from "react";
import {Modal,Platform,Pressable,ScrollView,Text,View,useWindowDimensions,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {Button} from "../Button.tsx";
import {TextField} from "../TextField.tsx";
import {announce} from "../forge/announce.ts";
import {placePopover,type Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton,type CommandMenuItem} from "./MenuButton.tsx";
import {
  PRESET_NAME_MAX,copyName,presetActions,presetNameMessage,presetNameProblem,validatePresetList,
  type WorkspacePreset,
} from "./workspace-preset-model.ts";

export type {WorkspacePreset} from "./workspace-preset-model.ts";

/**
 * Props for {@linkcode WorkspacePresetSwitcher}. Each callback maps to one
 * action on the host's preset store; the switcher never edits presets itself.
 */
export interface WorkspacePresetSwitcherProps extends Omit<ViewProps,"children"> {
  /** Document/workspace identity. Changes abandon open drafts and queued UI actions. */
  scope?:string;
  disabled?:boolean;
  /** Relevant workspace/preset revision; a change abandons pending menu/dialog input. */
  revision?:string|number;
  presets:readonly WorkspacePreset[];
  activeId?:string;
  /** Switch to a preset. */
  onSelect:(id:string)=>void;
  /** Save the current layout as a new custom preset. `name` is trimmed and validated. */
  onSaveAs:(name:string)=>void;
  /** Rename a custom preset. `name` is trimmed and validated. */
  onRename:(id:string,name:string)=>void;
  /** Copy a preset (built-in or custom) into a new custom one. */
  onDuplicate:(id:string)=>void;
  /** Delete a custom preset, after the user confirmed. */
  onDelete:(id:string)=>void;
  /** Put a preset's layout back to its saved default. */
  onReset:(id:string)=>void;
  /**
   * The preset the host just deleted and can still restore. While set, an
   * "Undo delete" button shows beside the menu. The host clears it when the
   * undo window ends.
   */
  recentlyDeleted?:{readonly id:string;readonly name:string};
  /** Restore {@linkcode WorkspacePresetSwitcherProps.recentlyDeleted}. Without it no undo is offered. */
  onUndoDelete?:(id:string)=>void;
  /** Window-space regions the menu and preset dialogs may use, from the foldable layout owner. */
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

type DialogDraft=
  | {kind:"save"|"rename";presetId:string|null;draft:string;submitted:boolean}
  | {kind:"delete";presetId:string};
type Dialog=DialogDraft&{readonly session:number};
type Local={dialog:Dialog|undefined;nextSession:number};

/**
 * Menu for workspace layout presets: the built-in edit, color, audio, review
 * and presentation layouts plus the user's own. Built-ins are read-only and
 * offer only "Reset to default"; custom presets can be renamed, duplicated
 * and deleted (with a confirmation, then an undo button when the host keeps
 * the deleted preset). Names are trimmed, unique ignoring case, and at most
 * 40 characters. The menu is the kit's {@linkcode MenuButton}.
 */
export function WorkspacePresetSwitcher({
  scope="workspace",revision=0,disabled=false,presets,activeId,onSelect,onSaveAs,onRename,onDuplicate,onDelete,onReset,recentlyDeleted,onUndoDelete,
  usableRegions,className,unstyled=false,style,...rest
}:WorkspacePresetSwitcherProps){
  validatePresetList(presets);
  if(!scope.trim()||scope.length>256||typeof revision==='number'&&!Number.isFinite(revision)||typeof revision==='string'&&revision.length>512)throw new RangeError("Invalid workspace preset scope");
  const window=useWindowDimensions();
  const regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
  const dialogRegion=regions.some(r=>Number.isFinite(r.x)&&Number.isFinite(r.y)&&Number.isFinite(r.width)&&Number.isFinite(r.height)&&r.width>0&&r.height>0)
    ?placePopover({x:window.width/2,y:window.height/2,width:0,height:0},regions,420,320,16).region:undefined;
  const saved=presets.find(p=>p.id===activeId);
  const active=saved??{id:"",name:"Custom layout",builtIn:true,modified:false};
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({dialog:undefined,nextSession:1}));
  const store=local.current;
  const dialog=useStore(store,s=>s.dialog);
  const trigger=useRef<ComponentRef<typeof Pressable>>(null);
  const styled=!unstyled,nameId=useId();
  const can=presetActions(saved);

  const undoable=recentlyDeleted&&onUndoDelete?recentlyDeleted:undefined;
  const lastUndo=useRef<string|undefined>(undefined);
  const boundary=JSON.stringify([scope,revision,disabled,activeId??null,saved?.id??null,saved?.builtIn??null]);
  const snapshot=useRef<{boundary:string;scope:string;disabled:boolean;presets:readonly WorkspacePreset[];onSelect:typeof onSelect;onSaveAs:typeof onSaveAs;onRename:typeof onRename;onDuplicate:typeof onDuplicate;onDelete:typeof onDelete;onReset:typeof onReset;onUndoDelete:typeof onUndoDelete;undoable:typeof undoable}|null>(null);
  const focusTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useLayoutEffect(()=>{snapshot.current={boundary,scope,disabled,presets,onSelect,onSaveAs,onRename,onDuplicate,onDelete,onReset,onUndoDelete,undoable};});
  const undoScope=useRef(scope);
  useLayoutEffect(()=>{if(undoScope.current!==scope){lastUndo.current=undefined;undoScope.current=scope;}return()=>{snapshot.current=null;if(focusTimer.current!==null)clearTimeout(focusTimer.current);};},[scope]);
  useLayoutEffect(()=>{store.setState({dialog:undefined});},[boundary,store]);
  const current=()=>!disabled&&snapshot.current?.boundary===boundary?snapshot.current:null;
  const openDialog=(draft:DialogDraft)=>store.setState(state=>({nextSession:state.nextSession+1,dialog:{...draft,session:state.nextSession}}));
  useEffect(()=>{
    if(!undoable||lastUndo.current===undoable.id){lastUndo.current=undoable?.id;return;}
    lastUndo.current=undoable.id;
    announce(`Deleted “${undoable.name}”. Undo is available.`);
  },[undoable]);

  const focusTrigger=()=>{
    if(Platform.OS!=="web"||snapshot.current?.scope!==scope||snapshot.current.disabled)return;
    if(focusTimer.current!==null)clearTimeout(focusTimer.current);
    focusTimer.current=setTimeout(()=>{focusTimer.current=null;if(snapshot.current?.scope===scope)(trigger.current as unknown as {focus?:()=>void}|null)?.focus?.();},0);
  };
  const finishDialog=()=>{
    if(snapshot.current?.scope!==scope)return;
    store.setState({dialog:undefined});focusTrigger();
  };
  const close=()=>{if(current()&&store.getState().dialog!==undefined)finishDialog();};

  const items:CommandMenuItem[]=[
    ...presets.map(p=>({id:"preset:"+p.id,label:p.name,
      description:[p.builtIn?"Built-in":"Custom",p.id===activeId?"current":undefined,p.modified?"modified":undefined]
        .filter(Boolean).join(", ")})),
    {id:"action:save",label:"Save layout as new preset…"},
    {id:"action:duplicate",label:`Duplicate “${active.name}”`,disabled:!saved},
    {id:"action:rename",label:`Rename “${active.name}”…`,disabled:!can.canRename,
      ...(can.canRename?{}:{description:"Built-in presets keep their names"})},
    {id:"action:reset",label:`Reset “${active.name}” to default`,disabled:!can.canReset,
      ...(can.canReset?{}:{description:"Layout already matches the default"})},
    {id:"action:delete",label:`Delete “${active.name}”…`,danger:true,disabled:!can.canDelete,
      ...(can.canDelete?{}:{description:"Built-in presets can’t be deleted"})},
  ];
  const onMenu=(id:string)=>{
    const p=current();if(!p||store.getState().dialog!==undefined)return;
    if(id.startsWith("preset:")){const target=id.slice(7);if(target!==activeId&&p.presets.some(preset=>preset.id===target)){p.onSelect(target);focusTrigger();}return;}
    const subject=p.presets.find(preset=>preset.id===activeId),actions=presetActions(subject);
    switch(id.slice(7)){
      case "save":openDialog({kind:"save",presetId:subject?.id??null,draft:copyName(active.name,p.presets),submitted:false});break;
      case "rename":if(actions.canRename&&subject)openDialog({kind:"rename",presetId:subject.id,draft:subject.name,submitted:false});break;
      case "duplicate":if(subject)p.onDuplicate(subject.id);break;
      case "reset":if(actions.canReset&&subject)p.onReset(subject.id);break;
      case "delete":if(actions.canDelete&&subject)openDialog({kind:"delete",presetId:subject.id});break;
    }
  };

  const named=dialog&&dialog.kind!=="delete"?dialog:undefined;
  const problem=named?presetNameProblem(named.draft,presets,named.kind==="rename"?activeId:undefined):undefined;
  const submitName=()=>{
    const p=current(),draft=store.getState().dialog;
    if(!p||!named||!draft||draft.session!==named.session||draft.kind==='delete')return;
    const subject=p.presets.find(preset=>preset.id===draft.presetId);
    if(draft.kind==='rename'&&(!subject||subject.builtIn||subject.id!==activeId))return;
    const problem=presetNameProblem(draft.draft,p.presets,draft.kind==='rename'?subject?.id:undefined);
    if(problem){store.setState({dialog:{...draft,submitted:true}});return;}
    const name=draft.draft.trim();
    if(draft.kind==="save")p.onSaveAs(name);
    else if(subject&&name!==subject.name)p.onRename(subject.id,name);
    finishDialog();
  };
  const deletePreset=()=>{
    const p=current(),draft=store.getState().dialog;
    if(!p||dialog?.kind!=='delete'||draft?.kind!=='delete'||draft.session!==dialog.session)return;
    const subject=p.presets.find(preset=>preset.id===draft.presetId);
    if(!subject||subject.builtIn||subject.id!==activeId)return;
    p.onDelete(subject.id);finishDialog();
  };

  const triggerLabel=`Workspace preset: ${active.name}${active.modified?", modified":""}`;
  return <View {...rest} {...{className:joinClasses("flex-row items-center gap-1",className)}} style={style}>
    <MenuButton disabled={disabled} editScope={boundary} ref={trigger} label={triggerLabel} items={items} onSelect={onMenu} menuWidth={280}
      {...(usableRegions?{usableRegions}:{})} unstyled={unstyled}
      {...{className:joinClasses("flex-row gap-2 px-3",styled&&"border border-border bg-surface-raised hover:bg-surface-sunken")}}>
      <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm font-semibold text-text")}} style={{maxWidth:160}}>{active.name}</Text>
      {active.modified?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent")}}
        style={{width:8,height:8,borderRadius:4,borderWidth:4}}/>:null}
      <Chevron styled={styled}/>
    </MenuButton>
    {undoable?<Button disabled={disabled} title="Undo delete" variant="ghost" size="md"
      accessibilityLabel={`Undo delete of “${undoable.name}”`} onPress={()=>{const p=current();if(p?.undoable?.id===undoable.id)p.onUndoDelete?.(undoable.id);}}/>:null}
    <Modal visible={dialog!==undefined&&dialogRegion!==undefined} transparent animationType={Platform.OS==="web"?"none":"fade"} onRequestClose={close}>
      <View style={{flex:1}} {...{className:styled?"bg-text/50":undefined}}>
        <View style={{position:"absolute",left:dialogRegion?.x??0,top:dialogRegion?.y??0,width:dialogRegion?.width??0,height:dialogRegion?.height??0,alignItems:"center",justifyContent:"center",padding:16}}>
        <ScrollView keyboardShouldPersistTaps="handled" style={{flexGrow:0,width:"100%",maxWidth:420,maxHeight:"100%"}} contentContainerStyle={{flexGrow:1}}>
        <View accessibilityViewIsModal {...{role:"dialog","aria-modal":true,
          "aria-label":dialog?.kind==="delete"?"Delete preset":dialog?.kind==="rename"?"Rename preset":"Save preset",
          className:joinClasses("w-full gap-4 p-5",styled&&"rounded-card border border-border bg-surface-raised")}}
          style={{maxWidth:420}}>
          {dialog?.kind==="delete"?<>
            <Text accessibilityRole="header" {...{className:joinClasses("text-start",styled&&"text-lg font-semibold text-text")}}>
              {`Delete “${active.name}”?`}</Text>
            <Text {...{className:joinClasses("text-start",styled&&"text-sm text-text-muted")}}>
              {onUndoDelete?"The preset and its layout are removed. You can undo this right after.":"The preset and its layout are removed for good."}</Text>
            <View style={{flexDirection:"row",justifyContent:"flex-end",gap:8,flexWrap:"wrap"}}>
              <Button title="Cancel" variant="secondary" onPress={close}/>
              <Button title="Delete" variant="danger" onPress={deletePreset}/>
            </View>
          </>:named?<>
            <Text accessibilityRole="header" {...{className:joinClasses("text-start",styled&&"text-lg font-semibold text-text")}}>
              {named.kind==="save"?"Save layout as a new preset":`Rename “${active.name}”`}</Text>
            <TextField id={`${nameId}-workspace-preset-name`} label="Preset name" value={named.draft} autoFocus selectTextOnFocus
              maxLength={PRESET_NAME_MAX*2+20} returnKeyType="done" onSubmitEditing={submitName}
              onChangeText={draft=>{const open=store.getState().dialog;if(current()&&open?.session===named.session&&open.kind!=='delete')store.setState({dialog:{...open,draft}});}}
              {...(named.submitted&&problem?{errorText:presetNameMessage(problem,named.draft)}
                :{helperText:`Up to ${PRESET_NAME_MAX} characters.`})}/>
            <View style={{flexDirection:"row",justifyContent:"flex-end",gap:8,flexWrap:"wrap"}}>
              <Button title="Cancel" variant="secondary" onPress={close}/>
              <Button title={named.kind==="save"?"Save preset":"Rename"} onPress={submitName}/>
            </View>
          </>:null}
        </View>
        </ScrollView>
        </View>
      </View>
    </Modal>
  </View>;
}

function Chevron({styled}:{styled:boolean}){
  // Two strokes drawn as borders, so forced-colors mode keeps them.
  return <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text-muted")}}
    style={{width:8,height:8,borderRightWidth:2,borderBottomWidth:2,transform:[{rotate:"45deg"}],marginTop:-4}}/>;
}
