'use server';

import { db } from '@/lib/db';

export interface ProgramCreator {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

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
  registrantCount: number;
  programValue: number; // In cents, $0.00 if no payments
  createdBy: ProgramCreator | null;
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
  
  return programs.map(program => ({
    id: program.id,
    title: program.title,
    type: program.type,
    eventDates: program.event_dates as { start?: string; end?: string },
    visibility: program.visibility as 'public' | 'private',
    registrationStatus: (program.registration_status || 'open') as 'open' | 'closed',
    registrantCount: program._count.registration_submissions,
    programValue: 0, // $0.00 - no payment tracking yet
    createdBy: program.creator ? {
      id: program.creator.id,
      firstName: program.creator.first_name,
      lastName: program.creator.last_name,
      avatar: program.creator.avatar
    } : null
  }));
}

export async function getOrganizationId(): Promise<string | null> {
  const org = await db.organizations.findFirst({
    select: { id: true }
  });
  return org?.id ?? null;
}
