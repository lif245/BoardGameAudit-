import React from 'react';

export const EventModal = ({ eventInfo, onMakeChoice }) => {
  if (!eventInfo) return null;
  const { type, ev } = eventInfo;
  
  const badge = type === 'risk' 
    ? <div className="card-badge badge-risk">Critical Risk Scenario</div> 
    : <div className="card-badge badge-opp">Strategic Opportunity</div>;
  const iconHtml = type === 'risk' ? '⚠️' : '💡';

  return (
    <div className="overlay-wrap">
      <div className="card-modal">
        <div className="card-header">
          <div className="card-icon">{iconHtml}</div>
          <div>{badge}<div className="card-title">{ev.title}</div></div>
        </div>
        <div className="card-desc">{ev.desc}</div>
        <div style={{fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '10px'}}>
          Select Response Protocol:
        </div>
        <div className="choice-list">
          {ev.choices.map((c, i) => (
            <button key={i} className="choice-btn" onClick={() => onMakeChoice(i)}>
              {c.text}<span className="choice-label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ResultModal = ({ choice, chips, onClose }) => {
  return (
    <div className="overlay-wrap">
      <div className="card-modal">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <div>
            <div className="card-badge" style={{background: '#334155'}}>System Metrics Update</div>
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
          <button className="btn-game btn-primary-game" onClick={onClose}>ดำเนินการต่อ</button>
        </div>
      </div>
    </div>
  );
};

export const BossModal = ({ gameState, mTotal, mPower, riskBonus, bossRoll, onRollBoss, onAcknowledgeBoss }) => {
  if (gameState.trust <= 20 || gameState.budget <= 20) {
    return (
      <div className="overlay-wrap">
        <div className="card-modal boss-modal">
          <div style={{fontSize: '42px', marginBottom: '12px'}}>📉</div>
          <div className="card-title" style={{color: 'var(--status-boss)', marginBottom: '8px'}}>Evaluation Terminated</div>
          <div className="card-desc" style={{color: 'var(--color-text-primary)'}}>
            พารามิเตอร์ Trust และ Budget ประเมินผลแล้วไม่อยู่ในเกณฑ์มาตรฐานของบอร์ดบริหาร (ต้องมีมากกว่า 20)<br/><br/>
            <span style={{color: 'var(--color-text-secondary)'}}>โครงการและบทบาทหน้าที่ของคุณถูกระงับทันที</span>
          </div>
          <button className="btn-game" style={{width: '100%'}} onClick={() => onAcknowledgeBoss('lose_fired')}>Acknowledge</button>
        </div>
      </div>
    );
  }

  const hp = 35;
  
  if (bossRoll) {
    const { d1, d2, total } = bossRoll;
    const totalPlayerPower = total + mPower + riskBonus;
    const isWin = totalPlayerPower >= hp;
    
    return (
      <div className="overlay-wrap">
        <div className="card-modal" style={isWin ? {borderColor: 'var(--status-opp)'} : {borderColor: 'var(--status-boss)'}}>
          <div style={{fontSize: '42px', marginBottom: '12px', textAlign: 'center'}}>📊</div>
          <div className="card-title" style={{textAlign: 'center', marginBottom: '12px'}}>Audit Result: {isWin?'Passed':'Failed'}</div>
          
          <div style={{fontSize: '16px', marginBottom: '16px', textAlign: 'center', color: 'var(--color-text-secondary)'}}>
            Random Variance: {d1} + {d2} <b style={{color: 'var(--color-text-primary)'}}>= {total}</b>
          </div>

          <div style={{fontSize: '15px', marginBottom: '24px', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center'}}>
            คะแนนประเมินรวมสุทธิ = <br/>
            <span style={{fontSize: '32px', fontWeight: 700, color: isWin ? 'var(--status-opp)' : 'var(--status-boss)', fontFamily: "'Inter', sans-serif"}}>{totalPlayerPower}</span><br/>
            <span style={{fontSize: '12px', color: 'var(--color-text-secondary)'}}>(Target Threshold: {hp})</span>
          </div>

          <button className="btn-boss" style={{background: isWin ? 'var(--status-opp)' : 'var(--status-boss)'}} 
            onClick={() => onAcknowledgeBoss(isWin ? 'win_boss' : 'lose_boss')}>
            {isWin ? 'Acknowledge Success 🏆' : 'Acknowledge Failure 💀'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-wrap">
      <div className="card-modal boss-modal">
        <div style={{fontSize: '48px', marginBottom: '10px', textAlign: 'center'}}>🕵️</div>
        <div className="card-title" style={{textAlign: 'center', marginBottom: '4px'}}>The Ultimate External Audit</div>
        <div style={{textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '20px'}}>การตรวจสอบใหญ่ประจำปีเริ่มต้นขึ้นแล้ว!</div>
        
        <div style={{background: 'var(--bg-dark)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '14px', border: '1px solid var(--border-color)', textAlign: 'left'}}>
          <div style={{color: 'var(--status-boss)', fontWeight: 600, textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase'}}>เกณฑ์มาตรฐานที่ต้องผ่าน (Target): {hp}</div>
          <div style={{color: 'var(--primary-blue)', fontWeight: 500, marginBottom: '8px'}}>ประเมินระบบป้องกันอัตโนมัติ:</div>
          <div style={{marginBottom: '4px', display: 'flex', justifyContent: 'space-between'}}><span>Maturity Levels ({mTotal}) x2</span> <span style={{color: 'var(--status-opp)', fontWeight: 600}}>+{mPower}</span></div>
          <div style={{marginBottom: '4px', display: 'flex', justifyContent: 'space-between'}}><span>Risk Buffer Bonus (&gt;50)</span> <span style={{color: 'var(--status-opp)', fontWeight: 600}}>+{riskBonus}</span></div>
          <div style={{marginTop: '12px', borderTop: '1px dashed var(--border-focus)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between'}}>
            <span style={{color: 'var(--status-risk)', fontWeight: 500}}>Random Execution (Roll 2 Dice)</span> <span>🎲 ?</span>
          </div>
        </div>

        <button className="btn-boss" onClick={onRollBoss}>Execute Defense Protocols 🎲🎲</button>
      </div>
    </div>
  );
};
