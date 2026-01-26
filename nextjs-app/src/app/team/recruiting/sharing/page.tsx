'use client';

import PageHeader from '@/components/PageHeader';

export default function SharingPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Sharing"
        description="Manage video sharing with recruiters and colleges."
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
