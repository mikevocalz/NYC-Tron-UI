import * as ReactNative from "react-native";
import { StyleSheet, type StyleProp } from "react-native";
import type { ReactElement } from "react";
import type {
  HeadingProps, LinkProps, SemanticBaseProps, SemanticBlockProps, SemanticTextProps,
} from "./types.ts";

export { Input } from "./Input.tsx";
export type {
  HeadingLevel, HeadingProps, InputProps, InputType, LinkProps,
  SemanticBaseProps, SemanticBlockProps, SemanticTextProps,
} from "./types.ts";

/**
 * Web fork: real `<main>`, `<header>`, `<nav>`, `<h2>`, `<a>`… through React
 * Native Web's own element factory, the path RNW's View and Text use. Style
 * props, `dataSet`, aria props and RTL `dir` resolve exactly as on a View.
 *
 * View with a `role` would reach most of these elements too, but it always
 * writes the role attribute: a `<header role="banner">` nested in a section
 * would announce a second page banner. The factory emits the element with its
 * implicit role only.
 */
type Factory=(tag:string,props:object)=>ReactElement;
const createElement=(ReactNative as unknown as {unstable_createElement?:Factory}).unstable_createElement;
if(typeof createElement!=="function"){
  throw new Error("@nyc-tron/ui/components/html web build needs react-native-web (unstable_createElement).");
}

// RN View defaults, so block primitives lay out like the Views around them
// (flex column, no shrink); app classes override them as they do on a View.
const base=StyleSheet.create({
  block:{display:"flex",flexDirection:"column",alignItems:"stretch",flexBasis:"auto",flexShrink:0,
    minHeight:0,minWidth:0,position:"relative"},
  text:{},
});

function render(tag:string,{className,style,hidden,dataSet,children,...rest}:SemanticBaseProps&{style?:StyleProp<object>},
  baseStyle:object,extra?:object):ReactElement {
  const classes=className?{$$css:true,tw:className}:undefined;
  return createElement!(tag,{
    ...rest,...extra,dataSet,hidden,
    // `hidden` alone loses to a display utility; the inline style does not.
    style:[baseStyle,classes,style,hidden?{display:"none"}:undefined],
    children,
  });
}

export const Page=(props:SemanticBlockProps)=>render("div",props,base.block);
export const Main=(props:SemanticBlockProps)=>render("main",props,base.block);
export const Header=(props:SemanticBlockProps)=>render("header",props,base.block);
export const Footer=(props:SemanticBlockProps)=>render("footer",props,base.block);
export const Section=(props:SemanticBlockProps)=>render("section",props,base.block);
export const Nav=(props:SemanticBlockProps)=>render("nav",props,base.block);
export const Article=(props:SemanticBlockProps)=>render("article",props,base.block);
export const Aside=(props:SemanticBlockProps)=>render("aside",props,base.block);

// Text primitives inherit the app's font from the page instead of RNW Text's
// `14px System`, which a layered stylesheet cannot override. Like RNW Text
// they default to dir="auto", so punctuation in mixed-direction copy lands on
// the right side of each run.
const auto=<P extends {dir?:SemanticBaseProps["dir"]}>(props:P)=>({...props,dir:props.dir??"auto"});
export const Text=({numberOfLines:_n,selectable:_s,...props}:SemanticTextProps)=>render("span",auto(props),base.text);
export const Paragraph=({numberOfLines:_n,selectable:_s,...props}:SemanticTextProps)=>render("p",auto(props),base.text);
export function Heading({level=1,numberOfLines:_n,selectable:_s,...props}:HeadingProps) {
  return render("h"+level,auto(props),base.text);
}
export function Link({href,target,rel,onPress,numberOfLines:_n,selectable:_s,...props}:LinkProps) {
  return render("a",auto(props),base.text,{
    href,target,
    rel:target==="_blank"?joinRel(rel,"noopener noreferrer"):rel,
    onClick:onPress,
  });
}
const joinRel=(rel:string|undefined,add:string)=>[...new Set([...(rel??"").split(/\s+/),...add.split(" ")].filter(Boolean))].join(" ");
