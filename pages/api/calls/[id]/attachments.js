
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const attachments = await prisma.attachment.findMany({
    where: { entityType: 'call', entityId: Number(id) },
  });
  res.status(200).json(attachments);
}
