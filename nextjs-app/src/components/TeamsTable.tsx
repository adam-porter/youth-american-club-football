'use client';

import type { TeamWithStats } from '@/lib/actions/teams';
import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';

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


function TableContent({ teams }: { teams: TeamWithStats[] }) {
  return (
    <div className="teams-table">
      {/* Header Row */}
      <div className="table-row table-header">
        <div className="table-cell cell-team">
          <span className="header-label">Team</span>
          <SortArrow />
        </div>
        <div className="table-cell cell-sport">
          <span className="header-label">Sport</span>
          <SortArrow />
        </div>
        <div className="table-cell cell-grade">
          <span className="header-label">Grade</span>
          <SortArrow />
        </div>
        <div className="table-cell cell-gender">
          <span className="header-label">Gender</span>
          <SortArrow />
        </div>
        <div className="table-cell cell-roster align-right">
          <span className="header-label">Roster</span>
          <SortArrow />
        </div>
      </div>

      {/* Data Rows */}
      {teams.map((team) => (
        <div key={team.id} className="table-row table-data">
          <div className="table-cell cell-team">
            <TeamAvatar avatar={team.avatar} title={team.title} />
            <span className="team-name">{team.title}</span>
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
          <div className="table-cell cell-roster align-right">
            <RosterBadge count={team.rosterCount} max={team.maxRosterSize} />
          </div>
        </div>
      ))}

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
          border-bottom: 1px solid var(--u-color-base-foreground-subtle, #607081);
        }

        .table-data {
          background: var(--u-color-background-container, #fefefe);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          height: 52px;
          box-sizing: border-box;
        }

        .table-data .cell-team {
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
          transition: text-decoration-color 0.15s ease;
        }

        .table-data:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          cursor: pointer;
        }

        .table-data:hover .cell-team {
          text-decoration-color: var(--u-color-line-subtle, #c4c6c8);
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

        .team-name {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
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
  emptyStateVariant?: EmptyStateVariant;
  emptyStateSeasonName?: string;
  searchQuery?: string;
}

export default function TeamsTable({ 
  teams, 
  emptyStateVariant = 'teams',
  emptyStateSeasonName,
  searchQuery 
}: TeamsTableProps) {
  return (
    <div className="teams-content">
      {teams.length > 0 ? (
        <TableContent teams={teams} />
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
