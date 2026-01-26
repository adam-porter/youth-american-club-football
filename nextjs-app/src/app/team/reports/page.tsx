'use client';

import PageHeader from '@/components/PageHeader';

export default function ReportsPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Reports"
        description="View performance reports and analytics for your team."
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
