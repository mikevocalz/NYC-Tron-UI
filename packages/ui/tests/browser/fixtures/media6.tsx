import {AppRegistry,ScrollView,Text,View} from 'react-native';import {create} from 'zustand';
// Browser media decoding through @nyc-tron/platform-services. The audio
// interruption recovery dialog of this page moved with the editor controls to
// Nitro Forge's packages/editor-controls/tests/browser lane.
import {Button} from '../../../src/components/Button.tsx';
import {createPlatformMediaDecoder} from '../../../../platform-services/src/media/platform.web.ts';
const decoder=createPlatformMediaDecoder();
const useDoc=create<{log:string;error:string}>(()=>({log:'',error:''}));
const log=(v:string)=>useDoc.setState({log:v});
function App(){const s=useDoc();const run=async(work:()=>Promise<void>)=>{try{await work();}catch(e){useDoc.setState({error:e instanceof Error?e.message:String(e)});}};return <ScrollView contentContainerStyle={{padding:16,gap:12}}>
 <Text>Native media</Text>
 <Button title="Decode frame at zero" onPress={()=>{void run(async()=>{const frame=await decoder.decodeFrame(location.origin+'/decoder.webm',{timeUs:0,maxWidth:32,maxHeight:32});log(`frame ${frame.width}x${frame.height} ${frame.actualTimeUs} ${frame.timing} ${frame.uri.startsWith('data:image/jpeg')}`);});}}/>
 <Button title="Decode audio" onPress={()=>{void run(async()=>{const result=await decoder.decodeAudio(location.origin+'/decoder.webm',{startUs:0,durationUs:500000,sampleRate:16000});log(`audio ${result.channels} ${result.sampleRate} ${result.frames} ${result.pcm.kind}`);});}}/>
 <Text testID="log">{s.log}</Text><Text testID="error">{s.error}</Text>
 </ScrollView>;}
const q=new URLSearchParams(location.search);document.documentElement.dataset.theme=q.get('theme')??'light';document.documentElement.dir=q.get('dir')??'ltr';document.body.style.margin='0';AppRegistry.registerComponent('media6',()=>App);AppRegistry.runApplication('media6',{rootTag:document.getElementById('root')});
