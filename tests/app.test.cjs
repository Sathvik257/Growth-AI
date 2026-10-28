const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const KEY='campus-relay-v1';
function boot(initial,query='') {
  const values=new Map(initial===undefined?[]:[[KEY,initial]]), nodes=new Map(), control={fail:false};
  function node(id) {
    if(!nodes.has(id)) nodes.set(id,{value:({day:'3',campusRate:'50',refRate:'50',code:'CAMPUS01',kitSource:'campus'})[id]||'',textContent:'',innerHTML:'',hidden:false,click(){return this.onclick?.();},setAttribute(){},classList:{toggle(){}}});
    return nodes.get(id);
  }
  const storage={getItem:k=>values.get(k)??null,setItem(k,v){if(control.fail)throw Error('Storage unavailable');values.set(k,v);},removeItem(k){if(control.fail)throw Error('Storage unavailable');values.delete(k);}};
  const ctx=vm.createContext({document:{getElementById:node,querySelectorAll:()=>[],createElement:()=>({click(){}})},window:{addEventListener(){}},localStorage:storage,location:{href:'https://example.test/'+query,search:query},URL,URLSearchParams,crypto:require('node:crypto').webcrypto,Blob,setTimeout,navigator:{clipboard:{writeText:async()=>{}}},FormData:class{constructor(f){this.data=f.data;}get(k){return this.data[k]??null;}}});
  for(const file of ['app.js','operations.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../public',file),'utf8'),ctx);
  const records=()=>JSON.parse(vm.runInContext('JSON.stringify(records)',ctx));
  function submit(overrides={}) {node('form').onsubmit({preventDefault(){},target:{data:{name:'Demo Student',email:'demo@example.invalid',college:'Demo College',year:'final',source:'campus',ref:'',consent:'on',...overrides},reportValidity:()=>true,reset(){}}});}
  return {node,records,submit,values,control,storage,ctx};
}
test('invalid saved data is preserved and does not crash the app',()=>{
  for(const raw of ['[null]','{}','not json']){const a=boot(raw);assert.match(a.node('appStatus').textContent,/could not be read/);a.submit();assert.equal(a.values.get(KEY),raw);assert.equal(a.records().length,0);}
});
test('failed registration and sample writes leave no phantom records',()=>{
  const a=boot();a.control.fail=true;a.submit();assert.equal(a.records().length,0);assert.match(a.node('status').textContent,/not saved/);a.node('seed').click();assert.equal(a.records().length,0);assert.equal(a.values.has(KEY+'-operations'),false);
});
test('email normalization, duplicate rejection, eligibility and consent',()=>{
  const a=boot();a.submit({email:'  DEMO@example.invalid  '});assert.equal(a.records()[0].email,'demo@example.invalid');a.submit();assert.match(a.node('status').textContent,/already registered/);a.submit({email:'other@example.invalid',year:'other'});a.submit({email:'other@example.invalid',consent:null});assert.equal(a.records().length,1);
});
test('referrals validate existing codes and retain incoming attribution',()=>{
  const a=boot();a.submit();const code=a.records()[0].code;
  const b=boot(a.values.get(KEY),'?source=referral&ref='+code);b.submit({email:'friend@example.invalid',source:'referral',ref:code});assert.equal(b.records()[1].ref,code);assert.equal(b.records()[1].source,'referral');assert.equal(b.node('source').value,'referral');assert.equal(b.node('ref').value,code);b.submit({email:'unknown@example.invalid',source:'referral',ref:'UNKNOWN'});assert.equal(b.records().length,2);
});
test('failed reset preserves data; successful reset clears records and check-in',()=>{
  const a=boot();a.node('seed').click();assert.equal(a.records().length,180);const saved=a.values.get(KEY+'-operations');a.control.fail=true;a.node('confirmReset').click();assert.equal(a.records().length,180);assert.equal(a.values.get(KEY+'-operations'),saved);a.control.fail=false;a.node('confirmReset').click();assert.equal(a.records().length,0);assert.equal(a.values.has(KEY+'-operations'),false);
});
test('registration rereads persisted changes from another tab',()=>{
  const a=boot();a.submit();const b=boot(a.values.get(KEY));b.submit({email:'second@example.invalid'});a.storage.setItem(KEY,b.values.get(KEY));a.submit({email:'third@example.invalid'});assert.equal(a.records().length,3);
});
test('user content is escaped and CSV formula characters are protected',()=>{
  const a=boot();a.submit({name:'<script>alert(1)</script>'});assert.ok(a.node('ledger').innerHTML.includes('&lt;script&gt;'));assert.equal(vm.runInContext('csvCell("=1+1")',a.ctx),'"\'=1+1"');assert.equal(vm.runInContext('csvCell(\'a"b\')',a.ctx),'"a""b"');assert.equal(vm.runInContext('csvCell("\\n=1")',a.ctx),'"\'\n=1"');
});
