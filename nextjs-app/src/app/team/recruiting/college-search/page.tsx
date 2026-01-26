'use client';

import PageHeader from '@/components/PageHeader';

export default function CollegeSearchPage() {
  return (
    <div className="team-page">
      <PageHeader 
        title="College Search"
        description="Find and connect with college programs."
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
