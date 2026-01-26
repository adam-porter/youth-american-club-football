import PageHeader from '@/components/PageHeader';
import ProgramsTable from '@/components/ProgramsTable';
import { getPrograms, getOrganizationId } from '@/lib/actions/programs';

export default async function ProgramsPage() {
  const organizationId = await getOrganizationId();
  const programs = organizationId ? await getPrograms(organizationId) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <PageHeader 
        title="Programs"
        description="Manage your registration programs, seasons, and events."
        actions={[
          { label: 'Import', buttonStyle: 'minimal' },
          { label: 'New Program', buttonStyle: 'standard' }
        ]}
      />
      <ProgramsTable programs={programs} />
    </div>
  );
}
