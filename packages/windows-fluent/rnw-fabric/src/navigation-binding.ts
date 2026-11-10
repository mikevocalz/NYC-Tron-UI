import type {
  WindowsDestination, WindowsNavigationState, WindowsNativeNavigationEvent,
  WindowsNativeNavigationTransport,
} from "@nyc-tron/windows-fluent/types";

/** Mount this binding in WindowsNavigationHost to connect the peer-free controller to WinUI. */
export interface WindowsNavigationBinding {
  readonly transport: WindowsNativeNavigationTransport;
  /** Returns false without a mounted host. True means dispatched; native focus is observed separately. */
  focusSelected(): boolean;
  /** Restore the native Settings opener after the app closes its own Settings surface. */
  focusSettings(): boolean;
  /** Detaches native event delivery and removes the mounted native view. Idempotent. */
  dispose(): void;
}

interface Snapshot extends WindowsNavigationState { readonly disposed: boolean }
type Listener = () => void;
type FocusTarget = "selected" | "settings";

class NavigationBindingOwner {
  private snapshot: Snapshot = {
    items: [], footerItems: [], selectedId: null, paneMode: "auto", paneOpen: false,
    paneTitle: "", settingsVisible: false, disposed: false,
  };
  private readonly changes = new Set<Listener>();
  private readonly events = new Set<(event: WindowsNativeNavigationEvent) => void>();
  private attached: { token: object; focus?: (target: FocusTarget) => boolean } | null = null;

  readonly getSnapshot = (): Snapshot => this.snapshot;
  readonly subscribe = (listener: Listener): (() => void) => {
    this.changes.add(listener);
    return () => { this.changes.delete(listener); };
  };

  private requireLive(): void {
    if (this.snapshot.disposed) throw new Error("Windows navigation binding has been disposed");
  }
  private update(patch: Partial<WindowsNavigationState>): void {
    this.requireLive();
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of [...this.changes]) listener();
  }

  readonly transport: WindowsNativeNavigationTransport = {
    setDestinations: (items, footerItems) => {
      const ids = new Set<string>();
      const copy = (source: readonly WindowsDestination[]) => source.map(item => {
        if (typeof item.id !== "string" || !item.id.trim() || typeof item.label !== "string" || !item.label.trim() || ids.has(item.id))
          throw new TypeError("WinUI destination IDs and labels must be unique and nonempty");
        ids.add(item.id);
        return { ...item };
      });
      const nextItems = copy(items), nextFooter = copy(footerItems);
      this.update({ items: nextItems, footerItems: nextFooter,
        selectedId: this.snapshot.selectedId !== null && ids.has(this.snapshot.selectedId) ? this.snapshot.selectedId : null });
    },
    setSelectedId: selectedId => {
      if (selectedId !== null && ![...this.snapshot.items, ...(this.snapshot.footerItems ?? [])].some(item => item.id === selectedId))
        throw new RangeError("WinUI selected destination must exist in current items");
      this.update({ selectedId });
    },
    setPaneMode: paneMode => {
      if (!["auto", "expanded", "compact", "minimal"].includes(paneMode)) throw new TypeError("Invalid WinUI pane mode");
      this.update({ paneMode });
    },
    setPaneOpen: paneOpen => {
      if (typeof paneOpen !== "boolean") throw new TypeError("Native pane visibility must be a boolean");
      this.update({ paneOpen });
    },
    setPaneTitle: paneTitle => {
      if (typeof paneTitle !== "string") throw new TypeError("Native pane title must be a string");
      this.update({ paneTitle });
    },
    setSettingsVisible: settingsVisible => {
      if (typeof settingsVisible !== "boolean") throw new TypeError("Settings visibility must be a boolean");
      this.update({ settingsVisible });
    },
    subscribe: listener => {
      this.requireLive();
      this.events.add(listener);
      return () => { this.events.delete(listener); };
    },
  };

  attach(token: object, focus?: (target: FocusTarget) => boolean): () => void {
    this.requireLive();
    if (this.attached !== null && this.attached.token !== token)
      throw new Error("A Windows navigation binding can own only one mounted native view");
    const lease = { token, focus };
    this.attached = lease;
    return () => { if (this.attached === lease) this.attached = null; };
  }
  focus(target: FocusTarget): boolean {
    this.requireLive();
    return this.attached?.focus?.(target) ?? false;
  }
  emit(token: object, event: WindowsNativeNavigationEvent): void {
    if (this.snapshot.disposed || this.attached?.token !== token) return;
    for (const listener of [...this.events]) listener(event);
  }
  dispose(): void {
    if (this.snapshot.disposed) return;
    this.attached = null;
    this.events.clear();
    this.snapshot = { ...this.snapshot, disposed: true };
    for (const listener of [...this.changes]) listener();
  }
}

const owners = new WeakMap<WindowsNavigationBinding, NavigationBindingOwner>();

/** The transport drives the existing Fabric NavigationView; it does not create an RN view fallback. */
export function createWindowsNavigationBinding(): WindowsNavigationBinding {
  const owner = new NavigationBindingOwner();
  const binding: WindowsNavigationBinding = {
    transport: owner.transport,
    focusSelected: () => owner.focus("selected"),
    focusSettings: () => owner.focus("settings"),
    dispose: () => owner.dispose(),
  };
  owners.set(binding, owner);
  return binding;
}

/** @internal The React host is the only native event source for a binding. */
export function navigationBindingOwner(binding: WindowsNavigationBinding): NavigationBindingOwner {
  const owner = owners.get(binding);
  if (!owner) throw new TypeError("WindowsNavigationHost needs a binding created by createWindowsNavigationBinding");
  return owner;
}
