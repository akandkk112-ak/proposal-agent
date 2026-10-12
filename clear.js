const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.template.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log('All data deleted successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
