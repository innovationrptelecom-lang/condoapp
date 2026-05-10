
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { status, condoId, q, startDate, endDate, type, responsible } = req.query;
    const where = {
      ...(status && { status }),
      ...(type && { type }),
      ...(responsible && { responsible: { contains: responsible, mode: 'insensitive' } }),
      ...(condoId && { condominiumId: Number(condoId) }),
      ...(q && { description: { contains: q, mode: 'insensitive' } }),
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };
    const calls = await prisma.call.findMany({ where, orderBy: { createdAt: 'desc' } });
    return res.status(200).json(calls);
  }

  if (method === 'POST') {
    const data = JSON.parse(req.body);
    const created = await prisma.call.create({ data });
    res.socket.server?.io?.emit('calls:update');
    return res.status(201).json(created);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
