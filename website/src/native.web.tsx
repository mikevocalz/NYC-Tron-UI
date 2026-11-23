// Documentation-host interop only: preserve the library's className recipes
// through React Native Web's compiled CSS slot, as Tron's semantic web
// primitives already do. The real RNW controls, events and refs remain owners.
import React, { forwardRef } from 'react';
import * as Native from 'react-native-web';
export * from 'react-native-web';
const css=(className?:string)=>className?{$$css:true,docs:className}:undefined;
function styled(Component:any){return forwardRef<any,any>(function DocsStyledNative({className,style,...props},ref){const withClasses=typeof style==='function'?(state:any)=>[css(className),style(state)]:[css(className),style];return <Component {...props} ref={ref} style={withClasses}/>;});}
export const View=styled(Native.View);
export const Text=styled(Native.Text);
export const TextInput=styled(Native.TextInput);
export const Pressable=styled(Native.Pressable);
export const ScrollView=styled(Native.ScrollView);
export const ActivityIndicator=styled(Native.ActivityIndicator);
