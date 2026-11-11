import type { HostComponent, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';
import type { DirectEventHandler, Double, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

interface NativeProps extends ViewProps {
  visible?: WithDefault<boolean, false>;
  scopeToken: string;
  presentationToken: string;
  anchorX: Double;
  anchorY: Double;
  anchorWidth: Double;
  anchorHeight: Double;
  popupWidth: Double;
  popupHeight: Double;
  regionX: Double;
  regionY: Double;
  regionWidth: Double;
  regionHeight: Double;
  preferredEdge: string;
  animated?: WithDefault<boolean, true>;
  onDismiss?: DirectEventHandler<Readonly<{ scopeToken: string }>>;
  onPresentationRejected?: DirectEventHandler<Readonly<{
    scopeToken: string;
    presentationToken: string;
    x: Double;
    y: Double;
    width: Double;
    height: Double;
    regionX: Double;
    regionY: Double;
    regionWidth: Double;
    regionHeight: Double;
  }>>;
}

export default codegenNativeComponent<NativeProps>('NYCTronPopover') as HostComponent<NativeProps>;
