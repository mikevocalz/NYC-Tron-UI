import { TextInput, type KeyboardTypeOptions, type TextInputProps } from "react-native";
import { joinClasses } from "../styles.ts";
import type { InputProps, InputType } from "./types.ts";

const KEYBOARD:Record<InputType,KeyboardTypeOptions>={
  text:"default",search:"web-search",email:"email-address",url:"url",
  tel:"phone-pad",number:"decimal-pad",password:"default",
};
const INPUT_MODE:Record<InputType,TextInputProps["inputMode"]>={
  text:"text",search:"search",email:"email",url:"url",tel:"tel",number:"decimal",password:"text",
};

/**
 * Single-line text field on both platforms: a real `<input>` on web (React
 * Native Web's TextInput) and the platform field on native. For a labelled
 * field with helper and error text use TextField; this is the bare control
 * Forge's semantic set exposes. At least 44pt tall.
 */
export function Input({type="text",id,className,...props}:InputProps) {
  return (
    <TextInput
      {...props}
      nativeID={id}
      keyboardType={props.keyboardType??KEYBOARD[type]}
      inputMode={props.inputMode??INPUT_MODE[type]}
      secureTextEntry={props.secureTextEntry??type==="password"}
      autoCapitalize={props.autoCapitalize??(type==="text"?"sentences":"none")}
      {...{className:joinClasses("min-h-11",className)}}
    />
  );
}
