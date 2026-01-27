import { getPrograms, getOrganizationId } from '@/lib/actions/programs';
import ProgramsPageClient from './ProgramsPageClient';

export default async function ProgramsPage() {
  const organizationId = await getOrganizationId();
  const programs = organizationId ? await getPrograms(organizationId) : [];

  return <ProgramsPageClient programs={programs} />;
}
