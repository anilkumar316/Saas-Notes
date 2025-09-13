
import prisma from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';
import cors from '../_cors';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const auth = await requireAuth(req, res);
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const { user } = auth;
  const { id } = req.query;

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.tenantId !== user.tenantId) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') {
    return res.json(note);
  } else if (req.method === 'PUT') {
    const { title, content } = req.body || {};
    const updated = await prisma.note.update({
      where: { id },
      data: { title: title ?? note.title, content: content ?? note.content }
    });
    return res.json(updated);
  } else if (req.method === 'DELETE') {
    await prisma.note.delete({ where: { id } });
    return res.json({ ok: true });
  }
  return res.status(405).end();
}
