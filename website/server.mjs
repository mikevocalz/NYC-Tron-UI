import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const dist=join(dirname(fileURLToPath(import.meta.url)),'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.tsx':'text/plain; charset=utf-8'};
const port=Number(process.env.PORT??4173);
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Invalid URL');return;}let file=resolve(dist,'.'+name);if(file!==dist&&!file.startsWith(dist+sep)){res.writeHead(403);res.end('Forbidden');return;}if(existsSync(file)&&statSync(file).isDirectory())file=join(file,'index.html');if(!existsSync(file)){res.writeHead(404);res.end('Page not found');return;}res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(readFileSync(file));}).listen(port,'127.0.0.1',()=>console.log(`Docs server ready on http://127.0.0.1:${port}`));
