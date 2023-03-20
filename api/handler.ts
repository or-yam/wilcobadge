import { readFileSync } from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const WILCO_PROFILE_API = 'https://engine.wilco.gg/api/v1/profile/';
const ICON_NAMES = {
  coin: 'coin',
  xp: 'xp',
  trophy: 'trophy',
  logo: 'logo'
} as const;

type Stats = {
  xp: number;
  wilCoins: number;
  quests: number;
};
type Icon = keyof typeof ICON_NAMES;
type statsIconNames = Exclude<Icon, 'logo'>;

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

async function getWilcoStats(wilcoName: string): Promise<Stats> {
  const stats = await fetch(`${WILCO_PROFILE_API}${wilcoName}`)
    .then(res => res.json())
    .then(data => ({ xp: data.xp, wilCoins: data.gems, quests: data?.finishedQuests?.length } satisfies Stats))
    .catch(e => {
      console.log(e.message);
      return { xp: 0, wilCoins: 0, quests: 0 } satisfies Stats;
    });
  return stats;
}

function generateStatsIcon(iconName: Icon, value?: number): string {
  const file = path.join(process.cwd(), 'public/icons', `${iconName}.svg`);
  const svgIcon = readFileSync(file, 'utf8');

  if (iconName === ICON_NAMES.logo || value === undefined) return svgIcon;

  const text = createSvgTextTemplate(iconName, value);
  return `${svgIcon} ${text}`;
}

function generateSvgBadge(stats: Stats) {
  const svgLogo = generateStatsIcon(ICON_NAMES.logo);
  const svgCoin = generateStatsIcon(ICON_NAMES.coin, stats.wilCoins);
  const svgTrophy = generateStatsIcon(ICON_NAMES.trophy, stats.quests);
  const svgXp = generateStatsIcon(ICON_NAMES.xp, stats.xp);
  const badge = createSvgBadgeTemplate(svgLogo, svgCoin, svgTrophy, svgXp);
  return badge;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { wilconame: wilcoName } = request.query;

  if (!wilcoName || Array.isArray(wilcoName)) {
    response.status(404).send('no username 🤷‍♀️');
    return;
  }

  try {
    const wilcoStats = await getWilcoStats(wilcoName);
    const svgBadge = generateSvgBadge(wilcoStats);
    response.setHeader('Content-Type', 'image/svg+xml');
    response.send(svgBadge);
  } catch (error) {
    //TODO Handle error with message and an svg without stats.
    response.status(500).send('something went wrong 😱');
  }
}
