import fs from 'node:fs';
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

function generateStatsIcon(iconName: string, value?: number): string {
  const svgIcon = fs.readFileSync(`../icons/${iconName}.svg`, 'utf-8');
  if (!value) return svgIcon;
  return `${svgIcon} ${value}`;
}

export function generateSvgBadge(stats: Stats) {
  const svgLogo = generateStatsIcon('logo');
  const svgCoin = generateStatsIcon('coin', stats.wilCoins);
  const svgTrophy = generateStatsIcon('trophy', stats.quests);
  const svgXp = generateStatsIcon('xp', stats.xp);
  return `
  <svg>
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
