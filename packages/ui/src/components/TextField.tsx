import type { ComponentRef, ReactNode, Ref } from 'react';
import { TextInput, Text, View, type TextInputProps } from 'react-native';
import { joinClasses } from './styles.ts';
/** NYC-Tron semantic native text input. App colors/radii are theme-owned. */
export interface TextFieldProps extends TextInputProps {
  id: string;
  label: string;
  helperText?: string;
  errorText?: string;
  startAdornment?: ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  /** No default visual classes: the app supplies the full recipe. */
  unstyled?: boolean;
  /** Forwarded to the TextInput (React 19 ref-as-prop), for focus management. */
  ref?: Ref<ComponentRef<typeof TextInput>>;
}
export function TextField({
 id,label,helperText,errorText,startAdornment,className,inputClassName,
 labelClassName,editable=true,unstyled=false,...props
}:TextFieldProps) {
 const styled=!unstyled;
 return (
  <View {...{className:joinClasses('gap-2',className)}}>
   <Text nativeID={id+'-label'} {...{className:joinClasses(styled&&'text-sm font-semibold text-text',labelClassName)}}>
    {label}
   </Text>
   {/* One border color at a time: border-border and border-danger together
       resolve by stylesheet order, not by intent. */}
   <View {...{className:joinClasses('min-h-12 flex-row items-center gap-2',
     styled&&'rounded-control border bg-surface-sunken px-3',
     styled&&(errorText?'border-danger':'border-border'),
     styled&&!editable&&'opacity-50')}}>
    {startAdornment ?? null}
    <TextInput
     {...props}
     editable={editable}
     accessibilityLabel={label}
     accessibilityLabelledBy={id+'-label'}
     accessibilityHint={errorText??helperText}
     accessibilityState={{...props.accessibilityState,disabled:!editable}}
     {...{className:joinClasses('flex-1 min-h-11',styled&&'text-base text-text',inputClassName)}}
    />
   </View>
   {errorText ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" {...{className:joinClasses(styled&&'text-sm text-danger')}}>{errorText}</Text>
   : helperText ? <Text {...{className:joinClasses(styled&&'text-sm text-text-muted')}}>{helperText}</Text> : null}
  </View>
 );
}
