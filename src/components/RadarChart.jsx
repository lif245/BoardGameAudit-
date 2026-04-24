import React from 'react';

const RadarChart = ({ data, domains, size = 300 }) => {
  const padding = 50;
  const center = size / 2;
  const radius = (size - padding * 2) / 2;
  
  // Calculate points for the polygons
  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    // value is 1-5, normalize to 0-1
    const normalizedValue = (value - 0) / 5; 
    const x = center + radius * normalizedValue * Math.cos(angle);
    const y = center + radius * normalizedValue * Math.sin(angle);
    return { x, y };
  };

  const total = domains.length;
  
  // Grid lines (pentagon rings)
  const rings = [1, 2, 3, 4, 5].map(v => {
    return domains.map((_, i) => {
      const p = getPoint(v, i, total);
      return `${p.x},${p.y}`;
    }).join(' ');
  });

  // Axis lines
  const axes = domains.map((_, i) => {
    const p = getPoint(5, i, total);
    return { x1: center, y1: center, x2: p.x, y2: p.y };
  });

  // Data polygon
  const dataPoints = domains.map((d, i) => {
    const p = getPoint(data[d.id] || 1, i, total);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Labels
  const labels = domains.map((d, i) => {
    const p = getPoint(5.8, i, total); // Slightly outside the chart
    return { x: p.x, y: p.y, text: d.name, color: d.color };
  });

  return (
    <div className="radar-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        {/* Background Rings */}
        {rings.map((r, i) => (
          <polygon key={i} points={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        
        {/* Axis Lines */}
        {axes.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}

        {/* Data Area */}
        <polygon 
          points={dataPoints} 
          fill="rgba(59, 130, 246, 0.3)" 
          stroke="var(--primary-blue)" 
          strokeWidth="2"
          style={{ transition: 'all 0.5s ease-out' }}
        />

        {/* Data Points (Glow) */}
        {domains.map((d, i) => {
          const p = getPoint(data[d.id] || 1, i, total);
          return (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--primary-blue)" style={{ filter: 'drop-shadow(0 0 5px var(--primary-blue))' }} />
          );
        })}
      </svg>

      {/* Labels Overlay */}
      {labels.map((l, i) => (
        <div 
          key={i} 
          style={{ 
            position: 'absolute', 
            left: l.x, 
            top: l.y, 
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            fontWeight: 800,
            color: l.color,
            textShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};

export default RadarChart;
