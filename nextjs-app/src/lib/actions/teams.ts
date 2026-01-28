'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface TeamWithStats {
  id: string;
  title: string;
  sport: string;
  gender: string;
  grades: string | null;  // Comma-separated grade values, e.g., "1,2,3"
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
  grades?: string | null;  // Comma-separated grade values, e.g., "1,2,3"
  ageMin?: number | null;
  ageMax?: number | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  seasonId?: string | null;
  avatar?: string | null;
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
    const updateData: Record<string, string | number | Date | null> = {
      updated_at: new Date(),
    };

    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.sport !== undefined) updateData.sport = input.sport.trim();
    if (input.gender !== undefined) updateData.gender = input.gender.trim();
    if (input.grades !== undefined) updateData.grades = input.grades;
    if (input.ageMin !== undefined) updateData.age_min = input.ageMin;
    if (input.ageMax !== undefined) updateData.age_max = input.ageMax;
    if (input.primaryColor !== undefined) updateData.primary_color = input.primaryColor;
    if (input.secondaryColor !== undefined) updateData.secondary_color = input.secondaryColor;
    if (input.seasonId !== undefined) updateData.season_id = input.seasonId;
    if (input.avatar !== undefined) updateData.avatar = input.avatar;

    await db.teams.update({
      where: { id: input.id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: updateData as any,
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

    // Get current user to add as team admin
    const currentUser = await db.users.findFirst({
      where: { role: 'school-administrator' },
    });

    const teamId = crypto.randomUUID();

    // Use transaction to create team and add admin
    await db.$transaction(async (tx) => {
      await tx.teams.create({
        data: {
          id: teamId,
          organization_id: organizationId,
          season_id: input.seasonId,
          title: input.title,
          sport: 'Football', // Default sport
          gender: 'Male', // Default gender
          status: 'draft', // New teams start as draft - only CSMs can provision
          updated_at: new Date(),
        },
      });

      // Add current user as team admin
      if (currentUser) {
        await tx.team_members.create({
          data: {
            team_id: teamId,
            user_id: currentUser.id,
            role: 'admin',
          },
        });
      }
    });

    const team = await db.teams.findUnique({ where: { id: teamId } });

    revalidatePath('/teams');
    revalidatePath('/', 'layout'); // Update workspace switcher

    return {
      success: true,
      team: team ? { id: team.id, title: team.title } : undefined,
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
      _count: {
        select: {
          team_assignments: true,
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
    grades: team.grades,
    avatar: team.avatar,
    primaryColor: team.primary_color,
    secondaryColor: team.secondary_color,
    status: team.status,
    seasonId: team.season_id,
    rosterCount: team._count.team_assignments,
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
      const teamRoles = Array.from(new Set(user.team_members.map(tm => tm.role)));
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
  teams?: TeamWithStats[];
  error?: string;
}

export async function copyTeams(input: CopyTeamsInput): Promise<CopyTeamsResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    // Get current user to add as team admin
    const currentUser = await db.users.findFirst({
      where: { role: 'school-administrator' },
    });

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
        const newTeamId = crypto.randomUUID();
        
        // Create new team with required fields (always copy name, sport, gender as they're required)
        const newTeamData: Record<string, string | number | Date | null> = {
          id: newTeamId,
          organization_id: organizationId,
          season_id: input.targetSeasonId,
          status: 'draft', // Duplicated teams start as draft - only CSMs can provision
          finalized_at: null,
          updated_at: new Date(),
          title: sourceTeam.title, // Always required
          sport: sourceTeam.sport, // Always required
          gender: sourceTeam.gender, // Always required
        };

        // Copy individual attributes if selected
        if (input.copyOptions.grade) {
          newTeamData.grades = sourceTeam.grades;
        }

        if (input.copyOptions.colors) {
          newTeamData.primary_color = sourceTeam.primary_color;
          newTeamData.secondary_color = sourceTeam.secondary_color;
        }

        if (input.copyOptions.avatar) {
          newTeamData.avatar = sourceTeam.avatar;
        }

        const newTeam = await tx.teams.create({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: newTeamData as any,
        });

        // Add current user as team admin
        if (currentUser) {
          await tx.team_members.create({
            data: {
              team_id: newTeamId,
              user_id: currentUser.id,
              role: 'admin',
            },
          });
        }

        newTeams.push(newTeam);
      }

      return newTeams;
    });

    revalidatePath('/teams');
    revalidatePath('/', 'layout'); // Update workspace switcher

    // Map to TeamWithStats format
    const mappedTeams: TeamWithStats[] = copiedTeams.map(team => ({
      id: team.id,
      title: team.title,
      sport: team.sport,
      gender: team.gender,
      grades: team.grades,
      avatar: team.avatar,
      primaryColor: team.primary_color,
      secondaryColor: team.secondary_color,
      status: team.status,
      seasonId: team.season_id,
      rosterCount: 0,
      maxRosterSize: team.max_roster_size,
      ageMin: team.age_min,
      ageMax: team.age_max,
    }));

    return {
      success: true,
      copiedCount: copiedTeams.length,
      teams: mappedTeams,
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

export async function revalidateTeamsData() {
  revalidatePath('/teams');
  revalidatePath('/teams/manage');
}

export interface AssignAthletesInput {
  teamId: string;
  submissionIds: string[]; // registration_submission IDs
}

export interface AssignAthletesResult {
  success: boolean;
  assignedCount?: number;
  error?: string;
}

export async function assignAthletesToTeam(input: AssignAthletesInput): Promise<AssignAthletesResult> {
  try {
    const { teamId, submissionIds } = input;

    if (submissionIds.length === 0) {
      return { success: false, error: 'No athletes to assign' };
    }

    // Use a transaction to batch all upserts and avoid connection pool exhaustion
    const assignments = await db.$transaction(
      submissionIds.map(submissionId =>
        db.team_assignments.upsert({
          where: {
            team_id_submission_id: {
              team_id: teamId,
              submission_id: submissionId,
            },
          },
          create: {
            team_id: teamId,
            submission_id: submissionId,
            status: 'assigned',
          },
          update: {
            status: 'assigned',
            updated_at: new Date(),
          },
        })
      )
    );

    revalidatePath('/teams');
    revalidatePath('/teams/assignments');

    return {
      success: true,
      assignedCount: assignments.length,
    };
  } catch (error) {
    console.error('Failed to assign athletes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to assign athletes: ${errorMessage}` };
  }
}

export async function unassignAthleteFromTeam(teamId: string, submissionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete the team_assignment record
    await db.team_assignments.delete({
      where: {
        team_id_submission_id: {
          team_id: teamId,
          submission_id: submissionId,
        },
      },
    });

    revalidatePath('/teams');
    revalidatePath('/teams/assignments');

    return { success: true };
  } catch (error) {
    console.error('Failed to unassign athlete:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to unassign athlete: ${errorMessage}` };
  }
}

export interface RosterAthlete {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  grade: number;
  teamId: string;
  teamName: string;
  teamAvatar: string | null;
  teamSeasonId: string | null;
  primaryContact: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
}

export async function getAthletesOnProvisionedTeams(organizationId: string): Promise<RosterAthlete[]> {
  // Query team_assignments to support multiple team assignments per athlete
  const assignments = await db.team_assignments.findMany({
    where: {
      teams: {
        organization_id: organizationId,
        status: 'provisioned',
      },
    },
    include: {
      teams: {
        select: {
          id: true,
          title: true,
          avatar: true,
          season_id: true,
        },
      },
      registration_submissions: {
        include: {
          athletes: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              birthdate: true,
              gender: true,
              grade: true,
            },
          },
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: [
      { teams: { title: 'asc' } },
      { registration_submissions: { athletes: { last_name: 'asc' } } },
    ],
  });

  return assignments.map(assignment => ({
    id: assignment.registration_submissions.athlete_id,
    firstName: assignment.registration_submissions.athletes.first_name,
    lastName: assignment.registration_submissions.athletes.last_name,
    birthdate: assignment.registration_submissions.athletes.birthdate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    gender: assignment.registration_submissions.athletes.gender,
    grade: assignment.registration_submissions.athletes.grade,
    teamId: assignment.teams.id,
    teamName: assignment.teams.title,
    teamAvatar: assignment.teams.avatar,
    teamSeasonId: assignment.teams.season_id,
    primaryContact: assignment.registration_submissions.users ? {
      id: assignment.registration_submissions.users.id,
      firstName: assignment.registration_submissions.users.first_name,
      lastName: assignment.registration_submissions.users.last_name,
      avatar: assignment.registration_submissions.users.avatar,
    } : null,
  }));
}
