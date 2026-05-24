import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

type Mood = 'happy' | 'cheer' | 'sleep' | 'wave' | 'sad';

interface MascotProps {
  mood?: Mood;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

const MOOD_IMAGES: Record<Mood, any> = {
  // transparent background — safe on any colored surface
  wave:  require('../assets/elephant/cute-chubby-elephant-character--full-body--3-4-vie (1) Background Removed.png'),
  cheer: require('../assets/elephant/cute-chubby-elephant-character--full-body--3-4-vie Background Removed.png'),
  // white background — fine on white/light card surfaces
  happy: require('../assets/elephant/hello.png'),
  sad:   require('../assets/elephant/cute-chubby.png'),
  sleep: require('../assets/elephant/cute-chubby.png'),
};

export function Mascot({ mood = 'happy', size = 120, color, style }: MascotProps) {
  return (
    <Image
      source={MOOD_IMAGES[mood]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
