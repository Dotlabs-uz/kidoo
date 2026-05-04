import React from 'react';
import { View } from 'react-native';
import { Icon } from './Icon';

interface StarGroupProps {
  count: number;
  size?: number;
}

export function StarGroup({ count, size = 16 }: StarGroupProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={size} color="#FFC700" />
      ))}
    </View>
  );
}
