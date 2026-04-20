// ==========================================
// GAME DATA & CONFIGURATION
// ==========================================
const CHARS = [
  {id:'cio',name:'Dr. วิชัย',title:'Chief Information Officer',avatar:'👔', bonus:'EDM',bonusDesc:'EDM +2 ทุกครั้งที่อัป',ability:'Executive Override',abilityDesc:'เพิ่ม Trust +15 (ใช้ได้ 1 ครั้ง)',passive:'Trust เริ่มที่ 60',startBonus:{trust:10},abilityUsed:false},
  {id:'risk',name:'นางสาว สุภา',title:'Risk Manager',avatar:'🛡️', bonus:'APO',bonusDesc:'APO +2 ทุกครั้งที่อัป',ability:'Crisis Shield',abilityDesc:'เพิ่ม Risk +25 (ใช้ได้ 1 ครั้ง)',passive:'Risk เริ่มที่ 65',startBonus:{risk:15},abilityUsed:false},
  {id:'dev',name:'นาย ธนกร',title:'Lead Developer',avatar:'💻', bonus:'BAI',bonusDesc:'BAI +2 ทุกครั้งที่อัป',ability:'Rapid Deploy',abilityDesc:'ลดผลเสีย Budget (Passive)',passive:'Budget เริ่มที่ 120',startBonus:{budget:20},abilityUsed:false},
  {id:'auditor',name:'นาง มาลี',title:'Internal Auditor',avatar:'📋', bonus:'MEA',bonusDesc:'MEA +2 ทุกครั้งที่อัป',ability:'Emergency Fund',abilityDesc:'เพิ่ม Budget 20 (ใช้ได้ 1 ครั้ง)',passive:'Maturity เริ่มที่ Lv.2',startBonus:{maturity:1},abilityUsed:false}
];

const DOMAINS_DEF = [
  {id:'EDM',name:'EDM',icon:'🏛️',color:'#D4AF37'}, {id:'APO',name:'APO',icon:'📐',color:'#9b87f5'},
  {id:'BAI',name:'BAI',icon:'🔧',color:'#2dd4bf'}, {id:'DSS',name:'DSS',icon:'⚙️',color:'#fbbf24'},
  {id:'MEA',name:'MEA',icon:'📊',color:'#f87171'}
];

const ITEMS = [
  {id:'budget_pack',name:'💰 กองทุนด่วน',desc:'Budget +20',uses:1,effect:{budget:20}},
  {id:'trust_boost',name:'🤝 PR Event',desc:'Trust +15',uses:1,effect:{trust:15}},
  {id:'risk_barrier',name:'🛡️ Firewall',desc:'Risk Buffer +20',uses:1,effect:{risk:20}},
  {id:'mat_boost',name:'✨ Upgrade',desc:'Maturity +1 ทุกโดเมน',uses:1,effect:{maturity:{EDM:1,APO:1,BAI:1,DSS:1,MEA:1}}}
];

