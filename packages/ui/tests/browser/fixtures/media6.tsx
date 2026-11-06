import {AppRegistry,ScrollView,Text,View} from 'react-native';import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {AudioInterruptionRecoveryDialog} from '../../../src/components/forge/audio/AudioInterruptionRecoveryDialog.tsx';
import {createPlatformMediaDecoder} from '../../../../platform-services/src/media/platform.web.ts';
const decoder=createPlatformMediaDecoder();
const useDoc=create<{dialog:'waiting'|'ready'|'output'|'reset'|'recording'|undefined;log:string;error:string}>(()=>({dialog:undefined,log:'',error:''}));
const log=(v:string)=>useDoc.setState({log:v});
function App(){const s=useDoc();const run=async(work:()=>Promise<void>)=>{try{await work();}catch(e){useDoc.setState({error:e instanceof Error?e.message:String(e)});}};return <ScrollView contentContainerStyle={{padding:16,gap:12}}>
 <Text>Native media and recovery</Text>
 <Button title="Decode frame at zero" onPress={()=>{void run(async()=>{const frame=await decoder.decodeFrame(location.origin+'/decoder.webm',{timeUs:0,maxWidth:32,maxHeight:32});log(`frame ${frame.width}x${frame.height} ${frame.actualTimeUs} ${frame.timing} ${frame.uri.startsWith('data:image/jpeg')}`);});}}/>
 <Button title="Decode audio" onPress={()=>{void run(async()=>{const result=await decoder.decodeAudio(location.origin+'/decoder.webm',{startUs:0,durationUs:500000,sampleRate:16000});log(`audio ${result.channels} ${result.sampleRate} ${result.frames} ${result.pcm.kind}`);});}}/>
 {(['waiting','ready','output','reset','recording'] as const).map(dialog=><Button key={dialog} title={'Show '+dialog} onPress={()=>useDoc.setState({dialog})}/>)}
 <Text testID="log">{s.log}</Text><Text testID="error">{s.error}</Text>
 {s.dialog==='recording'?<AudioInterruptionRecoveryDialog visible notice={{kind:'recording',filename:'Take 3.wav'}} onKeep={()=>log('keep')} onDiscard={()=>log('discard')} onClose={()=>useDoc.setState({dialog:undefined})}/>:
 s.dialog==='reset'?<AudioInterruptionRecoveryDialog visible notice={{kind:'reset'}} onRetry={()=>log('restart')} onStop={()=>log('stop')} onClose={()=>useDoc.setState({dialog:undefined})}/>:
 s.dialog?<AudioInterruptionRecoveryDialog visible notice={{kind:'paused',reason:s.dialog==='output'?'output-lost':'interruption',ready:s.dialog!=='waiting'}} onResume={()=>{if(q.has('fail'))throw new Error('Output still unavailable');log('resume');}} onStop={()=>log('stop')} onClose={()=>useDoc.setState({dialog:undefined})}/>:null}
 </ScrollView>;}
const q=new URLSearchParams(location.search);document.documentElement.dataset.theme=q.get('theme')??'light';document.documentElement.dir=q.get('dir')??'ltr';document.body.style.margin='0';AppRegistry.registerComponent('media6',()=>App);AppRegistry.runApplication('media6',{rootTag:document.getElementById('root')});
