'use client';

import PageHeader from '@/components/PageHeader';

export default function VerifyAthletesPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="Verify Athletes"
        description="Verify athlete profiles for recruiting purposes."
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
