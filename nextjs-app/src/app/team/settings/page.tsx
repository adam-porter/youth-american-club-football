'use client';

import PageHeader from '@/components/PageHeader';

export default function TeamSettingsPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Team Settings"
        description="Configure your team's settings and preferences."
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
