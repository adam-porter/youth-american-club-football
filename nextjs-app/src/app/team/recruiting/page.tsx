'use client';

import PageHeader from '@/components/PageHeader';

export default function RecruitingPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Recruiting"
        description="Manage athlete recruiting, college connections, and profile sharing."
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
