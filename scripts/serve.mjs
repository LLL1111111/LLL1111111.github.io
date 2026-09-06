import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.pdf':'application/pdf','.xml':'application/xml'};
http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(root+path.sep)&&p!==root){res.writeHead(403);res.end();return}const file=p===root||fs.existsSync(p)&&fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)}).listen(4178,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4178'));
