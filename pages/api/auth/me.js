
import cors from '../_cors';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const auth = await requireAuth(req, res);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const { user } = auth;
  res.json({ email: user.email, role: user.role, tenantSlug: user.tenant.slug });
}
