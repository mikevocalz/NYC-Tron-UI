import React,{useEffect,useMemo} from 'react';
import {Text,View} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {File,Paths} from 'expo-file-system';
import {NativeVideoPlayer} from '../tron-complete/packages/native-controls/src/NativeVideoPlayer.tsx';
import fixtures from './player-fixtures.json';

export default function PlayerApp(){
 const store=useMemo(()=>createStore(()=>({phase:'init',sourceId:'A',uri:'',paused:true,seekTimeUs:0,seekToken:'',mounted:false,result:'P03 PLAYER RUNNING',checks:[]})),[]);
 const state=useStore(store,s=>s);
 useEffect(()=>{
  const a=new File(Paths.cache,'p03-player-a.mp4'),b=new File(Paths.cache,'p03-player-b.mp4');
  for(const [file,bytes] of [[a,fixtures.a],[b,fixtures.b]]){file.create({overwrite:true});file.write(bytes,{encoding:'base64'});}
  store.setState({phase:'readyA',uri:a.uri,mounted:true});
  const timer=setTimeout(()=>{const s=store.getState();if(s.phase!=='pass')store.setState({phase:'fail',result:'P03 PLAYER FAIL: timeout in '+s.phase,mounted:false});},20000);
  return()=>{clearTimeout(timer);if(a.exists)a.delete();if(b.exists)b.delete();};
 },[store]);
 const fail=message=>store.setState({phase:'fail',mounted:false,result:'P03 PLAYER FAIL: '+message});
 const onStatus=s=>{
  const current=store.getState();
  console.log('P03PLAYER',JSON.stringify({phase:current.phase,...s}));
  if(current.phase==='pass'||current.phase==='fail')return;
  if(!current.mounted){fail('status delivered after unmount');return;}
  if(s.sourceId!==current.sourceId){fail('stale source status exposed');return;}
  if(s.status==='error'){
   if(current.phase==='errorD'&&s.error){
    store.setState({checks:[...current.checks,'PASS actual native missing-file error'],phase:'recoveryE',sourceId:'E',uri:new File(Paths.cache,'p03-player-a.mp4').uri,paused:true,seekTimeUs:0,seekToken:''});
   }else fail(s.error);
   return;
  }
  const next=(label,patch)=>store.setState({...patch,checks:[...current.checks,label]});
  if(current.phase==='readyA'&&['ready','paused'].includes(s.status)&&s.durationUs>=2900000){next('PASS native source A readiness',{phase:'playingA',paused:false});}
  else if(current.phase==='playingA'&&s.status==='playing'&&s.positionUs>0){next('PASS actual play and advancing clock',{phase:'pausedA',paused:true});}
  else if(current.phase==='pausedA'&&s.status==='paused'){next('PASS native pause',{phase:'seekA',seekTimeUs:500000,seekToken:'seek-A-1'});}
  else if(current.phase==='seekA'&&s.seekToken==='seek-A-1'&&s.status==='paused'){
   if(Math.abs(s.positionUs-500000)>10000){fail('seek acknowledgement outside 10ms');return;}
   next('PASS seek token acknowledged within 10ms (not frame pixels)',{phase:'readyB',sourceId:'B',uri:new File(Paths.cache,'p03-player-b.mp4').uri,paused:true,seekTimeUs:0,seekToken:''});
  }
  else if(current.phase==='readyB'&&['ready','paused'].includes(s.status)&&s.durationUs>0&&s.durationUs<2000000){
   if(s.seekToken!==''){fail('old seek token survived source replacement');return;}
   next('PASS source B replaces A and clears seek token',{phase:'unmounted',mounted:false});
   setTimeout(()=>{
    if(store.getState().phase!=='unmounted')return;
    const checks=[...store.getState().checks,'PASS no callback after React unmount (500ms)'];
    store.setState({checks,phase:'remounted',mounted:true,sourceId:'C',uri:new File(Paths.cache,'p03-player-a.mp4').uri,seekTimeUs:0,seekToken:''});
   },500);
  }
  else if(current.phase==='remounted'&&['ready','paused'].includes(s.status)&&s.durationUs>=2900000){
   const missing=new File(Paths.cache,'p03-player-missing.mp4');
   if(missing.exists){fail('missing-file fixture unexpectedly exists');return;}
   next('PASS fresh native remount readiness',{phase:'errorD',sourceId:'D',uri:missing.uri,paused:true,seekTimeUs:0,seekToken:''});
  }
  else if(current.phase==='recoveryE'&&['ready','paused'].includes(s.status)&&s.durationUs>=2900000){
   const checks=[...current.checks,'PASS native source recovery after error'];
   store.setState({checks,phase:'pass',mounted:false,result:'P03 PLAYER PASS\n'+checks.join('\n')});
  }
 };
 return React.createElement(View,null,
  React.createElement(Text,{accessibilityLabel:state.result,style:{color:'white',fontSize:14}},state.result+'\nPhase '+state.phase),
  state.mounted?React.createElement(NativeVideoPlayer,{sourceId:state.sourceId,uri:state.uri,paused:state.paused,muted:true,volume:0,rate:1,...(state.seekToken?{seekTimeUs:state.seekTimeUs,seekToken:state.seekToken}:{}),width:320,height:180,label:'P03 native player surface',onStatus}):null);
}
