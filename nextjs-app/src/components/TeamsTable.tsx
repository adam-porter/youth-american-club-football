'use client';

import type { TeamWithStats, Season } from '@/lib/actions/teams';
import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';
import Icon from './Icon';
import Checkbox from './Checkbox';

function formatGrade(grade: number | null): string {
  if (grade === null) return '—';
  const suffix = grade === 1 ? 'st' : grade === 2 ? 'nd' : grade === 3 ? 'rd' : 'th';
  return `${grade}${suffix} Grade`;
}

function formatSport(sport: string): string {
  return sport.charAt(0).toUpperCase() + sport.slice(1);
}

function formatGender(gender: string): string {
  const genderMap: Record<string, string> = {
    male: 'Boys',
    female: 'Girls',
    coed: 'Co-ed',
  };
  return genderMap[gender.toLowerCase()] || gender;
}

function getSeasonName(seasonId: string | null, seasons: Season[]): string {
  if (!seasonId) return '—';
  const season = seasons.find(s => s.id === seasonId);
  return season?.name || '—';
}

function SortArrow() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 0L8.5 4H1.5L5 0Z" fill="var(--u-color-base-foreground-subtle, #607081)" />
      <path d="M5 11L1.5 7H8.5L5 11Z" fill="var(--u-color-base-foreground-subtle, #607081)" />
    </svg>
  );
}

