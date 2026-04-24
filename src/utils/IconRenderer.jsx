import React from 'react';
import * as Lucide from 'lucide-react';

const IconRenderer = ({ name, size = 16, className = "" }) => {
  const Icon = Lucide[name];
  return Icon ? <Icon size={size} className={className} /> : null;
};

export default IconRenderer;
