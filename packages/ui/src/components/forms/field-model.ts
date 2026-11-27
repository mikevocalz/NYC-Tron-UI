/*
 * Behaviour adapted from NYC-MON packages/ui/FormField.tsx and
 * packages/ui/Textarea.tsx (MIT), mikevocalz/nyc-mon commit
 * 5ed8cf8322c685c86dbe03f4ac7b801255d1b907. Copyright (c) 2025 Gursel Cakar,
 * MIT. Notices: THIRD_PARTY_NOTICES.md. Modified for NYC-Tron UI (2026-11):
 * pure id, ARIA and auto-grow rules split out for unit tests.
 */
/**
 * Pure rules behind Field and Textarea: id wiring, the accessible name and
 * hint a control gets inside a Field, the character counter's wording and
 * when it is announced, and row clamping for auto-grow. No React here, so
 * the rules are unit tested without a renderer.
 */

/** Ids a Field hands to its control. `descriptionId`/`errorId` exist only while that text is shown. */
export interface FieldIds {
  /** The control's own id (`nativeID`). */
  inputId:string;
  /** The Label's `nativeID`; target of `accessibilityLabelledBy` / `aria-labelledby`. */
  labelId:string;
  descriptionId?:string;
  errorId?:string;
}

/**
 * Turns a React `useId()` value (`:r0:`, `«r0»`, `_r_0_`) into a token safe
 * for `nativeID`, DOM ids and `aria-describedby` lists.
 */
export function safeId(raw:string):string {
  const id=raw.replace(/[^A-Za-z0-9_-]/g,"");
  return id||"field";
}

/** Ids for one Field. Description and error ids are left out when that text is absent. */
export function fieldIds(base:string,{description,error}:{description?:string;error?:string}={}):FieldIds {
  const id=safeId(base);
  return {
    inputId:id,
    labelId:id+"-label",
    ...(description?{descriptionId:id+"-description"}:{}),
    ...(error?{errorId:id+"-error"}:{}),
  };
}

/**
 * Space-separated id list for `aria-describedby`, in the given order, with
 * empty entries and repeats removed. Undefined when nothing is left, so the
 * attribute is not written at all.
 */
export function describedBy(...ids:Array<string|false|null|undefined>):string|undefined {
  const seen:string[]=[];
  for(const entry of ids){
    if(!entry)continue;
    for(const id of entry.split(/\s+/)){
      if(id&&!seen.includes(id))seen.push(id);
    }
  }
  return seen.length?seen.join(" "):undefined;
}

function sentence(text:string):string {
  const t=text.trim();
  if(!t)return "";
  return /[.!?…:;]$/.test(t)?t:t+".";
}

/**
 * The control's accessible name on platforms that do not follow
 * `aria-labelledby` (iOS, and Android before it resolves the labelling
 * view): the label, then the required word.
 */
export function fieldLabelText(label:string,required=false,requiredText="required"):string {
  const l=label.trim();
  return required&&requiredText?`${l}, ${requiredText}`:l;
}

/**
 * Native `accessibilityHint`: the error first (prefixed, so the state is
 * spoken in words), then the description. Undefined when both are empty.
 */
export function fieldHint(
  {description,error,errorPrefix="Error:"}:{description?:string;error?:string;errorPrefix?:string},
):string|undefined {
  const parts:string[]=[];
  if(error?.trim())parts.push(sentence(errorPrefix?`${errorPrefix} ${error.trim()}`:error));
  if(description?.trim())parts.push(sentence(description));
  return parts.length?parts.join(" "):undefined;
}

/** What a Field knows about itself, as handed to its control. */
export interface FieldState {
  ids:FieldIds;
  /** Plain-text label, used for the native accessible name. */
  label?:string;
  description?:string;
  error?:string;
  required:boolean;
  disabled:boolean;
  invalid:boolean;
  /** Spoken after the label when required. @default "required" */
  requiredText?:string;
  /** Spoken before the error in the native hint. @default "Error:" */
  errorPrefix?:string;
}

/** Accessibility props for any control inside a Field. Spread them on the control. */
export interface FieldControlProps {
  nativeID:string;
  accessibilityLabelledBy:string;
  "aria-labelledby":string;
  "aria-describedby"?:string;
  accessibilityLabel?:string;
  accessibilityHint?:string;
  "aria-required"?:boolean;
  "aria-invalid"?:boolean;
  "aria-disabled"?:boolean;
  accessibilityState:{disabled:boolean};
}

/**
 * Builds the control props from a field state. `extraDescribedBy` (for
 * example a character counter id) is appended after the description and
 * error ids.
 */
export function fieldControlProps(field:FieldState,...extraDescribedBy:Array<string|undefined>):FieldControlProps {
  const {ids}=field;
  return {
    nativeID:ids.inputId,
    accessibilityLabelledBy:ids.labelId,
    "aria-labelledby":ids.labelId,
    "aria-describedby":describedBy(ids.errorId,ids.descriptionId,...extraDescribedBy),
    accessibilityLabel:field.label?fieldLabelText(field.label,field.required,field.requiredText):undefined,
    accessibilityHint:fieldHint({description:field.description,error:field.error,errorPrefix:field.errorPrefix}),
    "aria-required":field.required||undefined,
    "aria-invalid":field.invalid||undefined,
    "aria-disabled":field.disabled||undefined,
    accessibilityState:{disabled:field.disabled},
  };
}

// ---- character counter ----------------------------------------------------

/** Inputs to a counter label. `remaining` is undefined without a `max`. */
export interface CounterState {
  length:number;
  max?:number;
  remaining?:number;
}

