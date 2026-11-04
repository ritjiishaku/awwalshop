import { prisma } from '@/lib/db';
(async () => {
  const admin = await prisma.adminUser.findFirst();
  console.log('Admin user:', admin);
})();
