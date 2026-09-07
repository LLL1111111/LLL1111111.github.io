import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'));
let checked=0;
for(const file of files){
 const html=fs.readFileSync('dist/'+file,'utf8'),$=load(html);
 if(/C:\\Users|absolute_path|source_root|\[Add /.test(html))throw new Error('Private path or placeholder in '+file);
 for(const el of $('a[href],img[src],iframe[src],script[src],link[href]').toArray()){
  const url=$(el).attr('href')||$(el).attr('src');
  if(!url||/^(https?:|mailto:|data:)/.test(url))continue;
  const [encodedPath,hash]=url.split('#');
  const pathname=decodeURIComponent(encodedPath);
  const target=pathname.startsWith('/')?path.join('dist',pathname):path.join('dist',path.dirname(file),pathname.split('?')[0]||path.basename(file));
  if(!fs.existsSync(target))throw new Error(`${file}: missing ${url}`);
  if(hash&&target.endsWith('.html')){const dest=load(fs.readFileSync(target,'utf8'));if(!dest('[id]').toArray().some(e=>dest(e).attr('id')===hash))throw new Error(`${file}: missing anchor ${url}`)}
  checked++;
 }
}
if(fs.existsSync('dist/content'))throw new Error('Draft source leaked into public output');
console.log(`Validated ${files.length} HTML pages and ${checked} local references. Draft sources excluded.`);
