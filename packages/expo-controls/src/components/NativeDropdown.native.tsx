import { useEffect, useRef } from "react";
import { Platform, Text, View } from "react-native";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { Host } from "@expo/ui";
import { Picker as SwiftUIPicker, Section as SwiftUISection, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { disabled as swiftUIDisabled, pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import {
  DropdownMenuItem, ExposedDropdownMenu, ExposedDropdownMenuBox, HorizontalDivider,
  Text as ComposeText, TextField, type TextFieldRef,
} from "@expo/ui/jetpack-compose";
import {
  menuAnchor, onVisibilityChanged, padding, semantics, testID as composeTestID,
} from "@expo/ui/jetpack-compose/modifiers";
import {
  dropdownOptions, joinDropdownClasses, selectedOptionLabel, validateDropdownOptions,
  type NativeDropdownGroup, type NativeDropdownOption, type NativeDropdownProps,
} from "./NativeDropdown.types.ts";
export type {
  NativeDropdownProps, NativeDropdownOption, NativeDropdownGroup,
  NativeDropdownBaseProps, NativeDropdownOptionsChoice, NativeDropdownGroupsChoice,
} from "./NativeDropdown.types.ts";
export { validateDropdownOptions, dropdownOptions } from "./NativeDropdown.types.ts";

/*
 * Accessibility decision: the label goes into the platform picker itself,
 * not onto an RN wrapper.
 *
 * Expo's universal Picker has no label prop, so VoiceOver and TalkBack read
 * only the selected value. Wrapping it in an accessible RN View with
 * role=button and an accessibilityLabel would make the wrapper the only
 * focusable element. Activating it then taps the view's centre instead of
 * opening the native menu, which is unreliable. So this file renders the
 * platform pickers the universal one wraps, with a label each platform
 * understands:
 *   - iOS: SwiftUI Picker(label:). VoiceOver reads "Lesson, <value>, pop up
 *     button"; the menu and wheel styles do not draw the label.
 *   - Android: Material ExposedDropdownMenuBox. The read-only anchor field
 *     gets the caption as contentDescription, and TalkBack follows it with
 *     the field text (the value). Putting the value in the description too
 *     would read it twice.
 * The visible RN caption is hidden from assistive tech so it is not
 * announced twice.
 *
 * Headed `groups`: on iOS each group is a SwiftUI `Section` inside the
 * Picker, which the menu style draws as a section header (the wheel style
 * lists the options without headers). On Android each group gets a heading
 * row in the Material menu, with a divider between groups; the heading is
 * plain text, not a menu item, so TalkBack reads it and never offers to
 * select it.
 *
 * Both platform trees are imported here. Expo resolves a native view config
 * lazily, on first render (NativeComponentRegistry.get in expo-modules-core
 * 58), so importing the SwiftUI views on Android, or the Compose views on
 * iOS, registers nothing and logs nothing.
 */
export function NativeDropdown(props:NativeDropdownProps){
  const {
    label,value,onValueChange,disabled=false,appearance="menu",
    className,labelClassName,testID,style,options:_options,groups,...rest
  }=props;
  const options=dropdownOptions(props);
  validateDropdownOptions(value,options);
  const enabled=!disabled && options.length>0;
  const choose=(next:string)=>{if(enabled && next!==value)onValueChange(next);};
  return <View {...rest} style={style}
    {...{className:joinDropdownClasses("w-full min-w-0 gap-1",className)}}>
    <Text accessibilityElementsHidden importantForAccessibility="no"
      {...{className:joinDropdownClasses("text-sm text-text",labelClassName)}}>{label}</Text>
    <Host matchContents={{vertical:true}} style={{width:"100%"}}>
      {Platform.OS==="android"
        ? <ComposeDropdown label={label} value={value} options={options} groups={groups}
            enabled={enabled} onChoose={choose} testID={testID}/>
        : <SwiftUIPicker label={label} selection={value} testID={testID}
            onSelectionChange={next=>{if(typeof next==="string")choose(next);}}
            modifiers={enabled
              ? [pickerStyle(appearance)]
              : [pickerStyle(appearance),swiftUIDisabled(true)]}>
            {groups===undefined
              ? options.map(swiftUIOption)
              : groups.map((group,index)=><SwiftUISection key={"group:"+index} title={group.heading}>
                  {group.options.map(swiftUIOption)}
                </SwiftUISection>)}
          </SwiftUIPicker>}
    </Host>
  </View>;
}

const swiftUIOption=(option:NativeDropdownOption)=>
  <SwiftUIText key={option.value} modifiers={[tag(option.value)]}>{option.label}</SwiftUIText>;

interface ComposeDropdownProps {
  readonly label:string;
  readonly value:string;
  readonly options:readonly NativeDropdownOption[];
  readonly groups:readonly NativeDropdownGroup[]|undefined;
  readonly enabled:boolean;
  readonly onChoose:(value:string)=>void;
  readonly testID?:string;
}
type ComposeMenuState={expanded:boolean;visible:boolean};
/** Material 3 exposed dropdown. `appearance` does not apply: Material has no wheel. */
function ComposeDropdown({label,value,options,groups,enabled,onChoose,testID}:ComposeDropdownProps){
  const local=useRef<StoreApi<ComposeMenuState>|null>(null);
  if(!local.current)local.current=createStore<ComposeMenuState>(()=>({expanded:false,visible:false}));
  const store=local.current;
  const expanded=useStore(store,state=>state.expanded);
  const visible=useStore(store,state=>state.visible);
  const field=useRef<TextFieldRef>(null);
  const selectedLabel=selectedOptionLabel(value,options);
  // The anchor field is uncontrolled; push the selection once it is on screen.
  useEffect(()=>{
    if(visible)void field.current?.setText(selectedLabel);
  },[selectedLabel,visible]);
  const setExpanded=(next:boolean)=>store.setState({expanded:next});
  const item=(option:NativeDropdownOption)=><DropdownMenuItem key={option.value}
    onClick={enabled?()=>{onChoose(option.value);setExpanded(false);}:undefined}>
    <DropdownMenuItem.Text><ComposeText>{option.label}</ComposeText></DropdownMenuItem.Text>
  </DropdownMenuItem>;
  return <ExposedDropdownMenuBox expanded={expanded}
    onExpandedChange={enabled?setExpanded:undefined}>
    <TextField ref={field} readOnly enabled={enabled}
      modifiers={[
        menuAnchor(),
        onVisibilityChanged(next=>store.setState({visible:next})),
        semantics({contentDescription:label}),
        ...(testID?[composeTestID(testID)]:[]),
      ]}/>
    <ExposedDropdownMenu expanded={expanded} onDismissRequest={()=>setExpanded(false)}>
      {groups===undefined
        ? options.map(item)
        : groups.flatMap((group,index)=>[
            ...(index>0?[<HorizontalDivider key={"divider:"+index}/>]:[]),
            // Material 3 menu section label: labelLarge text, inset like the items, never clickable.
            <ComposeText key={"heading:"+index} style={{typography:"labelLarge"}}
              modifiers={[padding(16,12,16,4)]}>{group.heading}</ComposeText>,
            ...group.options.map(item),
          ])}
    </ExposedDropdownMenu>
  </ExposedDropdownMenuBox>;
}
