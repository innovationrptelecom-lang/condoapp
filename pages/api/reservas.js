
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    const data = await prisma.reservation.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(data);
  }
  if (method === 'POST') {
    const body = JSON.parse(req.body);
    const created = await prisma.reservation.create({ data: body });
    return res.status(201).json(created);
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
