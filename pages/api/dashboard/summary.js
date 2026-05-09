
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const [open, resolved, approved, periodic] = await Promise.all([
    prisma.call.count({ where: { status: 'PENDENTE' } }),
    prisma.call.count({ where: { status: 'RESOLVIDO' } }),
    prisma.call.count({ where: { status: 'APROVADO' } }),
    prisma.periodicTask.count({ where: { status: 'PRESTES_VENCER' } })
  ]);

  res.status(200).json({ open, resolved, approved, periodic });
}
