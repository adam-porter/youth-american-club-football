'use client';

import PageHeader from '@/components/PageHeader';

export default function SchedulePage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Schedule"
        description="View and manage your team's game schedule."
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
