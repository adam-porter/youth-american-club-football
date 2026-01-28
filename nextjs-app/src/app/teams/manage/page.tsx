import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import ManageTeamsPageClient from './ManageTeamsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

interface ManageTeamsPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function ManageTeamsPage({ searchParams }: ManageTeamsPageProps) {
  const params = await searchParams;
  const organizationId = await getOrganizationId();

  // Parallelize data fetching for better performance
  const [teams, seasons] = await Promise.all([
    organizationId ? getAllTeams(organizationId) : Promise.resolve([]),
    organizationId ? getSeasons(organizationId) : Promise.resolve([]),
  ]);
  
  // Use season from URL params, fall back to active season, then first season
  const seasonFromUrl = params.season ? seasons.find(s => s.id === params.season) : null;
  const activeSeason = seasonFromUrl || seasons.find(s => s.isActive) || seasons[0];

  return (
    <ManageTeamsPageClient 
      teams={teams} 
      seasons={seasons}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
