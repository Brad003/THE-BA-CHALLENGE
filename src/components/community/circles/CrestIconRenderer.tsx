import React from 'react';
import {
  Mountain,
  Shield,
  Flame,
  Crown,
  Swords,
  TreePine,
  Zap,
  Footprints
} from 'lucide-react';
import { CircleCrestIcon } from '../../../types';

interface CrestIconRendererProps {
  icon: CircleCrestIcon;
  className?: string;
  themeColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CrestIconRenderer: React.FC<CrestIconRendererProps> = ({
  icon,
  className = '',
  themeColor = '#10b981',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-11 h-11'
  };

  const iconClass = `${sizeMap[size]} ${className}`;

  switch (icon) {
    case 'Mountain':
      return <Mountain className={iconClass} style={{ color: themeColor }} />;
    case 'Shield':
      return <Shield className={iconClass} style={{ color: themeColor }} />;
    case 'Flame':
      return <Flame className={iconClass} style={{ color: themeColor }} />;
    case 'Crown':
      return <Crown className={iconClass} style={{ color: themeColor }} />;
    case 'Swords':
      return <Swords className={iconClass} style={{ color: themeColor }} />;
    case 'TreePine':
      return <TreePine className={iconClass} style={{ color: themeColor }} />;
    case 'Zap':
      return <Zap className={iconClass} style={{ color: themeColor }} />;
    case 'Footprints':
      return <Footprints className={iconClass} style={{ color: themeColor }} />;
    default:
      return <Shield className={iconClass} style={{ color: themeColor }} />;
  }
};
