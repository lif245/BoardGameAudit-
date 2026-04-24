import React, { useState, useEffect, useRef } from 'react';
import { CHARS, DOMAINS_DEF, ITEMS, EVENTS, BOARD_TRACK } from './constants';
import Dice from './components/Dice';
import Board from './components/Board';
import RightPanel from './components/RightPanel';
import { EventModal, ResultModal, BossModal } from './components/Modals';
import AudioPlayer from './components/AudioPlayer';
import { soundEngine } from './utils/soundEngine';
import IconRenderer from './utils/IconRenderer';
import RadarChart from './components/RadarChart';

function App() {
  const [screen, setScreen] = useState('start'); // start, game, end
  const [endResult, setEndResult] = useState(null); 
  const [startView, setStartView] = useState('menu'); // menu, rules, credits, char_select
  const [selectedCharId, setSelectedCharId] = useState('cio');
  
  const [gameState, setGameState] = useState(null);
  const [eventModal, setEventModal] = useState(null); // { type, ev }
  const [resultModal, setResultModal] = useState(null); // { choice, chips }
  const [bossActive, setBossActive] = useState(false);
  const [bossRoll, setBossRoll] = useState(null);
  
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [landing, setLanding] = useState(false);
  const [tileFeedback, setTileFeedback] = useState(null);
  const [mobileDossier, setMobileDossier] = useState(false);
  
  const diceRef = useRef();

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const addLog = (msg, currentTurn) => {
    setGameState(prev => {
      const newLog = [{ turn: currentTurn, msg }, ...prev.log];
      if (newLog.length > 20) newLog.pop();
      return { ...prev, log: newLog };
    });
  };

  const startGame = (character = null) => {
    const ch = character || CHARS.find(c => c.id === selectedCharId) || CHARS[0];
    
    let initialMaturity = { EDM: 1, APO: 1, BAI: 1, DSS: 1, MEA: 1 };
    let initialTrust = 50, initialBudget = 100, initialRisk = 50;

    if (ch.startBonus.trust) initialTrust += ch.startBonus.trust;
    if (ch.startBonus.budget) initialBudget += ch.startBonus.budget;
    if (ch.startBonus.risk) initialRisk += ch.startBonus.risk;
    if (ch.startBonus.maturity) {
      Object.keys(initialMaturity).forEach(k => initialMaturity[k] = 2);
    }

    setGameState({
      char: ch,
      turn: 1,
      position: 0,
      trust: initialTrust,
      budget: initialBudget,
      risk: initialRisk,
      maturity: initialMaturity,
      log: [{ turn: 1, msg: 'ติดตั้งระบบเสร็จสิ้น: ควบคุมตัวแปร Trust และ Budget ให้อยู่ในระดับปลอดภัย' }],
      char: JSON.parse(JSON.stringify(ch)),
      items: JSON.parse(JSON.stringify(ITEMS))
    });
    
    setScreen('game');
  };

  const checkEnd = (state) => {
    if (state.trust <= 0) {
      setEndResult('lose_trust');
      setScreen('end');
      return true;
    }
    if (state.budget <= 0) {
      setEndResult('lose_budget');
      setScreen('end');
      return true;
    }
    return false;
  };

  const applyEffect = (eff, currentState) => {
    if (!eff) return currentState;
    let bChange = eff.budget || 0;
    if (currentState.char.id === 'dev' && bChange < 0) bChange = Math.round(bChange * 0.85); 
    
    const newTrust = Math.max(0, Math.min(100, currentState.trust + (eff.trust || 0)));
    const newBudget = Math.max(0, Math.min(200, currentState.budget + bChange));
    const newRisk = Math.max(0, Math.min(100, currentState.risk + (eff.risk || 0)));
    
    const newMaturity = { ...currentState.maturity };
    if (eff.maturity) {
      Object.entries(eff.maturity).forEach(([d, v]) => {
        let add = v; 
        if (currentState.char.bonus === d && v > 0) add++; 
        newMaturity[d] = Math.max(1, Math.min(5, newMaturity[d] + add));
      });
    }

    return { ...currentState, trust: newTrust, budget: newBudget, risk: newRisk, maturity: newMaturity };
  };

  const handleRollComplete = (steps) => {
    soundEngine.playMove();
    let currentPos = gameState.position;
    let stepsLeft = steps;

    // Safety clear any existing interval
    if (window.moveInterval) clearInterval(window.moveInterval);

    window.moveInterval = setInterval(() => {
      if (stepsLeft > 0 && currentPos < BOARD_TRACK.length - 1) {
        currentPos++;
        stepsLeft--;
        setGameState(prev => ({ ...prev, position: currentPos }));
      } else {
        clearInterval(window.moveInterval);
        window.moveInterval = null;
        setLanding(true);
        setTimeout(() => setLanding(false), 1000);
        setTimeout(() => processTile(currentPos), 300);
      }
    }, 250);
  };

  const processTile = (pos) => {
    setGameState(prev => {
      const nextTurn = prev.turn + 1;
      const t = BOARD_TRACK[pos];
      
      let newState = { ...prev, turn: nextTurn };
      
      if (pos === BOARD_TRACK.length - 1) {
        setBossActive(true);
        return newState;
      }
      
      if (t.type === 'bonus') {
        const unowned = newState.items.filter(i => !i.owned);
        if (unowned.length > 0) {
          const itemToGive = unowned[Math.floor(Math.random() * unowned.length)];
          newState.items = newState.items.map(i => i.id === itemToGive.id ? { ...i, owned: true } : i);
          showToast('ได้รับไอเทมช่วยเหลือ!');
          setTileFeedback({ msg: `+ Item: ${itemToGive.name}`, type: 'pos' });
        }
        addLog('พบทรัพยากรพิเศษ! ดึงไอเทมเข้ากระเป๋าสำเร็จ', newState.turn);
      } else if (t.type === 'safe') {
        addLog('ผ่านช่วงดำเนินการเงียบสงบ ไม่มีข้อบ่งชี้ความเสี่ยง', newState.turn);
        setTileFeedback({ msg: 'Safe Area', type: 'pos' });
      } else if (t.type === 'risk' || t.type === 'opp') {
        const pool = EVENTS[t.type];
        const ev = pool[Math.floor(Math.random() * pool.length)];
        setEventModal({ type: t.type, ev });
        setTileFeedback({ msg: t.type === 'risk' ? 'Risk Alert!' : 'Opportunity!', type: t.type === 'risk' ? 'neg' : 'pos' });
      }

      setTimeout(() => setTileFeedback(null), 2000);

      return newState;
    });
  };

  // Ensure checkEnd fires after state updates where processing is done synchronously
  useEffect(() => {
    if (screen === 'game' && gameState && !eventModal && !resultModal && !bossActive) {
      checkEnd(gameState);
    }
  }, [screen, gameState, eventModal, resultModal, bossActive]);

  const handleMakeChoice = (idx) => {
    const choice = eventModal.ev.choices[idx];
    const eff = choice.effect;
    
    let chips = [];
    let bChange = eff.budget || 0;
    if (gameState.char.id === 'dev' && bChange < 0) bChange = Math.round(bChange * 0.85);

    if (eff.trust) chips.push({ type: eff.trust > 0 ? 'ec-pos' : 'ec-neg', text: `Trust ${eff.trust > 0 ? '+' : ''}${eff.trust}` });
    if (bChange) chips.push({ type: bChange > 0 ? 'ec-pos' : 'ec-neg', text: `Budget ${bChange > 0 ? '+' : ''}${bChange}` });
    if (eff.risk) chips.push({ type: eff.risk > 0 ? 'ec-pos' : 'ec-neg', text: `Risk ${eff.risk > 0 ? '+' : ''}${eff.risk}` });
    
    if (eff.maturity) {
      Object.keys(eff.maturity).forEach(d => {
        let add = eff.maturity[d];
        if (gameState.char.bonus === d && add > 0) add++;
        chips.push({ type: 'ec-pos', text: `${d} +${add}` });
      });
    }

    if (chips.length === 0) chips.push({ type: 'ec-neutral', text: 'ไม่มีผลกระทบ' });

    if (eff.budget < 0 || eff.trust < 0 || eff.risk < 0) {
      soundEngine.playAlert();
    } else {
      soundEngine.playSuccess();
    }

    setGameState(prev => applyEffect(eff, prev));
    setResultModal({ choice, chips });
    setEventModal(null);
  };

  const handleCloseResultModal = () => {
    setResultModal(null);
  };

  const handleUseItem = (id) => {
    setGameState(prev => {
      const item = prev.items.find(x => x.id === id);
      if (item && item.owned) {
        soundEngine.playSuccess();
        showToast(`ใช้งาน ${item.name} สำเร็จ!`);
        addLog(`System Override: ใช้งาน ${item.name}`, prev.turn);
        let newState = applyEffect(item.effect, prev);
        newState.items = newState.items.map(i => i.id === id ? { ...i, owned: false } : i);
        return newState;
      }
      return prev;
    });
  };

  const handleUseAbility = () => {
    setGameState(prev => {
      if (!prev.char.abilityUsed) {
        soundEngine.playSuccess();
        let eff = {};
        if (prev.char.id === 'cio') { eff = { trust: 15 }; showToast('Executive Override Activated: Trust +15'); }
        if (prev.char.id === 'risk') { eff = { risk: 25 }; showToast('Crisis Shield Deployed: Risk +25'); }
        if (prev.char.id === 'auditor') { eff = { budget: 20 }; showToast('Emergency Fund Approved: Budget +20'); }
        
        let newState = applyEffect(eff, prev);
        newState.char = { ...newState.char, abilityUsed: true };
        return newState;
      }
      return prev;
    });
  };

  const handleRollBoss = () => {
    soundEngine.playRoll();
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setBossRoll({ d1, d2, total: d1 + d2 });
  };

  const handleAcknowledgeBoss = (result) => {
    console.log("App: handleAcknowledgeBoss called with:", result);
    setBossActive(false);
    setBossRoll(null);
    setEndResult(result);
    setScreen('end');
  };

  // Renders
  if (screen === 'start') {
    return (
      <div className="game-wrap">
        <AudioPlayer />
        <div className="hud-screen">
          {/* Tactical Corner Brackets */}
          <div className="corner-bracket cb-tl"></div>
          <div className="corner-bracket cb-tr"></div>
          <div className="corner-bracket cb-bl"></div>
          <div className="corner-bracket cb-br"></div>

          {/* Hexagon Logo Section */}
          <div className="hexagon-logo-wrap">
            <div className="logo-crosshair"></div>
            <div className="hexagon-logo">
              <IconRenderer name="Target" size={60} className="text-blue-400" />
            </div>
          </div>

          {/* Typography Section */}
          <div className="menu-typography">
            <h1 className="main-title">COBIT QUEST</h1>
            <div className="sub-title-tactical">GOVERNANCE FRAMEWORK EDITION</div>
            
            <div className="domain-pills-row">
              <span className="domain-pill-mini">APO</span>
              <span className="domain-pill-mini">DSS</span>
              <span className="domain-pill-mini">MEA</span>
              <span className="domain-pill-mini">EDM</span>
            </div>
          </div>

          {/* Action Buttons */}
          {startView === 'menu' && (
            <div className="tactical-btn-group">
              <button className="btn-primary-tactical" onClick={() => { soundEngine.playClick(); setStartView('char_select'); }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <IconRenderer name="Play" size={24} fill="white" />
                </div>
                <div>
                  <span className="btn-label">เริ่มการตรวจสอบ (START)</span>
                  <span className="btn-sub">เริ่มต้นการจำลองระบบตรวจสอบองค์กร</span>
                </div>
              </button>
              
              <button className="btn-secondary-tactical" style={{ width: '100%', marginBottom: '8px' }} onClick={() => { soundEngine.playClick(); setStartView('rules'); }}>
                <IconRenderer name="BookOpen" size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                ระเบียบปฏิบัติ (PROTOCOLS)
              </button>

              <button className="btn-secondary-tactical" style={{ width: '100%' }} onClick={() => { soundEngine.playClick(); setStartView('credits'); }}>
                <IconRenderer name="Code" size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                คณะผู้พัฒนา (EXECUTIVE DEVELOPERS)
              </button>
            </div>
          )}

          {/* HUD Status Bar */}
          <div className="hud-status-bar">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>SYSTEM ONLINE</span>
            </div>
            <div>VER 1.0.4 // LOCALHOST // ENCRYPTED</div>
          </div>

          {/* Overlay Modals for Credits/Rules (Still using existing logic but centered) */}
          {startView === 'credits' && (
            <div className="menu-modal-container" style={{ position: 'absolute', zIndex: 2000 }}>
              <div className="credits-box" style={{ margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div className="credits-title">👨‍💻 ทีมผู้พัฒนา (Executive Developers)</div>
                <div className="credits-grid">
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">ณัฐพล วงค์ชมภู</span> <span className="credit-id">68053881</span></div>
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">วรเทพ สุวรรณประดิษฐ์</span> <span className="credit-id">68081605</span></div>
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">ปฏิภาน เครือใย</span> <span className="credit-id">68019056</span></div>
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">เกริกกานต์ กิ่งแก้ว</span> <span className="credit-id">68102067</span></div>
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">นพณัฐ ศรีเหรัญ</span> <span className="credit-id">68050519</span></div>
                  <div className="credit-item"><span className="c-dot"></span><span className="credit-name">วรัญญู แก้วเมือง</span> <span className="credit-id">68095907</span></div>
                </div>
                <button className="btn-menu" style={{ marginTop: '20px' }} onClick={() => setStartView('menu')}>ย้อนกลับ</button>
              </div>
            </div>
          )}
          
          {startView === 'rules' && (
            <div className="menu-modal-container">
              <div className="rules-box" style={{ margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary-blue)' }}>📋 ระเบียบและพารามิเตอร์การประเมิน</h3>
                <ul style={{ fontSize: '15px', lineHeight: '1.8' }}>
                  <li><b>การประเมินสถานะ:</b> หาก <b>Trust หรือ Budget ลดเหลือ 0</b> จะถือว่าระบบล้มเหลว (Project Terminated) ทันที</li>
                  <li><b>เกณฑ์เข้าประชุมบอร์ดผู้บริหาร:</b> ต้องมีองค์ประกอบ Trust &gt; 20 และ Budget &gt; 20 เมื่อถึงช่องสุดท้าย</li>
                  <li><b>การป้องกัน Audit ครั้งสุดท้าย:</b> แต้มทอย 2 ลูก + <b>(ระดับผลรวม Maturity x 2)</b> ข้ามเส้นมาตรฐาน (35 แต้ม)</li>
                  <li><i>Security Bonus:</i> ถ้าระบบป้องกัน (Risk Buffer) &gt; 50 ตอนเจอบอส จะได้คะแนนสมทบให้อีก +5</li>
                </ul>
                <button className="btn-menu" style={{ marginTop: '20px' }} onClick={() => setStartView('menu')}>ย้อนกลับ</button>
              </div>
            </div>
          )}

          {startView === 'char_select' && (
            <div className="menu-modal-container char-selection-modal-wrapper" style={{ width: '100%', maxWidth: '1000px' }}>
              <div className="char-selection-container">
                {/* Left Pane: Selection List (Grid on Mobile) */}
                <div className={`char-list ${mobileDossier ? 'hidden-mobile-only' : ''}`}>
                  <div className="selection-header-mobile">
                    <div style={{fontSize:'12px', fontWeight:800, color:'var(--primary-blue)', textTransform:'uppercase', letterSpacing:'1px'}}>Executive Clearance List</div>
                    <div className="mobile-only-hint" style={{fontSize:'10px', opacity:0.6}}>แตะเพื่อเลือก / กด (i) เพื่อดูสเตตัส</div>
                  </div>
                  
                  <div className="char-grid-mobile">
                    {CHARS.map(c => (
                      <div 
                        key={c.id} 
                        className={`char-id-card ${selectedCharId === c.id ? 'selected' : ''}`} 
                        onClick={() => { 
                          soundEngine.playClick(); 
                          setSelectedCharId(c.id); 
                          setMobileDossier(true); 
                        }}
                      >
                        <div className="char-id-icon" style={{ overflow: 'hidden' }}>
                          {c.img ? <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconRenderer name={c.iconName} size={24} />}
                        </div>
                        <div className="char-id-info">
                          <div className="char-id-name">{c.name}</div>
                          <div className="char-id-title">{c.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:'20px'}}>
                    <button className="btn-menu" onClick={() => setStartView('menu')}>ย้อนกลับไปหน้าหลัก</button>
                  </div>
                </div>

                {/* Right Pane: Dossier Detail (Modal on Mobile) */}
                <div className={`dossier-view ${mobileDossier ? 'mobile-modal-active' : ''}`}>
                  {(() => {
                    const char = CHARS.find(c => c.id === selectedCharId) || CHARS[0];
                    return (
                      <>
                        <div className="mobile-modal-header">
                          <div className="modal-title-mobile" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Executive Dossier</div>
                        </div>

                        <div className="dossier-header">
                          <div className="dossier-avatar-wrap" style={{ overflow: 'hidden' }}>
                            {char.img ? <img src={char.img} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconRenderer name={char.iconName} size={48} />}
                          </div>
                          <div>
                            <div className="dossier-name">{char.name}</div>
                            <div className="dossier-title">{char.title}</div>
                            <div style={{display:'flex', gap:'8px'}}>
                              <span className="char-bonus" style={{background:'rgba(59, 130, 246, 0.1)', color:'var(--primary-blue)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px'}}>LEVEL 4 CLEARANCE</span>
                              <span className="char-bonus" style={{background:'rgba(16, 185, 129, 0.1)', color:'var(--status-opp)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px'}}>AUTHENTICATED</span>
                            </div>
                          </div>
                        </div>

                        <div style={{marginBottom:'24px'}}>
                          <div className="panel-title" style={{marginBottom:'12px', color:'var(--color-text-primary)'}}>Executive Capability Matrix</div>
                          <div className="dossier-stats-grid">
                            {[
                              { label: 'Management', val: char.stats.mgmt },
                              { label: 'Strategy', val: char.stats.strat },
                              { label: 'Technical', val: char.stats.tech },
                              { label: 'Audit/Compliance', val: char.stats.audit }
                            ].map(s => (
                              <div key={s.label} className="dossier-stat-item">
                                <div className="stat-lbl-row">
                                  <span>{s.label}</span>
                                  <span>LVL {s.val}/5</span>
                                </div>
                                <div className="stat-bar-bg">
                                  <div className="stat-bar-fill" style={{ width: `${(s.val/5)*100}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="dossier-ability-box">
                          <div className="ability-title">
                            <IconRenderer name="Zap" size={16} />
                            <span>Executive Ability: {char.ability}</span>
                          </div>
                          <div className="ability-desc" style={{fontSize: '13px', lineHeight: '1.6'}}>
                            {char.loreAbility}<br/>
                            <span style={{color:'var(--status-opp)', fontSize:'12px', fontWeight:600}}>System Effect: {char.abilityDesc}</span>
                          </div>
                        </div>

                        <div className="dossier-footer">
                          <button 
                            className="btn-game btn-primary-game" 
                            style={{ padding: '14px 40px', fontSize: '15px', width: '100%' }}
                            onClick={() => { soundEngine.playClick(); startGame(); }}
                          >
                            เริ่มระบบ (INITIALIZE SESSION)
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'end') {
    let title = '', sub = '', icon = '', color = '';
    if (endResult === 'lose_trust') { title='โครงการถูกพับ (Project Aborted)'; sub='คุณถูกถอดถอนจากความน่าเชื่อถือที่หมดลง (Trust = 0)'; icon='👎'; color='var(--status-boss)'; }
    else if (endResult === 'lose_budget') { title='งบประมาณหมดเกลี้ยง (Fund Depleted)'; sub='ทรัพยากรการเงินหมดเกลี้ยง โครงการไปต่อไม่ได้'; icon='💸'; color='var(--status-boss)'; }
    else if (endResult === 'lose_fired') { title='ยุติบทบาท (Terminated)'; sub='พารามิเตอร์องค์กร (Trust/Budget) ต่ำกว่าเกณฑ์มาตรฐานตอนเทสประเมินสเตจสุดท้าย'; icon='📉'; color='var(--status-boss)'; }
    else if (endResult === 'lose_boss') { title='การประเมินล้มเหลว (Audit Failed)'; sub='พบช่องโหว่การตรวจสอบจาก External Audit สรุปผลล้มเหลว'; icon='🚨'; color='var(--status-boss)'; }
    else if (endResult === 'win_boss') { title='ผ่านเกณฑ์การตรวจสอบ (Compliance Achieved)'; sub='การตรวจสอบไร้รอยต่อ องค์กรผ่านเกณฑ์ COBIT อย่างสมบูรณ์'; icon='🏆'; color='var(--status-opp)'; }

    const mTotal = gameState ? Object.values(gameState.maturity).reduce((a, b) => a + b, 0) : 0;

    return (
      <div className="game-wrap">
        <AudioPlayer />
        <div className="hud-screen" style={{ overflowY: 'auto', display: 'block', padding: '40px 0' }}>
          <div className="corner-bracket cb-tl"></div>
          <div className="corner-bracket cb-tr"></div>
          <div className="corner-bracket cb-bl"></div>
          <div className="corner-bracket cb-br"></div>
          <div className="end-hero">
            <div className="end-grade">{icon}</div>
            <div style={{fontSize:'28px', fontWeight:700, marginBottom:'12px', color, fontFamily:"'Inter',sans-serif", letterSpacing:'0.5px'}}>{title}</div>
            <div style={{color:'var(--color-text-secondary)', marginBottom:'32px', fontSize:'15px', lineHeight:1.6}}>{sub}</div>
            
            <div className="radar-wrap">
              <div style={{fontSize:'14px', fontWeight:700, color:'var(--primary-blue)', marginBottom:'16px', textTransform:'uppercase'}}>Maturity Radar Chart</div>
              <RadarChart data={gameState?.maturity || {}} domains={DOMAINS_DEF} />
            </div>

            <div style={{display:'flex', justifyContent:'center', gap:'16px', marginBottom: '40px', flexWrap:'wrap'}}>
              <div className="stat-box" style={{width:'130px', textAlign:'center'}}>
                <div style={{fontSize:'24px', fontWeight:600, color:'var(--color-text-primary)', fontFamily:"'Inter'"}}>{gameState?.trust}</div>
                <div style={{fontSize:'11px', color:'var(--color-text-secondary)', marginTop:'4px', textTransform:'uppercase'}}>ความเชื่อมั่น</div>
              </div>
              <div className="stat-box" style={{width:'130px', textAlign:'center'}}>
                <div style={{fontSize:'24px', fontWeight:600, fontFamily:"'Inter'"}}>{gameState?.budget}</div>
                <div style={{fontSize:'11px', color:'var(--color-text-secondary)', marginTop:'4px', textTransform:'uppercase'}}>งบประมาณ</div>
              </div>
              <div className="stat-box" style={{width:'130px', textAlign:'center'}}>
                <div style={{fontSize:'24px', fontWeight:600, color:'var(--status-opp)', fontFamily:"'Inter'"}}>{mTotal}</div>
                <div style={{fontSize:'11px', color:'var(--color-text-secondary)', marginTop:'4px', textTransform:'uppercase'}}>วุฒิภาวะรวม</div>
              </div>
            </div>
            
            <button className="btn-game btn-primary-game" style={{fontSize: '15px', padding: '12px 30px'}} onClick={() => { setScreen('start'); setGameState(null); }}>
              เริ่มการประเมินรอบใหม่ 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GAME RENDERING
  const mTotal = gameState ? Object.values(gameState.maturity).reduce((a, b) => a + b, 0) : 0;
  const mPower = mTotal * 2;
  const riskBonus = (gameState?.risk || 0) > 50 ? 5 : 0;

  // Dynamic Background Logic
  let matClass = 'mat-low';
  if (mTotal > 10 && mTotal <= 20) matClass = 'mat-mid';
  if (mTotal > 20) matClass = 'mat-high';

  const drawStat = (label, val, icon, dangerThresh = 20) => {
    let colorClass = val <= dangerThresh ? 'var(--status-boss)' : 'var(--color-text-primary)';
    return (
      <div className="stat-box">
        <div className="stat-header">
          <span className="stat-lbl">{label}</span>
          <span className="stat-icon">{icon}</span>
        </div>
        <div className="stat-num" style={{ color: colorClass }}>{val}</div>
      </div>
    );
  };

  return (
    <div className={`game-wrap ${matClass}`}>
      <AudioPlayer />
      <div className="screen active">
        <div className="game-header">
          <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
            <span className="header-title">ความคืบหน้าการตรวจสอบ (Progress)</span>
            <span className="turn-badge">รอบเดินที่ {gameState.turn}</span>
          </div>
          <button className="btn-game" onClick={() => showToast('เป้าหมาย: เพิ่มระดับ Maturity ให้เยอะที่สุด และคุม Trust/Budget ไม่ให้ต่ำกว่า 20')}>ⓘ เป้าหมายระบบ</button>
        </div>

        <div className="main-layout">
          <div className="center-board">
            <div className="stats-row">
              {drawStat('ความเชื่อมั่น (Trust)', gameState.trust, '🤝')}
              {drawStat('งบดุล (Budget)', gameState.budget, '💰')}
              {drawStat('เกราะความเสี่ยง (Risk)', gameState.risk, '🛡️')}
              {drawStat('ระดับวุฒิภาวะรวม', mTotal, '✨', 0)}
            </div>
            
            <Dice ref={diceRef} onRollComplete={handleRollComplete} rollDisabled={eventModal || resultModal || bossActive} />

            <Board 
              currentPosition={gameState.position} 
              charAvatar={gameState.char.avatar} 
              charIconName={gameState.char.iconName} 
              charImg={gameState.char.img}
              landing={landing}
              tileFeedback={tileFeedback}
            />
          </div>

          <RightPanel gameState={gameState} onUseAbility={handleUseAbility} onUseItem={handleUseItem} />
        </div>
      </div>

      {eventModal && <EventModal eventInfo={eventModal} onMakeChoice={handleMakeChoice} />}
      {resultModal && <ResultModal choice={resultModal.choice} chips={resultModal.chips} onClose={handleCloseResultModal} />}
      {bossActive && (
        <BossModal 
          gameState={gameState} 
          mTotal={mTotal} 
          mPower={mPower} 
          riskBonus={riskBonus}
          bossRoll={bossRoll}
          onRollBoss={handleRollBoss}
          onAcknowledgeBoss={handleAcknowledgeBoss}
        />
      )}

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </div>
  );
}

export default App;
