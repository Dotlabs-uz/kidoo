import 'react-native-url-polyfill/auto';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

function App() {
  // @ts-expect-error require.context is a webpack/metro API not in TS types
  const ctx = require.context('./app');
  return React.createElement(ExpoRoot, { context: ctx });
}

registerRootComponent(App);
