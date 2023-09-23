import { Stats } from './types.js';

const WILCO_PROFILE_API = 'https://engine.wilco.gg/api/v1/profile/';

export async function getWilcoStats(wilcoName: string): Promise<Stats> {
  const stats = await fetch(`${WILCO_PROFILE_API}${wilcoName}`)
    .then(res => res.json())
    .then(data => ({ xp: data.xp, wilCoins: data.gems, quests: data?.finishedQuests?.length } satisfies Stats))
    .catch(e => {
      console.log(e.message);
      return { xp: 0, wilCoins: 0, quests: 0 } satisfies Stats;
    });
  return stats;
}
