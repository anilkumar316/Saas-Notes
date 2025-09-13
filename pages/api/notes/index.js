
import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import cors from '../_cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const auth = await requireAuth(req, res);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const { user } = auth;

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({ where: { tenantId: user.tenantId }, orderBy: { createdAt: 'desc' } });
    return res.json(notes);
  }

  if (req.method === 'POST') {
    const { title, content } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });
    if (tenant.plan === 'free') {
      const count = await prisma.note.count({ where: { tenantId: user.tenantId } });
      if (count >= 3) return res.status(403).json({ error: 'Free plan note limit reached' });
    }

    const note = await prisma.note.create({
      data: { title, content: content || '', tenantId: user.tenantId, ownerId: user.id }
    });
    return res.status(201).json(note);
  }

  return res.status(405).end();
}
