import {assertRgba,type RgbaColor} from "../color.ts";
/** One stable, normalized mesh control point consumed by GradientMeshEditor. */
export interface MeshPoint {readonly id:string;readonly x:number;readonly y:number;readonly color:RgbaColor}
/** Row-major bilinear color mesh. The host owns actual surface rendering. */
export interface GradientMesh {readonly rows:number;readonly columns:number;readonly points:readonly MeshPoint[]}
const cross=(a:MeshPoint,b:MeshPoint,c:MeshPoint)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
/** Rejects folded/singular cells by checking all four bilinear corner Jacobians. */
export function validateMesh(mesh:GradientMesh):void{
 if(![mesh.rows,mesh.columns].every(n=>Number.isInteger(n)&&n>=2&&n<=16)||mesh.points.length!==mesh.rows*mesh.columns)throw new RangeError('Mesh requires a 2..16 by 2..16 row-major grid');
 const ids=new Set<string>();for(const p of mesh.points){if(!p.id||ids.has(p.id))throw new TypeError('Mesh point IDs must be distinct');ids.add(p.id);if(![p.x,p.y].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw new RangeError('Mesh coordinates must be 0..1');assertRgba(p.color);}
 for(let row=0;row<mesh.rows-1;row++)for(let column=0;column<mesh.columns-1;column++){
  const a=mesh.points[row*mesh.columns+column]!,b=mesh.points[row*mesh.columns+column+1]!,c=mesh.points[(row+1)*mesh.columns+column]!,d=mesh.points[(row+1)*mesh.columns+column+1]!;
  if(Math.min(cross(a,b,c),cross(b,d,a),cross(c,a,d),cross(d,c,b))<=1e-8)throw new RangeError('Mesh movement would fold or collapse a cell');
 }
}
/** Immutable edit; invalid topology leaves the original document unchanged. */
export function editMeshPoint(mesh:GradientMesh,id:string,change:Partial<Pick<MeshPoint,'x'|'y'|'color'>>):GradientMesh{
 validateMesh(mesh);if(!mesh.points.some(p=>p.id===id))throw new TypeError('Unknown mesh point');
 const next={...mesh,points:mesh.points.map(p=>p.id===id?{...p,...change}:p)};validateMesh(next);return next;
}
