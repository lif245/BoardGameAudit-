import React from 'react';
import { DOMAINS_DEF } from '../constants';
import IconRenderer from '../utils/IconRenderer';
import { soundEngine } from '../utils/soundEngine';

const RightPanel = ({ gameState, onUseAbility, onUseItem }) => {
  const { char, maturity, items, log } = gameState;

  const handleAction = (fn) => {
    soundEngine.playClick();
    fn();
  };

  return (
    <div className="right-panel">
      <div className="panel-box">
        <div className="panel-title">ความสามารถเฉพาะตัว (Profile)</div>
        <div className="cs-header">
          <div className="cs-avatar" style={{ overflow: 'hidden' }}>
            {char.img ? <img src={char.img} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconRenderer name={char.iconName} size={32} />}
          </div>
          <div>
            <div className="cs-name">{char.name}</div>
            <div className="cs-role">{char.title}</div>
          </div>
        </div>
        
        <div>
          {!char.abilityUsed && char.id !== 'dev' ? (
            <button className="btn-game btn-primary-game" style={{ width: '100%', textAlign: 'center' }} onClick={() => handleAction(onUseAbility)}>
              ⚡ ใช้สกิล: {char.ability}
            </button>
          ) : char.id === 'dev' ? (
            <button className="btn-game" style={{ width: '100%', cursor: 'default' }} disabled>
              ⚡ เสริมประสิทธิภาพ (Passive)
            </button>
          ) : (
            <button className="btn-game" style={{ width: '100%', cursor: 'default', borderStyle: 'dashed' }} disabled>
              ⚡ สกิลหมดความพร้อม
            </button>
          )}
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-title">ดัชนีชี้วัดขีดความสามารถ (Maturity Lv.1-5)</div>
        <div className="domain-grid">
          {DOMAINS_DEF.map(d => (
            <div className="dom-row" key={d.id}>
              <div className="dt-name" style={{ color: d.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconRenderer name={d.iconName} size={14} />
                {d.name}
              </div>
              <div className="dt-bar">
                <div className="dt-fill" style={{ width: `${(maturity[d.id] / 5) * 100}%`, background: `linear-gradient(90deg, transparent 0%, ${d.color} 100%)` }}></div>
              </div>
              <div className="dt-lv">Lv.{maturity[d.id]}</div>
            </div>
          ))}
        </div>
      </div>

      {items.filter(i => i.owned).length > 0 && (
        <div className="panel-box">
          <div className="panel-title">ทรัพยากรตัวช่วยที่มีอยู่</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {items.filter(i => i.owned).map(i => (
              <span key={i.id} className="item-chip" onClick={() => handleAction(() => onUseItem(i.id))} title={i.desc}>
                <IconRenderer name={i.iconName} size={14} /> {i.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="panel-box" style={{ flex: 1, minHeight: '220px' }}>
        <div className="panel-title">บันทึกเหตุการณ์ระบบ (Logs)</div>
        <div className="log-panel">
          {log.map((l, index) => (
            <div className="log-entry" key={index}>
              <div className="log-turn">T{l.turn}</div>
              <div>{l.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

