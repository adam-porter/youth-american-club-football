import { getAllTeams, getOrganizationId, getSeasons } from '@/lib/actions/teams';
import ManageTeamsPageClient from './ManageTeamsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ManageTeamsPage() {
  const organizationId = await getOrganizationId();
  const teams = organizationId ? await getAllTeams(organizationId) : [];
  const seasons = organizationId ? await getSeasons(organizationId) : [];
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];

  return (
    <ManageTeamsPageClient 
      teams={teams} 
      seasons={seasons}
      initialSeasonId={activeSeason?.id || ''}
    />
  );
}
