import * as spark from '@legendapp/spark/windows';
import { onSystemEvent } from '@legendapp/spark/system';
import { createWindowController, validateDisplays, type WindowController, type WindowControllerOptions } from './window-controller.ts';
import { createMacOSWindowChromeHost, type MacOSWindowChromeHost, type MacOSWindowChromeHostOptions } from './window-chrome.ts';
import NativeDisplays from './NativeNYCTronDisplays.ts';
import { requireAppKit } from './native-availability.ts';

export type { WindowController, WindowControllerOptions, HostDisplay } from './window-controller.ts';
export type { MacOSWindowChromeHost, MacOSWindowChromeHostOptions } from './window-chrome.ts';
export type { WindowOpenOptions, WindowInfo, WindowUpdateOptions } from '@legendapp/spark/windows';

function nativeDisplays() {
  if (!NativeDisplays) throw new Error('NativeNYCTronDisplays is missing: build this app with spark build, including @nyc-tron/macos-appkit.');
  return NativeDisplays;
}

/** Real NSWindow/AppKit host. Register each component with AppRegistry first. */
export function createMacOSWindowHost(options: WindowControllerOptions = {}) {
  requireAppKit('Windows', spark.getWindowAvailability());
  const displays = nativeDisplays();
  return createWindowController({
    open: spark.openWindow, get: spark.getWindow, close: spark.closeWindow,
    show: spark.showWindow, minimize: spark.minimizeWindow, bounds: spark.setWindowBounds,
    options: spark.setWindowOptions,
    listen: (id, event, listener) => spark.addWindowListener(id, event, listener, { onError: options.onError }),
    beforeClose: (id, allow) => spark.beforeWindowClose(id, allow, { onError: options.onError }),
    displays: async () => validateDisplays(JSON.parse(await displays.readDisplays())),
    displayChanges: listener => onSystemEvent(event => { if (event.type === 'displaysChanged' || event.type === 'wake') listener(); }),
  }, options);
}

/**
 * Title-bar commands and native button insets for windows owned by
 * `controller`, usually the result of {@linkcode createMacOSWindowHost}.
 * Zoom uses Spark maximize/unmaximize; insets come from the real AppKit
 * button frames through NativeNYCTronDisplays. Dispose it before the
 * controller.
 *
 * @example
 * const chrome = createMacOSWindowChrome(windows);
 * const insets = await chrome.readInsets('document-1');
 */
export function createMacOSWindowChrome(controller: WindowController, options: MacOSWindowChromeHostOptions = {}): MacOSWindowChromeHost {
  requireAppKit('Windows', spark.getWindowAvailability());
  const native = nativeDisplays();
  return createMacOSWindowChromeHost(controller, {
    info: spark.getWindow, maximize: spark.maximizeWindow, unmaximize: spark.unmaximizeWindow,
    readInsets: id => native.readTitleBarInsets(id),
  }, options);
}
