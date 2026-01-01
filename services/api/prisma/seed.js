const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();
  console.log('Seeding database...');

  const password = 'password';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { email: 'test@example.com', name: 'Test User', passwordHash: hash }
  });

  await prisma.budget.upsert({
    where: { id: 'initial-budget' },
    update: {},
    create: { id: 'initial-budget', name: 'Monthly Groceries', limit: 300, category: 'Groceries', recurring: true, userId: user.id }
  });

  await prisma.transaction.createMany({ data: [
    { amount: -120.5, date: '2025-12-05', name: 'Supermarket', category: 'Groceries', userId: user.id },
    { amount: -50.0, date: '2025-12-10', name: 'Dinner', category: 'Food', userId: user.id },
    { amount: 1500.0, date: '2025-12-01', name: 'Salary', category: 'Income', userId: user.id }
  ] });

  await prisma.plaidItem.upsert({
    where: { itemId: 'sandbox-item-id' },
    update: {},
    create: { itemId: 'sandbox-item-id', accessToken: 'access-sandbox-token', institutionName: 'Sandbox Bank', userId: user.id }
  });

  console.log('Seed complete.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
