'use client';

import PageHeader from '@/components/PageHeader';

export default function LibraryPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Library"
        description="Access and manage your team's video library."
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
