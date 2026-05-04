import React from 'react';
import { Text, View } from 'react-native';
import { AVATARS } from '../lib/colors';

interface AvatarCircleProps {
  id: string;
  size?: number;
  ring?: boolean;
}

export function AvatarCircle({ id, size = 72, ring = false }: AvatarCircleProps) {
  const av = AVATARS.find(a => a.id === id) ?? AVATARS[0];
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: av.color + '22',
      borderWidth: ring ? 4 : 3,
      borderColor: av.color,
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Text style={{ fontSize: size * 0.55, lineHeight: size * 0.7 }}>{av.emoji}</Text>
    </View>
  );
}
