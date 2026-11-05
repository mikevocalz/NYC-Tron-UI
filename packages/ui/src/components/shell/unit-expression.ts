/**
 * Bounded unit arithmetic for {@linkcode UnitInput}. A hand-written
 * recursive-descent parser over a fixed token set: no `eval`, no `Function`,
 * no identifiers beyond the unit names below, and hard limits on length,
 * token count and nesting, so a pasted string cannot cost more than a few
 * hundred steps.
 *
 * Grammar:
 *   expression := term (("+" | "-") term)*
 *   term       := unary (("*" | "/") unary)*
 *   unary      := ("+" | "-") unary | primary
 *   primary    := number unit? | "(" expression ")"
 */

/** What a field measures. Units convert only within one dimension. */
export type UnitDimension="length"|"time"|"level"|"ratio";

/** Units each dimension accepts. */
export const UNITS={
  length:["px","pt","mm","cm","in","%"],
  time:["s","ms","f","smp"],
  level:["dB"],
  ratio:["%","x"],
} as const satisfies Record<UnitDimension,readonly string[]>;

/** A unit name from {@linkcode UNITS}. */
export type UnitName=(typeof UNITS)[UnitDimension][number];

/**
 * How a field converts between units. Values are stored in the base unit of
 * the dimension: pixels, seconds, decibels, or a plain ratio (1 = 100%).
 */
export interface UnitContext {
  readonly dimension:UnitDimension;
  /** Unit for bare numbers and for display. */
  readonly unit:UnitName;
  /** Pixels per inch for length. @default 96 */
  readonly pixelsPerInch?:number;
  /** Frames per second; required to use `f`. */
  readonly frameRate?:number;
  /** Samples per second; required to use `smp`. */
  readonly sampleRate?:number;
  /** Base-unit value that 100% of a length means, e.g. the parent width. Required to use `%` for length. */
  readonly percentOf?:number;
}

/** Result of {@linkcode parseUnitExpression}. */
export type UnitParseResult=
  | {readonly ok:true;
      /** In the dimension's base unit. */
      readonly value:number}
  | {readonly ok:false;readonly error:string;
      /** Character offset of the problem. */
      readonly at:number};

/** Hard limits that bound parser work. */
export const UNIT_EXPRESSION_LIMITS={maxLength:128,maxTokens:64,maxDepth:8} as const;

type Token={kind:"num";value:number;unit:string|undefined;at:number}|{kind:"op";op:string;at:number};
class UnitError extends Error{
  readonly at:number;
  constructor(message:string,at:number){super(message);this.at=at;}
}

// A decimal comma is accepted for locales that type one.
const NUMBER=/^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?/i;
const WORD=/^[a-z%]+/i;
const UNIT_NAMES=new Set(["px","pt","mm","cm","in","%","s","ms","f","smp","dB","db","x"]);

/**
 * Base units per one `unit`, or throws when the unit does not belong to the
 * dimension or its context (frame rate, sample rate, percent reference) is
 * missing.
 */
export function unitScale(unit:string,ctx:UnitContext):number{
  const u=unit==="db"?"dB":unit;
  const allowed=UNITS[ctx.dimension] as readonly string[];
  if(!allowed.includes(u))throw new RangeError(`${unit} is not a ${ctx.dimension} unit`);
  const ppi=ctx.pixelsPerInch??96;
  if(!(ppi>0)||!Number.isFinite(ppi))throw new RangeError("pixelsPerInch must be positive");
  switch(u){
    case "px":return 1;
    case "pt":return ppi/72;
    case "mm":return ppi/25.4;
    case "cm":return ppi/2.54;
    case "in":return ppi;
    case "s":return 1;
    case "ms":return 0.001;
    case "dB":return 1;
    case "x":return 1;
    case "f":
      if(!(ctx.frameRate!>0))throw new RangeError("Frames need a frame rate");
      return 1/ctx.frameRate!;
    case "smp":
      if(!(ctx.sampleRate!>0))throw new RangeError("Samples need a sample rate");
      return 1/ctx.sampleRate!;
    case "%":
      if(ctx.dimension==="ratio")return 0.01;
      if(!(Number.isFinite(ctx.percentOf)&&ctx.percentOf!>=0))throw new RangeError("Percent needs a reference size");
      return ctx.percentOf!/100;
  }
  throw new RangeError(`Unknown unit ${unit}`);
}

function tokenize(text:string):Token[]{
  const tokens:Token[]=[];
  let i=0;
  while(i<text.length){
    const ch=text[i]!;
    if(ch===" "||ch==="\t"){i++;continue;}
    const op=ch==="×"?"*":ch==="−"?"-":ch;
    if("+-*/()".includes(op)){tokens.push({kind:"op",op,at:i});i++;}
    else{
      const num=NUMBER.exec(text.slice(i));
      if(!num)throw new UnitError(`Unexpected "${ch}"`,i);
      const at=i;
      i+=num[0].length;
      let j=i;
      while(text[j]===" ")j++;
      const word=WORD.exec(text.slice(j))?.[0];
      if(word!==undefined&&!UNIT_NAMES.has(word))throw new UnitError(`Unknown unit "${word}"`,j);
      if(word!==undefined)i=j+word.length;
      tokens.push({kind:"num",value:Number(num[0].replace(",",".")),unit:word,at});
    }
    if(tokens.length>UNIT_EXPRESSION_LIMITS.maxTokens)throw new UnitError("Expression is too long",i);
  }
  return tokens;
}

