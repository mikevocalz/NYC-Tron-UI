import {Host} from '@expo/ui';
import {requireNativeView} from 'expo';
import {Platform,type NativeSyntheticEvent} from 'react-native';
export interface NativeVideoStatus {sourceId:string;status:'loading'|'ready'|'playing'|'paused'|'ended'|'error';positionUs:number;durationUs:number;seekToken:string;error:string}
export interface NativeVideoPlayerProps {sourceId:string;uri:string;paused:boolean;muted?:boolean;volume?:number;rate?:number;seekTimeUs?:number;seekToken?:string;width:number;height:number;label:string;onStatus:(status:NativeVideoStatus)=>void}
const NativeView=requireNativeView<Omit<NativeVideoPlayerProps,'width'|'height'|'onStatus'>&{onStatus:(event:NativeSyntheticEvent<NativeVideoStatus>)=>void}>('NYCTronInstruments','TronVideoPlayerView');
/** AVPlayerLayer on iOS, VideoView/MediaPlayer on Android. The app owns audio-focus policy and playback intent. Mount this stable leaf above changing panel layouts. */
export function NativeVideoPlayer({width,height,onStatus,...props}:NativeVideoPlayerProps){
 if(!['ios','android'].includes(Platform.OS))throw new Error('NativeVideoPlayer requires its iOS or Android adapter');
 if(props.seekTimeUs!==undefined&&!props.seekToken?.trim()||!props.sourceId.trim()||props.sourceId.length>256||!props.label.trim()||props.label.length>1024||props.uri.length>32768||!(/^(file|content|https?):\/\//.test(props.uri))||![width,height].every(n=>Number.isFinite(n)&&n>0&&n<=16384)||!Number.isFinite(props.volume??1)||(props.volume??1)<0||(props.volume??1)>1||!Number.isFinite(props.rate??1)||(props.rate??1)<.25||(props.rate??1)>4||!Number.isSafeInteger(props.seekTimeUs??0)||(props.seekTimeUs??0)<0||(props.seekToken?.length??0)>256)throw new RangeError('Invalid native video request');
 return <Host style={{width,height}}><NativeView {...props} muted={props.muted??false} volume={props.volume??1} rate={props.rate??1} seekTimeUs={props.seekTimeUs??0} seekToken={props.seekToken??''} onStatus={event=>{const s=event.nativeEvent;if(s.sourceId!==props.sourceId||!['loading','ready','playing','paused','ended','error'].includes(s.status)||![s.positionUs,s.durationUs].every(n=>Number.isSafeInteger(n)&&n>=0))return;onStatus(s);}}/></Host>;
}
