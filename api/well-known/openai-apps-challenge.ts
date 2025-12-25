import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/plain')
  return res.status(200).send('_LnONjTTzimr1xaGByiavCAzXEnAQooHLtFcQW-V6GA')
}
