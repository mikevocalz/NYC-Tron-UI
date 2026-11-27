// Behaviour adapted from NYC-MON packages/ui/FormField.tsx (MIT).
import { createContext, use, useId, useMemo, type ComponentRef, type ReactNode, type Ref } from "react";
import { Platform, Text, View, type TextProps, type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import { ErrorMessage } from "../feedback/ErrorMessage.tsx";
import {
  fieldControlProps, fieldIds, fieldLabelText,
  type FieldControlProps, type FieldIds, type FieldState,
} from "./field-model.ts";

export type { FieldControlProps, FieldIds, FieldState } from "./field-model.ts";

const FieldContext=createContext<FieldState|null>(null);

/** The surrounding Field's state, or null outside a Field. */
export function useField():FieldState|null {
  return use(FieldContext);
}

/** The surrounding Field's ids, or null outside a Field. */
export function useFieldIds():FieldIds|null {
  return use(FieldContext)?.ids??null;
}

// Web only: keeps words in the accessible name without drawing them.
const visuallyHidden={position:"absolute",width:1,height:1,margin:-1,padding:0,overflow:"hidden",borderWidth:0} as const;

/** Props for {@linkcode Label}. */
export interface LabelProps extends Omit<TextProps,"children"> {
  children:ReactNode;
  /** Id other elements point at with `accessibilityLabelledBy` / `aria-labelledby`. */
  nativeID?:string;
  /** Draws a "*" and adds the required word to the spoken name. */
  required?:boolean;
  /** Word spoken for the required mark. @default "required" */
  requiredText?:string;
  /** Dims the label to match a disabled control. */
  disabled?:boolean;
  className?:string;
  /** Class for the "*" mark. */
  requiredClassName?:string;
  /** No default visual classes; the app supplies the full recipe. */
  unstyled?:boolean;
  ref?:Ref<ComponentRef<typeof Text>>;
}

/**
 * Visible name for a control. When `required`, a "*" is drawn and the word
 * "required" is part of what a screen reader says, so the mark never relies
 * on the symbol or its color alone.
 */
export function Label({
  children,nativeID,required=false,requiredText="required",disabled=false,
  className,requiredClassName,unstyled=false,accessibilityLabel,...rest
}:LabelProps) {
  const styled=!unstyled,web=Platform.OS==="web";
  // Native flattens nested Text, so the spoken name is set on the outer Text.
  const spoken=accessibilityLabel??(!web&&typeof children==="string"?fieldLabelText(children,required,requiredText):undefined);
  return (
    <Text {...rest} nativeID={nativeID} accessibilityLabel={spoken}
      {...{className:joinClasses(styled&&"text-sm font-semibold text-text",disabled&&"opacity-50",className)}}>
      {children}
      {required?<>
        <Text aria-hidden importantForAccessibility="no"
          {...{className:joinClasses(styled&&"text-text-muted",requiredClassName)}}>{" *"}</Text>
        {web&&requiredText?<Text style={visuallyHidden}>{" "+requiredText}</Text>:null}
      </>:null}
    </Text>
  );
}

/** Props for {@linkcode HelperText}. */
export interface HelperTextProps {
  /** One or two sentences. Nothing renders when empty. */
  children?:string;
  /** `error` uses the danger token, a drawn "!" mark and a polite live region. @default "default" */
  tone?:"default"|"error";
  /** Id a control lists in `aria-describedby`. */
  nativeID?:string;
  testID?:string;
  className?:string;
  /** Class for the text itself (error tone; the default tone styles its only Text with `className`). */
  textClassName?:string;
  /** No default visual classes; the app supplies the full recipe. */
  unstyled?:boolean;
  ref?:Ref<ComponentRef<typeof View>>;
}

/**
 * Description or error under a control. The error tone reuses
 * {@linkcode ErrorMessage}: announced politely when it appears, with a drawn
 * mark so the state reads without color.
 */
export function HelperText({
  children,tone="default",nativeID,testID,className,textClassName,unstyled=false,ref,
}:HelperTextProps) {
  if(!children)return null;
  if(tone==="error"){
    return <ErrorMessage {...{ref}} message={children} nativeID={nativeID} testID={testID}
      className={className} messageClassName={textClassName} unstyled={unstyled}/>;
  }
  return (
    <Text ref={ref} nativeID={nativeID} testID={testID}
      {...{className:joinClasses(!unstyled&&"text-sm text-text-muted",className,textClassName)}}>
      {children}
    </Text>
  );
}

/** What a render-prop child of {@linkcode Field} receives. */
export interface FieldRenderProps extends FieldState {
  /** Accessibility props to spread on the control. */
  controlProps:FieldControlProps;
}

/** Props for {@linkcode Field}. */
export interface FieldProps extends Omit<ViewProps,"children"> {
  /** Visible name of the control. */
  label:string;
  /**
   * The control. Controls that read {@linkcode useField} (Textarea) wire
   * themselves; for any other control use the render prop and spread
   * `controlProps`.
   */
  children:ReactNode|((field:FieldRenderProps)=>ReactNode);
  /** Help text that stays visible: a format, a limit or a consequence. */
  description?:string;
  /** What is wrong and how to fix it. Sets `invalid` unless `invalid` is given. */
  error?:string;
  required?:boolean;
  disabled?:boolean;
  /** Invalid without an error message, for example while an error is shown elsewhere. */
  invalid?:boolean;
  /** Base id for the control and its parts. Defaults to a React `useId()` value. */
  id?:string;
  /** Word spoken for the required mark. @default "required" */
  requiredText?:string;
  /** Spoken before the error in the native hint. @default "Error:" */
  errorPrefix?:string;
  className?:string;
  labelClassName?:string;
  descriptionClassName?:string;
  errorClassName?:string;
  /** No default visual classes; the app supplies the full recipe. */
  unstyled?:boolean;
  ref?:Ref<ComponentRef<typeof View>>;
}

/**
 * Label, description and error around one control, with ids wired so the
 * label names the control and the description and error describe it
 * (`aria-labelledby` / `aria-describedby` on web, `accessibilityLabelledBy`
 * and `accessibilityHint` on native). The control is the app's choice.
 */
export function Field({
  label,children,description,error,required=false,disabled=false,invalid,id,
  requiredText="required",errorPrefix="Error:",
  className,labelClassName,descriptionClassName,errorClassName,unstyled=false,...rest
}:FieldProps) {
  const generated=useId();
  const base=id??generated;
  const state=useMemo<FieldState>(()=>({
    ids:fieldIds(base,{description,error}),
    label,description,error,required,disabled,
    invalid:invalid??!!error,
    requiredText,errorPrefix,
  }),[base,label,description,error,required,disabled,invalid,requiredText,errorPrefix]);
  const content=typeof children==="function"?children({...state,controlProps:fieldControlProps(state)}):children;
  return (
    <FieldContext value={state}>
      <View {...rest} {...{className:joinClasses("w-full min-w-0",!unstyled&&"gap-2",className)}}>
        <Label nativeID={state.ids.labelId} required={required} requiredText={requiredText}
          disabled={disabled} unstyled={unstyled} className={labelClassName}>{label}</Label>
        {content}
        <HelperText nativeID={state.ids.descriptionId} unstyled={unstyled} className={descriptionClassName}>{description}</HelperText>
        <HelperText tone="error" nativeID={state.ids.errorId} unstyled={unstyled} className={errorClassName}>{error}</HelperText>
      </View>
    </FieldContext>
  );
}
