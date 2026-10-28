(function () {
  'use strict';
  const checkpoints = [40, 100, 180, 280, 370, 440, 500];
  function assess(input) {
    const day = Number(input.day), total = Number(input.total);
    const remaining = Math.max(0, 500 - total), days = 8 - day;
    const rates = Object.fromEntries(['campus', 'referral', 'club'].map(k => [k,
      input.visits[k] > 0 && input.visits[k] >= input.counts[k] ? input.counts[k] / input.visits[k] : null]));
    const result = {remaining, checkpoint: checkpoints[day - 1], daily: Math.ceil(remaining / days),
      extraReach: Math.ceil(remaining / (0.15 * 0.5)), rates, budgetLeft: 2000 - input.spend};
    if (total >= 500) return {...result, title: 'Audit the goal before celebrating.', action: 'Check unique eligible registrations and source attribution. Attendance is a separate downstream metric.'};
    if (input.spend >= 2000) return {...result, title: 'Budget limit reached.', action: 'Stop new spending. Use approved organic follow-ups and inspect conversion; the contingency is already included in the Rs 2,000 cap.'};
    if (day >= 3 && input.active < 12) return {...result, title: 'Fix distribution coverage first.', action: `${input.active} of 20 ambassadors are active. Contact the reserve; prioritize admins who have approved sharing and posted the invitation. Do not count a verbal yes as activation.`};
    if (Object.values(rates).some(v => v === null)) return {...result, title: 'Complete the measurement before deciding.', action: 'Enter cumulative unique visits for every channel with activity. Missing visits or visits below registrations cannot support a conversion claim.'};
    const low = Object.entries(rates).filter(([,v]) => v < 0.35).sort((a,b)=>a[1]-b[1]);
    if (low.length) return {...result, title: 'Fix the weakest conversion path.', action: `${low[0][0]} converts at ${(low[0][1]*100).toFixed(1)}%. Check project proof, date/time clarity and form friction. Test revised copy before adding more reach; rates below 35% are a diagnostic trigger, not a universal benchmark.`};
    if (day >= 6 && total < checkpoints[day-1]) return {...result, title: 'Quantify the recovery before expanding.', action: `Need ${remaining} more registrations, or ${result.daily} per day including today. At the planning rates of 15% visits and 50% conversion, that needs about ${result.extraReach.toLocaleString()} additional unique people reached. Check access with backup clubs; if unavailable, report the miss.`};
    return {...result, title: 'Keep the best invitation moving.', action: 'Use one permitted reminder and invite two suitable friends per sharer. Keep audiences incremental and preserve first successful registration attribution.'};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {assess};
  if (typeof document === 'undefined') return;
  const key = KEY + '-operations';
  let state = {active: 0, spend: 0, visits: {campus: 0, referral: 0, club: 0}, sample: false};
  try {
    const saved=JSON.parse(localStorage.getItem(key));
    if(saved && Number.isInteger(saved.active) && saved.active>=0 && saved.active<=20 &&
       Number.isFinite(saved.spend) && saved.spend>=0 && saved.spend<=2000 &&
       ['campus','referral','club'].every(k=>Number.isInteger(saved.visits?.[k])&&saved.visits[k]>=0)) state=saved;
  } catch {}
  function populate() {
    $('opsActive').value=state.active; $('opsSpend').value=state.spend;
    for(const k of ['campus','referral','club']) $('ops'+k).value=state.visits[k];
  }
  function update() {
    const counts=Object.fromEntries(['campus','referral','club'].map(k=>[k,records.filter(r=>r.source===k).length]));
    const answer=assess({day:+$('day').value,total:records.length,counts,...state});
    $('actionTitle').textContent=answer.title; $('action').textContent=answer.action;
    $('opsSummary').textContent=`${state.sample?'Sample check-in':'Manually entered check-in'} · ${state.active}/20 active ambassadors · Rs ${state.spend} spent · Rs ${answer.budgetLeft} remaining. No analytics integration is connected.`;
    $('conversionRows').innerHTML=Object.entries(answer.rates).map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${channels[k].label}</span><strong>${v===null?'Not measurable':(v*100).toFixed(1)+'%'}</strong></div><small>${counts[k]} demo registrations / ${state.visits[k]} entered unique visits</small></div>`).join('');
    $('recovery').textContent=`To reach 500: ${answer.remaining} registrations left; ${answer.daily}/day including today. Modelled extra unique reach: ${answer.extraReach.toLocaleString()} at 15% visit rate × 50% registration conversion. This is a capacity requirement, not a forecast.`;
  }
  const baseRender=render;
  render=function(){baseRender();update();};
  $('day').onchange=render;
  $('opsForm').onsubmit=e=>{
    e.preventDefault();
    const next={active:+$('opsActive').value,spend:+$('opsSpend').value,visits:{},sample:false};
    if(!Number.isInteger(next.active)||next.active<0||next.active>20||!Number.isFinite(next.spend)||next.spend<0||next.spend>2000){$('opsStatus').textContent='Use 0–20 active ambassadors and spend from Rs 0 to Rs 2,000.';return;}
    for(const k of ['campus','referral','club']) {
      const n=+$('ops'+k).value, count=records.filter(r=>r.source===k).length;
      if(!Number.isInteger(n)||n<0||n<count){$('opsStatus').textContent=`${channels[k].label}: visits must be a whole number at least as large as its ${count} registrations.`;return;}
      next.visits[k]=n;
    }
    try{localStorage.setItem(key,JSON.stringify(next));state=next;render();$('opsStatus').textContent='Campaign check-in saved. Recommendation updated.';}catch{$('opsStatus').textContent='Storage unavailable; check-in was not saved.';}
  };
  const seed=$('seed').onclick;
  $('seed').onclick=()=>{const already=records.some(r=>r.sample);seed();if(!already){state={active:12,spend:350,visits:{campus:300,referral:85,club:35},sample:true};try{localStorage.setItem(key,JSON.stringify(state));}catch{}populate();render();}};
  const reset=$('confirmReset').onclick;
  $('confirmReset').onclick=()=>{reset();state={active:0,spend:0,visits:{campus:0,referral:0,club:0},sample:false};localStorage.removeItem(key);populate();render();$('opsStatus').textContent='Campaign check-in cleared.';};
  populate();update();
})();
