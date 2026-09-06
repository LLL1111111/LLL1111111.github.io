import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
fs.mkdirSync('test-results',{recursive:true});
try {
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900}});
  for(const route of ['index.html','insights.html','future.html','projects.html','about.html','posts/context-engineering-full-stack.html']){
   await page.goto('http://127.0.0.1:4178/'+route,{waitUntil:'load'});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)throw new Error(`Overflow ${width} ${route}`);
   if(await page.locator('h1').count()!==1)throw new Error('Missing/duplicate heading '+route);
   if(route==='index.html'){if(!await page.locator('.cover img').evaluate(e=>e.complete&&e.naturalWidth>0))throw new Error('Cover missing');await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true})}
  }
  await page.goto('http://127.0.0.1:4178/insights.html');
  await page.locator('#search').fill('unmatched-query');
  if(!await page.locator('#empty').isVisible())throw new Error('Empty state failed');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.entry:not([hidden])').length===1);
  await page.locator('#year').selectOption('2025');
  await page.reload();
  if(await page.locator('#year').inputValue()!=='2025')throw new Error('Filter URL persistence failed');
  await page.goto('http://127.0.0.1:4178/blog.html');
  await page.waitForURL('**/insights.html');
  await page.close();
 }
 console.log('Desktop, 390px and 320px mobile: all routes fit; cover renders; search, reset, URL state and redirects pass.');
} finally {await browser.close()}
