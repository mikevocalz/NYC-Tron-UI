/**
 * Drop-in check against Nitro Forge's host slot contracts: the prop types
 * below are copied from nitro-forge `packages/studio-workspace/src/ui.tsx`
 * and `apps/studio-preview/src/host-ui.d.ts` (branch
 * feat/forge-2046-design-studio-personas-2026-11-04). Each assignment fails
 * to compile if a NYC-Tron component stops accepting what Forge passes.
 * Run by `pnpm typecheck` (tests/tsconfig.slots.json); never shipped.
 */
import type { ComponentType, ReactNode } from "react";
import type { ViewProps } from "react-native";
import { Banner } from "../src/components/feedback/Banner.tsx";
import { Badge } from "../src/components/feedback/Badge.tsx";
import { EmptyState } from "../src/components/feedback/EmptyState.tsx";
import { ErrorMessage } from "../src/components/feedback/ErrorMessage.tsx";
import { KeyValueList } from "../src/components/content/KeyValueList.tsx";
import { NightScope } from "../src/components/theme/NightScope.tsx";
import { DropZone as WebDropZone } from "../src/components/files/DropZone.web.tsx";
import { DropZone as NativeDropZone } from "../src/components/files/DropZone.native.tsx";
import { FilePicker as WebFilePicker } from "../src/components/files/FilePicker.web.tsx";
import { FilePicker as NativeFilePicker } from "../src/components/files/FilePicker.native.tsx";
import * as webHtml from "../src/components/html/semantic.web.tsx";
import * as nativeHtml from "../src/components/html/semantic.native.tsx";

type StudioBannerProps = { tone: 'info' | 'danger' | 'success' | 'neutral'; title: string; description?: string; action?: ReactNode; live?: 'status' | 'alert'; className?: string };
type StudioBadgeProps = { label: string; tone?: 'neutral'; size?: 'xs' | 'sm'; className?: string };
type StudioEmptyStateProps = { title: string; description?: string; action?: ReactNode; icon?: ReactNode; illustration?: ReactNode; className?: string; tone?: 'royal' | 'carolina' };
type StudioKeyValueListProps = { items: readonly { key: string; label: string; value: ReactNode; action?: ReactNode }[]; columns?: 1 | 2; surface?: 'page' | 'night'; className?: string };
type StudioErrorMessageProps = { message?: string; surface?: 'page' | 'night'; className?: string };
type StudioDropZoneProps = { children?: ReactNode; onDrop?: (event: { assets: { file?: File; uri?: string; type: string; fileName?: string }[] }) => void; disableObjectUrl?: boolean; includeBase64?: boolean; className?: string; style?: ViewProps['style']; accept?: string };
type FilePickerHostProps = { label: string; className?: string; accept?: string; multiple?: boolean; disabled?: boolean; onFiles: (files: File[]) => void; testID?: string };

export const slots: {
  Banner: ComponentType<StudioBannerProps>;
  Badge: ComponentType<StudioBadgeProps>;
  EmptyState: ComponentType<StudioEmptyStateProps>;
  KeyValueList: ComponentType<StudioKeyValueListProps>;
  ErrorMessage: ComponentType<StudioErrorMessageProps>;
  NightScope: ComponentType<{ children: ReactNode }>;
  DropZone: ComponentType<StudioDropZoneProps>;
  NativeDropZone: ComponentType<StudioDropZoneProps>;
  FilePicker: ComponentType<FilePickerHostProps>;
  NativeFilePicker: ComponentType<FilePickerHostProps>;
} = {
  Banner, Badge, EmptyState, KeyValueList, ErrorMessage, NightScope,
  DropZone: WebDropZone, NativeDropZone, FilePicker: WebFilePicker, NativeFilePicker,
};

// Exactly the call shapes studio-preview's main.tsx and app-launcher.tsx use.
export const usage = (theme: string, hidden: boolean) => {
  for (const h of [webHtml, nativeHtml]) {
    const { Page, Main, Header, Footer, Section, Nav, Text, Heading, Paragraph, Link, Input } = h;
    void <Main dataSet={{ theme }}>
      <Nav className="launcher-nav" aria-label="App navigation">
        <Link className="suite-label" href="#/"><Text className="suite-mark" aria-hidden>N</Text>NitroForge</Link>
      </Nav>
      <Page className="workspace-container" data-host-width="phone" hidden={hidden} style={{ display: 'flex', width: 390 }} />
      <Section className="app-launcher" aria-labelledby="apps-heading">
        <Header className="launcher-heading"><Heading level={1} id="apps-heading">Apps</Heading><Paragraph>Intro</Paragraph></Header>
        <Link className="app-card-link" href="#/apps/quill" title="Detail" aria-label="Open Quill">Open</Link>
        <Footer className="launcher-footnote"><Text>Note</Text></Footer>
      </Section>
      <Input aria-label="Search" placeholder="Search" type="search" />
    </Main>;
  }
};
