require('@legendapp/spark/runtime-entry');
if (!(globalThis as { __THREADED_RUNTIME_ENV__?: boolean }).__THREADED_RUNTIME_ENV__) {
  const { AppRegistry } = require('react-native');
  const { registerRootComponent } = require('expo');
  const { MainWindow, DocumentWindow } = require('./App');
  AppRegistry.registerComponent('NYCTronDocument', () => DocumentWindow);
  registerRootComponent(MainWindow);
}
