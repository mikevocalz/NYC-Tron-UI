import type {Gesture as GestureNamespace} from "react-native-gesture-handler";
import type {DragPoint,DragTransportProps} from "./drag-transport.ts";

type Latest={readonly current:DragTransportProps};

/**
 * Race of a one-pointer Pan and a Tap for {@linkcode GestureHandlerDrag}. Callbacks run
 * on JS. A tap with no MOVE still begins and releases once, and the losing Pan's
 * finalize cannot cancel it. `Gesture` is passed in so this module never loads
 * react-native-gesture-handler at runtime.
 */
export function buildDragGesture(Gesture:typeof GestureNamespace,latest:Latest,disabled:boolean){
  let start:DragPoint={x:0,y:0};
  let panClaimed=false;
  let tapRejected=false;
  const pan=Gesture.Pan()
    .enabled(!disabled).minDistance(0).maxPointers(1).runOnJS(true)
    // Pan can stay BEGAN for DOWN then UP with no MOVE, even at distance zero.
    .onBegin(event=>{start={x:event.absoluteX,y:event.absoluteY};panClaimed=false;})
    .onStart(()=>{panClaimed=true;latest.current.onBegin(start);})
    .onTouchesDown(event=>{if(event.numberOfTouches!==1)latest.current.onCancel();})
    .onUpdate(event=>latest.current.onMove({x:event.absoluteX,y:event.absoluteY},event.numberOfPointers))
    .onEnd((event,success)=>{
      if(success)latest.current.onRelease({x:event.absoluteX,y:event.absoluteY});
      else if(panClaimed)latest.current.onCancel();
    })
    .onFinalize((_event,success)=>{if(!success&&panClaimed)latest.current.onCancel();});
  const tap=Gesture.Tap().enabled(!disabled).maxDistance(4).runOnJS(true)
    .onBegin(event=>{tapRejected=event.numberOfPointers!==1;})
    .onTouchesDown(event=>{if(event.numberOfTouches!==1)tapRejected=true;})
    .onEnd((event,success)=>{
      if(!success||tapRejected)return;
      const point={x:event.absoluteX,y:event.absoluteY};
      latest.current.onBegin(point);
      latest.current.onRelease(point);
    });
  return Gesture.Race(pan,tap);
}
