'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import TeamsTable from '@/components/TeamsTable';
import StaffTable from '@/components/StaffTable';
import Toolbar from '@/components/Toolbar';
import ActionBar from '@/components/ActionBar';
import CopyTeamsModal from '@/components/CopyTeamsModal';
import type { TeamWithStats, Season, StaffUser } from '@/lib/actions/teams';
import EmptyState, { type EmptyStateVariant } from '@/components/EmptyState';

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface TeamsPageClientProps {
  teams: TeamWithStats[];
  seasons: Season[];
  staff: StaffUser[];
  currentUser: CurrentUser | null;
}

export default function TeamsPageClient({ teams, seasons, staff, currentUser }: TeamsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Teams');
  // Default to active season, or first season if none active
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  
  // Copy mode state
  const copyMode = searchParams.get('action') === 'copy-teams';
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const selectedSeason = seasons.find(s => s.id === selectedSeasonId);

  const tabs = [
    { label: 'Teams', isActive: activeTab === 'Teams', onClick: () => setActiveTab('Teams') },
    { label: 'Athletes', isActive: activeTab === 'Athletes', onClick: () => setActiveTab('Athletes') },
    { label: 'Parents', isActive: activeTab === 'Parents', onClick: () => setActiveTab('Parents') },
    { label: 'Staff', isActive: activeTab === 'Staff', onClick: () => setActiveTab('Staff') },
  ];

  const seasonSegments = [
    {
      placeholder: 'Season',
      value: selectedSeasonId,
      options: seasons.map(s => ({ value: s.id, label: `${s.name} Season` })),
      onChange: (value: string) => setSelectedSeasonId(value),
    },
  ];

  // Filter teams by selected season
  const seasonFilteredTeams = teams.filter(team => team.seasonId === selectedSeasonId);
  
  // Filter by search query
  const filteredTeams = searchQuery.trim()
    ? seasonFilteredTeams.filter(team => 
        team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.sport.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : seasonFilteredTeams;

  // Filter staff by search query
  const filteredStaff = staffSearchQuery.trim()
    ? staff.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(staffSearchQuery.toLowerCase())
      )
    : staff;
  
  // Handle team selection
  const handleTeamSelectionChange = (teamId: string, checked: boolean, index: number, shiftKey: boolean) => {
    if (shiftKey && lastClickedIndex !== null && copyMode) {
      // Shift-click: select range
      const startIndex = Math.min(lastClickedIndex, index);
      const endIndex = Math.max(lastClickedIndex, index);
      const rangeTeamIds = filteredTeams.slice(startIndex, endIndex + 1).map(team => team.id);
      
      // Use the intended state of the current item (checked parameter)
      if (checked) {
        // Add all in range
        setSelectedTeamIds(Array.from(new Set([...selectedTeamIds, ...rangeTeamIds])));
      } else {
        // Remove all in range
        setSelectedTeamIds(selectedTeamIds.filter(id => !rangeTeamIds.includes(id)));
      }
    } else {
      // Normal click
      if (checked) {
        setSelectedTeamIds([...selectedTeamIds, teamId]);
      } else {
        setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
      }
    }
    
    // Update last clicked index
    setLastClickedIndex(index);
  };
  
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedTeamIds(filteredTeams.map(team => team.id));
    } else {
      setSelectedTeamIds([]);
      setLastClickedIndex(null);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedTeamIds([]);
    setLastClickedIndex(null);
  };

  // Determine empty state variant
  const getEmptyStateVariant = (): EmptyStateVariant => {
    if (searchQuery.trim() && filteredTeams.length === 0) return 'search';
    if (seasonFilteredTeams.length === 0) return 'teams-season';
    return 'teams';
  };

  return (
    <div className="teams-page">
      <PageHeader 
        title="Teams"
        description="View and manage your organization's teams, rosters, and schedules."
        actions={activeTab === 'Teams' ? [
          { label: 'Team Assignments', buttonStyle: 'minimal' },
          { label: 'Manage Teams', buttonStyle: 'standard', onClick: () => router.push('/teams/manage') }
        ] : undefined}
        tabs={tabs}
      />
      
      <CopyTeamsModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        selectedTeamIds={selectedTeamIds}
        sourceSeasonId={selectedSeasonId}
        seasons={seasons}
      />
      
      {activeTab === 'Teams' && (
        <div className="teams-content">
          <div className="toolbar-wrapper">
            <Toolbar
              segments={seasonSegments}
              searchPlaceholder="Search teams..."
              showFilter={true}
              showExport={true}
              onSearch={(query) => setSearchQuery(query)}
            />
            {copyMode && selectedTeamIds.length > 0 && (
              <ActionBar
                selectedCount={selectedTeamIds.length}
                onDuplicate={() => setIsCopyModalOpen(true)}
                onDelete={() => {
                  // TODO: Implement delete functionality
                  console.log('Delete teams:', selectedTeamIds);
                }}
                onClose={handleClearSelection}
                onClearSelection={handleClearSelection}
              />
            )}
          </div>
          <TeamsTable 
            teams={filteredTeams}
            seasons={seasons}
            emptyStateVariant={getEmptyStateVariant()}
            emptyStateSeasonName={selectedSeason?.name}
            searchQuery={searchQuery}
            copyMode={copyMode}
            selectedTeamIds={selectedTeamIds}
            onTeamSelectionChange={handleTeamSelectionChange}
            onSelectAllChange={handleSelectAllChange}
            onSelectAllChangeWithReset={() => {
              setLastClickedIndex(null);
              setSelectedTeamIds(filteredTeams.map(team => team.id));
            }}
          />
        </div>
      )}

      {activeTab === 'Athletes' && (
        <div className="teams-content">
          <div className="toolbar-wrapper">
            <Toolbar
              segments={seasonSegments}
              searchPlaceholder="Search athletes..."
              showFilter={true}
              showExport={true}
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <EmptyState variant="teams-athletes" searchQuery={searchQuery} />
        </div>
      )}

      {activeTab === 'Parents' && (
        <div className="teams-content">
          <div className="toolbar-wrapper">
            <Toolbar
              segments={seasonSegments}
              searchPlaceholder="Search parents..."
              showFilter={true}
              showExport={true}
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          <EmptyState variant="teams-parents" searchQuery={searchQuery} />
        </div>
      )}

      {activeTab === 'Staff' && (
        <div className="teams-content">
          <div className="toolbar-wrapper">
            <Toolbar
              segments={seasonSegments}
              searchPlaceholder="Search staff..."
              showFilter={true}
              showExport={true}
              onSearch={(query) => setStaffSearchQuery(query)}
            />
          </div>
          <StaffTable 
            staff={filteredStaff} 
            emptyStateVariant="teams-staff"
            searchQuery={staffSearchQuery}
            currentUserId={currentUser?.id}
          />
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

        .toolbar-wrapper {
          position: relative;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
