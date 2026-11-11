import React,{useEffect,useMemo} from 'react';
import {Text,ScrollView} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {File,Paths} from 'expo-file-system';
import {createPlatformMediaDecoder} from '../tron-complete/packages/platform-services/src/media/platform.native.ts';
import fixtures from './fixtures.json';

export default function App(){
 const store=useMemo(()=>createStore(()=>({result:'P03 BRIDGE RUNNING'})),[]);
 const result=useStore(store,s=>s.result);
 useEffect(()=>{let live=true;const outputs=[];const sources=[];const decoder=createPlatformMediaDecoder();
  const run=async()=>{
   const checks=[];
   try{
    if(!decoder.isAvailable||decoder.presentationIndexVersion!==1||decoder.indexedFrameVersion!==1||!decoder.presentationIndex||!decoder.decodeIndexedFrame)throw Error('Actual native capability is missing');
    checks.push('PASS actual Expo native capabilities');
    await decoder.clearCache();
    for(const [name,fixture] of Object.entries(fixtures)){
     const source=new File(Paths.cache,'p03-'+name+'.mp4');source.create({overwrite:true});source.write(fixture.base64,{encoding:'base64'});sources.push(source);
     const probe=await decoder.probe(source.uri);
     if(!probe.video)throw Error(name+' missing native video probe');
     const index=await decoder.presentationIndex(source.uri);
     if(JSON.stringify(index.timesUs)!==JSON.stringify(fixture.timesUs))throw Error(name+' PTS mismatch '+JSON.stringify(index.timesUs));
     for(const timeUs of index.timesUs){
      const frame=await decoder.decodeIndexedFrame(source.uri,{timeUs,maxWidth:64,maxHeight:64});
      const file=new File(frame.uri);outputs.push(file);
      if(frame.actualTimeUs!==timeUs||frame.timing!=='presentation'||!file.exists||file.size<=0||frame.width<=0||frame.height<=0)throw Error(name+' invalid actual JPEG '+timeUs);
     }
     checks.push('PASS '+name+': 12 actual PTS and 12 real JPEG files');
     try{await decoder.presentationIndex(source.uri,{maxFrames:1});throw Error('cap accepted');}catch(error){if(error.code!=='out-of-range')throw error;}
     try{await decoder.decodeIndexedFrame(source.uri,{timeUs:1});throw Error('missing frame accepted');}catch(error){if(error.code!=='out-of-range')throw error;}
    }
    await decoder.clearCache();
    if(outputs.some(file=>file.exists))throw Error('native cache cleanup left JPEG output');
    checks.push('PASS actual native cache cleanup of 36 JPEG files');
    checks.push('PASS native cap and missing-timestamp errors');
    if(live)store.setState({result:'P03 BRIDGE PASS\n'+checks.join('\n')});
   }catch(error){if(live)store.setState({result:'P03 BRIDGE FAIL\n'+String(error)+'\n'+checks.join('\n')});}
   finally{for(const source of sources)if(source.exists)source.delete();}
  };void run();return()=>{live=false;};
 },[store]);
 return React.createElement(ScrollView,{contentContainerStyle:{padding:24,paddingTop:80}},React.createElement(Text,{testID:'p03-bridge-result',style:{fontSize:16,color:'white'}},result));
}
