import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";

export function ReferencePage({ title, description, eyebrow, children, actions, testID }: {
  title: string; description: string; eyebrow: string; children: ReactNode; actions?: ReactNode; testID: string;
}) {
  return <ScrollView testID={testID} keyboardShouldPersistTaps="handled" style={{ flex: 1, minWidth: 0 }}
    contentContainerStyle={{ padding: 24, paddingBottom: 40, flexGrow: 1 }}>
    <ContentFrame maxWidth={1120} style={{ gap: 28 }}>
      <View style={{ gap: 10 }}>
        <Text {...{ className: "text-xs font-semibold tracking-widest text-text-muted" }}>{eyebrow}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <Text accessibilityRole="header" style={{ flexGrow: 1 }} {...{ className: "text-3xl font-semibold text-text" }}>{title}</Text>
          {actions}
        </View>
        <Text style={{ maxWidth: 640 }} {...{ className: "text-base leading-relaxed text-text-muted" }}>{description}</Text>
      </View>
      {children}
    </ContentFrame>
  </ScrollView>;
}
export function ReferenceCard({ children, testID }: { children: ReactNode; testID?: string }) {
  return <View testID={testID} style={{ padding: 20, gap: 20, minWidth: 0 }}
    {...{ className: "rounded-sm border border-border bg-surface-raised" }}>{children}</View>;
}
export function StatusLine({ children, testID }: { children: ReactNode; testID?: string }) {
  return <Text testID={testID} role="status" accessibilityLiveRegion="polite"
    {...{ className: "text-sm leading-relaxed text-text-muted" }}>{children}</Text>;
}
