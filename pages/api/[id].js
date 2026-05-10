
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const call = await prisma.call.findUnique({ where: { id: Number(id) } });
      return res.status(200).json(call);

    case 'PUT':
      const data = JSON.parse(req.body);
      const updated = await prisma.call.update({ where: { id: Number(id) }, data });
      return res.status(200).json(updated);

    case 'DELETE':
      await prisma.call.delete({ where: { id: Number(id) } });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
