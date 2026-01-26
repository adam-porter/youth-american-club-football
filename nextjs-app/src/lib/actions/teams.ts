'use server';

import { db } from '@/lib/db';

export interface TeamWithStats {
  id: string;
  title: string;
  sport: string;
  gender: string;
  grade: number | null;
  avatar: string | null;
  status: string;
  rosterCount: number;
  maxRosterSize: number | null;
}

export async function getProvisionedTeams(organizationId: string): Promise<TeamWithStats[]> {
  // Get the active season
  const activeSeason = await db.seasons.findFirst({
    where: {
      organization_id: organizationId,
      is_active: true,
    },
  });

  if (!activeSeason) {
    return [];
  }

  // Get provisioned teams for the active season
  const teams = await db.teams.findMany({
    where: {
      organization_id: organizationId,
      season_id: activeSeason.id,
      status: 'provisioned',
    },
    include: {
      _count: {
        select: {
          team_members: true,
        },
      },
    },
    orderBy: [
      { sport: 'asc' },
      { title: 'asc' },
    ],
  });

  return teams.map((team) => ({
    id: team.id,
    title: team.title,
    sport: team.sport,
    gender: team.gender,
    grade: team.grade,
    avatar: team.avatar,
    status: team.status,
    rosterCount: team._count.team_members,
    maxRosterSize: team.max_roster_size,
  }));
}

export async function getOrganizationId(): Promise<string | null> {
  const org = await db.organizations.findFirst({
    select: { id: true },
  });
  return org?.id ?? null;
}
