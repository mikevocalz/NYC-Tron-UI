import * as spark from '@legendapp/spark/windows';
import { onSystemEvent } from '@legendapp/spark/system';
import { createWindowController, validateDisplays, type WindowControllerOptions } from './window-controller.ts';
import NativeDisplays from './NativeNYCTronDisplays.ts';
import { requireAppKit } from './native-availability.ts';

export type { WindowController, WindowControllerOptions, HostDisplay } from './window-controller.ts';
export type { WindowOpenOptions, WindowInfo, WindowUpdateOptions } from '@legendapp/spark/windows';

/** Real NSWindow/AppKit host. Register each component with AppRegistry first. */
export function createMacOSWindowHost(options: WindowControllerOptions = {}) {
  requireAppKit('Windows', spark.getWindowAvailability());
  if (!NativeDisplays) throw new Error('NativeNYCTronDisplays is missing: build this app with spark build, including @nyc-tron/macos-appkit.');
  const nativeDisplays = NativeDisplays;
  return createWindowController({
    open: spark.openWindow, get: spark.getWindow, close: spark.closeWindow,
    show: spark.showWindow, minimize: spark.minimizeWindow, bounds: spark.setWindowBounds,
    options: spark.setWindowOptions,
    listen: (id, event, listener) => spark.addWindowListener(id, event, listener, { onError: options.onError }),
    beforeClose: (id, allow) => spark.beforeWindowClose(id, allow, { onError: options.onError }),
    displays: async () => validateDisplays(JSON.parse(await nativeDisplays.readDisplays())),
    displayChanges: listener => onSystemEvent(event => { if (event.type === 'displaysChanged' || event.type === 'wake') listener(); }),
  }, options);
}
