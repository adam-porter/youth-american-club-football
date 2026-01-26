'use client';

import PageHeader from '@/components/PageHeader';

export default function RecruitingSettingsPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Recruiting Settings"
        description="Configure recruiting preferences and notifications."
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
