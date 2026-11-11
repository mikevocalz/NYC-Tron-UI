import {AppRegistry,View,Text} from 'react-native';
import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {IconButton} from '../../../src/components/IconButton.tsx';
import {PrecisionScrubber} from '../../../src/components/forge/inputs/PrecisionScrubber.tsx';
const useFixture=create<{value:number;commits:number}>(()=>({value:37,commits:0}));
function App(){const {value,commits}=useFixture();return <View style={{padding:16,gap:16,width:'100%'}}>
 <View style={{width:280,maxWidth:'100%',gap:12}}>
 <Button title="Save document" targetSize={48} onPress={()=>useFixture.setState(s=>({commits:s.commits+1}))}/>
 <IconButton aria-label="Save" icon={<Text>S</Text>} targetSize={48} size="sm" onPress={()=>useFixture.setState(s=>({commits:s.commits+1}))}/>
 <PrecisionScrubber label="Deckkraft der ausgewählten Ebene" targetSize={48} value={value} min={0} max={100} step={1} unit="%"
 labels={{increase:'Deckkraft erhöhen',decrease:'Deckkraft verringern',value:'Deckkraft bearbeiten',idleHint:'Nach oben für feine, nach unten für grobe Schritte ziehen',gestureHint:'Mit Pfeiltasten oder den Schaltflächen ändern',fine:'Feine Schritte',normal:'Normale Schritte',coarse:'Grobe Schritte'}}
 onCommit={value=>useFixture.setState(s=>({value,commits:s.commits+1}))}/>
 </View><Text testID="density-result">{value}% · {commits} commits</Text>
 </View>}
document.body.style.margin='0';AppRegistry.registerComponent('control-density',()=>App);AppRegistry.runApplication('control-density',{rootTag:document.getElementById('root')});
