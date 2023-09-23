export type Stats = {
  xp: number;
  wilCoins: number;
  quests: number;
};

export type Icon = keyof typeof ICON_NAMES;

export type statsIconNames = Exclude<Icon, 'logo'>;

export const ICON_NAMES = {
  coin: 'coin',
  xp: 'xp',
  trophy: 'trophy',
  logo: 'logo'
} as const;
