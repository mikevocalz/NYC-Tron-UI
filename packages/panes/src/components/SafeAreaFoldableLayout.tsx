import {View,type ViewProps} from 'react-native';
import {AdaptivePaneHost,type AdaptivePaneHostProps} from './AdaptivePaneHost.tsx';
export interface SafeAreaFoldableLayoutProps extends Omit<AdaptivePaneHostProps,'container'|'style'|'onLayout'> {
 container:NonNullable<AdaptivePaneHostProps['container']>;
 /** Only unconsumed insets. Pass zero for edges already consumed by the app shell. */
 safeAreaInsets:{top:number;right:number;bottom:number;left:number};style?:ViewProps['style'];onLayout?:ViewProps['onLayout'];
}
/** Applies safe insets once, then gives the existing pane planner the actual inset window-space origin. Media/document state stays above this layout. */
export function SafeAreaFoldableLayout({container,safeAreaInsets,style,onLayout,...props}:SafeAreaFoldableLayoutProps){const {top,right,bottom,left}=safeAreaInsets;
 if(![container.x,container.y,container.width,container.height,top,right,bottom,left].every(Number.isFinite)||[top,right,bottom,left].some(n=>n<0)||container.width<=left+right||container.height<=top+bottom)throw new RangeError('Safe insets must leave a positive pane container');
 return <View onLayout={onLayout} style={[{flex:1},style,{paddingTop:top,paddingRight:right,paddingBottom:bottom,paddingLeft:left}]}><AdaptivePaneHost {...props} container={{x:container.x+left,y:container.y+top,width:container.width-left-right,height:container.height-top-bottom}} style={{flex:1}}/></View>;
}
