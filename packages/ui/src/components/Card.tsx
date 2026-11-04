import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { joinClasses } from "./styles";
export type CardSurface="raised"|"sunken"|"transparent";
export interface CardProps extends Omit<ViewProps,"children"> {
 children?:ReactNode;
 surface?:CardSurface;
 padded?:boolean;
 className?:string;
 /** No default visual classes: app provides full Tailwind styling. */
 unstyled?:boolean;
}
const surfaces:Record<CardSurface,string>={
 raised:"bg-surface-raised border-border",
 sunken:"bg-surface-sunken border-border",
 transparent:"bg-transparent border-transparent"
};
/** Presentation only. Never imports an app theme or Forge document runtime. */
export function Card({
 children,surface="raised",padded=true,unstyled=false,className,style,...rest
}:CardProps) {
 return (
   <View {...rest} {...{className:joinClasses(
     !unstyled&&"rounded-card border",!unstyled&&surfaces[surface],!unstyled&&padded&&"p-4",className
   )}} style={style}>{children}</View>
 );
}
