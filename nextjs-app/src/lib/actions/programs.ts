'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface ProgramCreator {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export type ProgramStatus = 'draft' | 'published' | 'archived';

export interface ProgramWithStats {
  id: string;
  title: string;
  type: string;
  eventDates: {
    start?: string;
    end?: string;
  };
  visibility: 'public' | 'private';
  registrationStatus: 'open' | 'closed';
  status: ProgramStatus;
  registrantCount: number;
  programValue: number; // In cents, $0.00 if no payments
  createdBy: ProgramCreator | null;
}

export interface CreateProgramInput {
  title: string;
  status: 'draft' | 'published';
}

export interface CreateProgramResult {
  success: boolean;
  program?: { id: string; title: string };
  error?: string;
}

export async function createProgram(input: CreateProgramInput): Promise<CreateProgramResult> {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      return { success: false, error: 'No organization found' };
    }

    // Get David Mitchell as creator (for prototype - would use auth in production)
    const user = await db.users.findFirst({
      where: {
        first_name: 'David',
        last_name: 'Mitchell'
      },
      select: { id: true }
    });

    const program = await db.programs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        title: input.title,
        type: 'season', // Default type
        event_dates: {}, // Empty, to be filled later
        fee_responsibility: 'organization',
        visibility: 'public',
        registration_status: 'open',
        status: input.status,
        created_by: user?.id ?? null,
        updated_at: new Date(),
      },
    });

    revalidatePath('/programs');

    return {
      success: true,
      program: { id: program.id, title: program.title },
    };
  } catch (error) {
    console.error('Failed to create program:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Failed to create program: ${errorMessage}` };
  }
}

export async function getPrograms(organizationId: string): Promise<ProgramWithStats[]> {
  const programs = await db.programs.findMany({
    where: { organization_id: organizationId },
    include: {
      _count: {
        select: {
          registration_submissions: true
        }
      },
      creator: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
  
  return programs.map(program => {
    const registrantCount = program._count.registration_submissions;
    const defaultSeasonPrice = program.default_season_price ? Number(program.default_season_price) : 0;
    // programValue is in cents (registrantCount * price in dollars * 100)
    const programValue = Math.round(registrantCount * defaultSeasonPrice * 100);
    
    return {
      id: program.id,
      title: program.title,
      type: program.type,
      eventDates: program.event_dates as { start?: string; end?: string },
      visibility: program.visibility as 'public' | 'private',
      registrationStatus: (program.registration_status || 'open') as 'open' | 'closed',
      status: (program.status || 'published') as ProgramStatus,
      registrantCount,
      programValue,
      createdBy: program.creator ? {
        id: program.creator.id,
        firstName: program.creator.first_name,
        lastName: program.creator.last_name,
        avatar: program.creator.avatar
      } : null
    };
  });
}

export async function getOrganizationId(): Promise<string | null> {
  const org = await db.organizations.findFirst({
    select: { id: true }
  });
  return org?.id ?? null;
}

export interface Registration {
  id: string;
  programId: string;
  title: string;
  sport: string;
  submissionCount: number;
}

export async function getRegistrationsByProgram(programId: string): Promise<Registration[]> {
  const registrations = await db.registrations.findMany({
    where: { program_id: programId },
    include: {
      _count: {
        select: {
          registration_submissions: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return registrations.map(reg => ({
    id: reg.id,
    programId: reg.program_id,
    title: reg.title,
    sport: reg.sport,
    submissionCount: reg._count.registration_submissions,
  }));
}

export async function getAllRegistrations(organizationId: string): Promise<Registration[]> {
  const registrations = await db.registrations.findMany({
    where: {
      programs: {
        organization_id: organizationId
      }
    },
    include: {
      _count: {
        select: {
          registration_submissions: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return registrations.map(reg => ({
    id: reg.id,
    programId: reg.program_id,
    title: reg.title,
    sport: reg.sport,
    submissionCount: reg._count.registration_submissions,
  }));
}

export interface TeamAssignment {
  teamId: string;
  teamSeasonId: string | null;
  status: string;
}

export interface RegisteredAthlete {
  id: string;
  submissionId: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  teamId: string | null; // Legacy - kept for backward compatibility
  teamSeasonId: string | null; // Legacy - kept for backward compatibility
  teamAssignments: TeamAssignment[];
}

export async function getAthletesByRegistration(registrationId: string): Promise<RegisteredAthlete[]> {
  const submissions = await db.registration_submissions.findMany({
    where: { registration_id: registrationId },
    include: {
      athletes: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          birthdate: true,
        }
      },
      teams: {
        select: {
          id: true,
          season_id: true,
        }
      },
      team_assignments: {
        include: {
          teams: {
            select: {
              id: true,
              season_id: true,
            }
          }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return submissions.map(sub => ({
    id: sub.athlete_id,
    submissionId: sub.id,
    registrationId: sub.registration_id,
    firstName: sub.athletes.first_name,
    lastName: sub.athletes.last_name,
    birthdate: sub.athletes.birthdate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    teamId: sub.team_id,
    teamSeasonId: sub.teams?.season_id || null,
    teamAssignments: sub.team_assignments.map(ta => ({
      teamId: ta.team_id,
      teamSeasonId: ta.teams.season_id,
      status: ta.status,
    })),
  }));
}

export async function getAllAthleteSubmissions(organizationId: string): Promise<RegisteredAthlete[]> {
  const submissions = await db.registration_submissions.findMany({
    where: {
      programs: {
        organization_id: organizationId
      }
    },
    include: {
      athletes: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          birthdate: true,
        }
      },
      teams: {
        select: {
          id: true,
          season_id: true,
        }
      },
      team_assignments: {
        include: {
          teams: {
            select: {
              id: true,
              season_id: true,
            }
          }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  return submissions.map(sub => ({
    id: sub.athlete_id,
    submissionId: sub.id,
    registrationId: sub.registration_id,
    firstName: sub.athletes.first_name,
    lastName: sub.athletes.last_name,
    birthdate: sub.athletes.birthdate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    teamId: sub.team_id,
    teamSeasonId: sub.teams?.season_id || null,
    teamAssignments: sub.team_assignments.map(ta => ({
      teamId: ta.team_id,
      teamSeasonId: ta.teams.season_id,
      status: ta.status,
    })),
  }));
}
