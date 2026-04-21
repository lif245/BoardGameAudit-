import React from 'react';
import { DOMAINS_DEF } from '../constants';

const RightPanel = ({ gameState, onUseAbility, onUseItem }) => {
  const { char, maturity, items, log } = gameState;

  return (
    <div className="right-panel">
      <div className="panel-box">
        <div className="panel-title">Active Executive Profile</div>
        <div className="cs-header">
          <div className="cs-avatar">{char.avatar}</div>
          <div>
            <div className="cs-name">{char.name}</div>
            <div className="cs-role">{char.title}</div>
          </div>
        </div>
        
        <div>
          {!char.abilityUsed && char.id !== 'dev' ? (
            <button className="btn-game btn-primary-game" style={{ width: '100%', textAlign: 'center' }} onClick={onUseAbility}>
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
        <div className="panel-title">Maturity Metrics (Level 1-5)</div>
        <div className="domain-grid">
          {DOMAINS_DEF.map(d => (
            <div className="dom-row" key={d.id}>
              <div className="dt-name" style={{ color: d.color }}>{d.name}</div>
              <div className="dt-bar">
                <div className="dt-fill" style={{ width: `${(maturity[d.id] / 5) * 100}%`, backgroundColor: d.color }}></div>
              </div>
              <div className="dt-lv">Lv.{maturity[d.id]}</div>
            </div>
          ))}
        </div>
      </div>

      {items.filter(i => i.owned).length > 0 && (
        <div className="panel-box">
          <div className="panel-title">Available Resources</div>
          <div>
            {items.filter(i => i.owned).map(i => (
              <span key={i.id} className="item-chip" onClick={() => onUseItem(i.id)} title={i.desc}>
                {i.icon} {i.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="panel-box" style={{ flex: 1, minHeight: '220px' }}>
        <div className="panel-title">System Activity Log</div>
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
