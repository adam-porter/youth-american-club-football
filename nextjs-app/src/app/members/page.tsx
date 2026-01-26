import PageHeader from '@/components/PageHeader';

export default function MembersPage() {
  return (
    <PageHeader 
      title="Members"
      description="Manage athletes, coaches, and staff across your organization."
      actions={[
        { label: 'Import', buttonStyle: 'minimal' },
        { label: 'Add Member', buttonStyle: 'standard' }
      ]}
    />
  );
}
