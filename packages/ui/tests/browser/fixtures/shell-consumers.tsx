import {AppRegistry,View} from "react-native";
import {ShellDemo} from "../../../../../examples/native-instruments/ShellDemo.tsx";
const query=new URLSearchParams(location.search);
document.documentElement.dataset.theme=query.get('theme')??'light';
document.documentElement.dir=query.get('dir')==='rtl'?'rtl':'ltr';
const dir=document.documentElement.dir as 'ltr'|'rtl';
AppRegistry.registerComponent('ShellConsumers',()=>()=> <View {...{dir}} style={{flex:1}}><ShellDemo/></View>);
AppRegistry.runApplication('ShellConsumers',{rootTag:document.getElementById('root')});
