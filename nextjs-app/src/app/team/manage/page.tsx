'use client';

import PageHeader from '@/components/PageHeader';

export default function ManageTeamPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Manage Team"
        description="Manage your team roster, staff, and permissions."
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
