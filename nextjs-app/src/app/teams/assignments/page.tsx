import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import { getPrograms, getAllRegistrations, getAllAthleteSubmissions } from '@/lib/actions/programs';
import AssignmentsPageClient from './AssignmentsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

interface AssignmentsPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function AssignmentsPage({ searchParams }: AssignmentsPageProps) {
  const params = await searchParams;
  const organizationId = await getOrganizationId();
  const teams = organizationId ? await getAllTeams(organizationId) : [];
  const seasons = organizationId ? await getSeasons(organizationId) : [];
  const programs = organizationId ? await getPrograms(organizationId) : [];
  const registrations = organizationId ? await getAllRegistrations(organizationId) : [];
  const athletes = organizationId ? await getAllAthleteSubmissions(organizationId) : [];
  
  // Use season from URL params, fall back to active season, then first season
  const seasonFromUrl = params.season ? seasons.find(s => s.id === params.season) : null;
  const activeSeason = seasonFromUrl || seasons.find(s => s.isActive) || seasons[0];

  return (
    <AssignmentsPageClient 
      teams={teams} 
      seasons={seasons}
      programs={programs}
      registrations={registrations}
      athletes={athletes}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
