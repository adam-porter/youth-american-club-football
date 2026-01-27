'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface TeamWithStats {
  id: string;
  title: string;
  sport: string;
  gender: string;
  grade: number | null;
  avatar: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: string;
  seasonId: string | null;
  rosterCount: number;
  maxRosterSize: number | null;
  ageMin: number | null;
  ageMax: number | null;
}

export interface CreateTeamInput {
  title: string;
  seasonId: string;
}

export interface CreateTeamResult {
  success: boolean;
  team?: { id: string; title: string };
  error?: string;
}

export interface UpdateTeamInput {
  id: string;
  title?: string;
  sport?: string;
  gender?: string;
  grade?: number | null;
  ageMin?: number | null;
  ageMax?: number | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  seasonId?: string | null;
}

export interface UpdateTeamResult {
  success: boolean;
  error?: string;
}

export async function updateTeam(input: UpdateTeamInput): Promise<UpdateTeamResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    // Validate required fields if provided
    if (input.title !== undefined && !input.title.trim()) {
      return { success: false, error: 'Team title is required' };
    }

    if (input.sport !== undefined && !input.sport.trim()) {
      return { success: false, error: 'Sport is required' };
    }

    if (input.gender !== undefined && !input.gender.trim()) {
      return { success: false, error: 'Gender is required' };
    }

    // Validate age range if both are provided
    if (input.ageMin !== undefined && input.ageMax !== undefined && input.ageMin !== null && input.ageMax !== null) {
      if (input.ageMin > input.ageMax) {
        return { success: false, error: 'Minimum age cannot be greater than maximum age' };
      }
    }

    // Validate color format if provided
    if (input.primaryColor !== undefined && input.primaryColor !== null && !/^#[0-9A-F]{6}$/i.test(input.primaryColor)) {
      return { success: false, error: 'Primary color must be a valid hex color (e.g., #FF0000)' };
    }

    if (input.secondaryColor !== undefined && input.secondaryColor !== null && !/^#[0-9A-F]{6}$/i.test(input.secondaryColor)) {
      return { success: false, error: 'Secondary color must be a valid hex color (e.g., #FF0000)' };
    }

    // Check if team exists and belongs to organization
    const existingTeam = await db.teams.findFirst({
      where: {
        id: input.id,
        organization_id: organizationId,
      },
    });

    if (!existingTeam) {
      return { success: false, error: 'Team not found' };
    }

    // Build update data object with only provided fields
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.sport !== undefined) updateData.sport = input.sport.trim();
    if (input.gender !== undefined) updateData.gender = input.gender.trim();
    if (input.grade !== undefined) updateData.grade = input.grade;
    if (input.ageMin !== undefined) updateData.age_min = input.ageMin;
    if (input.ageMax !== undefined) updateData.age_max = input.ageMax;
    if (input.primaryColor !== undefined) updateData.primary_color = input.primaryColor;
    if (input.secondaryColor !== undefined) updateData.secondary_color = input.secondaryColor;
    if (input.seasonId !== undefined) updateData.season_id = input.seasonId;

    await db.teams.update({
      where: { id: input.id },
      data: updateData,
    });

    // Don't revalidate on individual updates - rely on optimistic updates in the UI
    // This prevents table reordering while editing
    // revalidatePath('/teams');

    return { success: true };
  } catch (error) {
    console.error('Failed to update team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to update team: ${errorMessage}` };
  }
}

export async function createTeam(input: CreateTeamInput): Promise<CreateTeamResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    const team = await db.teams.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        season_id: input.seasonId,
        title: input.title,
        sport: 'Football', // Default sport
        gender: 'Male', // Default gender
        status: 'draft', // Teams are created as draft
        updated_at: new Date(),
      },
    });

    revalidatePath('/teams');

    return {
      success: true,
      team: { id: team.id, title: team.title },
    };
  } catch (error) {
    console.error('Failed to create team:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to create team: ${errorMessage}` };
  }
}

