import { createStore } from 'zustand/vanilla';

export const FIXTURE_COMPONENTS = ['Button', 'Card', 'TextField', 'NavigationRail', 'NavigationShell'] as const;
export type AppearanceChoice = 'system' | 'light' | 'dark';
export type KitchenState = {
  presses: number;
  draft: string;
  errorDraft: string;
  selectedId: string;
  collapsed: boolean;
  edge: 'left' | 'right';
  rtl: boolean;
  appearance: AppearanceChoice;
  importMode: 'direct' | 'root';
  press: () => void;
  setDraft: (draft: string) => void;
  setErrorDraft: (draft: string) => void;
  select: (id: string) => void;
  setCollapsed: (collapsed: boolean) => void;
  setEdge: (edge: 'left' | 'right') => void;
  setRtl: (rtl: boolean) => void;
  setAppearance: (appearance: AppearanceChoice) => void;
  setImportMode: (mode: 'direct' | 'root') => void;
};
export function createKitchenStore() {
  return createStore<KitchenState>()(set => ({
    presses: 0, draft: '', errorDraft: '', selectedId: 'library', collapsed: false,
    edge: 'right', rtl: false, appearance: 'system', importMode: 'direct',
    press: () => set(state => ({ presses: state.presses + 1 })),
    setDraft: draft => set({ draft }),
    setErrorDraft: errorDraft => set({ errorDraft }),
    select: id => { if (id !== 'unavailable') set({ selectedId: id }); },
    setCollapsed: collapsed => set({ collapsed }),
    setEdge: edge => set({ edge }), setRtl: rtl => set({ rtl }),
    setAppearance: appearance => set({ appearance }),
    setImportMode: importMode => set({ importMode }),
  }));
}
export type KitchenStore = ReturnType<typeof createKitchenStore>;
