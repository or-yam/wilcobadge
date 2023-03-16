import { readFileSync } from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Stats = {
  xp: number;
  wilCoins: number;
  quests: number;
};

const iconNames = {
  coin: 'coin',
  xp: 'xp',
  trophy: 'trophy',
  logo: 'logo'
} as const;

type Icon = keyof typeof iconNames;

const WILCO_PROFILE_API = 'https://engine.wilco.gg/api/v1/profile/';

const textXPosition = {
  coin: 47,
  xp: 95,
  trophy: 152
};

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

  if (iconName === 'logo' || value === undefined) return svgIcon;

  const text = `<text font-size="18" stroke="black" fill="black" x='${textXPosition[iconName]}' y="50">${value}</text>`;

  return `${svgIcon} ${text}`;
}

function generateSvgBadge(stats: Stats) {
  const svgLogo = generateStatsIcon(iconNames.logo);
  const svgCoin = generateStatsIcon(iconNames.coin, stats.wilCoins);
  const svgTrophy = generateStatsIcon(iconNames.trophy, stats.quests);
  const svgXp = generateStatsIcon(iconNames.xp, stats.xp);
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80" fill="none">
  ${svgLogo}
  ${svgCoin}
  ${svgXp}
  ${svgTrophy}
  </svg>`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { wilconame: wilcoName } = request.query;

  if (!wilcoName || Array.isArray(wilcoName)) {
    response.status(404).send('no username 🤷‍♀️');
    return;
  }

  const wilcoStats = await getWilcoStats(wilcoName);
  const svgBadge = generateSvgBadge(wilcoStats);

  response.setHeader('Content-Type', 'image/svg+xml');
  response.send(svgBadge);
}
