
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end();
  }
  const { id } = req.query;
  const updated = await prisma.call.update({
    where: { id: Number(id) },
    data: { status: 'APROVADO', approvedAt: new Date() }
  });
  res.socket.server?.io?.emit('calls:update');
  res.status(200).json(updated);
}
