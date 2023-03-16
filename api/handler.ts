import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSvgBadge, getWilcoStats } from '../src/index';

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
