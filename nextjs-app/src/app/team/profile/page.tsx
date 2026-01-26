'use client';

import PageHeader from '@/components/PageHeader';

export default function TeamProfilePage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Team Profile"
        description="View and update your team's public profile."
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
