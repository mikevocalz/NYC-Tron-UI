import {ReadAloudTransport,type ReadAloudTransportProps} from "../office/ReadAloudTransport.tsx";
import {SkipGlyph,ToolButton} from "../office/office-controls.tsx";

/** Props for {@linkcode PDFReadAloudTransport}. Sentence `block` values are 0-based page indexes. */
export interface PDFReadAloudTransportProps extends Omit<ReadAloudTransportProps,"context"|"label"|"accessory"> {
  readonly pageCount:number;
  /**
   * Restarts reading at the first sentence of `page` (0-based). The page
   * buttons render only when this is passed.
   */
  readonly onJumpToPage?:(page:number)=>void;
  /** @default "Read PDF aloud" */
  readonly label?:string;
}

/**
 * Read Aloud for a PDF (K-18): the shared transport plus the page being read
 * and previous/next page. Text comes from the PDF's extracted page text; the
 * app maps the current sentence back to the page it shows.
 */
export function PDFReadAloudTransport({pageCount,onJumpToPage,label="Read PDF aloud",unstyled=false,...rest}:PDFReadAloudTransportProps){
  const current=rest.sentences[Math.min(Math.max(rest.index,0),Math.max(rest.sentences.length-1,0))];
  const page=current?.block??0;
  const styled=!unstyled;
  const accessory=onJumpToPage&&pageCount>1?<>
    <ToolButton quiet label="Previous page" iconOnly disabled={page<=0} styled={styled} onPress={()=>onJumpToPage(page-1)}>
      <SkipGlyph styled={styled} back double/>
    </ToolButton>
    <ToolButton quiet label="Next page" iconOnly disabled={page>=pageCount-1} styled={styled} onPress={()=>onJumpToPage(page+1)}>
      <SkipGlyph styled={styled} double/>
    </ToolButton>
  </>:undefined;
  return <ReadAloudTransport {...rest} unstyled={unstyled} label={label}
    context={pageCount>0?"Page "+(page+1)+" of "+pageCount:label} {...(accessory?{accessory}:{})}/>;
}
