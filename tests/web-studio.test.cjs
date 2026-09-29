const { test }=require('node:test');
const assert=require('node:assert/strict');
const core=()=>import('../src/lib/webStudio.mjs');
const store=()=>import('../src/lib/visitorExperienceStore.mjs');
const memoryStorage=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),data};};
test('18 distinct original concepts, all sectors and valid themes',async()=>{
 const {MODELS,SECTORS,contrastInk}=await core();assert.equal(MODELS.length,18);assert.equal(new Set(MODELS.map(m=>m.id)).size,18);
 for(const m of MODELS){assert.ok(SECTORS.some(s=>s.id===m.sector));assert.equal(m.sections.length,3);assert.match(m.accent,/^#[0-9a-f]{6}$/i);assert.ok(['#000000','#FFFFFF'].includes(contrastInk(m.accent)));}
 assert.equal(new Set(MODELS.map(m=>m.layout)).size,6);
});
test('declared activity wins and recommendation explains itself',async()=>{
 const {rankModels}=await core();const ranked=rankModels({sector:'horeca',inferredSector:'immobilier'});assert.equal(ranked[0].sector,'horeca');assert.ok(ranked[0].reasons.some(r=>r.includes('Activité choisie')));
});
test('unknown visitor is not identified, weak and tied evidence abstain',async()=>{
 const {inferSector}=await core();assert.equal(inferSector('Bonjour, bienvenue sur mon site'),null);assert.equal(inferSector('Une entreprise'),null);assert.equal(inferSector('restaurant menu photographe portfolio'),null);
 assert.equal(inferSector('Restaurant et cuisine du chef, notre menu').sector,'horeca');
});
test('reliable sector clues and accents are interpreted as suggestions',async()=>{
 const {inferSector}=await core();const found=inferSector('Restaurant traiteur cuisine menu');assert.equal(found.sector,'horeca');assert.equal(found.status,'suggestion');assert.ok(found.evidence.length>=2);
 assert.equal(inferSector('Institut de beauté esthétique coiffure').sector,'beaute');
});
test('only live successful audit metadata can drive suggestions',async()=>{
 const {profileFromAudit}=await core();assert.throws(()=>profileFromAudit({verified:false}));assert.throws(()=>profileFromAudit({verified:true,source:'invented'}));assert.throws(()=>profileFromAudit({verified:true,source:'live_server_measurement',measurements:{status:403}}));
 const report=profileFromAudit({verified:true,source:'live_server_measurement',measurements:{status:200,title:'Restaurant',meta_description:'Notre cuisine, notre menu',h1:['La maison']},final_url:'https://example.com'});assert.equal(report.detected.sector,'horeca');
});
test('manual correction overrides classification; selected style remains intentional',async()=>{
 const {rankModels}=await core();assert.equal(rankModels({sector:'commerce',inferredSector:'horeca'})[0].sector,'commerce');assert.equal(rankModels({sector:'commerce',model:'nova'})[0].id,'nova');
});
test('no unsafe or credentialed URLs enter the audit request',async()=>{
 const {publicWebsite}=await core();for(const url of ['javascript:alert(1)','file:///etc/passwd','http://localhost','http://127.0.0.1','http://[::1]','https://a.local','https://user:pw@example.com','https://example.com:8787'])assert.throws(()=>publicWebsite(url));
 assert.equal(publicWebsite('example.com/#secret'),'https://example.com/');
});
test('untrusted campaign and profile data are allowlisted and bounded',async()=>{
 const {campaignProfile,normalizeProfile}=await core();const p=campaignProfile('?secteur=politique&objectif=javascript:foo&modele=nova&email=private@example.com');assert.equal(p.sector,'');assert.equal(p.goal,'');assert.equal(p.model,'nova');assert.ok(!('email' in p));
 const v=normalizeProfile({company:'x'.repeat(1000),accent:'red;url(evil)',previewed:['evil','nova'],evidence:['a'.repeat(100)]});assert.equal(v.company.length,80);assert.equal(v.accent,'');assert.deepEqual(v.previewed,['nova']);assert.equal(v.evidence[0].length,40);
});
test('preferences are persisted only after explicit opt-in, without identifying fields',async()=>{
 const {persistChoices,loadChoices,CHOICES_KEY}=await store();const storage=memoryStorage();persistChoices(storage,{remember:false},1000);assert.equal(storage.data.size,0);
 persistChoices(storage,{remember:true,sector:'horeca',company:'PRIVATE NAME',website:'https://private.example',activity:'PRIVATE',previewed:['nova'],evidence:['PRIVATE']},1000);
 const raw=storage.getItem(CHOICES_KEY);assert.ok(!raw.includes('PRIVATE'));assert.ok(!raw.includes('website'));assert.ok(!raw.includes('previewed'));assert.equal(loadChoices(storage,1001).sector,'horeca');assert.equal(loadChoices(storage,1001).company,'');
});
test('expired, malformed and revoked preferences do not identify a visitor',async()=>{
 const {persistChoices,loadChoices,CHOICES_KEY,CHOICES_TTL}=await store();const storage=memoryStorage();storage.setItem(CHOICES_KEY,'broken');assert.equal(loadChoices(storage),null);persistChoices(storage,{remember:true,sector:'commerce'},1000);assert.equal(loadChoices(storage,1000+CHOICES_TTL+1),null);assert.equal(storage.data.size,0);
 persistChoices(storage,{remember:true},1000);persistChoices(storage,{remember:false},1001);assert.equal(storage.data.size,0);
});
test('blocked browser storage is handled without crashing',async()=>{
 const {persistChoices,loadChoices}=await store();const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};assert.equal(loadChoices(blocked),null);assert.equal(persistChoices(blocked,{remember:true}),false);
});
test('brief discloses provisional activity and never constitutes an order',async()=>{
 const {buildBrief}=await core();const text=buildBrief({company:'Exemple',model:'aura',inferredSector:'horeca'});assert.match(text,/à confirmer/);assert.match(text,/Aura/);assert.match(text,/Aucune commande/);
});

test('a submission never succeeds without both verified Cockpit references',async()=>{
 const {verifiedTransmission}=await core();
 for(const value of [{},{success:true},{transmitted:true,verified:true},{transmitted:true,verified:true,request_id:'r'}])assert.throws(()=>verifiedTransmission(value));
 assert.deepEqual(verifiedTransmission({transmitted:true,verified:true,request_id:'r',journal_id:'j'}),{request_id:'r',journal_id:'j'});
});

test('missing HTTP status and empty proof identifiers are rejected',async()=>{
 const {profileFromAudit,verifiedTransmission}=await core();
 assert.throws(()=>profileFromAudit({verified:true,source:'live_server_measurement',measurements:{title:'Restaurant traiteur'}}));
 assert.throws(()=>verifiedTransmission({transmitted:true,verified:true,request_id:'   ',journal_id:'j'}));
});

test('controlled text inputs preserve spaces between keystrokes', async () => {
  const {normalizeProfile}=await import('../src/lib/webStudio.mjs');
  let p=normalizeProfile({company:'Maison '});
  assert.equal(p.company,'Maison ');
  p=normalizeProfile({...p,company:p.company+'du pain'});
  assert.equal(p.company,'Maison du pain');
  assert.equal(normalizeProfile({activity:'Restaurant '}).activity,'Restaurant ');
});
