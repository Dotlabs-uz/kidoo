export const Colors = {
  // === Background gradient ===
  bgTop: '#7B92FF',
  bgBottom: '#9EB0FF',
  screenBg: '#8A9FFF',

  // === CTA buttons ===
  purple: '#9333EA',
  purpleLight: '#A855F7',
  orange: '#FF9800',
  orangeLight: '#FFA726',

  // === Semantic ===
  success: '#22C55E',
  successDark: '#16A34A',
  successSoft: '#DCFCE7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  star: '#FFBA00',
  starDark: '#D97706',
  pink: '#EC4899',
  pinkDark: '#BE185D',
  pinkSoft: '#FDF2F8',

  // === Surfaces ===
  card: '#FFFFFF',
  glass: 'rgba(255,255,255,0.22)',
  glassBorder: 'rgba(255,255,255,0.35)',

  // === Text ===
  textWhite: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.72)',
  ink: '#1E1B4B',
  ink2: '#4B5563',
  ink3: '#9CA3AF',
  ink4: '#D1D5DB',
  line: '#E5E7EB',

  // === Bg (used in forms/inputs - light) ===
  bg: '#F4F6FF',

  // === Legacy aliases ===
  primary: '#9333EA',
  primaryDark: '#7E22CE',
  primarySoft: 'rgba(147,51,234,0.10)',
  teal: '#22C55E',
  tealDark: '#7B92FF',
  tealMid: '#9333EA',
  tealSoft: 'rgba(147,51,234,0.08)',
  blue: '#7B92FF',
  blueSoft: 'rgba(123,146,255,0.15)',
};

export const CardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 } as { width: number; height: number },
  shadowOpacity: 0.10,
  shadowRadius: 24,
  elevation: 6,
};

export const AVATARS = [
  { id: 'fox',   name: 'Лиса',    color: '#FF8A3D', emoji: '🦊' },
  { id: 'bear',  name: 'Мишка',   color: '#A0703D', emoji: '🐻' },
  { id: 'cat',   name: 'Котик',   color: '#FFBA00', emoji: '🐱' },
  { id: 'panda', name: 'Панда',   color: '#2A2540', emoji: '🐼' },
  { id: 'frog',  name: 'Лягушка', color: '#22C55E', emoji: '🐸' },
  { id: 'owl',   name: 'Совёнок', color: '#7C5CFF', emoji: '🦉' },
] as const;
