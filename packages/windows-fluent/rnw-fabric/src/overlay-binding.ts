import type { WindowsOverlayAnchorProps } from "./overlay-types.ts";

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
