// Behaviour adapted from NYC-MON packages/ui/ConfirmDestructive.tsx (MIT).
import {useLayoutEffect,useRef} from "react";
import {Platform} from "react-native";
import {Host} from "@expo/ui";
import {Alert,Button as SwiftUIButton,Spacer,Text as SwiftUIText} from "@expo/ui/swift-ui";
import {frame} from "@expo/ui/swift-ui/modifiers";
import {AlertDialog as ComposeAlertDialog,Text as ComposeText,TextButton,useMaterialColors} from "@expo/ui/jetpack-compose";
import {alertAction,composeDialogProperties,prefersSystemAlert,type AlertDialogAction} from "./dialog-model.ts";
import type {AlertDialogProps} from "./AlertDialog.types.ts";
import {AlertDialog as KitAlertDialog} from "./AlertDialog.web.tsx";
export type {AlertDialogProps,AlertDialogTone} from "./AlertDialog.types.ts";

/**
 * iOS: SwiftUI `Alert` from @expo/ui. Cancel has the cancel role and a danger
 * Confirm the destructive role, so VoiceOver and the system styling match
 * other iOS confirmations. SwiftUI closes the alert on any button press.
 *
 * Android: Material 3 `AlertDialog` from @expo/ui with text buttons; a
 * danger Confirm uses the theme's error color. While `busy` both buttons are
 * disabled and back and tap-outside are blocked.
 *
 * The kit dialog from `AlertDialog.web.tsx` draws instead when `children` are
 * passed, on iOS when `closeOnConfirm` is false, and on hosts without Expo UI
 * (see `prefersSystemAlert`). Not yet validated on a device in this repository.
 */
export function AlertDialog(props:AlertDialogProps){
  if(!prefersSystemAlert(Platform.OS,{hasChildren:props.children!=null&&props.children!==false,closeOnConfirm:props.closeOnConfirm}))
    return <KitAlertDialog {...props}/>;
  if(typeof props.confirmLabel!=="string"||props.confirmLabel.trim()==="")
    throw new RangeError("AlertDialog needs a confirmLabel that names the action");
  return Platform.OS==="android"?<ComposeAlert {...props}/>:<SwiftUIAlert {...props}/>;
}

function useAlertRunner({busy=false,closeOnConfirm=true,onConfirm,onCancel,onOpenChange,open}:AlertDialogProps){
  const latest=useRef({busy,closeOnConfirm,onConfirm,onCancel,onOpenChange,open});
  useLayoutEffect(()=>{latest.current={busy,closeOnConfirm,onConfirm,onCancel,onOpenChange,open};});
  return {latest,run:(action:AlertDialogAction)=>{
    const now=latest.current;
    if(!now.open)return;
    const step=alertAction(action,now);
    if(step.call==="confirm")now.onConfirm();
    else if(step.call==="cancel")now.onCancel?.();
    if(step.close)now.onOpenChange(false);
  }};
}

function SwiftUIAlert(props:AlertDialogProps){
  const {open,title,description,confirmLabel,cancelLabel="Cancel",tone="default",colorScheme}=props;
  const {run}=useAlertRunner(props);
  // A button press reports its own action; SwiftUI then reports the alert
  // closing, which must not count as a second, cancelling answer.
  const answered=useRef(false);
  return (
    <Host matchContents colorScheme={colorScheme} style={{position:"absolute"}}>
      <Alert title={title} isPresented={open}
        onIsPresentedChange={next=>{
          if(next){answered.current=false;return;}
          if(answered.current){answered.current=false;return;}
          run("cancel");
        }}>
        {/* SwiftUI drops presentation modifiers on an empty view; the trigger is a 1pt spacer. */}
        <Alert.Trigger><Spacer modifiers={[frame({width:1,height:1})]}/></Alert.Trigger>
        <Alert.Actions>
          <SwiftUIButton role="cancel" label={cancelLabel} onPress={()=>{answered.current=true;run("cancel");}}/>
          <SwiftUIButton role={tone==="danger"?"destructive":"default"} label={confirmLabel}
            onPress={()=>{answered.current=true;run("confirm");}}/>
        </Alert.Actions>
        {description?<Alert.Message><SwiftUIText>{description}</SwiftUIText></Alert.Message>:null}
      </Alert>
    </Host>
  );
}

function ComposeAlert(props:AlertDialogProps){
  const {open,title,description,confirmLabel,cancelLabel="Cancel",tone="default",busy=false,
    dismissible=true,closeOnBackdrop=false,colorScheme}=props;
  const {run}=useAlertRunner(props);
  const palette=useMaterialColors();
  const danger=tone==="danger";
  return (
    <Host matchContents colorScheme={colorScheme}>
      {open?(
        <ComposeAlertDialog onDismissRequest={()=>run("cancel")}
          properties={composeDialogProperties({dismissible,closeOnBackdrop,busy})}>
          <ComposeAlertDialog.Title><ComposeText>{title}</ComposeText></ComposeAlertDialog.Title>
          {description?<ComposeAlertDialog.Text><ComposeText>{description}</ComposeText></ComposeAlertDialog.Text>:null}
          <ComposeAlertDialog.ConfirmButton>
            <TextButton enabled={!busy} onClick={()=>run("confirm")}
              colors={danger?{contentColor:palette.error}:undefined}>
              <ComposeText>{confirmLabel}</ComposeText>
            </TextButton>
          </ComposeAlertDialog.ConfirmButton>
          <ComposeAlertDialog.DismissButton>
            <TextButton enabled={!busy} onClick={()=>run("cancel")}><ComposeText>{cancelLabel}</ComposeText></TextButton>
          </ComposeAlertDialog.DismissButton>
        </ComposeAlertDialog>
      ):null}
    </Host>
  );
}
