import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const input = process.argv[2];
if (!input) throw new Error('Pass the path to blog-materials-index.json');
const index = JSON.parse(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));
fs.mkdirSync('content/insights', {recursive:true});
for (const item of index.items) {
  let slug = 'archive-' + crypto.createHash('sha256').update(item.id).digest('hex').slice(0,12);
  let target = path.join('content/insights', slug + '.json');
  if (fs.existsSync(target) && JSON.parse(fs.readFileSync(target,'utf8')).sourceName !== item.source_file) {
    slug += '-' + crypto.createHash('sha256').update(item.source_file).digest('hex').slice(0,6);
    target = path.join('content/insights', slug + '.json');
  }
  if (fs.existsSync(target)) continue;
  fs.writeFileSync(target, JSON.stringify({slug,title:item.title,published:false,date:item.inferred_date || '',topic:item.category,type:item.format === 'pptx' ? 'Presentation' : item.format === 'pdf' ? 'Report' : 'Article',summary:'',body:'',sourceName:item.source_file,featured:false},null,2)+'\n');
}
console.log(`Imported ${index.items.length} archive records as drafts. Source files and local paths are not published.`);
