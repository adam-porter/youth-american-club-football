import PageHeader from '@/components/PageHeader';

export default function CommunityPage() {
  return (
    <PageHeader
      title="Community"
      description="Manage athletes, coaches, and staff across your organization."
      actions={[
        { label: 'Import', buttonStyle: 'minimal' },
        { label: 'Add Member', buttonStyle: 'standard' }
      ]}
    />
  );
}
