import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const base='http://127.0.0.1:4173';
const output='artifacts/web-studio';
await mkdir(output,{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4173'],{stdio:'inherit'});
let browser;
const errors=[];
const submissions=[];
try {
  let ready=false;
  for(let i=0;i<60;i++){
    try{const r=await fetch(base);if(r.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  assert.ok(ready,'Preview server must start');
  browser=await chromium.launch();
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  // Suppress the pre-existing automatic chat popup during focused, deterministic UI tests.
  await context.addInitScript(()=>localStorage.setItem('jsinnovia-elynea-welcomed-at',String(Date.now())));
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==base)return route.abort();
    if(url.pathname.startsWith('/api/')){
      if(url.pathname.endsWith('/analyzeSEO'))return route.fulfill({json:{verified:true,source:'live_server_measurement',final_url:'https://example.com/',measured_at:'2026-09-29T00:00:00Z',measurements:{status:200,title:'Restaurant des Jardins',meta_description:'Notre cuisine de saison, menu et service traiteur.',h1:['La maison']}}});
      if(url.pathname.endsWith('/submitElyneaRequest')){
        submissions.push(route.request().postDataJSON());
        return route.fulfill({json:submissions.length===1?{transmitted:true,verified:false}:{transmitted:true,verified:true,request_id:'browser-test-request',journal_id:'browser-test-journal'}});
      }
      return route.fulfill({json:{data:[]}});
    }
    return route.continue();
  });
  await page.goto(`${base}/web-studio`);
  await page.locator('#ws-collection .ws-card').first().waitFor();
  assert.equal(await page.locator('#ws-collection .ws-card').count(),18);
  assert.equal(await page.evaluate(()=>localStorage.getItem('jsinnovia:visitor-choices:v1')),null);
  await page.getByLabel('Nom de votre entreprise',{exact:true}).fill('Maison <script>danger</script>');
  await page.waitForFunction(()=>document.querySelector('.ws-demo-nav strong')?.textContent.includes('<script>'));
  assert.equal(await page.locator('.ws-demo script').count(),0);
  await page.getByLabel('Nom de votre entreprise',{exact:true}).fill('Maison des idées');
  await page.getByLabel('Votre activité',{exact:true}).selectOption('immobilier');
  await page.waitForFunction(()=>document.querySelector('.ws-recommendations .ws-card-info h3')?.textContent.includes('Zenith'));
  await page.getByText('Aidez-moi à trouver ma direction',{exact:true}).click();
  await page.getByLabel('Adresse de votre site public',{exact:true}).fill('example.com');
  await page.getByRole('button',{name:'Analyser ce site',exact:true}).click();
  await page.getByRole('button',{name:'Utiliser cette activité',exact:true}).waitFor();
  assert.equal(await page.getByLabel('Votre activité',{exact:true}).inputValue(),'immobilier');
  await page.getByRole('button',{name:'Utiliser cette activité',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.ws-recommendations .ws-card-info h3')?.textContent.includes('Aura'));
  await page.getByRole('button',{name:'Voir la démo Aura',exact:true}).first().click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Téléphone',exact:true}).click();
  assert.equal(await page.locator('.ws-device-frame').getAttribute('data-device'),'mobile');
  await page.locator('.ws-dialog .ws-demo-tabs button').nth(2).click();
  await page.getByRole('button',{name:'Tester le parcours',exact:true}).click();
  await page.getByText('Test terminé : rien n’a été envoyé.',{exact:true}).waitFor();
  assert.equal(submissions.length,0);
  await page.screenshot({path:`${output}/demo-mobile.png`});
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Choisir le style Aura',exact:true}).first().click();
  await page.locator('input[type=color]').fill('#224466');
  await page.getByLabel(/Mémoriser mes choix sur cet appareil/).check();
  const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('jsinnovia:visitor-choices:v1')));
  assert.equal(record.consent,true);
  assert.equal(record.choices.model,'aura');
  assert.ok(!JSON.stringify(record).includes('Maison'));
  assert.ok(!JSON.stringify(record).includes('example.com'));
  await page.getByRole('button',{name:'Préparer ma demande',exact:false}).click();
  await page.getByLabel('Votre nom',{exact:true}).fill('Test navigateur');
  await page.getByLabel('Votre e-mail',{exact:true}).fill('test@example.invalid');
  await page.locator('.ws-request-form input[type=checkbox]').check();
  await page.getByRole('button',{name:'Envoyer ma demande à JS-Innov.IA',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Aucune confirmation vérifiée'}).waitFor();
  assert.equal(await page.locator('.ws-confirmed').count(),0);
  await page.getByRole('button',{name:'Envoyer ma demande à JS-Innov.IA',exact:true}).click();
  await page.getByText('browser-test-request',{exact:true}).waitFor();
  assert.equal(submissions.length,2);
  assert.equal(submissions[0].idempotency_key,submissions[1].idempotency_key);
  assert.ok(submissions[1].messages[0].content.includes('Aura'));
  assert.equal(submissions[1].consent,true);
  await page.reload();
  await page.getByLabel('Nom de votre entreprise',{exact:true}).waitFor();
  assert.equal(await page.getByLabel('Nom de votre entreprise',{exact:true}).inputValue(),'');
  assert.equal(await page.getByLabel('Votre activité',{exact:true}).inputValue(),'horeca');
  await page.getByRole('button',{name:'Réinitialiser mes choix',exact:true}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('jsinnovia:visitor-choices:v1')),null);
  await page.screenshot({path:`${output}/web-studio-desktop.png`,fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:`${output}/web-studio-mobile.png`,fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page must not overflow horizontally');
  await page.goto(`${base}/?objectif=automate`);
  await page.getByRole('heading',{level:1,name:'Moins de tâches. Plus de temps pour votre métier.',exact:true}).waitFor();
  await page.getByRole('button',{name:/^Créer mon site/}).click();
  await page.getByRole('heading',{level:1,name:'Votre prochain site. Déjà un peu le vôtre.',exact:true}).waitFor();
  await page.screenshot({path:`${output}/home-mobile.png`});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile home must not overflow horizontally');
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:`${output}/home-desktop.png`});
  await page.goto(`${base}/web-studio.html`);
  await page.waitForURL(`${base}/web-studio`);
  await page.getByRole('heading',{level:1,name:/Ne choisissez pas un site/}).waitFor();
  assert.deepEqual(errors,[],'No JavaScript runtime errors');
  await writeFile(`${output}/results.json`,JSON.stringify({success:true,checks:['18 models','manual priority','conservative analysis','escaped input','interactive demo','responsive modal','explicit persistence','no PII persisted','verified handoff','idempotent retry','reset','adaptive home','mobile overflow','legacy route'],mockedSubmissions:submissions.length,liveSubmissions:0,errors},null,2));
  console.log('Web Studio browser checks passed. All network submissions were mocked.');
}catch(error){
  await writeFile(`${output}/failure.json`,JSON.stringify({error:error.stack,errors,mockedSubmissions:submissions.length,liveSubmissions:0},null,2));
  throw error;
}finally{
  await browser?.close();
  server.kill('SIGTERM');
}
