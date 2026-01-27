import { getAllTeams, getOrganizationId, getSeasons, getStaffUsers } from '@/lib/actions/teams';
import { getCurrentUser } from '@/lib/data';
import TeamsPageClient from './TeamsPageClient';

// Disable caching for this page to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const organizationId = await getOrganizationId();
  const teams = organizationId ? await getAllTeams(organizationId) : [];
  const seasons = organizationId ? await getSeasons(organizationId) : [];
  const staff = organizationId ? await getStaffUsers(organizationId) : [];
  const currentUserData = await getCurrentUser();
  const currentUser = currentUserData ? {
    id: currentUserData.id,
    firstName: currentUserData.first_name,
    lastName: currentUserData.last_name,
  } : null;

  return <TeamsPageClient teams={teams} seasons={seasons} staff={staff} currentUser={currentUser} />;
}
