import { getProvisionedTeams, getOrganizationId } from '@/lib/actions/teams';
import TeamsPageClient from './TeamsPageClient';

export default async function TeamsPage() {
  const organizationId = await getOrganizationId();
  const teams = organizationId ? await getProvisionedTeams(organizationId) : [];

  return <TeamsPageClient teams={teams} />;
}
