import { readFileSync } from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Stats {
  xp: number;
  wilCoins: number;
  quests: number;
}

export async function getWilcoStats(wilcoName: string): Promise<Stats> {
  const stats = await fetch(`https://engine.wilco.gg/api/v1/profile/${wilcoName}`)
    .then(res => res.json())
    .then(data => ({ xp: data.xp, wilCoins: data.gems, quests: data?.finishedQuests?.length } satisfies Stats))
    .catch(e => {
      console.log(e.message);
      return { xp: 0, wilCoins: 0, quests: 0 } satisfies Stats;
    });
  return stats;
}

function generateStatsIcon(iconName: 'coin' | 'xp' | 'trophy' | 'logo', value?: number): string {
  const file = path.join(process.cwd(), 'public/icons', `${iconName}.svg`);
  const svgIcon = readFileSync(file, 'utf8');

  if (iconName === 'logo') return svgIcon;

  const xPosition = {
    coin: 47,
    xp: 95,
    trophy: 152
  };

  const text = `<text font-size="18" stroke="black" fill="black" x='${xPosition[iconName]}' y="50">${value}</text>`;

  return `${svgIcon} ${text}`;
}

export function generateSvgBadge(stats: Stats) {
  const svgLogo = generateStatsIcon('logo');
  const svgCoin = generateStatsIcon('coin', stats.wilCoins);
  const svgTrophy = generateStatsIcon('trophy', stats.quests);
  const svgXp = generateStatsIcon('xp', stats.xp);
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
    response.status(404).send('no username');
    return;
  }

  // TODO GetSVGFromCache if cache is available return svg

  const wilcoStats = await getWilcoStats(wilcoName as string);
  const svgBadge = generateSvgBadge(wilcoStats);

  response.setHeader('Content-Type', 'image/svg+xml');
  response.send(svgBadge);
}
