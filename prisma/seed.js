
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  // Condomínio
  const condo = await prisma.condominium.create({
    data: { name: 'Residencial Alpha', address: 'Rua 1, 100' }
  });

  // Usuário admin
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@condoapp.com',
      name: 'Administrador',
      role: 'ADMIN',
      password: hash,
      condominiumId: condo.id
    }
  });

  // Chamados demo
  await prisma.call.createMany({
    data: [
      { condominiumId: condo.id, type: 'servico', description: 'Troca de lâmpada', status: 'PENDENTE' },
      { condominiumId: condo.id, type: 'ocorrencia', description: 'Portão com defeito', status: 'RESOLVIDO' },
      { condominiumId: condo.id, type: 'compra', description: 'Pedido de tinta', status: 'APROVADO', approvedAt: new Date() }
    ]
  });
  console.log('Seed concluído.');
}

main().catch((e) => console.error(e)).finally(async () => await prisma.$disconnect());

  // usuário zelador demo
  await prisma.user.create({
    data: {
      email: 'zelador@condoapp.com',
      name: 'Zelador Demo',
      role: 'ZELADOR',
      password: await bcrypt.hash('zelador123', 10),
      condominiumId: condo.id
    }
  });
