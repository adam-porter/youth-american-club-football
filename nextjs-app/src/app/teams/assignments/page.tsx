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

  // Parallelize data fetching for better performance
  const [teams, seasons, programs, registrations, athletes] = await Promise.all([
    organizationId ? getAllTeams(organizationId) : Promise.resolve([]),
    organizationId ? getSeasons(organizationId) : Promise.resolve([]),
    organizationId ? getPrograms(organizationId) : Promise.resolve([]),
    organizationId ? getAllRegistrations(organizationId) : Promise.resolve([]),
    organizationId ? getAllAthleteSubmissions(organizationId) : Promise.resolve([]),
  ]);
  
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
