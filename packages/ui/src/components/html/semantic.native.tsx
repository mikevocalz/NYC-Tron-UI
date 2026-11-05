import { Linking, Text as RNText, View, type GestureResponderEvent, type Role } from "react-native";
import type {
  HeadingProps, LinkProps, SemanticBaseProps, SemanticBlockProps, SemanticTextProps,
} from "./types.ts";

export { Input } from "./Input.tsx";
export type {
  HeadingLevel, HeadingProps, InputProps, InputType, LinkProps,
  SemanticBaseProps, SemanticBlockProps, SemanticTextProps,
} from "./types.ts";

/**
 * Native fork: View and Text with the matching ARIA `role`, which RN 0.88
 * maps to the platform's accessibility traits where one exists (heading,
 * link, list). Landmarks have no iOS or Android equivalent, so `main`,
 * `banner`, `navigation` and the like are carried for parity and are silent
 * to VoiceOver and TalkBack. Roles go through `role`, never
 * `accessibilityRole`: Android's enum throws on values outside its list.
 */
function nativeProps({id,hidden,title:_title,dataSet:_dataSet,dir:_dir,lang:_lang,className,...rest}:SemanticBaseProps) {
  const props:Record<string,unknown>={};
  for(const [key,value] of Object.entries(rest)){
    if(!key.startsWith("data-"))props[key]=value;
  }
  return {
    ...props,
    nativeID:id,
    className,
    ...(hidden?{"aria-hidden":true,accessibilityElementsHidden:true,importantForAccessibility:"no-hide-descendants" as const}:{}),
  };
}
function block(role:Role|undefined,displayName:string) {
  const Block=({style,hidden,...props}:SemanticBlockProps)=>(
    <View {...nativeProps({hidden,...props})} role={role}
      style={hidden?[style,{display:"none"}]:style}/>
  );
  Block.displayName=displayName;
  return Block;
}

export const Page=block(undefined,"Page");
export const Main=block("main","Main");
export const Header=block("banner","Header");
export const Footer=block("contentinfo","Footer");
export const Section=block("region","Section");
export const Nav=block("navigation","Nav");
export const Article=block("article","Article");
export const Aside=block("complementary","Aside");

export function Text({style,hidden,...props}:SemanticTextProps) {
  return <RNText {...nativeProps({hidden,...props})} style={hidden?[style,{display:"none"}]:style}/>;
}
export function Paragraph(props:SemanticTextProps) {
  return <Text {...props}/>;
}
export function Heading({level=1,style,hidden,...props}:HeadingProps) {
  return <RNText {...nativeProps({hidden,...props})} role="heading"
    {...{"aria-level":level}} style={hidden?[style,{display:"none"}]:style}/>;
}

const EXTERNAL=/^(?:https?:|mailto:|tel:)/i;
export function Link({href,target:_target,rel:_rel,onPress,style,hidden,...props}:LinkProps) {
  const external=href!==undefined&&EXTERNAL.test(href);
  const press=onPress??(external?(_event:GestureResponderEvent)=>{void Linking.openURL(href!);}:undefined);
  // A link that cannot go anywhere is plain text, never a dead control.
  return <RNText {...nativeProps({hidden,...props})} role={press?"link":undefined} onPress={press}
    style={hidden?[style,{display:"none"}]:style}/>;
}
