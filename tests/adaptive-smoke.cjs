const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path');const p=path.join(__dirname,'..','web','app.js');let src=fs.readFileSync(p,'utf8');src=src.slice(0,src.indexOf("$('#brand').onclick="));
const memory={};const ctx={window:{MTG_CONFIG:{}},localStorage:{getItem(k){return memory[k]||null},setItem(k,v){memory[k]=v}},console,URL,Date,Math,JSON,Blob,setTimeout,clearTimeout,crypto:require('crypto').webcrypto,document:{querySelector(){return null},querySelectorAll(){return []}}};vm.createContext(ctx);vm.runInContext(src,ctx);
const t=c=>vm.runInContext(c,ctx);
t(`S.buyerProfile={completed:true,location:'Milano',budget:350000,purpose:'primary',weights:makeWeights(),customCriteria:[]};const sample=emptyHome({name:'Trilocale',area:'Milano',text:'Trilocale Milano, 90 mq prezzo 310000 euro, terzo piano, classe D, ristrutturato'});S.homes.push(sample);sample.analysis=demoAnalyze(sample);`);
for(const [name,code] of [['overview','overviewTab(sample)'],['questions','questionsTab(sample)'],['dossier','dossierOffer(sample)'],['experts','expertsTab(sample)'],['decision','decisionTab(sample)'],['compare','comparePage()']]){const html=t(code);assert(html.length>200); console.log('PASS render',name,html.length)}
let count=t('currentBatch(sample).length');assert(count===4,`initial count ${count}`);assert(t('remainingQuestions(sample).length')>0);console.log('PASS initial batch',count);
t(`sample.questionStates[currentBatch(sample)[0].key]={answer:'Non lo so',closed:true};`);
assert(t('allowedDossier(sample)')===true);console.log('PASS dossier available after one answer');
let before=t('sample.analysis.gaps.length');t(`markFollowUps(sample,currentBatch(sample)[0].key,[{category:'urban',check_id:'urban_renovation_document',phase:'any',title:'Hai ricevuto la documentazione delle modifiche edilizie?',severity:'high',reason:'Nell’annuncio sono presenti lavori',action:'Richiedi pratica edilizia',source:'Risposta buyer'}]);`);assert(t('sample.analysis.gaps.length')===before+1);assert(t('currentBatch(sample).some(x=>x.check_id==="urban_renovation_document")'));console.log('PASS follow-up appears');
t('const originalRender=render; render=()=>{}; expandBatch(sample)');assert(t('currentBatch(sample).length')>=7);console.log('PASS expand batch',t('currentBatch(sample).length'));
t(`sample.visitStatus='visited';`);assert(t('currentBatch(sample).some(x=>x.phase==="after_visit")'));console.log('PASS visit adds visit-specific questions');
console.log('ALL TESTS OK');
