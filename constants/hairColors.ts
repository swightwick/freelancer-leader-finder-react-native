export const hairColors: Record<string, string> = {
  black: '#1a1a1a',
  blonde: '#f5deb3',
  brown: '#8b4513',
  gray: '#808080',
  red: '#dc143c',
  bald: '#d4af37',
};

export const hairColorOptions = [
  { label: 'Any', value: 'any' as const },
  { label: 'Black', value: 'black' as const, color: '#1a1a1a' },
  { label: 'Blonde', value: 'blonde' as const, color: '#f4d03f' },
  { label: 'Brown', value: 'brown' as const, color: '#8b4513' },
  { label: 'Gray', value: 'gray' as const, color: '#808080' },
  { label: 'Red', value: 'red' as const, color: '#dc143c' },
  { label: 'Bald', value: 'bald' as const },
];
