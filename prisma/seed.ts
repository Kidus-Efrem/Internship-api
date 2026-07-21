// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@infnova.com' },
    update: {},
    create: {
      email: 'admin@infnova.com',
      password: hashedPassword,
    },
  });

  console.log('Seeded default admin:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });