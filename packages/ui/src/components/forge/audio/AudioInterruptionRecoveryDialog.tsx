import {useRef} from 'react';
import {Modal,Text,View} from 'react-native';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {Button} from '../../Button.tsx';
import {joinClasses} from '../../styles.ts';
import {recoveryMessage,recoveryTitle,type AudioRecoveryNotice} from './audio-recovery-model.ts';

type Action=()=>void|Promise<unknown>;
type Base={readonly visible:boolean;readonly onClose:()=>void;readonly error?:string;className?:string;unstyled?:boolean};
/** Host callbacks are required for each recovery kind; no automatic resume or fabricated recovery file. */
export type AudioInterruptionRecoveryDialogProps=Base&(
 {readonly notice:Extract<AudioRecoveryNotice,{kind:'paused'}>;readonly onResume:Action;readonly onStop:Action}|
 {readonly notice:Extract<AudioRecoveryNotice,{kind:'reset'}>;readonly onRetry:Action;readonly onStop:Action}|
 {readonly notice:Extract<AudioRecoveryNotice,{kind:'recording'}>;readonly onKeep:Action;readonly onDiscard:Action});
/** Explicit recovery decisions; rejected actions keep the dialog open with the error. */
export function AudioInterruptionRecoveryDialog(props:AudioInterruptionRecoveryDialogProps){
 const local=useRef<StoreApi<{busy:boolean;error:string|undefined}>|null>(null);if(!local.current)local.current=createStore(()=>({busy:false,error:undefined}));
 const store=local.current,busy=useStore(store,s=>s.busy),error=useStore(store,s=>s.error);
 const run=async(action:Action)=>{if(store.getState().busy)return;store.setState({busy:true,error:undefined});try{await action();props.onClose();}catch(e){store.setState({error:e instanceof Error?e.message:String(e)});}finally{store.setState({busy:false});}};
 const notice=props.notice,styled=!props.unstyled;
 return <Modal visible={props.visible} transparent animationType="none" onRequestClose={()=>{if(!busy)props.onClose();}}>
  <View style={{flex:1,padding:16,alignItems:'center',justifyContent:'center'}} {...{className:styled?'bg-text/50':undefined}}>
   <View accessibilityViewIsModal role="dialog" aria-modal accessibilityLabel={recoveryTitle(notice)} style={{width:'100%',maxWidth:460}} {...{className:joinClasses(styled&&'bg-surface-raised border border-border rounded-card p-4 gap-4',props.className)}}>
    <Text accessibilityRole="header" {...{className:styled?'text-text text-lg font-semibold':undefined}}>{recoveryTitle(notice)}</Text>
    <Text {...{className:styled?'text-text':undefined}}>{recoveryMessage(notice)}</Text>
    {notice.kind==='paused'&&!notice.ready?<Text {...{className:styled?'text-text-muted':undefined}}>Resume is unavailable until the host confirms audio is ready.</Text>:null}
    {error||props.error?<Text accessibilityLiveRegion="polite" {...{className:styled?'text-danger':undefined}}>{error??props.error}</Text>:null}
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,justifyContent:'flex-end'}}>
     <Button title="Close" variant="ghost" disabled={busy} onPress={props.onClose}/>
     {'onKeep' in props?<><Button title="Discard recording" variant="danger" disabled={busy} onPress={()=>{void run(props.onDiscard);}}/><Button title="Keep recording" disabled={busy} onPress={()=>{void run(props.onKeep);}}/></>:
      'onRetry' in props?<><Button title="Stop" variant="secondary" disabled={busy} onPress={()=>{void run(props.onStop);}}/><Button title="Restart audio" disabled={busy} onPress={()=>{void run(props.onRetry);}}/></>:
      <><Button title="Stop" variant="secondary" disabled={busy} onPress={()=>{void run(props.onStop);}}/><Button title="Resume" disabled={busy||!props.notice.ready} onPress={()=>{void run(props.onResume);}}/></>}
    </View>
   </View>
  </View>
 </Modal>;
}
