import { getAllTeams, getOrganizationId, getSeasons, getStaffUsers, getAthletesOnProvisionedTeams } from '@/lib/actions/teams';
import { getCurrentUser } from '@/lib/data';
import TeamsPageClient from './TeamsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const params = await searchParams;
  const organizationId = await getOrganizationId();

  // Parallelize data fetching for better performance
  const [teams, seasons, staff, rosterAthletes, currentUserData] = await Promise.all([
    organizationId ? getAllTeams(organizationId) : Promise.resolve([]),
    organizationId ? getSeasons(organizationId) : Promise.resolve([]),
    organizationId ? getStaffUsers(organizationId) : Promise.resolve([]),
    organizationId ? getAthletesOnProvisionedTeams(organizationId) : Promise.resolve([]),
    getCurrentUser(),
  ]);
  const currentUser = currentUserData ? {
    id: currentUserData.id,
    firstName: currentUserData.first_name,
    lastName: currentUserData.last_name,
  } : null;

  // Determine initial season from URL param, falling back to active season
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  const initialSeasonId = params.season && seasons.some(s => s.id === params.season)
    ? params.season
    : activeSeason?.id;

  return <TeamsPageClient teams={teams} seasons={seasons} staff={staff} rosterAthletes={rosterAthletes} currentUser={currentUser} initialSeasonId={initialSeasonId} />;
}
