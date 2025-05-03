
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Award, Shield, ShieldCheck, Medal, Trophy } from 'lucide-react';
import { getRankDisplayName } from '@/utils/rankSystem';

interface RankBadgeProps {
  name: string;
  tier: number;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  name, 
  tier, 
  color, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4'
  };
  
  // Icon size
  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  // Icon selection based on rank
  const RankIcon = () => {
    if (!showIcon) return null;
    
    if (name === 'Legend') {
      return <Crown size={iconSize[size]} className="mr-1" />;
    } else if (name === 'Titan') {
      return <Trophy size={iconSize[size]} className="mr-1" />;
    } else if (name === 'Champion') {
      return <Shield size={iconSize[size]} className="mr-1" />;
    } else if (name === 'Master') {
      return <ShieldCheck size={iconSize[size]} className="mr-1" />;
    } else if (['Crystal', 'Gold'].includes(name)) {
      return <Medal size={iconSize[size]} className="mr-1" />;
    } else {
      return <Award size={iconSize[size]} className="mr-1" />;
    }
  };

  // Render badge with SVG shield or medal
  return (
    <Badge 
      className={`inline-flex items-center font-semibold relative overflow-visible ${sizeClasses[size]} ${className}`}
      style={{
        background: 'transparent',
        border: 'none',
        color: getBadgeTextColor(color)
      }}
    >
      <div className="absolute inset-0 -z-10">
        {renderRankBadgeSVG(name, color)}
      </div>
      <div className="relative z-10 flex items-center">
        <RankIcon />
        {getRankDisplayName(name, tier)}
      </div>
    </Badge>
  );
};

// Helper function to determine if text should be white or black based on background color
const getBadgeTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  
  if (backgroundColor.startsWith('#')) {
    r = parseInt(backgroundColor.slice(1, 3), 16);
    g = parseInt(backgroundColor.slice(3, 5), 16);
    b = parseInt(backgroundColor.slice(5, 7), 16);
  }
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#222222' : '#FFFFFF';
};

// Render the SVG for different rank badges
const renderRankBadgeSVG = (name: string, color: string): JSX.Element => {
  switch (name) {
    case 'Legend':
      // Crown-shaped badge for Legend
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <filter id="legendShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.5" />
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feFlood floodColor="#FFFFFF" floodOpacity="0.3" result="glow" />
              <feComposite in="glow" in2="blur" operator="in" result="glowBlur" />
              <feMerge>
                <feMergeNode in="glowBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M10,20 L20,5 L40,15 L60,0 L80,15 L100,5 L110,20 L110,30 C110,35 80,40 60,40 C40,40 10,35 10,30 Z" 
                fill="url(#legendGradient)" 
                filter="url(#legendShadow)" 
                strokeWidth="1" 
                stroke="#FFD700" />
        </svg>
      );
    
    case 'Titan':
      // Dragon-inspired shield for Titan
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="titanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#771414" />
            </linearGradient>
            <filter id="titanShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M10,5 C10,5 25,0 60,0 C95,0 110,5 110,5 L110,20 C110,30 90,40 60,40 C30,40 10,30 10,20 Z" 
                fill="url(#titanGradient)" 
                filter="url(#titanShadow)" 
                strokeWidth="1" 
                stroke="#771414" />
          <path d="M30,10 L30,25 C30,25 45,30 60,30 C75,30 90,25 90,25 L90,10" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="1" 
                strokeOpacity="0.3" />
        </svg>
      );
    
    case 'Champion':
      // Champion shield with emblem
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="championGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#1a237e" />
            </linearGradient>
            <filter id="championShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <path d="M10,0 L110,0 L110,20 C110,30 90,40 60,40 C30,40 10,30 10,20 Z" 
                fill="url(#championGradient)" 
                filter="url(#championShadow)" 
                strokeWidth="1" 
                stroke="#1a237e" />
          <circle cx="60" cy="17" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M55,17 L60,22 L65,17" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      );
    
    case 'Master':
      // Master shield with wings
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="masterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#4a148c" />
            </linearGradient>
            <filter id="masterShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <path d="M20,0 L100,0 L100,20 C100,30 85,40 60,40 C35,40 20,30 20,20 Z" 
                fill="url(#masterGradient)" 
                filter="url(#masterShadow)" 
                strokeWidth="1" 
                stroke="#4a148c" />
          <path d="M20,0 C20,0 10,10 0,20" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M100,0 C100,0 110,10 120,20" fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    
    case 'Crystal':
      // Crystal-like badge
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#006064" />
            </linearGradient>
            <filter id="crystalShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
            </filter>
          </defs>
          <polygon points="60,0 20,10 20,30 60,40 100,30 100,10" 
                   fill="url(#crystalGradient)" 
                   filter="url(#crystalShadow)" 
                   strokeWidth="1" 
                   stroke="#006064" />
          <line x1="60" y1="0" x2="60" y2="40" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      );
    
    case 'Gold':
      // Gold medal
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="60%" stopColor="#ff6f00" />
            </linearGradient>
            <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.5" floodColor="rgba(255, 215, 0, 0.5)" />
            </filter>
          </defs>
          <circle cx="60" cy="20" r="20" 
                  fill="url(#goldGradient)" 
                  filter="url(#goldShadow)" 
                  strokeWidth="1.5" 
                  stroke="#ff6f00" />
          <circle cx="60" cy="20" r="15" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M50,10 L70,30 M50,30 L70,10" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      );
    
    case 'Silver':
      // Silver medal
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="70%" stopColor="#9e9e9e" />
            </linearGradient>
            <filter id="silverShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="60" cy="20" r="18" 
                  fill="url(#silverGradient)" 
                  filter="url(#silverShadow)" 
                  strokeWidth="1" 
                  stroke="#9e9e9e" />
          <circle cx="60" cy="20" r="13" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M55,15 L65,25 M55,25 L65,15" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      );
    
    default: // Bronze
      // Bronze medal
      return (
        <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="80%" stopColor="#8d6e63" />
            </linearGradient>
            <filter id="bronzeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.2" />
            </filter>
          </defs>
          <circle cx="60" cy="20" r="16" 
                  fill="url(#bronzeGradient)" 
                  filter="url(#bronzeShadow)" 
                  strokeWidth="1" 
                  stroke="#8d6e63" />
          <circle cx="60" cy="20" r="12" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1" />
        </svg>
      );
  }
};

export default RankBadge;
