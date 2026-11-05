/** Engine-neutral XR interactions in METERS, not screen pixels. No compositor is bundled. */
export type Vec3=Readonly<{x:number;y:number;z:number}>;
export type Ray3=Readonly<{origin:Vec3;direction:Vec3}>;
export type Plane3=Readonly<{point:Vec3;normal:Vec3}>;
export type Target3=Readonly<{id:string;center:Vec3;radius:number;enabled?:boolean}>;
export type Hit3=Readonly<{id:string;distance:number;point:Vec3}>;
const dot=(a:Vec3,b:Vec3)=>a.x*b.x+a.y*b.y+a.z*b.z;
const sub=(a:Vec3,b:Vec3):Vec3=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const addScaled=(a:Vec3,b:Vec3,k:number):Vec3=>({x:a.x+b.x*k,y:a.y+b.y*k,z:a.z+b.z*k});
const finite=(p:Vec3)=>[p.x,p.y,p.z].every(Number.isFinite);
export function rayPlaneHit(ray:Ray3,plane:Plane3):Vec3|null{
 if(!finite(ray.origin)||!finite(ray.direction)||!finite(plane.point)||!finite(plane.normal))throw new RangeError("Invalid spatial ray");
 const denom=dot(ray.direction,plane.normal);
 if(Math.abs(denom)<1e-9)return null;
 const d=dot(sub(plane.point,ray.origin),plane.normal)/denom;
 return d>=0?addScaled(ray.origin,ray.direction,d):null;
}
/** Nearest forward ray-sphere intersection. No invented "hit" for offscreen targets. */
export function nearestSpatialHit(ray:Ray3,targets:readonly Target3[]):Hit3|null{
 if(!finite(ray.origin)||!finite(ray.direction))throw new RangeError("Invalid spatial ray");
 if(targets.length>1024)throw new RangeError("Too many spatial targets");
 const a=dot(ray.direction,ray.direction);
 if(a<1e-12)throw new RangeError("Degenerate spatial ray");
 let result:Hit3|null=null;
 for(const t of targets){
  if(t.enabled===false)continue;
  if(!t.id||!finite(t.center)||!Number.isFinite(t.radius)||t.radius<=0)throw new RangeError("Invalid spatial target");
  const oc=sub(ray.origin,t.center);
  const b=2*dot(oc,ray.direction),c=dot(oc,oc)-t.radius*t.radius;
  const discr=b*b-4*a*c;
  if(discr<0)continue;
  const root=Math.sqrt(discr),near=(-b-root)/(2*a),far=(-b+root)/(2*a);
  const distance=near>=0?near:far;
  if(distance<0||result&&distance>=result.distance)continue;
  result={id:t.id,distance,point:addScaled(ray.origin,ray.direction,distance)};
 }
 return result;
}
export type PinchState="open"|"pinched";
/** 2.5cm engage / 5cm release hysteresis prevents pinch flutter. */
export function updatePinch(previous:PinchState,thumbIndexMeters:number,
 engageMeters=0.025,releaseMeters=0.05):PinchState{
 if(![thumbIndexMeters,engageMeters,releaseMeters].every(Number.isFinite)||
   thumbIndexMeters<0||engageMeters<=0||releaseMeters<=engageMeters)throw new RangeError("Invalid pinch thresholds");
 return previous==="open"?(thumbIndexMeters<=engageMeters?"pinched":"open"):
   thumbIndexMeters>=releaseMeters?"open":"pinched";
}
export interface SpatialModelHandoff{
 readonly modelId:string;
 readonly variantId?:string;
 readonly destination:"app-3d-viewer";
 readonly source:"watch"|"widget"|"phone";
 readonly intent:"inspect";
}
export function validateModelHandoff(v:SpatialModelHandoff):SpatialModelHandoff{
 if(!v.modelId.trim()||v.destination!=="app-3d-viewer"||v.intent!=="inspect")throw new RangeError("Invalid spatial model handoff");
 return v;
}
