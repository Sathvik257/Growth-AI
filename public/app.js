const KEY = 'campus-relay-v1';
const channels = {
  campus: { label: 'Campus ambassadors', target: 360 },
  referral: { label: 'Student referrals', target: 120 },
  club: { label: 'Clubs / placement email', target: 40 }
};
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function report(message) { $('appStatus').textContent = message; }
function readRecords() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('Invalid saved campaign');
  const emails = new Set(), codes = new Set();
  return parsed.map(r => {
    if (!r || !['name','email','college','source','ref','code','created'].every(k => typeof r[k] === 'string') ||
        !r.name.trim() || !r.college.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim()) ||
        !Object.hasOwn(channels, r.source) || !/^[A-Z0-9]{3,20}$/.test(r.code) || typeof r.sample !== 'boolean') {
      throw new Error('Invalid saved registration');
    }
    const email = r.email.trim().toLowerCase();
    if (emails.has(email) || codes.has(r.code)) throw new Error('Duplicate saved registration');
    emails.add(email); codes.add(r.code);
    return {...r, email};
  });
}
let records = [];
try { records = readRecords(); }
catch { report('Saved data could not be read. Existing storage was left untouched. Clear this demo’s local data to start again, or enable browser storage.'); }
function refreshRecords() {
  try { records = readRecords(); return true; }
  catch { report('Cannot read saved data. No changes were made. Clear the demo data or enable browser storage.'); return false; }
}
function save(next) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { report('Browser storage is unavailable or full. No changes were saved.'); return false; }
  records = next;
  report('');
  render();
  return true;
}
function show(view) {
  for (const id of ['dashboard','register','toolkit']) $(id).hidden = id !== view;
  document.querySelectorAll('nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.view === view);
    b.setAttribute('aria-pressed', String(b.dataset.view === view));
  });
}
document.querySelectorAll('nav button').forEach(b => b.onclick = () => show(b.dataset.view));
function render() {
  const total = records.length, samples = records.filter(r => r.sample).length;
  const day = +$('day').value, target = [40,100,180,280,370,440,500][day - 1];
  $('metrics').innerHTML = [
    ['Demo registrations',total,`${samples} sample + ${total-samples} manual tests`],
    ['Target progress',Math.round(total/500*100)+'%','500 unique registrations'],
    ['Remaining',Math.max(0,500-total),'to the campaign goal'],
    ['Budget ceiling','₹2,000','Planned spend; not actual spend']
  ].map(([label,note,detail]) => `<div class="metric">${label}<strong>${note}</strong><small>${detail}</small></div>`).join('');
  $('channels').innerHTML = Object.entries(channels).map(([key,c]) => {
    const n = records.filter(r => r.source === key).length;
    return `<div class="bar-row"><div class="bar-label"><span>${c.label}</span><span>${n} / ${c.target}</span></div><div class="track"><div class="fill" style="width:${Math.min(100,n/c.target*100)}%"></div></div></div>`;
  }).join('');
  $('pace').textContent = `Day ${day} checkpoint: ${target} cumulative. Demo is ${Math.abs(total-target)} ${total<target?'behind':'ahead of'} this checkpoint.`;
  $('ledger').innerHTML = records.slice(-12).reverse().map(r => `<tr><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.college)}</td><td>${escapeHTML(channels[r.source].label)}</td><td>${escapeHTML(r.ref || 'Direct')}</td><td>${r.sample?'Sample':'Manual test'}</td></tr>`).join('') || '<tr><td colspan="5">No demo registrations yet. Try the student flow or load the sample campaign.</td></tr>';
  $('ledgerNote').textContent = `Showing latest ${Math.min(12,total)} of ${total}. Export includes all records.`;
}
$('day').onchange = render;
$('seed').onclick = () => {
  if (!refreshRecords()) return false;
  if (records.some(r => r.sample)) { report('Sample campaign already loaded. Clear demo data to restart.'); return false; }
  const samples = Array.from({length:180}, (_,i) => ({
    name:`Sample student ${i+1}`, email:`sample${i+1}@example.invalid`, college:`Demo Campus ${i%20+1}`,
    source:i<130?'campus':i<165?'referral':'club', ref:i<130?`CAMPUS${String(i%20+1).padStart(2,'0')}`:'',
    code:`S${String(i+1).padStart(5,'0')}`, sample:true, created:new Date().toISOString()
  }));
  if (samples.some(s => records.some(r => r.email===s.email || r.code===s.code))) {
    report('Sample identifiers conflict with existing test records. Export your records, then clear the demo before loading samples.'); return false;
  }
  return save([...records,...samples]);
};
function forecast() {
  const a=+$('campusRate').value, b=+$('refRate').value, n=Math.round(720*a/100+240*b/100+40);
  $('campusOut').textContent=a+'%'; $('refOut').textContent=b+'%';
  $('forecast').textContent=`${n} estimated registrations → ${n>=500?`${n-500} above`:`${500-n} below`} target. Base case is 520, leaving a 20-registration planning buffer.`;
}
$('campusRate').oninput=forecast; $('refRate').oninput=forecast;
function link(source,ref) {
  const u=new URL(location.href); u.search=''; u.hash=''; u.searchParams.set('source',source); u.searchParams.set('ref',ref); return u.href;
}
const params = new URLSearchParams(location.search);
function restoreAttribution() {
  $('source').value = Object.hasOwn(channels,params.get('source')) ? params.get('source') : 'campus';
  $('ref').value = params.get('ref') || '';
}
$('form').onsubmit = e => {
  e.preventDefault();
  if (!e.target.reportValidity()) return;
  $('success').hidden=true;
  if (!refreshRecords()) { $('status').textContent='Saved campaign could not be read. No registration was added.'; return; }
  const d=new FormData(e.target), email=String(d.get('email')||'').trim().toLowerCase();
  const name=String(d.get('name')||'').trim(), college=String(d.get('college')||'').trim();
  const ref=String(d.get('ref')||'').trim().toUpperCase(), source=d.get('source');
  let error='';
  if (!name || !college || name.length>60 || college.length>100) error='Please enter a valid name and college.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>120) error='Please enter a valid email address.';
  else if (d.get('year')!=='final') error='This campaign counts only final-year engineering students.';
  else if (!d.get('consent')) error='Please confirm that you understand this is a demo.';
  else if (!Object.hasOwn(channels,source)) error='Please choose a valid source.';
  else if (records.some(r=>r.email===email)) error='This email is already registered in this browser. No duplicate counted.';
  else if (ref && !/^[A-Z0-9]{3,20}$/.test(ref)) error='Use a referral code with 3–20 letters or digits.';
  else if (source==='referral' && (!ref || !records.some(r=>r.code===ref))) error='Student referral codes must belong to an existing registration in this browser.';
  if (error) { $('status').textContent=error; return; }
  let code;
  do { code='R'+crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase(); } while (records.some(r=>r.code===code));
  if (!save([...records,{name,email,college,source,ref,code,sample:false,created:new Date().toISOString()}])) {
    $('status').textContent='Browser storage is unavailable. Registration was not saved.'; return;
  }
  $('status').textContent='Demo registration saved successfully.';
  $('personalLink').value=link('referral',code); $('copyPersonal').textContent='Copy referral link'; $('success').hidden=false;
  e.target.reset(); restoreAttribution();
};
async function copy(value,id) {
  try { await navigator.clipboard.writeText(value); $(id).textContent='Copied'; }
  catch { $(id).textContent='Select the text and copy manually'; }
}
$('copyPersonal').onclick=()=>copy($('personalLink').value,'copyPersonal');
$('generate').onclick=()=>{
  const code=$('code').value.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,20}$/.test(code)) { $('kitStatus').textContent='Use 3–20 letters or digits.'; return; }
  $('kitStatus').textContent='Draft ready. Confirm workshop details before any real distribution.';
  $('copyInvite').textContent='Copy draft';
  $('invite').value=`Final-year engineering students: want a first AI project you can explain in an interview?\n\nProposed free workshop: Build Your First AI Project in 60 Minutes. Follow a guided AI study-planner template and personalize it. Bring a laptop and internet; no prior AI experience assumed.\n\nDate/time: to be confirmed by the host.\nTry the registration demo: ${link($('kitSource').value,code)}\n\nSIMULATION: no real seat booking. This is a browser-local prototype; no shared student database is connected. Share only in groups where the admin has agreed.`;
};
$('copyInvite').onclick=()=>copy($('invite').value,'copyInvite');
function csvCell(v) { let s=String(v??''); if (/^[=+@\-\t\r\n]/.test(s)) s="'"+s; return '"'+s.replace(/"/g,'""')+'"'; }
$('export').onclick=()=>{
  if (!refreshRecords()) return;
  render();
  const fields=['name','email','college','source','ref','code','sample','created'];
  const csv=[fields.join(','),...records.map(r=>fields.map(f=>csvCell(r[f])).join(','))].join('\r\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download='campus-relay-demo.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
$('reset').onclick=()=>$('resetConfirm').hidden=false;
$('cancelReset').onclick=()=>$('resetConfirm').hidden=true;
$('confirmReset').onclick=()=>{
  if (!save([])) return false;
  $('resetConfirm').hidden=true; $('success').hidden=true; $('personalLink').value=''; $('status').textContent='Demo records cleared.';
  return true;
};
window.addEventListener('storage', e=>{
  if (e.key===KEY || e.key===null) { if (refreshRecords()) render(); }
});
restoreAttribution();
show(Object.hasOwn(channels,params.get('source'))?'register':'dashboard');
render(); forecast(); $('generate').click();
