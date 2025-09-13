
import cors from './_cors';

export default function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.status(200).json({ status: 'ok' });
}
