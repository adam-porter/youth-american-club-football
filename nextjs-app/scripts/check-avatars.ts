import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.teams.findMany({
    where: {
      avatar: {
        not: null
      }
    },
    select: {
      id: true,
      title: true,
      avatar: true
    }
  });

  console.log('Teams with avatars:');
  teams.forEach(team => {
    console.log(`${team.title}: ${team.avatar}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
