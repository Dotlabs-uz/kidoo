export const Colors = {
  primary: '#7C5CFF',
  primaryDark: '#5B3DCC',
  primarySoft: '#EDE7FF',

  teal: '#3ECFAC',
  tealDark: '#0D4F3C',
  tealMid: '#1A7A5E',
  tealSoft: '#E0F7F0',

  star: '#FFD23F',
  starDark: '#E0A82E',

  success: '#2ED573',
  successDark: '#1FA85B',

  danger: '#FF6B6B',
  pink: '#FF6B9D',
  pinkDark: '#D14079',
  orange: '#FF8A3D',
  blue: '#5BC0FF',

  bg: '#F8F6FF',
  card: '#FFFFFF',
  ink: '#1A1330',
  ink2: '#4A4063',
  ink3: '#8A82A8',
  ink4: '#C7C0DA',
  line: '#EFEAF5',
};

export const CardShadow = {
  shadowColor: '#1A1330',
  shadowOffset: { width: 0, height: 4 } as { width: number; height: number },
  shadowOpacity: 0.07,
  shadowRadius: 16,
  elevation: 3,
};

export const AVATARS = [
  { id: 'fox',   name: 'Лиса',    color: '#FF8A3D', emoji: '🦊' },
  { id: 'bear',  name: 'Мишка',   color: '#A0703D', emoji: '🐻' },
  { id: 'cat',   name: 'Котик',   color: '#FFD23F', emoji: '🐱' },
  { id: 'panda', name: 'Панда',   color: '#2A2540', emoji: '🐼' },
  { id: 'frog',  name: 'Лягушка', color: '#2ED573', emoji: '🐸' },
  { id: 'owl',   name: 'Совёнок', color: '#9B7CFF', emoji: '🦉' },
] as const;
