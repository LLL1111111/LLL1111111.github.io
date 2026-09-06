const filters=document.querySelector('.filters');
if(filters){
 const controls=['search','year','topic','type'].map(id=>document.getElementById(id));
 let view='all';
 const params=new URLSearchParams(location.search);
 controls.forEach(c=>{if(params.has(c.id)) c.value=params.get(c.id)});
 function update(){
  let count=0;const [search,year,topic,type]=controls.map(c=>c.value);
  document.querySelectorAll('.entry').forEach(e=>{const visible=(!year||e.dataset.year===year)&&(!topic||e.dataset.topic===topic)&&(!type||e.dataset.type===type)&&(view!=='featured'||e.dataset.featured==='true')&&e.textContent.toLowerCase().includes(search.toLowerCase());e.hidden=!visible;if(visible)count++});
  document.getElementById('empty').hidden=count>0;document.getElementById('result-count').textContent=`${count} publication${count===1?'':'s'}`;
  document.querySelectorAll('.timeline button').forEach(b=>{b.classList.toggle('active',b.dataset.year===year);b.setAttribute('aria-pressed',b.dataset.year===year)});
  const next=new URLSearchParams();controls.forEach(c=>{if(c.value)next.set(c.id,c.value)});history.replaceState(null,'',location.pathname+(next.size?'?'+next:'')+location.hash);
 }
 filters.addEventListener('submit',e=>e.preventDefault());controls.forEach(c=>c.addEventListener('input',update));
 filters.addEventListener('reset',()=>{setTimeout(()=>{view='all';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===view));update()},0)});
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(t=>t.setAttribute('aria-pressed',t===b));update()}));
 document.querySelectorAll('.timeline button').forEach(b=>b.addEventListener('click',()=>{controls[1].value=b.dataset.year;update()}));
 const timeline=document.querySelector('.timeline');let start=null,moved=false;
 timeline.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;start={x:e.clientX,scroll:timeline.scrollLeft};moved=false});
 window.addEventListener('pointermove',e=>{if(!start)return;const delta=e.clientX-start.x;if(Math.abs(delta)>5)moved=true;if(moved)timeline.scrollLeft=start.scroll-delta});
 window.addEventListener('pointerup',()=>{start=null});timeline.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
 update();
}
const feed=document.getElementById('x-feed');
if(feed){
 const fallback=()=>{document.getElementById('x-status')?.remove();document.getElementById('x-fallback').hidden=false};
 const timer=setTimeout(fallback,15000),script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;script.onerror=fallback;
 script.onload=()=>{if(!window.twttr?.widgets){fallback();return}window.twttr.widgets.createTimeline({sourceType:'profile',screenName:'donaldlai3000'},feed,{height:760,dnt:true,chrome:'noheader nofooter',theme:'light'}).then(result=>{clearTimeout(timer);if(result){document.getElementById('x-status')?.remove();document.getElementById('x-fallback').hidden=true}else fallback()}).catch(fallback)};document.head.append(script);
}
