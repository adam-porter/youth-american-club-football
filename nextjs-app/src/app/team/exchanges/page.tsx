'use client';

import PageHeader from '@/components/PageHeader';

export default function ExchangesPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Exchanges"
        description="Manage film exchanges with other teams."
      />

      <style jsx>{`
        .team-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
