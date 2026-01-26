'use client';

import PageHeader from '@/components/PageHeader';

export default function TeamHighlightsPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Team Highlights"
        description="Browse and manage team highlight videos."
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
