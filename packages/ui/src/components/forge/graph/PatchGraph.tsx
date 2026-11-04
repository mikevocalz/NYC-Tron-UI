import {useEffect,useMemo,useRef} from "react";
import {PanResponder,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {compatiblePorts,cubicGraphPoints,getPortAnchor,validatePatchGraph,
 type GraphNode,type GraphEdge,type GraphPoint,type GraphSelection} from "./model.ts";
import {joinClasses} from "../../styles.ts";

type Local={positions:Readonly<Record<string,GraphPoint>>;output:GraphSelection|null};
export interface PatchGraphProps extends Omit<ViewProps,"children">{
 nodes:readonly GraphNode[];
 edges:readonly GraphEdge[];
 width:number;
 height:number;
 selectedNodeId?:string|null;
 onSelectNode?:(id:string)=>void;
 onMoveNode?:(id:string,point:GraphPoint)=>void|Promise<unknown>;
 onConnect?:(from:{nodeId:string;portId:string},to:{nodeId:string;portId:string})=>void|Promise<unknown>;
 accentColor?:string;
 className?:string;
 unstyled?:boolean;
}
/** Native RN graph interaction surface. GPU wire renderer required beyond preview-sized graphs. */
export function PatchGraph({
 nodes,edges,width,height,selectedNodeId,onSelectNode,onMoveNode,onConnect,
 accentColor="#818CF8",className,unstyled=false,...rest
}:PatchGraphProps){
 const local=useRef<StoreApi<Local>|null>(null);
 if(!local.current)local.current=createStore<Local>(()=>({positions:{},output:null}));
 const store=local.current;
 const {positions,output}=useStore(store,s=>s);
 const rendered=useMemo(()=>nodes.map(n=>({...n,...positions[n.id]})),[nodes,positions]);
 useEffect(()=>{
   const pending=store.getState().positions;
   const next={...pending};
   let changed=false;
   for(const node of nodes){
     if(pending[node.id]?.x===node.x&&pending[node.id]?.y===node.y){delete next[node.id];changed=true;}
   }
   if(changed)store.setState({positions:next});
 },[nodes,store]);
 validatePatchGraph(rendered,edges);
 const byId=new Map(rendered.map(n=>[n.id,n] as const));
 const selectOutput=(port:GraphSelection)=>store.setState({output:port});
 const selectInput=(input:GraphSelection)=>{
  if(output&&compatiblePorts(output,input)){
   void onConnect?.({nodeId:output.nodeId,portId:output.portId},{nodeId:input.nodeId,portId:input.portId});
   store.setState({output:null});
  }
 };
 const previewMove=(id:string,point:GraphPoint)=>store.setState(s=>({positions:{...s.positions,[id]:point}}));
 const commitMove=(id:string,point:GraphPoint)=>{
  void onMoveNode?.(id,point);
  // Keep the preview until controlled engine nodes catch up; new gestures start at the visible position.
 };
 const cancelPending=()=>store.setState({output:null});
 return <View {...rest} {...{className:joinClasses("overflow-hidden",!unstyled&&"rounded-control bg-surface-sunken",className)}}>
  <ScrollView horizontal nestedScrollEnabled>
   <ScrollView nestedScrollEnabled>
    <View style={{width,height,minWidth:width,minHeight:height}}>
     {edges.flatMap(edge=>{
       const from=byId.get(edge.from.nodeId)!,to=byId.get(edge.to.nodeId)!;
       const points=cubicGraphPoints(getPortAnchor(from,edge.from.portId,"output"),getPortAnchor(to,edge.to.portId,"input"),16);
       return points.slice(1).map((p,i)=>{
         const prev=points[i],dx=p.x-prev.x,dy=p.y-prev.y,len=Math.hypot(dx,dy);
         return <View key={edge.id+"-"+i} pointerEvents="none" style={{position:"absolute",left:(p.x+prev.x-len)/2,
           top:(p.y+prev.y)/2-1,width:len,height:2,backgroundColor:accentColor,
           transform:[{rotate:Math.atan2(dy,dx)*180/Math.PI+"deg"}]}}/>;
       });
     })}
     {rendered.map(node=><PatchNode key={node.id} node={node} selected={selectedNodeId===node.id}
       accentColor={accentColor} onSelect={()=>onSelectNode?.(node.id)} onPreview={point=>previewMove(node.id,point)}
       onCommit={point=>commitMove(node.id,point)}
       onOutput={portId=>selectOutput({nodeId:node.id,portId,
         dataType:node.outputs.find(p=>p.id===portId)!.dataType})}
       onInput={portId=>selectInput({nodeId:node.id,portId,
         dataType:node.inputs.find(p=>p.id===portId)!.dataType})}/>)}
    </View>
   </ScrollView>
  </ScrollView>
  {output?<Pressable accessibilityRole="button" accessibilityLabel="Cancel cable connection"
    onPress={cancelPending} style={{minHeight:44,justifyContent:"center",paddingHorizontal:12}}>
      <Text>Connecting {output.nodeId}:{output.portId} · Tap an input, or cancel</Text>
    </Pressable>:null}
 </View>;
}
type PatchNodeProps={
 node:GraphNode;selected:boolean;accentColor:string;
 onSelect:()=>void;onPreview:(p:GraphPoint)=>void;onCommit:(p:GraphPoint)=>void;
 onInput:(portId:string)=>void;onOutput:(portId:string)=>void;
};
function PatchNode({node,selected,accentColor,onSelect,onPreview,onCommit,onInput,onOutput}:PatchNodeProps){
 const latest=useRef({node,onSelect,onPreview,onCommit});
 latest.current={node,onSelect,onPreview,onCommit};
 const start=useRef<GraphPoint>({x:node.x,y:node.y});
 const pan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
 if(!pan.current)pan.current=PanResponder.create({
  onStartShouldSetPanResponder:()=>true,
  onMoveShouldSetPanResponder:()=>true,
  onPanResponderGrant:()=>{start.current={x:latest.current.node.x,y:latest.current.node.y};},
  onPanResponderMove:(_e,g)=>latest.current.onPreview({x:Math.max(0,start.current.x+g.dx),y:Math.max(0,start.current.y+g.dy)}),
  onPanResponderRelease:(_e,g)=>{
    if(Math.abs(g.dx)+Math.abs(g.dy)<4)latest.current.onSelect();
    else latest.current.onCommit({x:Math.max(0,start.current.x+g.dx),y:Math.max(0,start.current.y+g.dy)});
  },
  onPanResponderTerminate:()=>latest.current.onPreview(start.current),
 });
 const w=node.width??200;
 const height=58+Math.max(node.inputs.length,node.outputs.length)*28;
 return <View style={{position:"absolute",left:node.x,top:node.y,width:w,minHeight:height,
   borderWidth:selected?2:1,borderColor:selected?accentColor:"#555565",borderRadius:10,
   backgroundColor:"#20202B",overflow:"hidden"}}>
   <View {...pan.current.panHandlers} accessible accessibilityRole="button"
     accessibilityLabel={"Drag or select "+node.title}
     style={{height:44,justifyContent:"center",paddingHorizontal:12,backgroundColor:"#333343"}}>
     <Text style={{color:"#FFFFFF",fontWeight:"700"}}>{node.title}</Text>
   </View>
   <View style={{flexDirection:"row",justifyContent:"space-between"}}>
    <View style={{flex:1}}>
     {node.inputs.map(p=><Pressable key={p.id} accessibilityRole="button"
       accessibilityLabel={"Connect input "+p.label+" ("+p.dataType+")"}
       onPress={()=>onInput(p.id)}
       style={{height:28,flexDirection:"row",alignItems:"center",gap:6}}>
       <View style={{width:12,height:12,borderRadius:6,borderWidth:2,borderColor:accentColor}}/>
       <Text numberOfLines={1} style={{color:"#EDEDF2",fontSize:11}}>{p.label}</Text>
     </Pressable>)}
    </View>
    <View style={{flex:1}}>
     {node.outputs.map(p=><Pressable key={p.id} accessibilityRole="button"
       accessibilityLabel={"Select output "+p.label+" ("+p.dataType+")"}
       onPress={()=>onOutput(p.id)}
       style={{height:28,flexDirection:"row",alignItems:"center",justifyContent:"flex-end",gap:6}}>
       <Text numberOfLines={1} style={{color:"#EDEDF2",fontSize:11}}>{p.label}</Text>
       <View style={{width:12,height:12,borderRadius:6,borderWidth:2,borderColor:accentColor}}/>
     </Pressable>)}
    </View>
   </View>
 </View>;
}
