import './global.css';
import {useRef,type ComponentRef} from 'react';
import {KeyboardAvoidingView,Platform,ScrollView,View} from 'react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {TabBar} from '@nyc-tron/ui/components/TabBar';
import {useReservedRegions} from '@nyc-tron/reserved-regions';
import {foldFeaturesFromRegions,resolveUsableRegions,type Rect} from '@nyc-tron/core/folds';
import {CanvasWorkbenchDemo} from './CanvasWorkbenchDemo';
import {MotionWorkbenchDemo} from './MotionWorkbenchDemo';
import {ShellDemo} from './ShellDemo';
import {NativeOverlayDemo} from './NativeOverlayDemo';
import {FocusAndA11yLayer} from '@nyc-tron/ui/components/shell/FocusAndA11yLayer';
import {WorkspaceContinuityDemo} from './WorkspaceContinuityDemo';
import {ColorManagementDemo} from './ColorManagementDemo';
import {PhotoWorkbenchDemo} from './PhotoWorkbenchDemo';
import {P3DiscDemo} from './P3DiscDemo';
import {ColorAdjustmentsDemo} from './ColorAdjustmentsDemo';
import {PlatformServicesDemo} from './PlatformServicesDemo';
type State={family:'shell'|'management'|'adjustments'|'P3'|'photo'|'motion'|'workspace'|'overlays'|'canvas'|'services';viewport:Rect|null};
function LibraryContent(){
 const local=useRef<StoreApi<State>|null>(null);local.current??=createStore<State>(()=>({family:'shell',viewport:null}));const store=local.current,state=useStore(store,s=>s);
 const host=useRef<ComponentRef<typeof View>|null>(null),regions=useReservedRegions();
 const usable=state.viewport?resolveUsableRegions({container:state.viewport,features:foldFeaturesFromRegions(regions,{includeOcclusions:true})}):[];
 const pane=usable.reduce<Rect|null>((best,next)=>!best||next.width*next.height>best.width*best.height?next:best,null);
 const measure=()=>host.current?.measureInWindow((x,y,width,height)=>{if([x,y,width,height].every(Number.isFinite)&&width>0&&height>0)store.setState({viewport:{x,y,width,height}});});
 return <SafeAreaView style={{flex:1,backgroundColor:'#101017'}}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
  <View ref={host} collapsable={false} onLayout={measure} style={{flex:1}}>
   <View style={[{position:'absolute',gap:8},pane?{left:pane.x,top:pane.y,width:pane.width,height:pane.height}:{inset:0}]}>
    <ScrollView horizontal testID="library-family-scroll" style={{flexGrow:0,flexShrink:0}} contentContainerStyle={{width:Math.max(576,pane?.width??576)}}><TabBar tabs={(['shell','management','adjustments','P3','photo','motion','workspace','overlays','canvas','services'] as const).map(key=>({key,label:key,active:key===state.family,onPress:()=>store.setState({family:key})}))}/></ScrollView>
    <View style={{flex:1}}>{state.family==='canvas'?<CanvasWorkbenchDemo/>:state.family==='services'?<PlatformServicesDemo/>:state.family==='overlays'?<NativeOverlayDemo/>:state.family==='workspace'?<WorkspaceContinuityDemo/>:state.family==='shell'?<ShellDemo height={Math.max(280,(pane?.height??700)-64)}/>:state.family==='management'?<ColorManagementDemo/>:state.family==='adjustments'?<ColorAdjustmentsDemo/>:state.family==='P3'?<P3DiscDemo/>:state.family==='photo'?<PhotoWorkbenchDemo/>:<MotionWorkbenchDemo/>}</View>
   </View>
  </View>
 </KeyboardAvoidingView></SafeAreaView>;
}
/** Standalone library acceptance consumer; no Forge or processing engine dependency. */
export default function LibraryAcceptance(){return <SafeAreaProvider><FocusAndA11yLayer><LibraryContent/></FocusAndA11yLayer></SafeAreaProvider>;}
