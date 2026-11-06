import {useRef} from 'react';
import {View} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {TabBar} from '@nyc-tron/ui/components/TabBar';
import {CompositionTreeDemo} from './CompositionTreeDemo';
import {MotionSettingsDemo} from './MotionSettingsDemo';
import {MotionTimelineDemo} from './MotionTimelineDemo';
import {MotionCurvesDemo} from './MotionCurvesDemo';
import {MotionQueueDemo} from './MotionQueueDemo';
const makeStore=()=>createStore(()=>({section:'Scene' as 'Scene'|'Queue'|'Curves'|'Timeline'|'Layers'}));
export function MotionWorkbenchDemo(){const local=useRef<ReturnType<typeof makeStore>|null>(null);local.current??=makeStore();const store=local.current,section=useStore(store,s=>s.section);return <View style={{flex:1,gap:8}}><TabBar tabs={(['Scene','Queue','Curves','Timeline','Layers'] as const).map(key=>({key,label:key,active:section===key,onPress:()=>store.setState({section:key})}))}/>{section==='Scene'?<MotionSettingsDemo/>:section==='Queue'?<MotionQueueDemo/>:section==='Curves'?<MotionCurvesDemo/>:section==='Timeline'?<MotionTimelineDemo/>:<CompositionTreeDemo/>}</View>;}
