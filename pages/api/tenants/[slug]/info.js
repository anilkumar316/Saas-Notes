
import prisma from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import cors from '../../_cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const auth = await requireAuth(req, res);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  const { slug } = req.query;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  if (tenant.id !== auth.user.tenantId) return res.status(403).json({ error: 'Forbidden' });

  res.json({ slug: tenant.slug, name: tenant.name, plan: tenant.plan });
}
