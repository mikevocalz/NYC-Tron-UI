import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { joinClasses } from "../styles.ts";

/** Well recipe shared by both forks. `active` is a drag over the zone. */
export function dropZoneClasses({active,disabled,unstyled,className}:{
  active:boolean;disabled:boolean;unstyled:boolean;className?:string;
}):string {
  return joinClasses("items-center justify-center",
    !unstyled&&"gap-3 rounded-card border-2 p-6",
    !unstyled&&(active?"border-solid border-focus bg-surface-sunken":"border-dashed border-border bg-surface-raised"),
    !unstyled&&"motion-reduce:transition-none",
    disabled&&"opacity-50",className);
}

/** Default content: headline, optional description and the web browse control. */
export function DropZoneCopy({title,description,browse,unstyled}:{
  title:string;description?:string;browse?:ReactNode;unstyled:boolean;
}) {
  return (
    <>
      <Text {...{className:joinClasses("text-center",!unstyled&&"text-base font-semibold leading-6 text-text")}}>{title}</Text>
      {description ? <Text {...{className:joinClasses("text-center",!unstyled&&"max-w-sm text-sm leading-5 text-text-muted")}}>{description}</Text> : null}
      {browse ? <View {...{className:!unstyled?"mt-1":undefined}}>{browse}</View> : null}
    </>
  );
}
