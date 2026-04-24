import React from 'react';
import IconRenderer from '../utils/IconRenderer';
import { soundEngine } from '../utils/soundEngine';

export const EventModal = ({ eventInfo, onMakeChoice }) => {
  if (!eventInfo) return null;
  const { type, ev } = eventInfo;
  
  const badge = type === 'risk' 
    ? <div className="card-badge badge-risk">ความเสี่ยงวิกฤต (Risk)</div> 
    : <div className="card-badge badge-opp">โอกาสเชิงกลยุทธ์ (Opportunity)</div>;
    
  const iconName = type === 'risk' ? 'AlertTriangle' : 'Lightbulb';

  const handleChoice = (idx) => {
    soundEngine.playClick();
    onMakeChoice(idx);
  };

  return (
    <div className="overlay-wrap">
      <div className="card-modal">
        <div className="card-header">
          <div className="card-icon">
            <IconRenderer name={iconName} size={32} />
          </div>
          <div>{badge}<div className="card-title">{ev.title}</div></div>
        </div>
        <div className="card-desc">{ev.desc}</div>
        <div style={{fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '10px'}}>
          โปรดเลือกแผนการรับมือ:
        </div>
        <div className="choice-list">
          {ev.choices.map((c, i) => (
            <button key={i} className="choice-btn" onClick={() => handleChoice(i)}>
              {c.text}<span className="choice-label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ResultModal = ({ choice, chips, onClose }) => {
  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <div className="overlay-wrap">
      <div className="card-modal">
        <div className="card-header">
          <div className="card-icon">
            <IconRenderer name="CheckCircle2" size={32} />
          </div>
          <div>
            <div className="card-badge" style={{background: '#334155'}}>สถานะระบบหลังจบเทิร์น</div>
            <div className="card-title">สรุปผลลัพธ์การตัดสินใจ</div>
          </div>
        </div>
        <div className="card-desc" style={{marginBottom: '10px'}}>
          คุณได้ดำเนินการแผน:<br/><b style={{color: 'var(--color-text-primary)'}}>{choice.text}</b>
        </div>
        <div className="effect-chips" style={{padding: '10px 0'}}>
          {chips.map((chip, i) => (
            <span key={i} className={`ec ${chip.type}`} dangerouslySetInnerHTML={{__html: chip.text}}></span>
          ))}
        </div>
        <div style={{textAlign: 'right'}}>
          <button className="btn-game btn-primary-game" onClick={handleClose}>ดำเนินการต่อ</button>
        </div>
      </div>
    </div>
  );
};

export const BossModal = ({ gameState, mTotal, mPower, riskBonus, bossRoll, onRollBoss, onAcknowledgeBoss }) => {
  const [isRolling, setIsRolling] = React.useState(false);
  const [tempDice, setTempDice] = React.useState({ d1: 1, d2: 1 });

  const handleAcknowledge = (result) => {
    soundEngine.playClick();
    onAcknowledgeBoss(result);
  };

  const startBossRoll = () => {
    soundEngine.playBossCharge();
    setIsRolling(true);
    
    const interval = setInterval(() => {
      setTempDice({
        d1: Math.floor(Math.random() * 6) + 1,
        d2: Math.floor(Math.random() * 6) + 1
      });
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      onRollBoss(); 
    }, 1500);
  };

  // Victory/Defeat sound trigger
  React.useEffect(() => {
    if (bossRoll && !isRolling) {
      const totalPlayerPower = bossRoll.total + mPower + riskBonus;
      soundEngine.playBossResult(totalPlayerPower >= 35);
    }
  }, [bossRoll, isRolling, mPower, riskBonus]);

  if (gameState.trust <= 20 || gameState.budget <= 20) {
    return (
      <div className="overlay-wrap">
        <div className="card-modal boss-modal">
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '12px'}}>
            <IconRenderer name="TrendingDown" size={48} className="text-red-500" />
          </div>
          <div className="card-title" style={{color: 'var(--status-boss)', marginBottom: '8px', textAlign: 'center'}}>ล้มเหลว (Evaluation Terminated)</div>
          <div className="card-desc" style={{color: 'var(--color-text-primary)', textAlign: 'center'}}>
            พารามิเตอร์ Trust และ Budget ประเมินผลแล้วไม่อยู่ในเกณฑ์มาตรฐานของบอร์ดบริหาร (ต้องมีมากกว่า 20)<br/><br/>
            <span style={{color: 'var(--color-text-secondary)'}}>โครงการและบทบาทหน้าที่ของคุณถูกระงับทันที</span>
          </div>
          <button className="btn-game" style={{width: '100%'}} onClick={() => handleAcknowledge('lose_fired')}>รับทราบ</button>
        </div>
      </div>
    );
  }

  const hp = 35;
  
  if (bossRoll && !isRolling) {
    const { d1, d2, total } = bossRoll;
    const totalPlayerPower = total + mPower + riskBonus;
    const isWin = totalPlayerPower >= hp;
    
    return (
      <div className="overlay-wrap">
        <div className={`card-modal boss-modal ${isWin ? 'shake' : ''}`} style={isWin ? {borderColor: 'var(--status-opp)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'} : {borderColor: 'var(--status-boss)'}}>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '12px'}}>
            <IconRenderer name={isWin ? "Trophy" : "AlertCircle"} size={64} className={isWin ? "text-yellow-400" : "text-red-500"} />
          </div>
          <div className="card-title" style={{textAlign: 'center', marginBottom: '12px', fontSize: '24px'}}>
            {isWin ? 'ภารกิจเสร็จสิ้น (Pass Audit)' : 'ไม่ผ่านการประเมิน (Fail Audit)'}
          </div>
          
          <div className="boss-dice-wrap">
            <div className="boss-dice-box">{d1}</div>
            <div className="boss-dice-box">{d2}</div>
          </div>

          <div style={{fontSize: '15px', marginBottom: '24px', background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)'}}>
            <div style={{color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px'}}>คะแนนประเมินรวมสุทธิ</div>
            <div style={{fontSize: '48px', fontWeight: 800, color: isWin ? 'var(--status-opp)' : 'var(--status-boss)', lineHeight: 1}}>{totalPlayerPower}</div>
            <div style={{fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px'}}>เกณฑ์มาตรฐาน: {hp}</div>
          </div>

          <button className="btn-boss" style={{background: isWin ? 'var(--status-opp)' : 'var(--status-boss)', fontWeight: 700}} 
            onClick={() => handleAcknowledge(isWin ? 'win_boss' : 'lose_boss')}>
            {isWin ? 'ยืนยันและรับใบรับรองมาตรฐาน' : 'ยอมรับความผิดพลาดและสรุปบทเรียน'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-wrap">
      <div className={`card-modal boss-modal ${isRolling ? 'shake' : ''}`}>
        {isRolling && <div className="audit-scanline" />}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
          <IconRenderer name={isRolling ? "Search" : "Activity"} size={48} className={isRolling ? "dice-rolling text-blue-400" : "text-blue-400"} />
        </div>
        <div className="card-title" style={{textAlign: 'center', marginBottom: '4px'}}>
          {isRolling ? 'ระบบกำลังถูกตรวจสอบ...' : 'เผชิญหน้า External Audit!'}
        </div>
        <div style={{textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '20px'}}>
          {isRolling ? 'หน่วยงานภายนอกกำลังประเมินผลการดำเนินงาน' : 'การตรวจสอบใหญ่ประจำปีเริ่มต้นขึ้นแล้ว!'}
        </div>
        
        <div className="boss-dice-wrap">
          <div className={`boss-dice-box ${isRolling ? 'rolling dice-rolling' : ''}`}>{isRolling ? tempDice.d1 : '?'}</div>
          <div className={`boss-dice-box ${isRolling ? 'rolling dice-rolling' : ''}`}>{isRolling ? tempDice.d2 : '?'}</div>
        </div>

        <div style={{background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '14px', border: '1px solid var(--border-color)', textAlign: 'left', opacity: isRolling ? 0.5 : 1}}>
          <div style={{color: 'var(--status-boss)', fontWeight: 600, textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>Target Standard: {hp}</div>
          <div style={{marginBottom: '4px', display: 'flex', justifyContent: 'space-between'}}><span>Maturity Levels ({mTotal}) x2</span> <span style={{color: 'var(--status-opp)', fontWeight: 600}}>+{mPower}</span></div>
          <div style={{marginBottom: '4px', display: 'flex', justifyContent: 'space-between'}}><span>Risk Buffer Bonus (&gt;50)</span> <span style={{color: 'var(--status-opp)', fontWeight: 600}}>+{riskBonus}</span></div>
        </div>

        <button 
          className="btn-boss" 
          disabled={isRolling}
          onClick={startBossRoll}
          style={{opacity: isRolling ? 0.5 : 1}}
        >
          {isRolling ? 'กำลังประเมินผล...' : 'เริ่มการทอยเต๋าพิพากษา'}
        </button>
      </div>
    </div>
  );
};
