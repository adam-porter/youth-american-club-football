'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import TeamsTable from '@/components/TeamsTable';
import StaffTable from '@/components/StaffTable';
import Toolbar from '@/components/Toolbar';
import ActionBar from '@/components/ActionBar';
import CopyTeamsModal from '@/components/CopyTeamsModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Checkbox from '@/components/Checkbox';
import type { TeamWithStats, Season, StaffUser, RosterAthlete } from '@/lib/actions/teams';
import { deleteTeams } from '@/lib/actions/teams';
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
  rosterAthletes: RosterAthlete[];
  currentUser: CurrentUser | null;
  initialSeasonId?: string;
}

function formatGrade(grade: number): string {
  if (grade === -1) return 'Pre-K';
  if (grade === 0) return 'K';
  const suffix = grade === 1 ? 'st' : grade === 2 ? 'nd' : grade === 3 ? 'rd' : 'th';
  return `${grade}${suffix}`;
}

export default function TeamsPageClient({ teams, seasons, staff, rosterAthletes, currentUser, initialSeasonId }: TeamsPageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Teams');
  // Use initialSeasonId if provided, otherwise default to active season
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(initialSeasonId || activeSeason?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  
  // Team selection state
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTeams, setLocalTeams] = useState<TeamWithStats[]>(teams);
  
  // Athlete selection state
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [lastClickedAthleteIndex, setLastClickedAthleteIndex] = useState<number | null>(null);
  
  // Parent selection state
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([]);
  const [lastClickedParentIndex, setLastClickedParentIndex] = useState<number | null>(null);

  const selectedSeason = seasons.find(s => s.id === selectedSeasonId);

  const tabs = [
    { label: 'Teams', isActive: activeTab === 'Teams', onClick: () => setActiveTab('Teams') },
    { label: 'Athletes', isActive: activeTab === 'Athletes', onClick: () => setActiveTab('Athletes') },
    { label: 'Family Members', isActive: activeTab === 'Family Members', onClick: () => setActiveTab('Family Members') },
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
  const seasonFilteredTeams = localTeams.filter(team => team.seasonId === selectedSeasonId);
  
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
    if (shiftKey && lastClickedIndex !== null) {
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

  const handleDeleteTeams = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTeams(selectedTeamIds);
      if (result.success) {
        // Remove deleted teams from local state
        setLocalTeams(prev => prev.filter(team => !selectedTeamIds.includes(team.id)));
        handleClearSelection();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      // Error handling - dialog stays open
    } finally {
      setIsDeleting(false);
    }
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
          { label: 'Team Assignments', buttonStyle: 'minimal', onClick: () => router.push(`/teams/assignments?season=${selectedSeasonId}`) },
          { label: 'Manage Teams', buttonStyle: 'standard', onClick: () => router.push(`/teams/manage?season=${selectedSeasonId}`) }
        ] : undefined}
        tabs={tabs}
      />
      
      <CopyTeamsModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        selectedTeamIds={selectedTeamIds}
        sourceSeasonId={selectedSeasonId}
        seasons={seasons}
        onSuccess={(newTeams) => {
          setLocalTeams(prev => [...prev, ...newTeams]);
          handleClearSelection();
        }}
      />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        message={`If you delete ${selectedTeamIds.length === 1 ? 'this team' : `these ${selectedTeamIds.length} teams`}, ${selectedTeamIds.length === 1 ? "it" : "they"} can't be recovered. Do you want to continue?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteTeams}
        onCancel={() => setIsDeleteDialogOpen(false)}
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
            {selectedTeamIds.length > 0 && (
              <ActionBar
                selectedCount={selectedTeamIds.length}
                onDuplicate={() => setIsCopyModalOpen(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
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
            copyMode={true}
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
          {(() => {
            // Filter athletes by selected season first
            const seasonFilteredAthletes = rosterAthletes.filter(
              athlete => athlete.teamSeasonId === selectedSeasonId
            );
            
            // Group athletes by ID and collect their teams
            const athleteMap = new Map<string, {
              id: string;
              firstName: string;
              lastName: string;
              birthdate: string;
              gender: string;
              grade: number;
              primaryContact: { id: string; firstName: string; lastName: string; avatar: string | null } | null;
              teams: { id: string; name: string; avatar: string | null }[];
            }>();
            
            seasonFilteredAthletes.forEach(athlete => {
              const existing = athleteMap.get(athlete.id);
              if (existing) {
                // Add team if not already present
                if (!existing.teams.some(t => t.id === athlete.teamId)) {
                  existing.teams.push({
                    id: athlete.teamId,
                    name: athlete.teamName,
                    avatar: athlete.teamAvatar,
                  });
                }
              } else {
                athleteMap.set(athlete.id, {
                  id: athlete.id,
                  firstName: athlete.firstName,
                  lastName: athlete.lastName,
                  birthdate: athlete.birthdate,
                  gender: athlete.gender,
                  grade: athlete.grade,
                  primaryContact: athlete.primaryContact,
                  teams: [{
                    id: athlete.teamId,
                    name: athlete.teamName,
                    avatar: athlete.teamAvatar,
                  }],
                });
              }
            });
            
            const groupedAthletes = Array.from(athleteMap.values());
            
            // Then filter by search query
            const filteredAthletes = searchQuery.trim()
              ? groupedAthletes.filter(athlete =>
                  `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  athlete.teams.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              : groupedAthletes;

            if (filteredAthletes.length === 0) {
              return <EmptyState variant={searchQuery.trim() ? 'search' : 'teams-athletes'} searchQuery={searchQuery} />;
            }

            const getInitials = (firstName: string, lastName: string) => 
              `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

            const allAthletesSelected = filteredAthletes.length > 0 && 
              filteredAthletes.every(a => selectedAthleteIds.includes(a.id));
            const someAthletesSelected = filteredAthletes.some(a => selectedAthleteIds.includes(a.id));

            const handleAthleteSelect = (athleteId: string, index: number, shiftKey: boolean) => {
              if (shiftKey && lastClickedAthleteIndex !== null) {
                const start = Math.min(lastClickedAthleteIndex, index);
                const end = Math.max(lastClickedAthleteIndex, index);
                const rangeIds = filteredAthletes.slice(start, end + 1).map(a => a.id);
                const isDeselecting = selectedAthleteIds.includes(athleteId);
                if (isDeselecting) {
                  setSelectedAthleteIds(prev => prev.filter(id => !rangeIds.includes(id)));
                } else {
                  setSelectedAthleteIds(prev => Array.from(new Set([...prev, ...rangeIds])));
                }
              } else {
                setSelectedAthleteIds(prev =>
                  prev.includes(athleteId)
                    ? prev.filter(id => id !== athleteId)
                    : [...prev, athleteId]
                );
              }
              setLastClickedAthleteIndex(index);
            };

            return (
              <div className="athletes-table">
                <div className="table-row table-header">
                  <div className="table-cell cell-checkbox">
                    <Checkbox
                      checked={allAthletesSelected}
                      indeterminate={someAthletesSelected && !allAthletesSelected}
                      onChange={() => {
                        if (allAthletesSelected) {
                          setSelectedAthleteIds([]);
                        } else {
                          setSelectedAthleteIds(filteredAthletes.map(a => a.id));
                        }
                      }}
                    />
                  </div>
                  <div className="table-cell cell-athlete-name">Athlete</div>
                  <div className="table-cell cell-athlete-team">Team</div>
                  <div className="table-cell cell-athlete-contact">Primary Contact</div>
                  <div className="table-cell cell-athlete-birthdate">Birthdate</div>
                  <div className="table-cell cell-athlete-grade">Grade</div>
                </div>
                {filteredAthletes.map((athlete, index) => {
                  const isSelected = selectedAthleteIds.includes(athlete.id);
                  return (
                  <div 
                    key={athlete.id} 
                    className={`table-row table-data ${isSelected ? 'table-data--selected' : ''}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('.cell-checkbox')) return;
                      handleAthleteSelect(athlete.id, index, e.shiftKey);
                    }}
                  >
                    <div className="table-cell cell-checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(checked, shiftKey) => handleAthleteSelect(athlete.id, index, shiftKey || false)}
                      />
                    </div>
                    <div className="table-cell cell-athlete-name">
                      <div className="avatar-cell">
                        <div className={`avatar avatar--small`}>
                          <div className="avatar-inner">
                            <span className="avatar-initials">{getInitials(athlete.firstName, athlete.lastName)}</span>
                          </div>
                        </div>
                        <span className="athlete-name">{athlete.firstName} {athlete.lastName}</span>
                      </div>
                    </div>
                    <div className="table-cell cell-athlete-team">
                      <div className="team-cell">
                        <div className="avatar-group">
                          {athlete.teams.slice(0, 3).map((team, i) => (
                            <div key={team.id} className={`avatar avatar--small avatar--stacked ${team.avatar ? 'avatar--has-image' : ''}`} style={{ zIndex: 3 - i }}>
                              <div className="avatar-inner">
                                {team.avatar ? (
                                  <img src={team.avatar} alt={team.name} className="avatar-img" />
                                ) : (
                                  <span className="avatar-initials">{team.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {athlete.teams.length > 3 && (
                            <div className="avatar avatar--small avatar--stacked avatar--more" style={{ zIndex: 0 }}>
                              <div className="avatar-inner">
                                <span className="avatar-initials">+{athlete.teams.length - 3}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="team-text">{athlete.teams.map(t => t.name).join(', ')}</span>
                      </div>
                    </div>
                    <div className="table-cell cell-athlete-contact">
                      {athlete.primaryContact ? (
                        <div className="avatar-cell">
                          <div className={`avatar avatar--small ${athlete.primaryContact.avatar ? 'avatar--has-image' : ''}`}>
                            <div className="avatar-inner">
                              {athlete.primaryContact.avatar ? (
                                <img src={athlete.primaryContact.avatar} alt="" className="avatar-img" />
                              ) : (
                                <span className="avatar-initials">{getInitials(athlete.primaryContact.firstName, athlete.primaryContact.lastName)}</span>
                              )}
                            </div>
                          </div>
                          <span>{athlete.primaryContact.firstName} {athlete.primaryContact.lastName}</span>
                        </div>
                      ) : (
                        <span className="no-contact">—</span>
                      )}
                    </div>
                    <div className="table-cell cell-athlete-birthdate">{athlete.birthdate}</div>
                    <div className="table-cell cell-athlete-grade">{formatGrade(athlete.grade)}</div>
                  </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'Family Members' && (
        <div className="teams-content">
          <div className="toolbar-wrapper">
            <Toolbar
              segments={seasonSegments}
              searchPlaceholder="Search family members..."
              showFilter={true}
              showExport={true}
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
          {(() => {
            // Filter athletes by season first
            const seasonFilteredAthletes = rosterAthletes.filter(
              athlete => athlete.teamSeasonId === selectedSeasonId
            );
            
            // Extract unique primary contacts with their associated athletes/teams
            const contactMap = new Map<string, {
              id: string;
              firstName: string;
              lastName: string;
              avatar: string | null;
              athletes: { id: string; firstName: string; lastName: string }[];
              teams: { id: string; name: string; avatar: string | null }[];
            }>();
            
            seasonFilteredAthletes.forEach(athlete => {
              if (athlete.primaryContact) {
                const existing = contactMap.get(athlete.primaryContact.id);
                if (existing) {
                  // Add athlete if not already added
                  if (!existing.athletes.find(a => a.id === athlete.id)) {
                    existing.athletes.push({
                      id: athlete.id,
                      firstName: athlete.firstName,
                      lastName: athlete.lastName,
                    });
                  }
                  // Add team if not already added
                  if (!existing.teams.find(t => t.id === athlete.teamId)) {
                    existing.teams.push({
                      id: athlete.teamId,
                      name: athlete.teamName,
                      avatar: athlete.teamAvatar,
                    });
                  }
                } else {
                  contactMap.set(athlete.primaryContact.id, {
                    id: athlete.primaryContact.id,
                    firstName: athlete.primaryContact.firstName,
                    lastName: athlete.primaryContact.lastName,
                    avatar: athlete.primaryContact.avatar,
                    athletes: [{
                      id: athlete.id,
                      firstName: athlete.firstName,
                      lastName: athlete.lastName,
                    }],
                    teams: [{
                      id: athlete.teamId,
                      name: athlete.teamName,
                      avatar: athlete.teamAvatar,
                    }],
                  });
                }
              }
            });
            
            const allContacts = Array.from(contactMap.values());
            
            // Filter by search query
            const filteredContacts = searchQuery.trim()
              ? allContacts.filter(contact =>
                  `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contact.athletes.some(a => 
                    `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
                  ) ||
                  contact.teams.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              : allContacts;

            if (filteredContacts.length === 0) {
              const emptyVariant: EmptyStateVariant = searchQuery.trim() ? 'search' : 'teams-parents';
              return <EmptyState variant={emptyVariant} searchQuery={searchQuery} />;
            }

            const getInitials = (firstName: string, lastName: string) => 
              `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

            const allContactsSelected = filteredContacts.length > 0 && 
              filteredContacts.every(c => selectedParentIds.includes(c.id));
            const someContactsSelected = filteredContacts.some(c => selectedParentIds.includes(c.id));

            const handleContactSelect = (contactId: string, index: number, shiftKey: boolean) => {
              if (shiftKey && lastClickedParentIndex !== null) {
                const start = Math.min(lastClickedParentIndex, index);
                const end = Math.max(lastClickedParentIndex, index);
                const rangeIds = filteredContacts.slice(start, end + 1).map(c => c.id);
                const isDeselecting = selectedParentIds.includes(contactId);
                if (isDeselecting) {
                  setSelectedParentIds(prev => prev.filter(id => !rangeIds.includes(id)));
                } else {
                  setSelectedParentIds(prev => Array.from(new Set([...prev, ...rangeIds])));
                }
              } else {
                setSelectedParentIds(prev =>
                  prev.includes(contactId)
                    ? prev.filter(id => id !== contactId)
                    : [...prev, contactId]
                );
              }
              setLastClickedParentIndex(index);
            };

            return (
              <div className="parents-table">
                <div className="table-row table-header">
                  <div className="table-cell cell-checkbox">
                    <Checkbox
                      checked={allContactsSelected}
                      indeterminate={someContactsSelected && !allContactsSelected}
                      onChange={() => {
                        if (allContactsSelected) {
                          setSelectedParentIds([]);
                        } else {
                          setSelectedParentIds(filteredContacts.map(c => c.id));
                        }
                      }}
                    />
                  </div>
                  <div className="table-cell cell-parent-name">Family Member</div>
                  <div className="table-cell cell-parent-athletes">Athletes</div>
                  <div className="table-cell cell-parent-teams">Teams</div>
                </div>
                {filteredContacts.map((contact, index) => {
                  const isSelected = selectedParentIds.includes(contact.id);
                  return (
                    <div 
                      key={contact.id} 
                      className={`table-row table-data ${isSelected ? 'table-data--selected' : ''}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.cell-checkbox')) return;
                        handleContactSelect(contact.id, index, e.shiftKey);
                      }}
                    >
                      <div className="table-cell cell-checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked, shiftKey) => handleContactSelect(contact.id, index, shiftKey || false)}
                        />
                      </div>
                      <div className="table-cell cell-parent-name">
                        <div className="avatar-cell">
                          <div className={`avatar avatar--small ${contact.avatar ? 'avatar--has-image' : ''}`}>
                            <div className="avatar-inner">
                              {contact.avatar ? (
                                <img src={contact.avatar} alt="" className="avatar-img" />
                              ) : (
                                <span className="avatar-initials">{getInitials(contact.firstName, contact.lastName)}</span>
                              )}
                            </div>
                          </div>
                          <span className="parent-name">{contact.firstName} {contact.lastName}</span>
                        </div>
                      </div>
                      <div className="table-cell cell-parent-athletes">
                        <div className="avatar-group">
                          {contact.athletes.slice(0, 3).map((a, i) => (
                            <div key={a.id} className="avatar avatar--small avatar--stacked" style={{ zIndex: 3 - i }}>
                              <div className="avatar-inner">
                                <span className="avatar-initials">{`${a.firstName[0] || ''}${a.lastName[0] || ''}`.toUpperCase()}</span>
                              </div>
                            </div>
                          ))}
                          {contact.athletes.length > 3 && (
                            <div className="avatar avatar--small avatar--stacked avatar--more" style={{ zIndex: 0 }}>
                              <div className="avatar-inner">
                                <span className="avatar-initials">+{contact.athletes.length - 3}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="athletes-text">
                          {contact.athletes.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                        </span>
                      </div>
                      <div className="table-cell cell-parent-teams">
                        <div className="avatar-group">
                          {contact.teams.slice(0, 3).map((t, i) => (
                            <div key={t.id} className={`avatar avatar--small avatar--stacked ${t.avatar ? 'avatar--has-image' : ''}`} style={{ zIndex: 3 - i }}>
                              <div className="avatar-inner">
                                {t.avatar ? (
                                  <img src={t.avatar} alt={t.name} className="avatar-img" />
                                ) : (
                                  <span className="avatar-initials">{t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                            </div>
                          ))}
                          {contact.teams.length > 3 && (
                            <div className="avatar avatar--small avatar--stacked avatar--more" style={{ zIndex: 0 }}>
                              <div className="avatar-inner">
                                <span className="avatar-initials">+{contact.teams.length - 3}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="teams-text">
                          {contact.teams.map(t => t.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
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

        .athletes-table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .athletes-table .table-row {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .athletes-table .table-header {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .athletes-table .table-data {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          height: 52px;
          box-sizing: border-box;
        }

        .athletes-table .table-data:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .athletes-table .table-data--selected {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .athletes-table .table-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          padding: 6px var(--u-space-one, 16px);
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-200, 14px);
          line-height: 1.4;
          color: var(--u-color-base-foreground, #36485c);
          height: 100%;
          box-sizing: border-box;
        }

        .athletes-table .table-header .table-cell {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .athletes-table .cell-athlete-name {
          flex: 1;
          min-width: 200px;
        }

        .athletes-table .athlete-name {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
          transition: text-decoration-color 0.15s ease;
        }

        .athletes-table .table-data:hover .athlete-name {
          text-decoration-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .athletes-table .cell-checkbox {
          flex-shrink: 0;
          justify-content: center;
          padding-left: 16px;
          padding-right: 2px;
        }

        .athletes-table .cell-athlete-team {
          flex: 1;
          min-width: 180px;
        }

        .athletes-table .team-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          min-width: 0;
        }

        .athletes-table .avatar-group {
          display: flex;
          flex-shrink: 0;
        }

        .athletes-table .avatar--stacked {
          margin-left: -8px;
        }

        .athletes-table .avatar--stacked:first-child {
          margin-left: 0;
        }

        .athletes-table .avatar--more .avatar-inner {
          background: var(--u-color-background-default, #e8eaec);
        }

        .athletes-table .avatar--more .avatar-initials {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .athletes-table .team-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .athletes-table .cell-athlete-contact {
          flex: 1;
          min-width: 180px;
        }

        .athletes-table .cell-athlete-birthdate {
          width: 120px;
          flex-shrink: 0;
        }

        .athletes-table .cell-athlete-grade {
          width: 80px;
          flex-shrink: 0;
        }

        .athletes-table .avatar-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .athletes-table .avatar {
          width: 32px;
          height: 32px;
          padding: 2px;
          flex-shrink: 0;
        }

        .athletes-table .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--u-color-identity-default, #38434f);
          border: 1px solid var(--u-color-identity-white, #fafafa);
        }

        .athletes-table .avatar--has-image .avatar-inner {
          background: var(--u-color-background-container, #fefefe);
        }

        .athletes-table .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .athletes-table .avatar-initials {
          font-family: var(--u-font-body);
          font-size: 11px;
          font-weight: var(--u-font-weight-bold, 700);
          color: white;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }

        .athletes-table .no-contact {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        /* Parents table styles */
        .parents-table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .parents-table .table-row {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .parents-table .table-header {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .parents-table .table-data {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          height: 52px;
          box-sizing: border-box;
        }

        .parents-table .table-data:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .parents-table .table-data--selected {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .parents-table .table-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          padding: 6px var(--u-space-one, 16px);
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-200, 14px);
          line-height: 1.4;
          color: var(--u-color-base-foreground, #36485c);
          height: 100%;
          box-sizing: border-box;
        }

        .parents-table .table-header .table-cell {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .parents-table .cell-checkbox {
          flex-shrink: 0;
          justify-content: center;
          padding-left: 16px;
          padding-right: 2px;
        }

        .parents-table .cell-parent-name {
          flex: 1;
          min-width: 200px;
        }

        .parents-table .cell-parent-athletes {
          flex: 1;
          min-width: 200px;
          gap: var(--u-space-half, 8px);
        }

        .parents-table .avatar-group {
          display: flex;
          flex-shrink: 0;
        }

        .parents-table .avatar--stacked {
          margin-right: -8px;
          position: relative;
        }

        .parents-table .avatar--stacked:last-child {
          margin-right: 0;
        }

        .parents-table .avatar--more .avatar-inner {
          background: var(--u-color-background-default, #e8eaec);
        }

        .parents-table .avatar--more .avatar-initials {
          color: var(--u-color-base-foreground, #36485c);
          font-size: 9px;
        }

        .parents-table .athletes-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .parents-table .cell-parent-teams {
          flex: 1;
          min-width: 180px;
          gap: var(--u-space-half, 8px);
        }

        .parents-table .teams-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .parents-table .avatar-cell {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .parents-table .avatar {
          width: 32px;
          height: 32px;
          padding: 2px;
          flex-shrink: 0;
        }

        .parents-table .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--u-color-identity-default, #38434f);
          border: 1px solid var(--u-color-identity-white, #fafafa);
        }

        .parents-table .avatar--has-image .avatar-inner {
          background: var(--u-color-background-container, #fefefe);
        }

        .parents-table .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .parents-table .avatar-initials {
          font-family: var(--u-font-body);
          font-size: 11px;
          font-weight: var(--u-font-weight-bold, 700);
          color: white;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }

        .parents-table .avatar--xs {
          width: 20px;
          height: 20px;
        }

        .parents-table .avatar--xs .avatar-initials {
          font-size: 8px;
        }

        .parents-table .parent-name {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
          transition: text-decoration-color 0.15s ease;
        }

        .parents-table .table-data:hover .parent-name {
          text-decoration-color: var(--u-color-line-subtle, #c4c6c8);
        }
      `}</style>
    </div>
  );
}
