import type { WindowsOverlayAnchorProps, WindowsPopoverProps } from "./overlay-types.ts";

let sequence = 0;
export const newOverlayScopeToken = () => `windows-overlay-${++sequence}`;
/** Events consult committed props. Abandoned renders and old cleanup leases cannot replace them. */
export function createOverlayBinding<P extends WindowsOverlayAnchorProps>() {
  let committed: { token: string; props: P } | undefined;
  return {
    commit(token: string, props: P) {
      const lease = { token, props }; committed = lease;
      return () => { if (committed === lease) committed = undefined; };
    },
    current(token: string, includeDisabled = false): P | undefined {
      return committed?.token === token && (includeDisabled || !committed.props.disabled) ? committed.props : undefined;
    },
  };
}

/** Acknowledge delivery even when the app vetoes without rendering or its callback throws. */
export function deliverPopoverOpenRequest(
  binding: ReturnType<typeof createOverlayBinding<WindowsPopoverProps>>,
  event: Readonly<{ scopeToken: string; open: boolean; requestId: string }>,
  acknowledge: (scopeToken: string, requestId: string) => void,
) {
  try {
    const current = binding.current(event.scopeToken);
    if (current && event.open !== current.open) current.onOpenRequested(event.open);
  } finally {
    if (event.requestId) acknowledge(event.scopeToken, event.requestId);
  }
}
