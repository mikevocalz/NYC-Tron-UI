import React,{useMemo} from 'react';
import {ScrollView,Button} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import BridgeApp from './BridgeApp';
import PlayerApp from './PlayerApp';
export default function App(){const store=useMemo(()=>createStore(()=>({mode:'bridge'})),[]);const mode=useStore(store,s=>s.mode);return React.createElement(ScrollView,{contentContainerStyle:{padding:20,paddingTop:60}},React.createElement(Button,{title:'Run native player lifecycle',testID:'p03-start-player',accessibilityLabel:'Run native player lifecycle',onPress:()=>store.setState({mode:'player'})}),mode==='bridge'?React.createElement(BridgeApp):React.createElement(PlayerApp));}
