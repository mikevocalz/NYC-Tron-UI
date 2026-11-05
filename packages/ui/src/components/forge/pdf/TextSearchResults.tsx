import {Pressable,ScrollView,Text,TextInput,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {Button} from "../../Button.tsx";
import {OFFICE_TOUCH_TARGET,SkipGlyph,ToolButton,officeKey,type OfficeKeyEvent} from "../office/office-controls.tsx";
import {groupHitsByPage,searchSummary,stepHit,type PdfSearchHit} from "./search-model.ts";

/** Search progress reported by the host while it walks the pages. */
export interface PdfSearchProgress {
  readonly searched:number;
  readonly pageCount:number;
  readonly running:boolean;
  /** The hit cap stopped the search before the last page. */
  readonly capped?:boolean;
}

/** Props for {@linkcode TextSearchResults}. */
export interface TextSearchResultsProps extends Omit<ViewProps,"children"> {
  readonly query:string;
  readonly onQueryChange:(query:string)=>void;
  /** Starts (or restarts) the search. Return key and the field's search action call it. */
  readonly onSubmit:(query:string)=>void;
  /** The query `hits` belong to; `undefined` before the first search. */
  readonly searchedQuery?:string;
  /** Hits in page order, from `insertPageHits`. */
  readonly hits:readonly PdfSearchHit[];
  /** Index into `hits` of the hit the page view shows, or -1. */
  readonly current:number;
  /** Shows hit `index`: the host moves the page view there. */
  readonly onSelect:(index:number,hit:PdfSearchHit)=>void;
  readonly progress:PdfSearchProgress;
  /**
   * The text could not be read (as opposed to "no matches"). Shown instead of
   * the results, with a retry that calls `onSubmit`.
   */
  readonly error?:string;
  /** The case toggle renders only with its callback. */
  readonly caseSensitive?:boolean;
  readonly onCaseSensitiveChange?:(value:boolean)=>void;
  /** The whole-word toggle renders only with its callback. */
  readonly wholeWords?:boolean;
  readonly onWholeWordsChange?:(value:boolean)=>void;
  className?:string;
  unstyled?:boolean;
}

/**
 * Document-wide text search for PDFs (K-04): a query field, optional case and
 * whole-word toggles, previous/next with wrap, and results grouped by page
 * with the match in bold inside its context. Enter (or F3) moves to the next
 * hit, Shift+Enter to the previous one.
 *
 * Highlighting hits on the rendered page needs glyph positions, which the
 * host's page renderer provides; this list gives it the page and the char
 * range.
 */
export function TextSearchResults({
  query,onQueryChange,onSubmit,searchedQuery,hits,current,onSelect,progress,error,caseSensitive=false,onCaseSensitiveChange,
  wholeWords=false,onWholeWordsChange,className,unstyled=false,...rest
}:TextSearchResultsProps){
  const styled=!unstyled;
  const groups=groupHitsByPage(hits);
  const go=(forward:boolean)=>{
    const i=stepHit(current,hits.length,forward);
    if(i>=0)onSelect(i,hits[i]!);
  };
  const submit=()=>{
    const q=query.trim();
    if(!q)return;
    // Searching the same text again steps to the next hit, as Find does in document apps.
    if(searchedQuery===q&&hits.length>0&&!progress.running){go(true);return;}
    onSubmit(q);
  };
  const onKeyDown=(e:OfficeKeyEvent)=>{
    const {key,shift}=officeKey(e);
    if(key==="F3"||(key==="Enter"&&shift)){
      (e as unknown as {preventDefault?:()=>void}).preventDefault?.();
      go(!shift);
    }
  };
  const muted=joinClasses(styled&&"text-text-muted text-sm");
  const text=joinClasses(styled&&"text-text");
  const trimmed=query.trim();
  const summary=searchSummary(hits.length,progress.searched,progress.pageCount,progress.running,progress.capped);
  return <View {...rest} accessibilityRole="search" accessibilityLabel="Search document" {...{onKeyDown}}
    {...{className:joinClasses("min-w-0",className)}} style={[{gap:10},rest.style as object]}>
    <View style={{flexDirection:"row",gap:6,alignItems:"center"}}>
      <TextInput value={query} onChangeText={onQueryChange} onSubmitEditing={submit} returnKeyType="search"
        placeholder="Find in document" accessibilityLabel="Find in document" autoCorrect={false} autoCapitalize="none"
        {...{enterKeyHint:"search",className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken text-text px-3 focus:border-focus")}}
        style={{flex:1,minWidth:0,minHeight:OFFICE_TOUCH_TARGET}}/>
      <Button title="Search" variant="secondary" disabled={!trimmed} onPress={submit}/>
    </View>
    {onCaseSensitiveChange||onWholeWordsChange?<View style={{flexDirection:"row",gap:6,flexWrap:"wrap"}}>
      {onCaseSensitiveChange?<ToolButton label="Match case" checked={caseSensitive} styled={styled}
        onPress={()=>onCaseSensitiveChange(!caseSensitive)}/>:null}
      {onWholeWordsChange?<ToolButton label="Whole words" checked={wholeWords} styled={styled}
        onPress={()=>onWholeWordsChange(!wholeWords)}/>:null}
    </View>:null}
    {error
      ?<View style={{gap:8,alignItems:"flex-start"}}>
        <Text accessibilityLiveRegion="polite" {...{className:text}}>{error}</Text>
        <Button title="Search again" variant="secondary" size="sm" onPress={()=>trimmed&&onSubmit(trimmed)}/>
      </View>
      :searchedQuery===undefined&&hits.length===0&&!progress.running
        ?<Text {...{className:muted}}>Search every page for a word or phrase.</Text>
        :<>
          <View style={{flexDirection:"row",alignItems:"center",gap:4}}>
            <Text accessibilityLiveRegion="polite" {...{className:muted}} style={{flex:1,fontVariant:["tabular-nums"]}}>
              {hits.length===0&&!progress.running?"No matches for “"+(searchedQuery??trimmed)+"”.":
                (current>=0?"Match "+(current+1)+" of "+hits.length+(progress.running?", searching":progress.capped?", later matches not shown":""):summary)}
            </Text>
            <View style={{flexDirection:"row",direction:"ltr"}}>
              <ToolButton quiet label="Previous match" iconOnly disabled={hits.length===0} styled={styled} onPress={()=>go(false)}>
                <SkipGlyph styled={styled} back/>
              </ToolButton>
              <ToolButton quiet label="Next match" iconOnly disabled={hits.length===0} styled={styled} onPress={()=>go(true)}>
                <SkipGlyph styled={styled}/>
              </ToolButton>
            </View>
          </View>
          <ScrollView style={{flexShrink:1}} contentContainerStyle={{gap:12}} keyboardShouldPersistTaps="handled">
            {groups.map(group=><View key={group.page} style={{gap:2}}>
              <Text accessibilityRole="header" {...{className:joinClasses(styled&&"text-text text-sm font-semibold")}}>
                {"Page "+(group.page+1)}
                <Text {...{className:muted}}>{"  "+(group.items.length===1?"1 match":group.items.length+" matches")}</Text>
              </Text>
              {group.items.map(({hit,index})=>{
                const on=index===current;
                return <Pressable key={index} accessibilityRole="button" accessibilityState={{selected:on}}
                  accessibilityLabel={"Page "+(hit.page+1)+": "+hit.before+hit.match+hit.after}
                  onPress={()=>onSelect(index,hit)}
                  {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",styled&&on&&"bg-accent/10")}}
                  style={{minHeight:OFFICE_TOUCH_TARGET,paddingVertical:8,paddingHorizontal:8,justifyContent:"center"}}>
                  <Text numberOfLines={2} {...{className:text}} style={{lineHeight:20}}>
                    {hit.before}<Text style={{fontWeight:"700"}}>{hit.match}</Text>{hit.after}
                  </Text>
                </Pressable>;
              })}
            </View>)}
          </ScrollView>
        </>}
  </View>;
}
