
import prisma from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';
import cors from '../../_cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const auth = await requireAuth(req, res);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });

  const { user } = auth;
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  const { slug } = req.query;
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  if (tenant.id !== user.tenantId) return res.status(403).json({ error: 'Cannot upgrade other tenant' });

  const updated = await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: 'pro' } });
  res.json({ ok: true, tenant: updated });
}
