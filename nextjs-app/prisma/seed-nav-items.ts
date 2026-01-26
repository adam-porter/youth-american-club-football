import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the first organization
  const org = await prisma.organizations.findFirst();
  
  if (!org) {
    console.log('No organization found. Please create one first.');
    return;
  }

  console.log(`Seeding nav items for organization: ${org.name}`);

  // Delete existing nav items for this org
  await prisma.nav_items.deleteMany({
    where: { organization_id: org.id }
  });

  // Create main nav items
  const programs = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Programs',
      icon: 'programs',
      route: '/programs',
      order: 1,
      is_active: true,
    }
  });

  const teams = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Teams',
      icon: 'teams',
      route: '/teams',
      order: 2,
      is_active: true,
    }
  });

  const finances = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Finances',
      icon: 'finances',
      route: '/finances',
      order: 3,
      is_active: true,
    }
  });

  const community = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Community',
      icon: 'community',
      route: '/community',
      order: 4,
      is_active: true,
    }
  });

  const tickets = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Tickets',
      icon: 'tickets',
      route: '/tickets',
      order: 5,
      is_active: true,
    }
  });

  // Create Settings with children
  const settings = await prisma.nav_items.create({
    data: {
      organization_id: org.id,
      label: 'Settings',
      icon: 'settings',
      route: null, // Parent items don't have routes
      order: 6,
      is_active: true,
    }
  });

  // Settings children
  await prisma.nav_items.createMany({
    data: [
      {
        organization_id: org.id,
        label: 'Ticketing',
        icon: 'placeholder',
        route: '/settings/ticketing',
        order: 1,
        parent_id: settings.id,
        is_active: true,
      },
      {
        organization_id: org.id,
        label: 'Payments',
        icon: 'placeholder',
        route: '/settings/payments',
        order: 2,
        parent_id: settings.id,
        is_active: true,
      },
      {
        organization_id: org.id,
        label: 'Users',
        icon: 'placeholder',
        route: '/settings/users',
        order: 3,
        parent_id: settings.id,
        is_active: true,
      },
      {
        organization_id: org.id,
        label: 'Permissions',
        icon: 'placeholder',
        route: '/settings/permissions',
        order: 4,
        parent_id: settings.id,
        is_active: true,
      },
    ]
  });

  console.log('Nav items seeded successfully!');
  console.log(`Created: ${programs.label}, ${teams.label}, ${finances.label}, ${community.label}, ${tickets.label}, ${settings.label} (with 4 children)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
