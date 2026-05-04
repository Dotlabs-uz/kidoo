import React from 'react';
import { Circle, Line, Path, Rect, Svg } from 'react-native-svg';
import { Colors } from '../lib/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  active?: boolean;
  mode?: 'parent' | 'child';
}

export function Icon({ name, size = 24, color, active = false, mode = 'parent' }: IconProps) {
  const c = color ?? (active ? (mode === 'child' ? Colors.success : Colors.primary) : Colors.ink3);
  const sw = 2.4;
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'tasks':
      return (
        <Svg {...props}>
          <Rect x="3.5" y="4" width="17" height="17" rx="4" />
          <Path d="M8 11l3 3 5-6" />
        </Svg>
      );
    case 'gift':
      return (
        <Svg {...props}>
          <Rect x="3" y="9" width="18" height="12" rx="2.5" />
          <Path d="M3 13h18" />
          <Path d="M12 9v12" />
          <Path d="M8 9c-1.5 0-2.5-1-2.5-2.5S6.5 4 8 4c2 0 4 4 4 4s2-4 4-4c1.5 0 2.5 1 2.5 2.5S17.5 9 16 9" />
        </Svg>
      );
    case 'chart':
      return (
        <Svg {...props}>
          <Path d="M4 19V9" />
          <Path d="M10 19V5" />
          <Path d="M16 19v-7" />
          <Path d="M3 21h18" />
        </Svg>
      );
    case 'profile':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...props} strokeWidth={3}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case 'back':
      return (
        <Svg {...props} strokeWidth={3}>
          <Path d="M15 6l-6 6 6 6" />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth={1.5} strokeLinejoin="round">
          <Path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.5l1.1-6L3.4 9.3l6-.8L12 3z" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props} strokeWidth={3}>
          <Path d="M5 12l5 5 9-10" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...props}>
          <Rect x="5" y="11" width="14" height="9" rx="2.5" />
          <Path d="M8 11V8a4 4 0 018 0v3" />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...props}>
          <Path d="M5 7h14" />
          <Path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          <Path d="M7 7l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...props}>
          <Rect x="4" y="5" width="16" height="16" rx="3" />
          <Path d="M4 10h16" />
          <Path d="M9 3v4M15 3v4" />
        </Svg>
      );
    case 'copy':
      return (
        <Svg {...props}>
          <Rect x="8" y="8" width="12" height="12" rx="2.5" />
          <Path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
        </Svg>
      );
    case 'switch':
      return (
        <Svg {...props}>
          <Path d="M7 4l-3 3 3 3" />
          <Path d="M4 7h12a4 4 0 014 4" />
          <Path d="M17 20l3-3-3-3" />
          <Path d="M20 17H8a4 4 0 01-4-4" />
        </Svg>
      );
    case 'logout':
      return (
        <Svg {...props}>
          <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <Path d="M16 17l5-5-5-5" />
          <Path d="M21 12H9" />
        </Svg>
      );
    case 'edit':
      return (
        <Svg {...props}>
          <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </Svg>
      );
    default:
      return null;
  }
}
