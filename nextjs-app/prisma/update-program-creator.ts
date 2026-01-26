import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find David Mitchell
  const davidMitchell = await prisma.users.findFirst({
    where: {
      first_name: 'David',
      last_name: 'Mitchell'
    }
  });

  if (!davidMitchell) {
    console.error('David Mitchell not found');
    return;
  }

  console.log('Found David Mitchell:', davidMitchell.id);

  // Update all programs to set David Mitchell as the creator
  const result = await prisma.programs.updateMany({
    data: {
      created_by: davidMitchell.id
    }
  });

  console.log(`Updated ${result.count} programs`);

  // Also update David Mitchell's avatar if not set
  if (!davidMitchell.avatar) {
    await prisma.users.update({
      where: { id: davidMitchell.id },
      data: { avatar: '/images/david-mitchell-avatar.png' }
    });
    console.log('Updated David Mitchell avatar');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
