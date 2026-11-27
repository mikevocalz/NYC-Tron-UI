// Behaviour adapted from NYC-MON packages/ui/ConfirmDestructive.tsx (MIT).
import {useLayoutEffect,useRef,type ComponentRef} from "react";
import type {Pressable} from "react-native";
import {Button} from "../Button.tsx";
import {Dialog} from "./Dialog.web.tsx";
import {alertAction,alertInitialFocus,type AlertDialogAction} from "./dialog-model.ts";
import type {AlertDialogProps} from "./AlertDialog.types.ts";
export type {AlertDialogProps,AlertDialogTone} from "./AlertDialog.types.ts";

/**
 * Confirmation built on the kit `Dialog` (role="alertdialog"). Cancel then
 * Confirm sit at the end of the actions row. A danger dialog opens with focus
 * on Cancel, so Enter never confirms by accident; a default one opens on
 * Confirm. Escape and the Android back button cancel when `dismissible`; a
 * tap outside does nothing unless `closeOnBackdrop`. While `busy`, Confirm
 * shows loading, Cancel is disabled and nothing closes the dialog.
 *
 * Web fork and the fallback used by `AlertDialog.native.tsx`.
 */
export function AlertDialog({
  ref,open,onOpenChange,title,description,children,confirmLabel,cancelLabel="Cancel",onConfirm,onCancel,
  tone="default",busy=false,closeOnConfirm=true,dismissible=true,closeOnBackdrop=false,size="sm",testID,
  className,overlayClassName,contentClassName,titleClassName,descriptionClassName,footerClassName,unstyled=false,colorScheme,
}:AlertDialogProps){
  if(typeof confirmLabel!=="string"||confirmLabel.trim()==="")throw new RangeError("AlertDialog needs a confirmLabel that names the action");
  const cancelRef=useRef<ComponentRef<typeof Pressable>|null>(null);
  const confirmRef=useRef<ComponentRef<typeof Pressable>|null>(null);
  const latest=useRef({busy,closeOnConfirm,onConfirm,onCancel,onOpenChange});
  useLayoutEffect(()=>{latest.current={busy,closeOnConfirm,onConfirm,onCancel,onOpenChange};});
  const run=(action:AlertDialogAction)=>{
    const now=latest.current;
    const step=alertAction(action,now);
    if(step.call==="confirm")now.onConfirm();
    else if(step.call==="cancel")now.onCancel?.();
    if(step.close)now.onOpenChange(false);
  };
  const initial=alertInitialFocus(tone)==="cancel"?cancelRef:confirmRef;
  return (
    <Dialog ref={ref} role="alertdialog" open={open} title={title} description={description} size={size}
      onOpenChange={next=>{if(!next)run("cancel");}}
      dismissible={dismissible} closeOnBackdrop={closeOnBackdrop} busy={busy}
      initialFocusRef={initial as {current:{focus?:()=>void}|null}} testID={testID} colorScheme={colorScheme}
      className={className} overlayClassName={overlayClassName} contentClassName={contentClassName}
      titleClassName={titleClassName} descriptionClassName={descriptionClassName} footerClassName={footerClassName}
      unstyled={unstyled}
      footer={<>
        <Button ref={cancelRef} title={cancelLabel} variant="secondary" disabled={busy} unstyled={unstyled}
          onPress={()=>run("cancel")}/>
        <Button ref={confirmRef} title={confirmLabel} variant={tone==="danger"?"danger":"primary"} loading={busy}
          unstyled={unstyled} onPress={()=>run("confirm")}/>
      </>}>
      {children}
    </Dialog>
  );
}
