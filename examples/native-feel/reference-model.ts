import { createStore } from "zustand/vanilla";
import type { AssetEntry } from "@nyc-tron/ui/components/shell/asset-browser-model";
import type { DemoAppearance } from "./AccountScreen";

export type ReferenceRoute = "library" | "editor" | "media" | "settings";
export type LibraryItem = AssetEntry & { description: string; collection: string };
export type LibraryLoader = (signal: AbortSignal) => Promise<readonly LibraryItem[]>;
export interface ReviewFrame {
  uri: string;
  width: number;
  height: number;
  actualTimeUs: number;
  durationUs: number;
  timing: "presentation" | "seek-target";
}
/** The host owns decoding and its resources. UI never substitutes a playback clock. */
export interface ReferenceMediaSource {
  label: string;
  loadFrame(timeUs: number, signal: AbortSignal): Promise<ReviewFrame>;
}
export interface WorkspacePreferences {
  name: string;
  appearance: DemoAppearance;
  start: ReferenceRoute;
}
export interface CoverDocument {
  headline: string;
  subtitle: string;
  alignment: "left" | "center" | "right";
  opacity: number;
}
export interface ReferenceState {
  route: ReferenceRoute;
  preferences: WorkspacePreferences;
  savedPreferences: WorkspacePreferences;
  preferenceError?: string;
  preferenceStatus: string;
  library: { status: "loading" | "ready" | "error"; items: readonly LibraryItem[]; error?: string };
  selectedIds: readonly string[];
  openedId: string | null;
  favorites: readonly string[];
  collection: "all" | "saved";
  document: CoverDocument;
  opacityPreview?: number;
  savedDocument: CoverDocument;
  documentError?: string;
  documentStatus: string;
  inspectorQuery: string;
  typographyExpanded: boolean;
  compositionExpanded: boolean;
  media: { status: "empty" | "loading" | "ready" | "error"; requestedUs: number; frame?: ReviewFrame; error?: string };
  note: string;
  savedNote: string;
  noteError?: string;
  noteStatus: string;
  savedTimeUs: number | null;
}

export const referenceLibrary: readonly LibraryItem[] = [
  { id: "cover", name: "Quiet forms", kind: "file", mediaType: "Design document", byteLength: 18432,
    description: "A cover study with editable type, alignment and contrast.", collection: "Design studies" },
  { id: "motion", name: "Motion study", kind: "file", mediaType: "Video review", byteLength: 8192,
    description: "A generated test clip for checking decoded frames and review notes.", collection: "Moving image" },
  { id: "notes", name: "Notes on a slower workspace", kind: "file", mediaType: "Text document", byteLength: 1280,
    description: "Leave room around the work. Keep its controls close, and let the content set the pace.", collection: "Writing" },
];
const initialCover: CoverDocument = {
  headline: "Quiet forms.", subtitle: "A little room to make something good.", alignment: "left", opacity: 100,
};
export interface ReferenceModelOptions {
  initialAppearance?: DemoAppearance;
  initialRoute?: ReferenceRoute;
  loadLibrary?: LibraryLoader;
  mediaSource?: ReferenceMediaSource;
}

