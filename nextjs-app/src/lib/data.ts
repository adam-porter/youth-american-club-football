import { db } from './db';

export async function getOrganizationWithTeams() {
  const organization = await db.organizations.findFirst({
    include: {
      teams: {
        orderBy: [
          { sport: 'asc' },
          { title: 'asc' }
        ]
      }
    }
  });

  return organization;
}

export async function getTeams() {
  const teams = await db.teams.findMany({
    orderBy: [
      { sport: 'asc' },
      { title: 'asc' }
    ]
  });

  return teams;
}

export async function getNavItems(organizationId: string) {
  // Fetch top-level nav items (no parent) with their children
  const navItems = await db.nav_items.findMany({
    where: {
      organization_id: organizationId,
      parent_id: null, // Only top-level items
      is_active: true,
    },
    include: {
      children: {
        where: { is_active: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  return navItems;
}

export async function getOrganizationWithNavItems() {
  const organization = await db.organizations.findFirst({
    include: {
      teams: {
        orderBy: [
          { sport: 'asc' },
          { title: 'asc' }
        ]
      },
      nav_items: {
        where: {
          parent_id: null, // Only top-level items
          is_active: true,
        },
        include: {
          children: {
            where: { is_active: true },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    }
  });

  return organization;
}

// For prototype: Get the school administrator as the "logged in" user
export async function getCurrentUser() {
  const user = await db.users.findFirst({
    where: {
      role: 'school-administrator',
    },
    include: {
      team_members: {
        where: { role: 'admin' },
        include: {
          teams: true,
        },
      }
    }
  });

  return user;
}

export type OrganizationWithTeams = Awaited<ReturnType<typeof getOrganizationWithTeams>>;
export type OrganizationWithNavItems = Awaited<ReturnType<typeof getOrganizationWithNavItems>>;
export type Team = Awaited<ReturnType<typeof getTeams>>[number];
export type NavItem = Awaited<ReturnType<typeof getNavItems>>[number];
export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;