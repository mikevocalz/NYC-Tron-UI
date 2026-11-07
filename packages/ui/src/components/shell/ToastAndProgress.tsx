import { useRef } from "react";
import { ActivityIndicator, FlatList, Text, View, type ViewProps } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Button } from "../Button.tsx";
import { ErrorMessage } from "../feedback/ErrorMessage.tsx";
import { joinClasses } from "../styles.ts";
import { useOwnedAction } from "./useOwnedAction.ts";
import { validateFeedback, jobActionLabel, type ProgressJob, type JobAction, type ToastMessage } from "./progress-model.ts";
export type { ProgressJob, JobAction, ToastMessage } from "./progress-model.ts";

export interface ToastAndProgressProps extends Omit<ViewProps, "children"> {
  readonly scope: string;
  readonly toasts: readonly ToastMessage[];
  readonly jobs: readonly ProgressJob[];
  readonly onDismissToast: (id: string) => void;
  readonly onToastAction?: (toastId: string, actionId: string, signal: AbortSignal) => void | Promise<void>;
  readonly onJobAction?: (jobId: string, action: JobAction, signal: AbortSignal) => void | Promise<void>;
  readonly height?: number;
  readonly className?: string;
  readonly unstyled?: boolean;
}

/** Controlled notifications and real job reports. Progress never advances on a UI timer. */
export function ToastAndProgress({ scope, toasts, jobs, onDismissToast, onToastAction, onJobAction, height = 360, className, unstyled = false, style, ...rest }: ToastAndProgressProps) {
  validateFeedback(toasts, jobs);
  if (toasts.some(toast => toast.action) && !onToastAction) throw new TypeError("Notification actions require onToastAction");
  if (jobs.some(job => job.actions.length) && !onJobAction) throw new TypeError("Job actions require onJobAction");
  if (!Number.isFinite(height) || height < 44) throw new RangeError("Feedback height must be at least 44");
  const local = useRef<StoreApi<{ expanded: boolean }> | null>(null);
  local.current ??= createStore(() => ({ expanded: false }));
  const expanded = useStore(local.current, state => state.expanded);
  const action = useOwnedAction(scope), busy = action.pending !== null, styled = !unstyled;
  const shown = expanded ? toasts : toasts.slice(0, 3);
  const rows: ({ kind: "toast"; item: ToastMessage } | { kind: "job"; item: ProgressJob })[] = [
    ...shown.map(item => ({ kind: "toast" as const, item })), ...jobs.map(item => ({ kind: "job" as const, item })),
  ];
  return <View {...rest} style={[{ gap: 8 }, style]} {...{ className: joinClasses(className) }}>
    <Text accessibilityRole="header" {...{ className: joinClasses(styled && "text-text font-semibold") }}>Notifications and jobs</Text>
    {toasts.length > 3 ? <Button title={expanded ? "Show recent notifications" : `Show all ${toasts.length} notifications`} onPress={() => local.current!.setState({ expanded: !expanded })} unstyled={unstyled}/> : null}
    <FlatList data={rows} keyExtractor={row => `${row.kind}:${row.item.id}`} style={{ height }} initialNumToRender={8} windowSize={5}
      ListEmptyComponent={<Text {...{ className: joinClasses(styled && "text-text-muted") }}>No notifications or jobs</Text>}
      renderItem={({ item: row }) => row.kind === "toast" ? <View style={{ padding: 10, gap: 8 }} {...{ className: joinClasses(styled && "border-b border-border") }}>
        <Text role={row.item.tone === "error" ? "alert" : "status"} accessibilityLiveRegion="polite" {...{ className: joinClasses(styled && "text-text font-semibold") }}>{row.item.title}</Text>
        {row.item.detail ? <Text {...{ className: joinClasses(styled && "text-text-muted") }}>{row.item.detail}</Text> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {row.item.action ? <Button title={row.item.action.label} disabled={busy} unstyled={unstyled}
            onPress={() => { const choice = row.item.action!; void action.run(`toast:${row.item.id}`, signal => onToastAction!(row.item.id, choice.id, signal)); }}/> : null}
          <Button title={`Dismiss ${row.item.title}`} disabled={busy} onPress={() => onDismissToast(row.item.id)} unstyled={unstyled}/>
        </View>
      </View> : <View style={{ padding: 10, gap: 8 }} {...{ className: joinClasses(styled && "border-b border-border") }}>
        <Text accessibilityLiveRegion="polite" {...{ className: joinClasses(styled && "text-text font-semibold") }}>{row.item.title}: {row.item.status}</Text>
        {row.item.detail ? <Text {...{ className: joinClasses(styled && "text-text-muted") }}>{row.item.detail}</Text> : null}
        <View accessibilityRole="progressbar" accessibilityLabel={row.item.title} aria-valuemin={0} aria-valuemax={100}
          {...(row.item.progress === null ? {} : { "aria-valuenow": Math.round(row.item.progress * 100) })}
          aria-valuetext={row.item.progress === null ? "Progress not reported" : `${Math.round(row.item.progress * 100)} percent`}
          accessibilityValue={{ min: 0, max: 100, ...(row.item.progress === null ? {} : { now: Math.round(row.item.progress * 100) }), text: row.item.progress === null ? "Progress not reported" : `${Math.round(row.item.progress * 100)} percent` }}>
          {row.item.progress === null ? (["queued", "running", "cancelling"].includes(row.item.status) ? <ActivityIndicator/> : <Text {...{ className: joinClasses(styled && "text-text-muted") }}>Progress not reported</Text>) : <View style={{ height: 6, overflow: "hidden" }} {...{ className: joinClasses(styled && "rounded-control bg-surface-sunken") }}>
            <View style={{ height: "100%", width: `${row.item.progress * 100}%` }} {...{ className: joinClasses(styled && "bg-primary") }}/>
          </View>}
        </View>
        {row.item.status === "failed" ? <ErrorMessage message={row.item.error} unstyled={unstyled}/> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{row.item.actions.map(choice => <Button key={choice} title={`${jobActionLabel[choice]} ${row.item.title}`} disabled={busy} unstyled={unstyled}
          onPress={() => { void action.run(`job:${row.item.id}`, signal => onJobAction!(row.item.id, choice, signal)); }}/>)}</View>
      </View>}/>
    {busy ? <Button title="Cancel pending notification or job request" onPress={action.cancel} unstyled={unstyled}/> : null}
    <ErrorMessage {...(action.error ? { message: action.error } : {})} unstyled={unstyled}/>
  </View>;
}
