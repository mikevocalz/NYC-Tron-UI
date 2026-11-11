// App-owned acceptance theme. This finite mapping is deliberately confined to
// the probe; it is not an alternative Uniwind compiler or a shipped UI theme.
// Native renderer, events, measurements, focus and controls remain unchanged.
const colors={surface:"#f6f7fa","surface-raised":"#ffffff","surface-sunken":"#e9edf3",
  text:"#172334","text-muted":"#526172",border:"#a6b1c0",primary:"#3456c8",
  "on-primary":"#ffffff",accent:"#3456c8",danger:"#a42737",focus:"#3456c8"};
const fixed={
  "w-full":{width:"100%"},"h-full":{height:"100%"},"min-w-0":{minWidth:0},
  "flex-row":{flexDirection:"row"},"flex-col":{flexDirection:"column"},"flex-wrap":{flexWrap:"wrap"},
  "flex-1":{flex:1},"flex-shrink":{flexShrink:1},"items-center":{alignItems:"center"},
  "items-start":{alignItems:"flex-start"},"self-start":{alignSelf:"flex-start"},
  "justify-center":{justifyContent:"center"},"justify-between":{justifyContent:"space-between"},
  relative:{position:"relative"},absolute:{position:"absolute"},"top-full":{top:"100%"},
  "overflow-hidden":{overflow:"hidden"},"rounded-control":{borderRadius:4},
  "rounded-full":{borderRadius:999},border:{borderWidth:1},"border-b":{borderBottomWidth:1},
  "border-r":{borderRightWidth:1},"border-l":{borderLeftWidth:1},
  "text-xs":{fontSize:12},"text-sm":{fontSize:14},"text-base":{fontSize:16},"text-lg":{fontSize:18},
  "font-semibold":{fontWeight:"600"},"font-bold":{fontWeight:"700"},"bg-transparent":{backgroundColor:"transparent"},
};
const spacing={p:["padding"],px:["paddingLeft","paddingRight"],py:["paddingTop","paddingBottom"],pt:["paddingTop"],pb:["paddingBottom"],pl:["paddingLeft"],pr:["paddingRight"],
  m:["margin"],mx:["marginLeft","marginRight"],my:["marginTop","marginBottom"],mt:["marginTop"],mb:["marginBottom"],ml:["marginLeft"],mr:["marginRight"],gap:["gap"],
  w:["width"],h:["height"],"min-w":["minWidth"],"min-h":["minHeight"]};

export function probeTokenStyle(className){
  const result={};
  for(const token of className.split(/\s+/)){
    if(!token||token.includes(":"))continue; // Platform state selectors remain native-host behavior.
    if(fixed[token]){Object.assign(result,fixed[token]);continue;}
    const measure=/^(min-w|min-h|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|p|m|w|h)-(\d+(?:\.\d+)?)$/.exec(token);
    if(measure){for(const key of spacing[measure[1]])result[key]=Number(measure[2])*4;continue;}
    const edge=/^(left|right|top|bottom)-(\d+)$/.exec(token);
    if(edge){result[edge[1]]=Number(edge[2])*4;continue;}
    const opacity=/^opacity-(\d+)$/.exec(token);
    if(opacity){result.opacity=Number(opacity[1])/100;continue;}
    const depth=/^z-(\d+)$/.exec(token);
    if(depth){result.zIndex=Number(depth[1]);continue;}
    const color=/^(bg|text|border)-([a-z-]+)(?:\/(\d+))?$/.exec(token);
    if(color&&colors[color[2]]){
      const hex=colors[color[2]],key={bg:"backgroundColor",text:"color",border:"borderColor"}[color[1]];
      result[key]=color[3]?`rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${Number(color[3])/100})`:hex;
    }
  }
  return result;
}

export function createProbeJsxRuntime(runtime,rn){
  // RN's component modules also import jsx-runtime while they initialize.
  // Resolve lazy public exports only once rendering starts, not in that cycle.
  let hosts;
  const wrap=render=>(type,props,...args)=>{
    hosts??=new Set([rn.View,rn.Text,rn.Pressable,rn.ScrollView,rn.TextInput]);
    if(!hosts.has(type)||typeof props?.className!=="string")return render(type,props,...args);
    const {className,...rest}=props,theme=probeTokenStyle(className);
    const style=typeof props.style==="function"?state=>[theme,props.style(state)]:[theme,props.style];
    return render(type,{...rest,style},...args);
  };
  return {...runtime,jsx:wrap(runtime.jsx),jsxs:wrap(runtime.jsxs)};
}
