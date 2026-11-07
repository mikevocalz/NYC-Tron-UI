import {PrecisionScrubber,type PrecisionScrubberProps} from '../inputs/PrecisionScrubber.tsx';
import {GestureHandlerDrag} from '../../gestures/GestureHandlerDrag.tsx';
export type AccessiblePrecisionScrubControlProps=Omit<PrecisionScrubberProps,'transport'>;
/** One precision model for native RNGH pointer, keyboard, switch, adjustable actions and explicit numeric entry. */
export function AccessiblePrecisionScrubControl(props:AccessiblePrecisionScrubControlProps){return <PrecisionScrubber {...props} transport={GestureHandlerDrag}/>;}
