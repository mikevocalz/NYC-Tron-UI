import {Pressable,ScrollView,Text,TextInput,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {useLocalStore} from "../../useLocalStore.ts";
import {OFFICE_TOUCH_TARGET,ToolButton} from "../office/office-controls.tsx";
import {groupThreads,resolveReply,threadCounts,threadLabel,type CommentEntry,type CommentFilter,type CommentThread} from "./comments-model.ts";

/** Props for {@linkcode CommentsThreadPanel}. Each action renders only when its callback is passed. */
export interface CommentsThreadPanelProps extends Omit<ViewProps,"children"> {
  readonly threads:readonly CommentThread[];
  readonly selectedId?:string;
  /** Shows the thread's page and anchor. */
  readonly onSelect:(id:string)=>void;
  /** Adds a reply. Rejecting keeps the draft so nothing typed is lost. */
  readonly onReply?:(threadId:string,body:string)=>void|Promise<unknown>;
  readonly onResolvedChange?:(threadId:string,resolved:boolean)=>void|Promise<unknown>;
  readonly onDelete?:(threadId:string)=>void|Promise<unknown>;
  /** The filter row renders only when `onResolvedChange` is passed (otherwise nothing is ever resolved). */
  readonly filter?:CommentFilter;
  readonly onFilterChange?:(filter:CommentFilter)=>void;
  /** Read failed: shown instead of the list. "No comments" is only said after a successful read. */
  readonly error?:string;
  readonly onRetry?:()=>void;
  /** @default "Comments" */
  readonly label?:string;
  className?:string;
  unstyled?:boolean;
}

type Local={drafts:Record<string,string>;failed:Record<string,string>;busy:Record<string,boolean>};

/**
 * PDF comment threads (K-07), grouped by page: author, time, body, replies,
 * and reply / resolve / delete when the host can save them. A failed reply
 * keeps its draft and shows the error under the field.
 */
export function CommentsThreadPanel({
  threads,selectedId,onSelect,onReply,onResolvedChange,onDelete,filter="all",onFilterChange,error,onRetry,label="Comments",
  className,unstyled=false,...rest
}:CommentsThreadPanelProps){
  const styled=!unstyled;
  const [local,store]=useLocalStore<Local>(()=>({drafts:{},failed:{},busy:{}}));
  const canFilter=onResolvedChange!==undefined&&onFilterChange!==undefined;
  const groups=groupThreads(threads,canFilter?filter:"all");
  const counts=threadCounts(threads);
  const text=joinClasses(styled&&"text-text");
  const muted=joinClasses(styled&&"text-text-muted text-sm");
  const send=async(id:string)=>{
    const body=resolveReply(local.drafts[id]??"");
    if(!body||!onReply)return;
    store.set(s=>({...s,busy:{...s.busy,[id]:true},failed:{...s.failed,[id]:""}}));
    try{
      await onReply(id,body);
      store.set(s=>({...s,drafts:{...s.drafts,[id]:""},busy:{...s.busy,[id]:false}}));
    }catch(e){
      store.set(s=>({...s,busy:{...s.busy,[id]:false},failed:{...s.failed,[id]:e instanceof Error?e.message:"The reply was not saved."}}));
    }
  };
  return <View {...rest} accessibilityLabel={label} {...{role:"region",className:joinClasses("min-w-0",className)}}
    style={[{gap:10},rest.style as object]}>
    {canFilter?<View accessibilityRole="radiogroup" accessibilityLabel="Show comments" style={{flexDirection:"row",gap:4,flexWrap:"wrap"}}>
      {(["open","resolved","all"] as const).map(f=><Pressable key={f} accessibilityRole="radio" accessibilityState={{checked:filter===f}}
        onPress={()=>onFilterChange!(f)}
        {...{className:joinClasses(styled&&"rounded-control border focus-visible:ring-2 focus-visible:ring-focus",
          styled&&(filter===f?"border-accent bg-accent/10":"border-border"))}}
        style={{minHeight:OFFICE_TOUCH_TARGET,paddingHorizontal:12,justifyContent:"center"}}>
        <Text {...{className:joinClasses(styled&&"text-text text-sm")}}>{(f==="open"?"Open":f==="resolved"?"Resolved":"All")+" ("+counts[f]+")"}</Text>
      </Pressable>)}
    </View>:null}
    {error?<View style={{gap:8,alignItems:"flex-start"}}>
      <Text accessibilityLiveRegion="polite" {...{className:text}}>{error}</Text>
      {onRetry?<Button title="Load comments again" variant="secondary" size="sm" onPress={onRetry}/>:null}
    </View>
    :groups.length===0?<Text {...{className:muted}}>
      {threads.length===0?"No comments in this document.":filter==="resolved"?"No resolved comments.":"No open comments."}
    </Text>
    :<ScrollView style={{flexShrink:1}} contentContainerStyle={{gap:14}} keyboardShouldPersistTaps="handled">
      {groups.map(g=><View key={g.page} style={{gap:8}}>
        <Text accessibilityRole="header" {...{className:joinClasses(styled&&"text-text text-sm font-semibold")}}>{"Page "+(g.page+1)}</Text>
        {g.threads.map(t=>{
          const on=t.id===selectedId;
          const draft=local.drafts[t.id]??"";
          const failed=local.failed[t.id];
          const busy=local.busy[t.id]===true;
          return <View key={t.id}
            {...{className:joinClasses(styled&&"rounded-card border",styled&&(on?"border-accent bg-surface-raised":"border-border bg-surface-raised"))}}
            style={{padding:10,gap:8,opacity:t.resolved?0.7:1}}>
            <Pressable accessibilityRole="button" accessibilityLabel={threadLabel(t)} accessibilityState={{selected:on}}
              accessibilityHint="Shows this comment on its page" onPress={()=>onSelect(t.id)}
              {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
              style={{minHeight:OFFICE_TOUCH_TARGET,gap:2,justifyContent:"center"}}>
              <Entry entry={t} styled={styled}/>
            </Pressable>
            {t.replies.length?<View {...{className:joinClasses(styled&&"border-border")}} style={{gap:8,borderStartWidth:1,paddingStart:10}}>
              {t.replies.map(r=><Entry key={r.id} entry={r} styled={styled}/>)}
            </View>:null}
            {onReply&&!t.resolved?<View style={{gap:6}}>
              <View style={{flexDirection:"row",gap:6,alignItems:"center"}}>
                <TextInput value={draft} placeholder="Write a reply" accessibilityLabel={"Reply to "+(t.author??"comment on page "+(t.page+1))}
                  editable={!busy} onChangeText={v=>store.set(s=>({...s,drafts:{...s.drafts,[t.id]:v}}))}
                  onSubmitEditing={()=>void send(t.id)} returnKeyType="send"
                  {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken text-text px-3 focus:border-focus")}}
                  style={{flex:1,minWidth:0,minHeight:OFFICE_TOUCH_TARGET}}/>
                <Button title="Reply" size="sm" variant="secondary" loading={busy} disabled={!resolveReply(draft)} onPress={()=>void send(t.id)}/>
              </View>
              {failed?<Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-danger text-sm")}}>{failed}</Text>:null}
            </View>:null}
            {onResolvedChange||onDelete?<View style={{flexDirection:"row",gap:6,flexWrap:"wrap"}}>
              {onResolvedChange&&t.resolved!==undefined?<ToolButton label={t.resolved?"Reopen":"Resolve"} styled={styled}
                onPress={()=>void onResolvedChange(t.id,!t.resolved)}/>:null}
              {onDelete?<ToolButton label="Delete" styled={styled} accessibilityLabel={"Delete comment on page "+(t.page+1)}
                onPress={()=>void onDelete(t.id)}/>:null}
            </View>:null}
          </View>;
        })}
      </View>)}
    </ScrollView>}
  </View>;
}

function Entry({entry,styled}:{entry:CommentEntry;styled:boolean}){
  const meta=[entry.author,entry.timeLabel].filter(Boolean).join(", ");
  return <View style={{gap:2}}>
    {meta?<Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted text-sm")}} style={{fontWeight:"600"}}>{meta}</Text>:null}
    <Text selectable {...{className:joinClasses(styled&&"text-text")}} style={{lineHeight:21}}>
      {entry.body||"No note text"}
    </Text>
  </View>;
}
