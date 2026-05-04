import React from 'react';
import { Circle, Ellipse, Path, Svg, Text } from 'react-native-svg';

type Mood = 'happy' | 'cheer' | 'sleep' | 'wave' | 'sad';

interface MascotProps {
  mood?: Mood;
  size?: number;
  color?: string;
}

export function Mascot({ mood = 'happy', size = 120, color = '#7C5CFF' }: MascotProps) {
  const eyeY = mood === 'sleep' ? 60 : 56;
  const closed = mood === 'sleep' || mood === 'cheer';
  const trunkEnd = mood === 'cheer' ? { cx: 96, cy: 84 } : { cx: 88, cy: 90 };
  const trunkPath = mood === 'cheer'
    ? 'M 68 80 Q 72 96 84 96 Q 96 96 96 84'
    : 'M 68 80 Q 70 94 78 96 Q 86 98 88 90';

  const mouth = (() => {
    if (mood === 'cheer') return <Path d="M 56 76 Q 70 90 84 76" stroke="#3A1F6B" strokeWidth={4} fill="#FF6B9D" strokeLinecap="round" />;
    if (mood === 'sad') return <Path d="M 60 80 Q 70 72 80 80" stroke="#3A1F6B" strokeWidth={4} fill="none" strokeLinecap="round" />;
    if (mood === 'sleep') return <Path d="M 62 78 Q 70 82 78 78" stroke="#3A1F6B" strokeWidth={3} fill="none" strokeLinecap="round" />;
    return <Path d="M 60 76 Q 70 84 80 76" stroke="#3A1F6B" strokeWidth={4} fill="none" strokeLinecap="round" />;
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      {/* shadow */}
      <Ellipse cx="70" cy="128" rx="34" ry="5" fill="rgba(0,0,0,0.12)" />
      {/* body */}
      <Ellipse cx="70" cy="100" rx="38" ry="32" fill={color} />
      {/* belly */}
      <Ellipse cx="70" cy="108" rx="22" ry="18" fill="rgba(255,255,255,0.25)" />
      {/* ears */}
      <Ellipse cx="32" cy="58" rx="16" ry="20" fill={color} transform="rotate(-20, 32, 58)" />
      <Ellipse cx="108" cy="58" rx="16" ry="20" fill={color} transform="rotate(20, 108, 58)" />
      <Ellipse cx="34" cy="60" rx="9" ry="12" fill="rgba(255,255,255,0.3)" transform="rotate(-20, 34, 60)" />
      <Ellipse cx="106" cy="60" rx="9" ry="12" fill="rgba(255,255,255,0.3)" transform="rotate(20, 106, 60)" />
      {/* head */}
      <Circle cx="70" cy="62" r="34" fill={color} />
      {/* trunk */}
      <Path d={trunkPath} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
      <Circle cx={trunkEnd.cx} cy={trunkEnd.cy} r="5" fill="rgba(0,0,0,0.15)" />
      {/* tusks */}
      <Path d="M 60 82 Q 58 88 60 92" stroke="#FFF8E0" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M 80 82 Q 82 88 80 92" stroke="#FFF8E0" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* eyes */}
      {closed ? (
        <>
          <Path d={`M 50 ${eyeY} Q 56 ${eyeY - 4} 62 ${eyeY}`} stroke="#1A1330" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d={`M 78 ${eyeY} Q 84 ${eyeY - 4} 90 ${eyeY}`} stroke="#1A1330" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx="56" cy={eyeY} r="6" fill="white" />
          <Circle cx="84" cy={eyeY} r="6" fill="white" />
          <Circle cx="57" cy={eyeY + 1} r="3.5" fill="#1A1330" />
          <Circle cx="85" cy={eyeY + 1} r="3.5" fill="#1A1330" />
          <Circle cx="58" cy={eyeY} r="1.2" fill="white" />
          <Circle cx="86" cy={eyeY} r="1.2" fill="white" />
        </>
      )}
      {/* cheeks */}
      <Circle cx="46" cy="70" r="5" fill="#FF6B9D" opacity={0.55} />
      <Circle cx="94" cy="70" r="5" fill="#FF6B9D" opacity={0.55} />
      {mouth}
      {/* hair tuft */}
      <Path d="M 66 28 Q 70 18 74 28" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* cheer extras */}
      {mood === 'cheer' && (
        <>
          <Text x="14" y="40" fontSize={22}>⭐</Text>
          <Text x="108" y="34" fontSize={18}>✨</Text>
          <Text x="2" y="90" fontSize={14}>✨</Text>
        </>
      )}
      {mood === 'sleep' && (
        <>
          <Text x="100" y="30" fontSize={14} fill="#8A82A8" fontWeight="800">z</Text>
          <Text x="110" y="22" fontSize={18} fill="#8A82A8" fontWeight="800">Z</Text>
        </>
      )}
    </Svg>
  );
}