/**
 * How close to the limit the counter starts announcing: 10% of the limit,
 * at least 5 and at most 20 characters, never more than the limit itself.
 */
export function defaultCountThreshold(max:number):number {
  assertCount(max,"max",1);
  return Math.min(max,Math.max(5,Math.min(20,Math.ceil(max*0.1))));
}

function assertCount(value:number,name:string,min:number):void {
  if(!Number.isInteger(value)||value<min||value>1_000_000)throw new RangeError(`Invalid ${name}: ${value}`);
}

export function counterState(length:number,max?:number):CounterState {
  assertCount(length,"length",0);
  if(max===undefined)return {length};
  assertCount(max,"max",1);
  return {length,max,remaining:max-length};
}

/** Default counter wording, in words so it reads the same aloud and on screen. */
export function counterText({length,remaining}:CounterState):string {
  if(remaining===undefined)return length===1?"1 character":`${length} characters`;
  if(remaining<0){
    const over=-remaining;
    return over===1?"1 character over the limit":`${over} characters over the limit`;
  }
  if(remaining===0)return "No characters left";
  return remaining===1?"1 character left":`${remaining} characters left`;
}

/** True when the counter should be a polite live region: at or inside the threshold. */
export function counterIsNearLimit({remaining}:CounterState,threshold:number):boolean {
  assertCount(threshold,"count threshold",0);
  return remaining!==undefined&&remaining<=threshold;
}

/**
 * Whether to send an explicit announcement (iOS has no live regions): only
 * near the limit, and only when the remaining count actually changed.
 */
export function shouldAnnounceCount(previousRemaining:number|undefined,state:CounterState,threshold:number):boolean {
  return counterIsNearLimit(state,threshold)&&state.remaining!==previousRemaining;
}

// ---- rows -------------------------------------------------------------------

/** Resolved row bounds. `autoGrow` is true when the height follows the content. */
export interface RowBounds {
  min:number;
  max:number;
  autoGrow:boolean;
}

const MAX_ROWS=100;

function assertRows(value:number|undefined,name:string):void {
  if(value!==undefined&&(!Number.isInteger(value)||value<1||value>MAX_ROWS)){
    throw new RangeError(`Invalid textarea ${name}: ${value} (whole number from 1 to ${MAX_ROWS})`);
  }
}

/**
 * Validates `rows` / `minRows` / `maxRows`. `rows` fixes the height and
 * cannot be combined with the other two. With neither, the textarea shows
 * 4 rows (NYC-MON's default). `minRows` alone grows without a cap up to
 * 100 rows; `maxRows` alone starts at one row.
 */
export function resolveRows({rows,minRows,maxRows}:{rows?:number;minRows?:number;maxRows?:number}):RowBounds {
  assertRows(rows,"rows");assertRows(minRows,"minRows");assertRows(maxRows,"maxRows");
  if(rows!==undefined&&(minRows!==undefined||maxRows!==undefined)){
    throw new RangeError("Textarea takes rows or minRows/maxRows, not both");
  }
  if(rows!==undefined)return {min:rows,max:rows,autoGrow:false};
  if(minRows===undefined&&maxRows===undefined)return {min:4,max:4,autoGrow:false};
  const min=minRows??1,max=maxRows??MAX_ROWS;
  if(min>max)throw new RangeError(`Textarea minRows (${min}) is greater than maxRows (${max})`);
  return {min,max,autoGrow:min!==max};
}

/** Layout metrics for row math. `inset` is the padding plus border on the block axis. */
export interface RowMetrics {
  lineHeight:number;
  fontScale:number;
  inset:number;
}

function assertMetrics({lineHeight,fontScale,inset}:RowMetrics):void {
  if(!Number.isFinite(lineHeight)||lineHeight<=0)throw new RangeError(`Invalid textarea lineHeight: ${lineHeight}`);
  if(!Number.isFinite(fontScale)||fontScale<=0)throw new RangeError(`Invalid font scale: ${fontScale}`);
  if(!Number.isFinite(inset)||inset<0)throw new RangeError(`Invalid textarea inset: ${inset}`);
}

/** Height of `rows` lines at the current font scale, never under the 44pt target. */
export function rowsHeight(rows:number,metrics:RowMetrics):number {
  assertMetrics(metrics);
  return Math.max(44,Math.ceil(rows*metrics.lineHeight*metrics.fontScale+metrics.inset));
}

/**
 * Auto-grow height for a measured content height (the text's own height,
 * without padding): clamped between the min and max row heights. `scroll`
 * is true once the content is taller than the max, so the field scrolls
 * instead of growing.
 */
export function autoGrowHeight(contentHeight:number,bounds:RowBounds,metrics:RowMetrics):{height:number;scroll:boolean} {
  const min=rowsHeight(bounds.min,metrics),max=rowsHeight(bounds.max,metrics);
  const wanted=Number.isFinite(contentHeight)&&contentHeight>0?Math.ceil(contentHeight+metrics.inset):min;
  return {height:Math.min(max,Math.max(min,wanted)),scroll:wanted>max};
}

/**
 * One step of keeping an Expo UI text field (which owns its text in an
 * observable state) on a controlled `value`. `sent` is the text the field
 * last reported, `current` what it holds now. The parent's `value` is pushed
 * only when it differs from what the field sent: then the parent changed or
 * rejected the edit. When they match, the parent took the edit and the field
 * is left alone, because a later keystroke may already be in it. Returns the
 * new `sent` and the text to write into the field, if any.
 */
export function controlledTextPush(value:string|undefined,sent:string,current:string):{sent:string;push?:string} {
  if(value===undefined||value===sent)return {sent};
  return value===current?{sent:value}:{sent:value,push:value};
}
