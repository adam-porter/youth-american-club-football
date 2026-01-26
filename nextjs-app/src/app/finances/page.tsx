import PageHeader from '@/components/PageHeader';

export default function FinancesPage() {
  return (
    <PageHeader 
      title="Finances"
      description="View and download your payout reports for ticketing and programs."
      actions={[
        { label: 'Export', buttonStyle: 'minimal' },
        { label: 'New Transaction', buttonStyle: 'standard' }
      ]}
    />
  );
}
