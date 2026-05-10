
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { cid } = req.query;
  const calls = await prisma.call.findMany({
    where: { condominiumId: Number(cid) },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json(calls);
}
