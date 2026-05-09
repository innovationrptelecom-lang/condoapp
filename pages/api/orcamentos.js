
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    const budgets = await prisma.budget.findMany({});
    return res.status(200).json(budgets);
  }
  if (method === 'POST') {
    const data = JSON.parse(req.body);
    const created = await prisma.budget.create({ data });
    res.socket.server?.io?.emit('budget:update');
    return res.status(201).json(created);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
