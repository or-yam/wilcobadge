import { getWilcoStats } from './wilcoApi.js';
import { generateSvgBadge } from './svgGenerator.js';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { wilconame: wilcoName } = request.query;

  if (!wilcoName || Array.isArray(wilcoName)) {
    response.status(404).send('no username 🤷‍♀️');
    return;
  }

  try {
    const wilcoStats = await getWilcoStats(wilcoName);
    const svgBadge = generateSvgBadge(wilcoStats);
    const linkWrapper = `<a href="https://app.wilco.gg/portfolio/${wilcoName}" rel="nofollow"">${svgBadge}</a>`;
    response.setHeader('Content-Type', 'image/svg+xml');
    response.send(linkWrapper);
  } catch (error) {
    //TODO Handle error with message and an svg without stats.
    response.status(500).send('something went wrong 😱');
  }
}