// เพิ่มเหตุการณ์ให้หลากหลาย ป้องกันการสุ่มซ้ำ
const EVENTS = {
  risk: [
    {title:'ระบบ ERP ขัดข้อง',desc:'ระบบหลักล่ม กระทบ 40 แผนก',domain:'DSS', choices:[{text:'เปิด War Room (+DSS)',effect:{budget:-10,risk:-15,maturity:{DSS:1}},label:'แก้ไขถูกจุด'},{text:'แก้เงียบๆ',effect:{trust:-15,risk:-10},label:'เสียความเชื่อมั่น'}]},
    {title:'Data Breach!',desc:'ข้อมูลลูกค้ารั่วไหล',domain:'DSS', choices:[{text:'แจ้ง Regulator (+MEA)',effect:{trust:-5,budget:-20,risk:-20,maturity:{MEA:1}},label:'โปร่งใส'},{text:'ปิดข่าวเงียบๆ',effect:{trust:-25,budget:-10,risk:-10},label:'เสี่ยงโดนปรับหนัก'}]},
    {title:'Ransomware Attack',desc:'โดนเจาะระบบเข้ารหัสไฟล์',domain:'APO', choices:[{text:'ใช้แผน DRP กู้ข้อมูล (+APO)',effect:{budget:-25,risk:-20,maturity:{APO:1}},label:'ปลอดภัย'},{text:'ยอมจ่ายค่าไถ่',effect:{trust:-20,budget:-40,risk:-10},label:'อันตรายและแพง'}]},
    {title:'Shadow IT พุ่งสูง',desc:'พนักงานแอบใช้แอปเถื่อน',domain:'APO', choices:[{text:'วาง Policy ใหม่ (+APO)',effect:{budget:-10,risk:-10,maturity:{APO:1}},label:'บริหารจัดการดี'},{text:'ไล่บล็อกทีละแอป',effect:{trust:-10,budget:-5,risk:-5},label:'แก้ปัญหาปลายเหตุ'}]}
  ],
  opp: [
    {title:'Cloud Migration',desc:'เสนอส่วนลด 30% สำหรับ Cloud',domain:'BAI', choices:[{text:'ทำ ROI ก่อนย้าย (+BAI)',effect:{trust:+5,budget:+5,risk:+5,maturity:{BAI:1}},label:'รอบคอบ'},{text:'อนุมัติย้ายทันที',effect:{trust:-5,budget:+15,risk:-15},label:'เสี่ยงล่ม'}]},
    {title:'COBIT Training',desc:'พนักงานขออบรม COBIT',domain:'EDM', choices:[{text:'จัดอบรมทั้งองค์กร (+EDM)',effect:{trust:+10,budget:-15,risk:+10,maturity:{EDM:1}},label:'คุ้มค่าระยะยาว'},{text:'ให้ไปหาอ่านเอง',effect:{budget:0,risk:-5},label:'ประหยัดงบ'}]},
    {title:'AI Integration',desc:'นำ AI มาใช้วิเคราะห์ข้อมูล',domain:'BAI', choices:[{text:'ตั้งทีมกำกับดูแล AI (+BAI)',effect:{trust:+10,budget:-20,risk:+5,maturity:{BAI:1}},label:'รัดกุม'},{text:'รีบปล่อยใช้งาน',effect:{trust:-5,budget:-5,risk:-20},label:'เสี่ยงผิดพลาด'}]},
    {title:'Audit Review',desc:'จ้างผู้ตรวจสอบภายนอกมาประเมิน',domain:'MEA', choices:[{text:'ยินยอมให้ตรวจเต็มรูปแบบ (+MEA)',effect:{trust:+15,budget:-15,risk:+10,maturity:{MEA:1}},label:'ยกระดับองค์กร'},{text:'ปฏิเสธการตรวจ',effect:{trust:-10,budget:0,risk:-10},label:'ปกปิดปัญหา'}]}
  ]
};

const BOARD_TRACK = [
  {type:'start', icon:'🏁'},
  {type:'safe', icon:'🛡️'}, {type:'risk', icon:'⚠️'}, {type:'opp', icon:'💡'}, {type:'safe', icon:'🛡️'},
  {type:'bonus', icon:'🎁'}, {type:'risk', icon:'⚠️'}, {type:'safe', icon:'🛡️'}, {type:'opp', icon:'💡'},
  {type:'safe', icon:'🛡️'}, {type:'risk', icon:'⚠️'}, {type:'bonus', icon:'🎁'}, {type:'opp', icon:'💡'},
  {type:'risk', icon:'⚠️'}, {type:'safe', icon:'🛡️'}, {type:'opp', icon:'💡'}, {type:'risk', icon:'⚠️'},
  {type:'safe', icon:'🛡️'}, {type:'bonus', icon:'🎁'}, {type:'opp', icon:'💡'}, {type:'risk', icon:'⚠️'},
  {type:'safe', icon:'🛡️'}, {type:'opp', icon:'💡'}, {type:'boss', icon:'👹'}
];

// ==========================================
// GAME STATE
// ==========================================
let G = {};
const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