// A quantity in base units (`dim` 1) or a plain number (`dim` 0).
type Q={v:number;dim:0|1};

/**
 * Parse text such as `12mm + 4pt`, `1.5s - 12f` or `(100% - 16px) / 2` into
 * the dimension's base unit. Bare numbers in a sum take the context's
 * `unit`; in a product they are plain factors, so `10mm * 2` is 20mm.
 * Dividing by a quantity, multiplying two quantities, and dividing by zero
 * are errors.
 */
export function parseUnitExpression(text:string,ctx:UnitContext):UnitParseResult{
  if(typeof text!=="string")return {ok:false,error:"Enter a value",at:0};
  if(text.length>UNIT_EXPRESSION_LIMITS.maxLength)return {ok:false,error:"Expression is too long",at:UNIT_EXPRESSION_LIMITS.maxLength};
  if(!text.trim())return {ok:false,error:"Enter a value",at:0};
  try{
    const tokens=tokenize(text);
    let pos=0;
    const peek=()=>tokens[pos];
    const atOf=()=>peek()?.at??text.length;
    const bare=(q:Q):Q=>q.dim===1?q:{v:q.v*unitScale(ctx.unit,ctx),dim:1};
    const expression=(depth:number):Q=>{
      let left=term(depth);
      for(let t=peek();t?.kind==="op"&&(t.op==="+"||t.op==="-");t=peek()){
        pos++;
        const right=term(depth);
        const a=bare(left),b=bare(right);
        left={v:t.op==="+"?a.v+b.v:a.v-b.v,dim:1};
      }
      return left;
    };
    const term=(depth:number):Q=>{
      let left=unary(depth);
      for(let t=peek();t?.kind==="op"&&(t.op==="*"||t.op==="/");t=peek()){
        pos++;
        const right=unary(depth);
        if(t.op==="*"){
          if(left.dim&&right.dim)throw new UnitError("Cannot multiply two measurements",t.at);
          left={v:left.v*right.v,dim:(left.dim||right.dim) as 0|1};
        }else{
          if(right.dim)throw new UnitError("Divide by a plain number",t.at);
          if(right.v===0)throw new UnitError("Cannot divide by zero",t.at);
          left={v:left.v/right.v,dim:left.dim};
        }
      }
      return left;
    };
    const unary=(depth:number):Q=>{
      const t=peek();
      if(t?.kind==="op"&&(t.op==="-"||t.op==="+")){
        pos++;
        const inner=unary(depth+1);
        return t.op==="-"?{v:-inner.v,dim:inner.dim}:inner;
      }
      return primary(depth);
    };
    const primary=(depth:number):Q=>{
      if(depth>UNIT_EXPRESSION_LIMITS.maxDepth)throw new UnitError("Too many nested parentheses",atOf());
      const t=peek();
      if(!t)throw new UnitError("Expression ends early",text.length);
      if(t.kind==="num"){
        pos++;
        if(t.unit===undefined)return {v:t.value,dim:0};
        let scale:number;
        try{scale=unitScale(t.unit,ctx);}catch(e){throw new UnitError((e as Error).message,t.at);}
        return {v:t.value*scale,dim:1};
      }
      if(t.op==="("){
        pos++;
        const inner=expression(depth+1);
        const close=peek();
        if(close?.kind!=="op"||close.op!==")")throw new UnitError("Missing )",atOf());
        pos++;
        return inner;
      }
      throw new UnitError(`Unexpected "${t.op}"`,t.at);
    };
    const result=bare(expression(0));
    if(pos<tokens.length)throw new UnitError(`Unexpected "${(()=>{const t=tokens[pos]!;return t.kind==="op"?t.op:String(t.value);})()}"`,atOf());
    if(!Number.isFinite(result.v))throw new UnitError("Value is out of range",0);
    return {ok:true,value:result.v};
  }catch(e){
    if(e instanceof UnitError)return {ok:false,error:e.message,at:e.at};
    if(e instanceof RangeError)return {ok:false,error:e.message,at:0};
    throw e;
  }
}

/** A base-unit value expressed in `unit`. */
export function convertFromBase(value:number,unit:UnitName,ctx:UnitContext):number{
  return value/unitScale(unit,ctx);
}

/** Decimals worth showing for a unit. */
export function unitPrecision(unit:UnitName):number{
  switch(unit){
    case "px":case "f":case "smp":return 0;
    case "mm":case "pt":case "%":case "dB":case "ms":return 1;
    default:return 2;
  }
}

/** Display text for a base-unit value, e.g. "12.5 mm" or "24 f". */
export function formatUnitValue(value:number,ctx:UnitContext,unit:UnitName=ctx.unit):string{
  const shown=Number(convertFromBase(value,unit,ctx).toFixed(unitPrecision(unit)));
  return (Object.is(shown,-0)?0:shown)+(unit==="%"||unit==="x"?"":" ")+unit;
}