/** One owner for drafts, selection and requests, above navigation and pane layouts. */
export function createReferenceModel(options: ReferenceModelOptions = {}) {
  const preferences: WorkspacePreferences = {
    name: "Fieldwork", appearance: options.initialAppearance ?? "system", start: "library",
  };
  const store = createStore<ReferenceState>(() => ({
    route: options.initialRoute ?? "library", preferences, savedPreferences: { ...preferences },
    preferenceStatus: "Changes are saved in this session only.",
    library: { status: "loading", items: [] }, selectedIds: [], openedId: null, favorites: [], collection: "all",
    document: { ...initialCover }, savedDocument: { ...initialCover }, documentStatus: "Ready to edit.",
    inspectorQuery: "", typographyExpanded: true, compositionExpanded: true,
    media: { status: "empty", requestedUs: 0 }, note: "", savedNote: "", noteStatus: "No review note saved yet.", savedTimeUs: null,
  }));
  let libraryRequest: AbortController | undefined;
  let frameRequest: AbortController | undefined;
  let disposed = false;
  const errorText = (error: unknown, fallback: string) => error instanceof Error && error.message.trim() ? error.message : fallback;
  const loadLibrary = async () => {
    if (disposed) return;
    libraryRequest?.abort();
    const request = new AbortController(); libraryRequest = request;
    store.setState(current => ({ library: { status: "loading", items: current.library.items } }));
    try {
      const items = await (options.loadLibrary ?? (async () => referenceLibrary))(request.signal);
      if (disposed || request.signal.aborted) return;
      store.setState(current => ({
        library: { status: "ready", items },
        selectedIds: current.selectedIds.filter(id => items.some(item => item.id === id)),
        openedId: items.some(item => item.id === current.openedId) ? current.openedId : null,
      }));
    } catch (error) {
      if (!disposed && !request.signal.aborted) store.setState(current => ({
        library: { status: "error", items: current.library.items, error: errorText(error, "The library could not be loaded. Try again.") },
      }));
    }
  };
  const loadFrame = async (timeUs = store.getState().media.requestedUs) => {
    if (disposed) return;
    if (!Number.isSafeInteger(timeUs) || timeUs < 0) throw new RangeError("Review time must be nonnegative integer microseconds");
    frameRequest?.abort();
    const request = new AbortController(); frameRequest = request;
    store.setState(current => ({ media: { ...current.media, status: "loading", requestedUs: timeUs, error: undefined } }));
    try {
      if (!options.mediaSource) throw new Error("This host has no media source. Open the reference in a host with a decoder to review frames.");
      const frame = await options.mediaSource.loadFrame(timeUs, request.signal);
      if (disposed || request.signal.aborted) return;
      store.setState({ media: { status: "ready", requestedUs: timeUs, frame } });
    } catch (error) {
      if (!disposed && !request.signal.aborted) store.setState(current => ({
        media: { ...current.media, status: "error", error: errorText(error, "This frame could not be opened. Try again.") },
      }));
    }
  };
  return {
    store, loadLibrary, loadFrame,
    start: () => {
      disposed = false;
      if (frameRequest?.signal.aborted && store.getState().media.status === "loading") {
        store.setState(current => ({ media: { ...current.media, status: current.media.frame ? "ready" : "empty" } }));
      }
      void loadLibrary();
    },
    mediaLabel: options.mediaSource?.label ?? "Motion study",
    navigate: (route: ReferenceRoute) => store.setState({ route }),
    editPreferences: (patch: Partial<WorkspacePreferences>) => store.setState(current => ({
      preferences: { ...current.preferences, ...patch }, preferenceError: undefined, preferenceStatus: "You have unsaved preferences.",
    })),
    savePreferences: () => {
      const draft = store.getState().preferences;
      const name = draft.name.trim();
      if (!name) { store.setState({ preferenceError: "Enter a workspace name before saving.", preferenceStatus: "Preferences have not been saved." }); return; }
      const savedPreferences = { ...draft, name };
      store.setState({ preferences: savedPreferences, savedPreferences, preferenceError: undefined, preferenceStatus: "Preferences saved for this session." });
    },
    resetPreferences: () => store.setState(current => ({ preferences: { ...current.savedPreferences }, preferenceError: undefined, preferenceStatus: "Restored your saved preferences." })),
    toggleFavorite: (id: string) => store.setState(current => ({ favorites: current.favorites.includes(id) ? current.favorites.filter(value => value !== id) : [...current.favorites, id] })),
    previewOpacity: (opacity: number) => store.setState(current => ({ opacityPreview: opacity === current.document.opacity ? undefined : opacity })),
    editDocument: (patch: Partial<CoverDocument>) => store.setState(current => ({ document: { ...current.document, ...patch }, opacityPreview: undefined, documentError: undefined, documentStatus: "You have unsaved changes." })),
    saveDocument: () => {
      const document = store.getState().document;
      if (!document.headline.trim()) { store.setState({ documentError: "Add a headline before saving.", documentStatus: "The cover has not been saved." }); return; }
      const savedDocument = { ...document, headline: document.headline.trim(), subtitle: document.subtitle.trim() };
      store.setState({ document: savedDocument, savedDocument, documentError: undefined, documentStatus: "Cover saved for this session." });
    },
    resetDocument: () => store.setState(current => ({ document: { ...current.savedDocument }, opacityPreview: undefined, documentError: undefined, documentStatus: "Restored the saved cover." })),
    saveNote: () => {
      const current = store.getState();
      const savedNote = current.note.trim();
      if (!savedNote) { store.setState({ noteError: "Write a review note before saving.", noteStatus: "The note has not been saved." }); return; }
      if (current.media.status !== "ready" || !current.media.frame) return;
      store.setState({ note: savedNote, savedNote, savedTimeUs: current.media.frame.actualTimeUs, noteError: undefined, noteStatus: "Review note saved for this session." });
    },
    dispose: () => { disposed = true; libraryRequest?.abort(); frameRequest?.abort(); },
  };
}
export type ReferenceModel = ReturnType<typeof createReferenceModel>;