function initGame(charId){
  const ch = CHARS.find(c=>c.id===charId);
  G = {
    turn: 1, position: 0, maxPos: BOARD_TRACK.length - 1,
    trust: 50, budget: 100, risk: 50,
    maturity: {EDM:1, APO:1, BAI:1, DSS:1, MEA:1},
    log: [], char: JSON.parse(JSON.stringify(ch)),
    items: JSON.parse(JSON.stringify(ITEMS)),
    isRolling: false, waitingChoice: false
  };
  
  if(G.char.startBonus.trust) G.trust += G.char.startBonus.trust;
  if(G.char.startBonus.budget) G.budget += G.char.startBonus.budget;
  if(G.char.startBonus.risk) G.risk += G.char.startBonus.risk;
  if(G.char.startBonus.maturity) DOMAINS_DEF.forEach(d=>G.maturity[d.id]=2);
  
  addLog('เริ่มเกม! รักษา Trust และ Budget ให้ดีเพื่อไปสู้บอส');
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================
// ==========================================
// RENDERING FUNCTIONS
// ==========================================
function renderStart(){
  document.getElementById('char-grid').innerHTML = CHARS.map(c=>`
    <div class="char-card ${G.selectedChar===c.id?'selected':''}" onclick="selectChar('${c.id}')" id="cc-${c.id}">
      <div class="card-glow"></div>
      <span class="char-avatar">${c.avatar}</span>
      <div class="char-name">${c.name}</div>
      <div class="char-title">${c.title}</div>
      <span class="char-bonus" style="font-size:10px; margin-top:8px; display:inline-block; background:rgba(6,182,212,0.2); padding:4px 8px; border-radius:4px; border:1px solid rgba(6,182,212,0.3); color:var(--neon-cyan);">
        ${c.bonusDesc}
      </span>
    </div>`).join('');
}

function selectChar(id){
  G.selectedChar = id;
  document.querySelectorAll('.char-card').forEach(el=>el.classList.remove('selected'));
  document.getElementById('cc-'+id)?.classList.add('selected');
}

function startGame(){
  if(!G.selectedChar) G.selectedChar = 'cio';
  initGame(G.selectedChar);
  document.getElementById('screen-start').classList.remove('active');
  document.getElementById('screen-game').classList.add('active');
  renderAll();
}

function renderAll(){
  renderStats(); renderBoard(); renderRightPanel();
}

function renderStats(){
  document.getElementById('turn-badge').textContent = `รอบที่ ${G.turn}`;
  const mTotal = Object.values(G.maturity).reduce((a,b)=>a+b,0);
  
  const tCol = G.trust<=30?'#ef4444':G.trust>70?'#22c55e':'var(--gold-primary)';
  const bCol = G.budget<=50?'#ef4444':'#fff';
  const rCol = G.risk<=30?'#fb923c':G.risk>70?'#22c55e':'var(--neon-cyan)';

  document.getElementById('stats-row').innerHTML = `
    <div class="stat-box"><span class="stat-icon">🤝</span><div class="stat-num" style="color:${tCol}">${G.trust}</div><div class="stat-lbl">Trust</div></div>
    <div class="stat-box"><span class="stat-icon">💰</span><div class="stat-num" style="color:${bCol}">${G.budget}</div><div class="stat-lbl">Budget</div></div>
    <div class="stat-box"><span class="stat-icon">🛡️</span><div class="stat-num" style="color:${rCol}">${G.risk}</div><div class="stat-lbl">Security</div></div>
    <div class="stat-box" style="border-color:var(--neon-purple)"><span class="stat-icon">⚛️</span><div class="stat-num" style="color:var(--neon-purple)">${mTotal}</div><div class="stat-lbl">Maturity Σ</div></div>`;
}

function renderBoard(){
  const trackEl = document.getElementById('board-track');
  trackEl.innerHTML = BOARD_TRACK.map((_, displayIndex) => {
    let row = Math.floor(displayIndex / 8);
    let col = displayIndex % 8;
    let i = displayIndex;
    
    // Snake Path Logic (Reverse rendering order for odd rows)
    if (row % 2 === 1) i = (row * 8) + (7 - col);
    
    let t = BOARD_TRACK[i];
    let cls = `track-cell t-${t.type}`;
    if(i < G.position) cls += ' passed';
    
    let token = i === G.position ? `<div class="player-token" style="transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">${G.char.avatar}</div>` : '';
    
    return `
      <div class="${cls}">
        <span class="cell-num">${i===G.maxPos?'BOSS':i||'START'}</span>
        ${t.icon}
        ${token}
      </div>`;
  }).join('');
}

function renderRightPanel(){
  document.getElementById('char-status-panel').innerHTML = `
    <div class="cs-avatar" style="box-shadow: 0 0 15px var(--neon-cyan);">${G.char.avatar}</div>
    <div>
      <div class="cs-name">${G.char.name}</div>
      <div class="cs-role" style="color:var(--neon-cyan)">${G.char.title}</div>
    </div>`;
  
  const abBtn = document.getElementById('ability-btn-container');
  if(!G.char.abilityUsed && G.char.id !== 'dev') {
    abBtn.innerHTML = `<button class="btn-game btn-primary-game" style="width:100%; font-size:12px; padding:12px; margin-top:10px;" onclick="useAbility()">⚡ ACTIVE: ${G.char.ability}</button>`;
  } else if (G.char.id === 'dev') {
    abBtn.innerHTML = `<div style="font-size:11px; padding:10px; background:rgba(6,182,212,0.1); border-radius:8px; border:1px solid rgba(6,182,212,0.3); color:var(--neon-cyan); margin-top:10px;">🛡️ PASSIVE: ${G.char.ability}</div>`;
  } else {
    abBtn.innerHTML = `<button class="btn-game" style="width:100%; font-size:12px; padding:12px; margin-top:10px; opacity:0.5" disabled>⚡ COOLDOWN (Used)</button>`;
  }

  document.getElementById('domain-board').innerHTML = DOMAINS_DEF.map(d=>`
    <div class="dom-tile">
      <span class="dt-ico">${d.icon}</span>
      <div class="dt-name">${d.name}</div>
      <div class="dt-lv" style="color:${d.color}">Lv.${G.maturity[d.id]}</div>
      <div class="dt-bar"><div class="dt-fill" style="width:${(G.maturity[d.id]/5)*100}%;background:${d.color}; color:${d.color}"></div></div>
    </div>`).join('');

  const items = G.items.filter(i=>i.owned);
  document.getElementById('items-panel').style.display = items.length ? 'block' : 'none';
  document.getElementById('items-container').innerHTML = items.map(i=>`<span class="item-chip" onclick="useItem('${i.id}')" title="${i.desc}">${i.name}</span>`).join('');

  document.getElementById('log-panel').innerHTML = G.log.slice(0, 15).map(l=>`
    <div class="log-entry" style="animation: slideIn 0.3s ease-out">
      <span style="color:var(--neon-cyan); font-weight:700">#${l.turn}</span> ${l.msg}
    </div>`).join('');
}

// ==========================================
// GAMEPLAY MECHANICS
// ==========================================
function rollDice() {
  if(G.isRolling || G.waitingChoice) return;
  G.isRolling = true; 
  document.getElementById('btn-roll').disabled = true;
  
  const dEl = document.getElementById('dice1');
  dEl.style.transform = 'scale(1.2)';
  dEl.classList.add('rolling');

  let spin = setInterval(() => { dEl.textContent = diceFaces[Math.floor(Math.random()*6)]; }, 60);
  setTimeout(() => {
    clearInterval(spin); 
    dEl.classList.remove('rolling');
    dEl.style.transform = 'scale(1)';
    const roll = Math.floor(Math.random() * 6) + 1;
    dEl.textContent = diceFaces[roll - 1];
    addLog(`ทอยลูกเต๋าได้ [${roll}] เตรียมเคลื่อนที่...`);
    movePlayer(roll);
  }, 800);
}

function movePlayer(steps) {
  let c = 0;
  let moveInt = setInterval(() => {
    if(c < steps && G.position < G.maxPos) { 
      G.position++; c++; 
      renderBoard(); 
      // Sound cue placeholder or visual pop
    } else { 
      clearInterval(moveInt); 
      setTimeout(() => processTile(G.position), 400); 
    }
  }, 300);
}

function processTile(pos) {
  G.isRolling = false;
  const t = BOARD_TRACK[pos];
  
  if(pos === G.maxPos) { startBossBattle(); return; } 
  
  if(t.type === 'bonus') { 
    giveItem(); 
    addLog('✨ โบนัสพิเศษ! พบทรัพยากรช่วยเหลือ'); 
    document.getElementById('btn-roll').disabled = false;
  }
  else if(t.type === 'safe') {
    addLog('🛡️ ตรวจสอบผ่าน! พื้นที่ปลอดภัย');
    document.getElementById('btn-roll').disabled = false;
  }
  else if(t.type === 'risk' || t.type === 'opp') {
    drawCard(t.type);
  } else {
    document.getElementById('btn-roll').disabled = false;
  }
  
  G.turn++; 
  checkEnd();
  renderStats();
}

function drawCard(type) {
  G.waitingChoice = true; 
  document.getElementById('btn-roll').disabled = true;
  
  const pool = EVENTS[type];
  const ev = pool[Math.floor(Math.random() * pool.length)];
  G.currentEvent = ev;

  const typeLabel = type==='risk' ? 'CRITICAL RISK' : 'STRATEGIC OPPORTUNITY';
  const typeClass = type==='risk' ? 'badge-risk' : 'badge-opp';
  
  document.getElementById('modal-container').innerHTML = `
    <div class="overlay-wrap" style="backdrop-filter: blur(15px);">
      <div class="card-modal" style="border-color:${type==='risk'?'var(--boss-red)':'var(--neon-cyan)'}">
        <div class="card-icon" style="font-size:64px; margin-bottom:20px;">${type==='risk'?'🚨':'⚡'}</div>
        <div class="card-badge ${typeClass}" style="padding:6px 20px; font-size:12px;">${typeLabel}</div>
        <div class="card-title" style="font-size:24px; margin-bottom:10px;">${ev.title}</div>
        <div class="card-desc" style="font-size:15px; margin-bottom:30px; line-height:1.6">${ev.desc}</div>
        <div class="choice-list">
          ${ev.choices.map((c,i)=>`
            <button class="choice-btn" onclick="makeChoice(${i})">
              <div style="font-weight:700; margin-bottom:4px;">${c.text}</div>
              <div class="choice-label" style="opacity:0.7">${c.label}</div>
            </button>`).join('')}
        </div>
      </div>
    </div>`;
}

function makeChoice(idx) {
  const choice = G.currentEvent.choices[idx];
  const eff = choice.effect;
  applyEffect(eff);
  
  let chips = [];
  let bChange = eff.budget || 0;
  if (G.char.id === 'dev' && bChange < 0) bChange = Math.round(bChange * 0.85);

  if(eff.trust) chips.push(`<span class="ec ${eff.trust>0?'ec-pos':'ec-neg'}">Trust ${eff.trust>0?'+':''}${eff.trust}</span>`);
  if(bChange) chips.push(`<span class="ec ${bChange>0?'ec-pos':'ec-neg'}">Budget ${bChange>0?'+':''}${bChange}</span>`);
  if(eff.risk) chips.push(`<span class="ec ${eff.risk>0?'ec-pos':'ec-neg'}">Security ${eff.risk>0?'+':''}${eff.risk}</span>`);
  
  if(eff.maturity) {
    Object.keys(eff.maturity).forEach(d => {
      let add = eff.maturity[d];
      if(G.char.bonus === d && add > 0) add = 2; // Fixed bonus +2
      chips.push(`<span class="ec ec-pos" style="border-color:var(--neon-purple); color:var(--neon-purple)">${d} +${add}</span>`);
    });
  }

  document.getElementById('modal-container').innerHTML = `
    <div class="overlay-wrap" style="backdrop-filter: blur(20px);">
      <div class="card-modal" style="border-color:#22c55e; max-width:400px; text-align:center;">
        <div style="font-size:56px; margin-bottom:15px;">📡</div>
        <div class="card-title" style="color:#22c55e">Data Processed</div>
        <div class="card-desc">คุณได้เลือกตัดสินใจ: <br><b style="color:#fff">"${choice.text}"</b></div>
        <div class="effect-chips" style="margin:20px 0;">${chips.join('')}</div>
        <button class="btn-game btn-primary-game" style="width:100%;" onclick="closeResultModal()">ดำเนินการต่อ →</button>
      </div>
    </div>`;
}

function closeResultModal() {
  document.getElementById('modal-container').innerHTML = '';
  G.waitingChoice = false; 
  document.getElementById('btn-roll').disabled = false;
  renderAll(); 
  checkEnd();
}

function applyEffect(eff) {
  if(!eff) return;
  let bChange = eff.budget || 0;
  if(G.char.id === 'dev' && bChange < 0) bChange = Math.round(bChange * 0.85); 
  
  G.trust = Math.max(0, Math.min(100, G.trust + (eff.trust||0)));
  G.budget = Math.max(0, Math.min(500, G.budget + bChange));
  G.risk = Math.max(0, Math.min(100, G.risk + (eff.risk||0)));
  
  if(eff.maturity) {
    Object.entries(eff.maturity).forEach(([d,v]) => {
      let add = v; 
      if(G.char.bonus === d && v > 0) add = 2; 
      G.maturity[d] = Math.max(1, Math.min(5, G.maturity[d] + add));
    });
  }
}

function giveItem() {
  const unowned = G.items.filter(i => !i.owned);
  if(unowned.length > 0) { 
    unowned[Math.floor(Math.random() * unowned.length)].owned = true; 
    renderRightPanel(); 
    showToast('🎁 ได้รับ [LEGACY ITEM] ใหม่ในกระเป๋า!'); 
  }
}

function useItem(id) {
  const item = G.items.find(x => x.id === id);
  if(item && item.owned) { 
    applyEffect(item.effect); 
    item.owned = false; 
    showToast(`✅ ใช้ไอเทม: ${item.name}`); 
    addLog(`ใช้ไอเทม [${item.name}] ปรับโครงสร้างข้อมูล`);
    renderAll(); 
    checkEnd(); 
  }
}

function useAbility() {
  if(!G.char.abilityUsed) {
    G.char.abilityUsed = true;
    if(G.char.id==='cio') { applyEffect({trust: 15}); showToast('⚡ CIO ABILITY: Trust +15'); }
    if(G.char.id==='risk') { applyEffect({risk: 25}); showToast('⚡ RISK SHIELD: Security +25'); }
    if(G.char.id==='auditor') { applyEffect({budget: 20}); showToast('⚡ BUDGET APPROVAL: Budget +20'); }
    renderAll(); 
  }
}

function checkEnd() {
  if(G.trust <= 0) endGame('lose_trust');
  else if(G.budget <= 0) endGame('lose_budget');
}

// ==========================================
// BOSS BATTLE MECHANICS
// ==========================================
function startBossBattle() {
  G.waitingChoice = true; 
  document.getElementById('btn-roll').disabled = true;
  triggerShake();

  if(G.trust <= 25 || G.budget <= 25) {
    document.getElementById('modal-container').innerHTML = `
      <div class="overlay-wrap"><div class="boss-modal" style="border-color:#555; background: #000;">
        <div style="font-size:72px; margin-bottom:20px;">🛡️❌</div>
        <div class="boss-title" style="color:var(--boss-red)">ถูกสั่งพักงาน!</div>
        <div class="card-desc" style="color:#fff; font-size:16px;">
          คุณไม่สามารถเข้าห้องประชุมบอร์ดบริหารได้ เนื่องจาก Trust หรือ Budget ต่ำเกินไป (< 25)<br><br>
          <b style="color:var(--boss-red)">โปรเจกต์ COBIT ของคุณถูกยกเลิกถาวร</b>
        </div>
        <button class="btn-game" style="width:100%; margin-top:20px; border-color:var(--boss-red)" onclick="endGame('lose_fired')">ออกจากระบบ</button>
      </div></div>`;
    return;
  }

  const mTotal = Object.values(G.maturity).reduce((a,b)=>a+b,0);
  const mPower = mTotal * 2;
  const riskBonus = G.risk > 60 ? 5 : 0;
  
  G.bossSetup = { hp: 35, mPower, riskBonus };

  document.getElementById('modal-container').innerHTML = `
    <div class="overlay-wrap" style="background:rgba(239, 68, 68, 0.2)">
      <div class="boss-modal" style="animation: bossPulse 0.5s infinite alternate">
        <div style="font-size:80px; margin-bottom:20px; filter: drop-shadow(0 0 30px #f00)">👹</div>
        <div class="boss-title" style="letter-spacing:5px;">THE EXTERNAL AUDITOR</div>
        <div style="color:var(--color-text-secondary); font-size:14px; margin-bottom:30px;">"เวลาของคุณหมดแล้ว... ไหนล่ะความวุฒิภาวะของระบบ?"</div>
        
        <div style="background:rgba(0,0,0,0.7); padding:24px; border-radius:20px; margin-bottom:30px; text-align:left; border: 1px solid var(--boss-red); position:relative; overflow:hidden">
          <div style="position:absolute; top:-10px; right:10px; font-size:64px; opacity:0.1">CRITICAL</div>
          <div style="color:var(--boss-red); font-weight:800; font-size:14px; margin-bottom:15px; border-bottom:1px solid rgba(239, 68, 68, 0.3); padding-bottom:10px;">
            AUDIT CHALLENGE: 35 POINTS
          </div>
          <div style="display:grid; grid-template-columns: 1fr auto; gap:10px; font-size:14px;">
            <span>Maturity Mastery (${mTotal} x 2)</span><b style="color:#22c55e">+${mPower}</b>
            <span>Security Compliance (>60)</span><b style="color:#22c55e">+${riskBonus}</b>
            <span style="border-top:1px dashed #444; padding-top:10px; margin-top:5px; color:var(--gold-primary)">Luck Factor (2 Dice)</span><b style="color:var(--gold-primary); margin-top:5px;">?</b>
          </div>
        </div>

        <button class="btn-boss" style="height:60px; font-size:18px;" onclick="rollForBoss()">DEPLOY DEFENSE 🎲🎲</button>
      </div>
    </div>`;
}

function rollForBoss() {
  triggerShake();
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const diceTotal = d1 + d2;
  
  const { hp, mPower, riskBonus } = G.bossSetup;
  const totalPlayerPower = diceTotal + mPower + riskBonus;
  const isWin = totalPlayerPower >= hp;
  
  document.getElementById('modal-container').innerHTML = `
    <div class="overlay-wrap" style="background:${isWin?'rgba(34,197,94,0.3)':'rgba(239, 68, 68, 0.4)'}">
      <div class="boss-modal" style="border-color:${isWin?'#22c55e':'var(--boss-red)'}">
        <div style="font-size:72px; margin-bottom:20px;">${isWin?'✅':'❌'}</div>
        <div style="font-size:24px; font-weight:800; color:#fff; margin-bottom:10px;">ROLL RESULT: ${d1} + ${d2} (${diceTotal})</div>
        <div style="font-size:20px; color:var(--gold-primary); margin-bottom:30px; background:rgba(0,0,0,0.5); padding:20px; border-radius:16px; border: 1px solid ${isWin?'#22c55e':'var(--boss-red)'}">
          DEFENSE POWER = <b style="font-size:32px; color:${isWin?'#22c55e':'#ef4444'}">${totalPlayerPower}</b> <br>
          <span style="font-size:12px; color:var(--color-text-secondary); opacity:0.8">(REQUIRED = ${hp})</span>
        </div>
        <button class="btn-boss" style="background:${isWin?'linear-gradient(135deg, #166534, #14532d)':'linear-gradient(135deg, #991b1b, #7f1d1d)'}" 
          onclick="endGame('${isWin ? 'win_boss' : 'lose_boss'}')">
          ${isWin ? 'COMPLETE AUDIT 🏆' : 'SYSTEM FAILURE 💀'}
        </button>
      </div>
    </div>`;
}

function triggerShake() {
  const wrap = document.getElementById('gw');
  wrap.style.animation = 'none';
  setTimeout(() => wrap.style.animation = 'shakeModal 0.4s ease-out', 10);
}


// ==========================================
// END GAME & UTILITIES
// ==========================================
function endGame(res) {
  document.getElementById('modal-container').innerHTML = '';
  document.getElementById('screen-game').classList.remove('active');
  document.getElementById('screen-end').classList.add('active');
  
  let title = '', sub = '', icon = '', color = '';
  
  if(res === 'lose_trust') { title='Game Over'; sub='ความเชื่อมั่นหมดลง บอร์ดบริหารไล่คุณออก'; icon='👎'; color='#e11d48'; }
  else if(res === 'lose_budget') { title='Bankrupt'; sub='งบประมาณหมดเกลี้ยง โครงการ IT ล่มสลาย'; icon='💸'; color='#e11d48'; }
  else if(res === 'lose_fired') { title='Fired Before Audit'; sub='งบและความเชื่อมั่นไม่ถึงเกณฑ์ที่บอร์ดตั้งไว้ (ต้อง >20)'; icon='📉'; color='#e11d48'; }
  else if(res === 'lose_boss') { title='Audit Failed!'; sub='Maturity ต่ำเกินไป ระบบป้องกันโดนเจาะทะลวงโดยสมบูรณ์'; icon='💀'; color='#e11d48'; }
  else if(res === 'win_boss') { title='COBIT Grand Master'; sub='เอาชนะการตรวจสอบและป้องกันภัยคุกคามได้อย่างสมบูรณ์แบบ!'; icon='🏆'; color='#4ade80'; }

  document.getElementById('end-content').innerHTML = `
    <div class="end-grade">${icon}</div>
    <div style="font-size:36px; font-weight:700; margin:15px 0; color:${color}; text-transform:uppercase;">${title}</div>
    <div style="color:var(--color-text-secondary); margin-bottom:30px; font-size:16px;">${sub}</div>
    
    <div style="display:flex; justify-content:center; gap:16px; margin-bottom: 40px; flex-wrap:wrap;">
      <div class="stat-box" style="width:120px; background:rgba(0,0,0,0.6);">
        <div style="font-size:28px; font-weight:bold; color:var(--gold-primary);">${G.trust}</div><div style="font-size:12px;">Trust</div>
      </div>
      <div class="stat-box" style="width:120px; background:rgba(0,0,0,0.6);">
        <div style="font-size:28px; font-weight:bold;">${G.budget}</div><div style="font-size:12px;">Budget</div>
      </div>
      <div class="stat-box" style="width:120px; background:rgba(0,0,0,0.6);">
        <div style="font-size:28px; font-weight:bold; color:#4ade80;">${Object.values(G.maturity).reduce((a,b)=>a+b,0)}</div><div style="font-size:12px;">Maturity Σ</div>
      </div>
    </div>
    
    <button class="btn-game btn-primary-game" style="font-size:18px; padding:16px 50px; border-radius:30px;" onclick="resetToStart()">เริ่มการผจญภัยใหม่ 🔄</button>
  `;
}

function resetToStart() {
  G = {}; 
  document.getElementById('screen-end').classList.remove('active');
  document.getElementById('screen-start').classList.add('active');
  renderStart();
}

function addLog(msg) {
  G.log.unshift({turn: G.turn, msg});
  if(G.log.length > 20) G.log.pop();
  if(document.getElementById('log-panel')) renderRightPanel();
}

function showToast(msg) {
  const t = document.getElementById('toast'); 
  t.textContent = msg; 
  t.style.opacity = 1;
  setTimeout(() => t.style.opacity = 0, 3000);
}

function showHelp() { 
  showToast('เป้าหมาย: อัปเกรด Maturity ทุกสายให้เยอะที่สุด และรักษา Trust/Budget ให้เกิน 20 ก่อนบอส'); 
}

renderStart();