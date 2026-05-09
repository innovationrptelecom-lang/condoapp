
# Condominium App – Next.js (Auth + Rotas)

Projeto ampliado com autenticação (NextAuth) e rotas protegidas.

## Instruções

```bash
cp .env.example .env.local   # edite o NEXTAUTH_SECRET
npm install
npm run dev
```

Login demo:
- **Email:** admin@condoapp.com
- **Senha:** admin123

## Banco de Dados
Execute:
```
npm run prisma:generate
npm run prisma:migrate -- --name init
```
Certifique-se que `DATABASE_URL` esteja no `.env.local`.


### Seed de dados
Após criar o banco, execute:
```bash
npm run prisma:seed
```

Isso insere Condomínio Alpha, admin demo e 3 chamados iniciais.


### AWS para anexos S3
```
AWS_REGION=us-east-1
AWS_BUCKET=nome-do-bucket
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```


#### Variáveis adicionais
`NEXT_PUBLIC_S3_PUBLIC` – URL do domínio público/Gateway do bucket para visualização direta (ex.: my-bucket.s3.amazonaws.com)


### Migração Pacote 1 – novos módulos
```bash
npx prisma migrate dev --name add_finance_reserva_visit_20260508
```

**v9 ajustes de dependências:** next 14.2.3, next-connect 0.12.2, multer 2.x, uuid 11.x

**v10:** uuid atualizado para ^9.0.1 (versão estável no npm)
