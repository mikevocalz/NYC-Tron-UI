import type { ReactNode } from 'react';
import { TextInput, Text, View, type TextInputProps } from 'react-native';
import { joinClasses } from './styles';
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
}
export function TextField({
 id,label,helperText,errorText,startAdornment,className,inputClassName,
 labelClassName,editable=true,...props
}:TextFieldProps) {
 return (
  <View {...{className:joinClasses('gap-2',className)}}>
   <Text nativeID={id+'-label'} {...{className:joinClasses('text-sm font-semibold text-foreground',labelClassName)}}>
    {label}
   </Text>
   <View {...{className:joinClasses('min-h-12 flex-row items-center gap-2 rounded-control border border-border bg-surface px-3',errorText&&'border-danger')}}>
    {startAdornment ?? null}
    <TextInput
     {...props}
     editable={editable}
     accessibilityLabel={label}
     accessibilityLabelledBy={id+'-label'}
     accessibilityHint={errorText??helperText}
     {...{className:joinClasses('flex-1 min-h-11 text-base text-foreground',inputClassName)}}
    />
   </View>
   {errorText ? <Text accessibilityRole="alert" {...{className:'text-sm text-danger'}}>{errorText}</Text>
   : helperText ? <Text {...{className:'text-sm text-muted'}}>{helperText}</Text> : null}
  </View>
 );
}