function TeamAvatar({ avatar, title }: { avatar: string | null; title: string }) {
  const initials = title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (avatar) {
    return (
      <div className="team-avatar">
        <img src={avatar} alt={title} />
        <style jsx>{`
          .team-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }
          .team-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="team-avatar-placeholder">
      {initials}
      <style jsx>{`
        .team-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--u-color-background-subtle, #f5f6f7);
          color: var(--u-color-base-foreground-subtle, #607081);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: var(--u-font-weight-bold, 700);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

function RosterBadge({ count, max }: { count: number; max: number | null }) {
  const displayText = max ? `${count}/${max}` : `${count}`;
  
  return (
    <span className="roster-badge">
      {displayText}
      <style jsx>{`
        .roster-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: var(--u-color-background-default, #e8eaec);
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: var(--u-font-weight-medium, 500);
          color: var(--u-color-base-foreground, #36485c);
        }
      `}</style>
    </span>
  );
}

function TeamColors({ primaryColor, secondaryColor }: { primaryColor: string | null; secondaryColor: string | null }) {
  if (!primaryColor && !secondaryColor) {
    return null;
  }

  return (
    <div className="team-colors">
      {primaryColor && (
        <div 
          className="team-color-block team-color-block--primary"
          style={{ 
            backgroundColor: primaryColor,
          }}
        />
      )}
      {secondaryColor && (
        <div 
          className="team-color-block team-color-block--secondary"
          style={{ 
            backgroundColor: secondaryColor,
          }}
        />
      )}
      <style jsx>{`
        .team-colors {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 16px;
          height: 24px;
          align-items: flex-start;
          padding: 2px;
          border: 1px solid var(--u-color-background-canvas, #eff0f0);
          box-sizing: border-box;
          border-radius: var(--u-border-radius-medium, 4px);
        }

        .team-color-block {
          width: 100%;
          flex: 1;
          flex-shrink: 0;
          min-height: 0;
        }

        .team-color-block--primary {
          border-radius: 2px 2px 0 0;
        }

        .team-color-block--secondary {
          border-radius: 0 0 2px 2px;
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isDraft = status === 'draft';
  const label = isDraft ? 'Draft' : 'Active';
  
  return (
    <span className="status-badge-wrapper">
      <span className={`status-badge ${isDraft ? 'status-badge--draft' : 'status-badge--active'}`}>
        {isDraft && (
          <Icon 
            src="/icons/info.svg" 
            alt="Info" 
            width={16} 
            height={16}
            className="status-badge-icon"
          />
        )}
        {label}
      </span>
      {isDraft && (
        <span className="status-tooltip">Contact your CSM to add this team to your Hudl subscription</span>
      )}
      <style jsx>{`
        .status-badge-wrapper {
          position: relative;
          display: inline-flex;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: var(--u-font-body);
          font-size: 12px;
          font-weight: var(--u-font-weight-medium, 500);
        }

        .status-badge-icon {
          flex-shrink: 0;
        }

        .status-badge--draft {
          background: var(--u-color-background-default, #e8eaec);
          color: var(--u-color-base-foreground, #36485c);
          cursor: help;
        }

        .status-badge--active {
          background: #E7F3FD;
          color: #085BB4;
        }

        .status-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background-color: #191F24;
          color: var(--u-color-background-container, #fefefe);
          padding: var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
          border-radius: var(--u-border-radius-medium, 4px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          z-index: 1000;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15), 0px 0px 4px rgba(0, 0, 0, 0.1);
        }

        .status-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #191F24;
        }

        .status-badge-wrapper:hover .status-tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </span>
  );
}

function TableContent({ 
  teams, 
  copyMode, 
  selectedTeamIds = [], 
  onTeamSelectionChange, 
  onSelectAllChange,
  onSelectAllChangeWithReset,
  seasons = []
}: { 
  teams: TeamWithStats[];
  copyMode?: boolean;
  seasons?: Season[];
  selectedTeamIds?: string[];
  onTeamSelectionChange?: (teamId: string, checked: boolean, index: number, shiftKey: boolean) => void;
  onSelectAllChange?: (checked: boolean) => void;
  onSelectAllChangeWithReset?: () => void;
}) {
  const allSelected = copyMode && teams.length > 0 && teams.every(team => selectedTeamIds.includes(team.id));
  const someSelected = copyMode && teams.length > 0 && selectedTeamIds.length > 0 && !allSelected;

  return (
    <div className="teams-table">
      {/* Header Row */}
      <div className="table-row table-header">
        {copyMode && (
          <div className="table-cell cell-checkbox">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(checked) => {
                // If all are selected, deselect all. Otherwise (none or some selected), select all.
                if (allSelected) {
                  onSelectAllChange?.(false);
                } else {
                  // Select all (whether currently none or some selected)
                  if (onSelectAllChangeWithReset) {
                    onSelectAllChangeWithReset();
                  } else {
                    onSelectAllChange?.(true);
                  }
                }
              }}
            />
          </div>
        )}
        <div className="table-cell cell-team">
          <span className="header-label">Team</span>
        </div>
        <div className="table-cell cell-status">
          <span className="header-label">Status</span>
        </div>
        <div className="table-cell cell-season">
          <span className="header-label">Season</span>
        </div>
        <div className="table-cell cell-sport">
          <span className="header-label">Sport</span>
        </div>
        <div className="table-cell cell-grade">
          <span className="header-label">Grade</span>
        </div>
        <div className="table-cell cell-gender">
          <span className="header-label">Gender</span>
        </div>
        <div className="table-cell cell-colors">
          <span className="header-label">Colors</span>
        </div>
        <div className="table-cell cell-roster align-right">
          <span className="header-label">Athletes</span>
        </div>
      </div>

      {/* Data Rows */}
      {teams.map((team, index) => {
        const isSelected = copyMode && selectedTeamIds.includes(team.id);
        return (
          <div 
            key={team.id} 
            className={`table-row table-data ${isSelected ? 'table-data--selected' : ''}`}
          >
            {copyMode && (
              <div className="table-cell cell-checkbox">
                <Checkbox
                  checked={isSelected}
                  onChange={(checked, shiftKey) => onTeamSelectionChange?.(team.id, checked, index, shiftKey)}
                />
              </div>
            )}
          <div className="table-cell cell-team">
            <TeamAvatar avatar={team.avatar} title={team.title} />
            <span className="team-name">{team.title}</span>
          </div>
          <div className="table-cell cell-status">
            <StatusBadge status={team.status} />
          </div>
          <div className="table-cell cell-season">
            {getSeasonName(team.seasonId, seasons)}
          </div>
          <div className="table-cell cell-sport">
            {formatSport(team.sport)}
          </div>
          <div className="table-cell cell-grade">
            {formatGrade(team.grade)}
          </div>
          <div className="table-cell cell-gender">
            {formatGender(team.gender)}
          </div>
          <div className="table-cell cell-colors">
            <TeamColors primaryColor={team.primaryColor} secondaryColor={team.secondaryColor} />
          </div>
          <div className="table-cell cell-roster align-right">
            <RosterBadge count={team.rosterCount} max={team.maxRosterSize} />
          </div>
        </div>
        );
      })}

      <style jsx>{`
        .teams-table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .table-row {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .table-header {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .table-data {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          height: 52px;
          box-sizing: border-box;
        }

        .table-data:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .table-data--selected {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .table-cell {
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

        .table-header .table-cell {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .cell-team {
          flex: 1;
          min-width: 200px;
        }

        .cell-colors {
          width: 100px;
          flex-shrink: 0;
          justify-content: center;
        }

        .team-name {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
          transition: text-decoration-color 0.15s ease;
        }

        .table-data:hover .team-name {
          text-decoration-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .cell-sport {
          width: 120px;
          flex-shrink: 0;
        }

        .cell-grade {
          width: 120px;
          flex-shrink: 0;
        }

        .cell-gender {
          width: 100px;
          flex-shrink: 0;
        }

        .cell-roster {
          width: 100px;
          flex-shrink: 0;
        }

        .cell-status {
          width: 100px;
          flex-shrink: 0;
        }

        .cell-season {
          width: 140px;
          flex-shrink: 0;
        }

        .cell-checkbox {
          flex-shrink: 0;
          justify-content: center;
          padding-left: 16px;
          padding-right: 2px;
        }

        .align-right {
          justify-content: flex-end;
          text-align: right;
        }

        .header-label {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

interface TeamsTableProps {
  teams: TeamWithStats[];
  seasons?: Season[];
  emptyStateVariant?: EmptyStateVariant;
  emptyStateSeasonName?: string;
  searchQuery?: string;
  copyMode?: boolean;
  selectedTeamIds?: string[];
  onTeamSelectionChange?: (teamId: string, checked: boolean, index: number, shiftKey: boolean) => void;
  onSelectAllChange?: (checked: boolean) => void;
  onSelectAllChangeWithReset?: () => void;
}

export default function TeamsTable({ 
  teams,
  seasons = [],
  emptyStateVariant = 'teams',
  emptyStateSeasonName,
  searchQuery,
  copyMode = false,
  selectedTeamIds = [],
  onTeamSelectionChange,
  onSelectAllChange,
  onSelectAllChangeWithReset
}: TeamsTableProps) {
  return (
    <div className="teams-content">
      {teams.length > 0 ? (
        <TableContent 
          teams={teams}
          seasons={seasons}
          copyMode={copyMode}
          selectedTeamIds={selectedTeamIds}
          onTeamSelectionChange={onTeamSelectionChange}
          onSelectAllChange={onSelectAllChange}
          onSelectAllChangeWithReset={onSelectAllChangeWithReset}
        />
      ) : (
        <EmptyState 
          variant={emptyStateVariant} 
          seasonName={emptyStateSeasonName}
          searchQuery={searchQuery}
        />
      )}

      <style jsx>{`
        .teams-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }
      `}</style>
    </div>
  );
}
