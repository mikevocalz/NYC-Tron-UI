import {AppRegistry,Text,View} from 'react-native';
import {create} from 'zustand';
import {Button} from '@nyc-tron/ui/components/Button';
import {UnitInput} from '@nyc-tron/ui/components/shell/UnitInput';
const useHost=create(()=>({scope:'a',disabled:false,value:0,commits:0}));
function Fixture(){const s=useHost();return <View style={{padding:16,gap:8}}><UnitInput scope={s.scope} label="Scoped numeric value" value={s.value} disabled={s.disabled} onCommit={value=>useHost.setState(s=>({value,commits:s.commits+1}))}/><Button title="Toggle field disabled" onPress={()=>useHost.setState(s=>({disabled:!s.disabled}))}/><Button title="Change numeric document" onPress={()=>useHost.setState({scope:'b',value:0,commits:0})}/><Text testID="unit-state">{JSON.stringify(s)}</Text></View>;}
AppRegistry.registerComponent('UnitBoundary',()=>Fixture);AppRegistry.runApplication('UnitBoundary',{rootTag:document.getElementById('root')});
