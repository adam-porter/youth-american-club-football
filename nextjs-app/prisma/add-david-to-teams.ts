import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addDavidToProvisionedTeams() {
  // Find David Mitchell (school-administrator)
  const david = await prisma.users.findFirst({
    where: {
      first_name: 'David',
      last_name: 'Mitchell',
      role: 'school-administrator',
    },
  });

  if (!david) {
    console.error('David Mitchell not found in users table');
    process.exit(1);
  }

  console.log(`Found David Mitchell: ${david.id}`);

  // Find all provisioned teams
  const provisionedTeams = await prisma.teams.findMany({
    where: {
      status: 'provisioned',
    },
  });

  console.log(`Found ${provisionedTeams.length} provisioned teams`);

  // Add David as admin to each team (if not already)
  for (const team of provisionedTeams) {
    const existingMembership = await prisma.team_members.findUnique({
      where: {
        team_id_user_id: {
          team_id: team.id,
          user_id: david.id,
        },
      },
    });

    if (existingMembership) {
      console.log(`David is already a member of team: ${team.title}`);
      continue;
    }

    await prisma.team_members.create({
      data: {
        team_id: team.id,
        user_id: david.id,
        role: 'admin',
      },
    });

    console.log(`Added David as admin to team: ${team.title}`);
  }

  console.log('Done!');
}

addDavidToProvisionedTeams()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