export async function getAllTeams(organizationId: string): Promise<TeamWithStats[]> {
  const teams = await db.teams.findMany({
    where: {
      organization_id: organizationId,
    },
    include: {
      team_members: {
        select: {
          role: true,
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
    primaryColor: team.primary_color,
    secondaryColor: team.secondary_color,
    status: team.status,
    seasonId: team.season_id,
    rosterCount: team.team_members.filter(tm => tm.role === 'Athlete').length,
    maxRosterSize: team.max_roster_size,
    ageMin: team.age_min,
    ageMax: team.age_max,
  }));
}

export async function getTeamsBySeason(organizationId: string, seasonId: string): Promise<TeamWithStats[]> {
  const allTeams = await getAllTeams(organizationId);
  return allTeams.filter(team => team.seasonId === seasonId);
}

// Keep for backwards compatibility
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

  return getTeamsBySeason(organizationId, activeSeason.id);
}

export async function getOrganizationId(): Promise<string | null> {
  const org = await db.organizations.findFirst({
    select: { id: true },
  });
  return org?.id ?? null;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  teamRoles: string[]; // Array of team member roles (admin, coach)
}

export async function getStaffUsers(organizationId: string): Promise<StaffUser[]> {
  // Get users with role 'school-administrator' or 'school administrator'
  const adminUsers = await db.users.findMany({
    where: {
      OR: [
        { role: 'school-administrator' },
        { role: 'school administrator' },
        { role: 'team-admin' },
        { role: 'team admin' },
      ],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  // Get users who are team members with role 'admin' or 'coach' for teams in this organization
  const teamMemberUsers = await db.users.findMany({
    where: {
      team_members: {
        some: {
          role: {
            in: ['admin', 'coach'],
          },
          teams: {
            organization_id: organizationId,
          },
        },
      },
    },
    include: {
      team_members: {
        where: {
          role: {
            in: ['admin', 'coach'],
          },
          teams: {
            organization_id: organizationId,
          },
        },
        select: {
          role: true,
        },
      },
    },
  });

  // Combine and deduplicate users
  const allUserIds = new Set<string>();
  const staffUsers: StaffUser[] = [];

  // Add admin users
  for (const user of adminUsers) {
    if (!allUserIds.has(user.id)) {
      allUserIds.add(user.id);
      staffUsers.push({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        teamRoles: [],
      });
    }
  }

  // Add team member users
  for (const user of teamMemberUsers) {
    if (!allUserIds.has(user.id)) {
      allUserIds.add(user.id);
      const teamRoles = [...new Set(user.team_members.map(tm => tm.role))];
      staffUsers.push({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        teamRoles,
      });
    }
  }

  return staffUsers;
}

export interface Season {
  id: string;
  name: string;
  isActive: boolean;
}

export async function getSeasons(organizationId: string): Promise<Season[]> {
  // Ensure both seasons exist
  await ensureSeasonsExist(organizationId);
  
  const seasons = await db.seasons.findMany({
    where: { organization_id: organizationId },
    orderBy: { name: 'desc' },
  });

  console.log('Fetched seasons:', seasons.map(s => s.name));

  return seasons.map((season) => ({
    id: season.id,
    name: season.name,
    isActive: season.is_active,
  }));
}

async function ensureSeasonsExist(organizationId: string): Promise<void> {
  const seasonConfigs = [
    { name: '2025-2026', isActive: true },
    { name: '2026-2027', isActive: false },
  ];
  
  for (const config of seasonConfigs) {
    try {
      const existing = await db.seasons.findFirst({
        where: { organization_id: organizationId, name: config.name },
      });
      
      if (!existing) {
        await db.seasons.create({
          data: {
            organization_id: organizationId,
            name: config.name,
            is_active: config.isActive,
          },
        });
        console.log(`Created season: ${config.name}`);
      }
    } catch (error) {
      console.error(`Failed to create/check season ${config.name}:`, error);
    }
  }
}

export interface CopyOptions {
  name: boolean;
  colors: boolean;
  avatar: boolean;
  sport: boolean;
  gender: boolean;
  grade: boolean;
}

export interface CopyTeamsInput {
  sourceTeamIds: string[];
  targetSeasonId: string;
  copyOptions: CopyOptions;
}

export interface CopyTeamsResult {
  success: boolean;
  copiedCount?: number;
  error?: string;
}

export async function copyTeams(input: CopyTeamsInput): Promise<CopyTeamsResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    // Verify target season exists
    const targetSeason = await db.seasons.findFirst({
      where: {
        id: input.targetSeasonId,
        organization_id: organizationId,
      },
    });

    if (!targetSeason) {
      return { success: false, error: 'Target season not found' };
    }

    // Fetch source teams
    const sourceTeams = await db.teams.findMany({
      where: {
        id: { in: input.sourceTeamIds },
        organization_id: organizationId,
      },
    });

    if (sourceTeams.length === 0) {
      return { success: false, error: 'No teams found to copy' };
    }

    // Use transaction to ensure all-or-nothing copy
    const copiedTeams = await db.$transaction(async (tx) => {
      const newTeams = [];

      for (const sourceTeam of sourceTeams) {
        // Create new team with required fields (always copy name, sport, gender as they're required)
        const newTeamData: any = {
          id: crypto.randomUUID(),
          organization_id: organizationId,
          season_id: input.targetSeasonId,
          status: 'draft',
          finalized_at: null,
          updated_at: new Date(),
          title: sourceTeam.title, // Always required
          sport: sourceTeam.sport, // Always required
          gender: sourceTeam.gender, // Always required
        };

        // Copy individual attributes if selected
        if (input.copyOptions.grade) {
          newTeamData.grade = sourceTeam.grade;
        }

        if (input.copyOptions.colors) {
          newTeamData.primary_color = sourceTeam.primary_color;
          newTeamData.secondary_color = sourceTeam.secondary_color;
        }

        if (input.copyOptions.avatar) {
          newTeamData.avatar = sourceTeam.avatar;
        }

        const newTeam = await tx.teams.create({
          data: newTeamData,
        });

        newTeams.push(newTeam);
      }

      return newTeams;
    });

    revalidatePath('/teams');

    return {
      success: true,
      copiedCount: copiedTeams.length,
    };
  } catch (error) {
    console.error('Failed to copy teams:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to copy teams: ${errorMessage}` };
  }
}

export interface DeleteTeamsResult {
  success: boolean;
  deletedCount?: number;
  error?: string;
}

export async function deleteTeams(teamIds: string[]): Promise<DeleteTeamsResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    if (teamIds.length === 0) {
      return { success: false, error: 'No teams to delete' };
    }

    // Verify teams exist and belong to organization
    const teams = await db.teams.findMany({
      where: {
        id: { in: teamIds },
        organization_id: organizationId,
      },
    });

    if (teams.length === 0) {
      return { success: false, error: 'No teams found to delete' };
    }

    // Delete teams (team_members will cascade, registration_submissions.team_id will be set to null)
    await db.teams.deleteMany({
      where: {
        id: { in: teamIds },
        organization_id: organizationId,
      },
    });

    revalidatePath('/teams');

    return {
      success: true,
      deletedCount: teams.length,
    };
  } catch (error) {
    console.error('Failed to delete teams:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to delete teams: ${errorMessage}` };
  }
}
