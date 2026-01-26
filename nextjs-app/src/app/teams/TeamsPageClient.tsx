'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TeamsTable from '@/components/TeamsTable';
import Toolbar from '@/components/Toolbar';
import type { TeamWithStats } from '@/lib/actions/teams';
import type { EmptyStateVariant } from '@/components/EmptyState';

interface TeamsPageClientProps {
  teams: TeamWithStats[];
}

export default function TeamsPageClient({ teams }: TeamsPageClientProps) {
  const [activeTab, setActiveTab] = useState('Teams');
  const [selectedSeason, setSelectedSeason] = useState('2025-2026');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { label: 'Teams', isActive: activeTab === 'Teams', onClick: () => setActiveTab('Teams') },
    { label: 'Athletes', isActive: activeTab === 'Athletes', onClick: () => setActiveTab('Athletes') },
    { label: 'Parents', isActive: activeTab === 'Parents', onClick: () => setActiveTab('Parents') },
    { label: 'Staff', isActive: activeTab === 'Staff', onClick: () => setActiveTab('Staff') },
  ];

  const seasonSegments = [
    {
      placeholder: 'Season',
      value: selectedSeason,
      options: [
        { value: '2025-2026', label: '2025-2026' },
        { value: '2026-2027', label: '2026-2027' },
      ],
      onChange: (value: string) => setSelectedSeason(value),
    },
  ];

  // Filter teams by season (2026-2027 has no teams yet)
  const seasonFilteredTeams = selectedSeason === '2025-2026' ? teams : [];
  
  // Filter by search query
  const filteredTeams = searchQuery.trim()
    ? seasonFilteredTeams.filter(team => 
        team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.sport.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : seasonFilteredTeams;

  // Determine empty state variant
  const getEmptyStateVariant = (): EmptyStateVariant => {
    if (searchQuery.trim() && filteredTeams.length === 0) return 'search';
    if (selectedSeason === '2026-2027') return 'teams-season';
    return 'teams';
  };

  return (
    <div className="teams-page">
      <PageHeader 
        title="Teams"
        description="View and manage your organization's teams, rosters, and schedules."
        actions={[
          { label: 'Team Assignments', buttonStyle: 'minimal' },
          { label: 'Manage Teams', buttonStyle: 'standard' }
        ]}
        tabs={tabs}
      />
      
      {activeTab === 'Teams' && (
        <div className="teams-content">
          <Toolbar
            segments={seasonSegments}
            searchPlaceholder="Search teams..."
            showFilter={true}
            showExport={true}
            onSearch={(query) => setSearchQuery(query)}
          />
          <TeamsTable 
            teams={filteredTeams} 
            emptyStateVariant={getEmptyStateVariant()}
            emptyStateSeasonName={selectedSeason}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {activeTab === 'Athletes' && (
        <div className="placeholder-content">
          <p>Athletes content coming soon...</p>
        </div>
      )}

      {activeTab === 'Parents' && (
        <div className="placeholder-content">
          <p>Parents content coming soon...</p>
        </div>
      )}

      {activeTab === 'Staff' && (
        <div className="placeholder-content">
          <p>Staff content coming soon...</p>
        </div>
      )}

      <style jsx>{`
        .teams-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .teams-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }

        .placeholder-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--u-space-four, 64px);
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-medium, 4px);
          border: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          color: var(--u-color-base-foreground-subtle, #607081);
          font-family: var(--u-font-body);
        }
      `}</style>
    </div>
  );
}
