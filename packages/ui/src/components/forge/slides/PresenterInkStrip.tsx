import {View,Text,Pressable,type ViewProps} from 'react-native';
import {Button} from '../../Button.tsx';
import {joinClasses} from '../../styles.ts';
import {webToggleProps} from '../toggle-a11y.ts';
import {PRESENTER_INK_TOOLS,PRESENTER_INK_TOOL_LABELS,PRESENTER_INK_SHORTCUTS,type PresenterInkMode} from './presenter-ink-model.ts';
/** Presenter tools; colors/size remain the consuming app's existing ink controls. */
export interface PresenterInkStripProps extends Omit<ViewProps,'children'> {
 readonly mode:PresenterInkMode;readonly onModeChange:(mode:PresenterInkMode)=>void;
 readonly strokeCount:number;readonly onClear:()=>void;readonly disabled?:boolean;className?:string;unstyled?:boolean;
}
/** Wraps on narrow panes; clear stays disabled until there are committed strokes. */
export function PresenterInkStrip({mode,onModeChange,strokeCount,onClear,disabled=false,className,unstyled=false,...rest}:PresenterInkStripProps){return <View {...rest} role="toolbar" accessibilityLabel="Presenter ink" style={{flexDirection:'row',gap:4,flexWrap:'wrap'}} {...{className}}>
 {PRESENTER_INK_TOOLS.map(tool=><Pressable key={tool} accessibilityRole="button" accessibilityLabel={PRESENTER_INK_TOOL_LABELS[tool]} accessibilityHint={PRESENTER_INK_SHORTCUTS[tool]} {...webToggleProps(mode===tool)} accessibilityState={{selected:mode===tool,disabled}} disabled={disabled} onPress={()=>onModeChange(tool)} style={{minWidth:44,minHeight:44,justifyContent:'center',paddingHorizontal:12}} {...{className:!unstyled?joinClasses('rounded-control focus-visible:ring-2 focus-visible:ring-focus',mode===tool?'bg-primary':'bg-surface-sunken'):undefined}}><Text {...{className:!unstyled?(mode===tool?'text-on-primary':'text-text'):undefined}}>{PRESENTER_INK_TOOL_LABELS[tool]}</Text></Pressable>)}
 <Button title="Clear ink" variant="secondary" disabled={disabled||strokeCount===0} onPress={onClear}/><Button title="Exit ink" variant="secondary" disabled={disabled||mode==='off'} onPress={()=>onModeChange('off')}/>
 </View>;}
