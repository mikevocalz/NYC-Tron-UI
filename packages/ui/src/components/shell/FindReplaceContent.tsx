import { useEffect, useRef } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Button } from "../Button.tsx";
import { ErrorMessage } from "../feedback/ErrorMessage.tsx";
import { SettingSwitch } from "../forge/canvas/SettingSwitch.tsx";
import { joinClasses } from "../styles.ts";
import { useOwnedAction } from "./useOwnedAction.ts";
import { validateFindResponse, type FindDocument, type FindQuery, type FindResponse, type FindMatch, type ReplaceRequest } from "./find-replace-model.ts";
export type { FindDocument, FindQuery, FindResponse, FindMatch, ReplaceRequest } from "./find-replace-model.ts";

export interface FindReplaceContentProps {
  readonly document: FindDocument;
  readonly active?: boolean;
  readonly onFind: (query: FindQuery, signal: AbortSignal) => FindResponse | Promise<FindResponse>;
  readonly onReplace: (request: ReplaceRequest, signal: AbortSignal) => void | Promise<void>;
  readonly onNavigate: (document: FindDocument, match: FindMatch) => void;
  readonly initialQuery?: string;
  readonly onClose?: () => void;
  readonly unstyled?: boolean;
}
type State = { query: string; replacement: string; caseSensitive: boolean; wholeWord: boolean; selected: number; found: FindResponse | null; foundScope: string };

/** Provider-backed search UI. Indexed and structured document engines keep their own search/replace authority. */
export function FindReplaceContent({ document, active = true, onFind, onReplace, onNavigate, initialQuery = "", onClose, unstyled = false }: FindReplaceContentProps) {
  const local = useRef<StoreApi<State> | null>(null);
  local.current ??= createStore<State>(() => ({ query: initialQuery, replacement: "", caseSensitive: false, wholeWord: false, selected: 0, found: null, foundScope: "" }));
  const store = local.current, state = useStore(store, value => value);
  const query: FindQuery = { document, text: state.query, caseSensitive: state.caseSensitive, wholeWord: state.wholeWord };
  const scope = JSON.stringify([document.id, document.revision, state.query, state.caseSensitive, state.wholeWord, active]);
  const finder = useOwnedAction(scope), mutation = useOwnedAction(JSON.stringify([document.id, document.revision, active]));
  const provider = useRef(onFind); provider.current = onFind;
  useEffect(() => {
    if (!active || !query.text) { store.setState({ found: null, foundScope: scope }); return; }
    void finder.run("find", async signal => { const result = await provider.current(query, signal); validateFindResponse(result); return result; },
      found => store.setState({ found, foundScope: scope, selected: 0 }));
  }, [scope, store]);
  const found = state.foundScope === scope ? state.found : null;
  const selected = Math.min(state.selected, Math.max(0, (found?.matches.length ?? 0) - 1));
  const current = found?.matches[selected];
  const searching = !!state.query && (finder.pending !== null || state.foundScope !== scope) && !finder.error;
  const pending = !active || mutation.pending !== null, styled = !unstyled;
  const navigate = (index: number) => {
    const match = found?.matches[index];
    if (!match || pending) return;
    store.setState({ selected: index }); onNavigate(document, match);
  };
  const replace = (all: boolean) => {
    if (!found || !current || pending) return;
    const request: ReplaceRequest = { query, searchToken: found.token, replacement: state.replacement, ...(all ? { kind: "all" } : { kind: "one", matchId: current.id }) };
    void mutation.run("replace", signal => onReplace(request, signal));
  };
  const fieldClass = joinClasses(styled && "rounded-control border border-border bg-surface-sunken text-text focus-visible:border-focus");
  return <ScrollView contentContainerStyle={{ padding: 12, gap: 8 }} keyboardShouldPersistTaps="handled">
    <Text accessibilityRole="header" {...{ className: joinClasses(styled && "text-text font-semibold") }}>Find and replace</Text>
    <TextInput accessibilityLabel="Find text" value={state.query} maxLength={256} editable={!pending} autoCapitalize="none" autoCorrect={false}
      onChangeText={text => store.setState({ query: text, selected: 0 })} onSubmitEditing={() => { if (current) navigate((selected + 1) % found!.matches.length); }}
      {...{ className: fieldClass }} style={{ minHeight: 44, padding: 8 }}/>
    <TextInput accessibilityLabel="Replacement text" value={state.replacement} maxLength={4096} editable={!pending} autoCapitalize="none" autoCorrect={false}
      onChangeText={replacement => store.setState({ replacement })} {...{ className: fieldClass }} style={{ minHeight: 44, padding: 8 }}/>
    <SettingSwitch label="Match case" on={state.caseSensitive} onChange={caseSensitive => store.setState({ caseSensitive })} disabled={pending} styled={styled}/>
    <SettingSwitch label="Whole words" on={state.wholeWord} onChange={wholeWord => store.setState({ wholeWord })} disabled={pending} styled={styled}/>
    <Text accessibilityLiveRegion="polite" {...{ className: joinClasses(styled && "text-text-muted") }}>{finder.error ? "Search failed" : searching ? "Finding…" : found ? `${found.total} matches${found.total > found.matches.length ? `; showing first ${found.matches.length}` : ""}` : state.query ? "No search results" : "Enter text to find"}</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Previous match" disabled={!current || pending} onPress={() => navigate((selected - 1 + found!.matches.length) % found!.matches.length)} unstyled={unstyled}/>
      <Button title="Next match" disabled={!current || pending} onPress={() => navigate((selected + 1) % found!.matches.length)} unstyled={unstyled}/>
      <Button title="Replace match" disabled={!current || pending || searching} onPress={() => replace(false)} unstyled={unstyled}/>
      <Button title="Replace all" disabled={!current || pending || searching} onPress={() => replace(true)} unstyled={unstyled}/>
      {pending ? <Button title="Cancel replacement" onPress={mutation.cancel} unstyled={unstyled}/> : null}
      {onClose ? <Button title="Close find and replace" onPress={onClose} unstyled={unstyled}/> : null}
    </View>
    {current ? <Text accessibilityLabel={`Match ${selected + 1}: ${current.before}${current.text}${current.after}`} {...{ className: joinClasses(styled && "text-text") }}>{current.before}<Text {...{ className: joinClasses(styled && "font-bold underline") }}>{current.text}</Text>{current.after}</Text> : null}
    <ErrorMessage {...(finder.error || mutation.error ? { message: finder.error || mutation.error! } : {})} unstyled={unstyled}/>
  </ScrollView>;
}
