import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ICON_NAMES, Icon, Stats, statsIconNames } from './types.js';

const textXPosition: Record<statsIconNames, number> = {
  coin: 114,
  xp: 174,
  trophy: 236
};

const iconLabels: Record<statsIconNames, string> = {
  coin: 'Wilcoins',
  xp: 'XP',
  trophy: 'Quests'
};

const textStyles = 'text-anchor="middle" font-size="14" fill="#a4a4a7"';

const createSvgTextTemplate = (iconName: statsIconNames, value: number) =>
  `<text ${textStyles} x='${textXPosition[iconName]}' y="60">${value}</text>
   <text ${textStyles} x='${textXPosition[iconName]}' y="75">${iconLabels[iconName]}</text>`;

const createSvgBadgeTemplate = (svgLogo: string, svgCoin: string, svgXp: string, svgTrophy: string) =>
  `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="270"
  height="90"
  viewBox="0 0 270 90"
  fill="none"
  style="
    background: linear-gradient(312.39deg, #855BBA 8.04%, #2EA9ED 19.62%, #5AB993 28.18%, #8ACA40 37.74%, #C3C232 48.81%, #FEBA2C 62.53%, #F77125 75.11%, #F02A23 87.16%, #C03450 93.71%);
    background-repeat: no-repeat;
    border-radius: 0.375rem;
  ">
    <rect x="2.5" y="2.5" rx="5" width="265" height="85" fill="#2f3136"></rect>
    <svg  width="260" height="80" x="5" y="5" viewBox="0 0 260 80" fill="none">
      ${svgLogo}
      ${svgCoin}
      ${svgXp}
      ${svgTrophy}
    </svg>
</svg>`;

function generateStatsIcon(iconName: Icon, value?: number): string {
  const file = path.join(process.cwd(), 'public/icons', `${iconName}.svg`);
  const svgIcon = readFileSync(file, 'utf8');

  if (iconName === ICON_NAMES.logo || value === undefined) return svgIcon;

  const text = createSvgTextTemplate(iconName, value);
  return `${svgIcon} ${text}`;
}

export function generateSvgBadge(stats: Stats) {
  const svgLogo = generateStatsIcon(ICON_NAMES.logo);
  const svgCoin = generateStatsIcon(ICON_NAMES.coin, stats.wilCoins);
  const svgTrophy = generateStatsIcon(ICON_NAMES.trophy, stats.quests);
  const svgXp = generateStatsIcon(ICON_NAMES.xp, stats.xp);
  const badge = createSvgBadgeTemplate(svgLogo, svgCoin, svgTrophy, svgXp);
  return badge;
}
