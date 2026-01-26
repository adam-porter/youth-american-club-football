'use client';

import PageHeader from '@/components/PageHeader';

export default function YourHighlightsPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Your Highlights"
        description="Manage your personal highlight videos."
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
