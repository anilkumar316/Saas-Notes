
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // create or update tenants
  const acme = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: { name: 'Acme', slug: 'acme', plan: 'free' }
  });

  const globex = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: { name: 'Globex', slug: 'globex', plan: 'free' }
  });

  const hash = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: { email: 'admin@acme.test', password: hash, role: 'admin', tenantId: acme.id }
  });

  await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {},
    create: { email: 'user@acme.test', password: hash, role: 'member', tenantId: acme.id }
  });

  await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {},
    create: { email: 'admin@globex.test', password: hash, role: 'admin', tenantId: globex.id }
  });

  await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {},
    create: { email: 'user@globex.test', password: hash, role: 'member', tenantId: globex.id }
  });

  console.log('Seed completed: tenants and test users created.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
