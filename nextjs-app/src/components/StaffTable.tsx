'use client';

import type { StaffUser } from '@/lib/actions/teams';
import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';

function StaffAvatar({ avatar, firstName, lastName }: { avatar: string | null; firstName: string; lastName: string }) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  if (avatar) {
    return (
      <div className="staff-avatar">
        <img src={avatar} alt={`${firstName} ${lastName}`} />
        <style jsx>{`
          .staff-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }
          .staff-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="staff-avatar-placeholder">
      {initials}
      <style jsx>{`
        .staff-avatar-placeholder {
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

function RoleBadge({ role, teamRoles }: { role: string; teamRoles: string[] }) {
  const displayRole = role === 'school-administrator' ? 'School Administrator' : 
                      role === 'team-admin' ? 'Team Admin' : 
                      role.charAt(0).toUpperCase() + role.slice(1);
  
  const allRoles = teamRoles.length > 0 
    ? [displayRole, ...teamRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1))].join(', ')
    : displayRole;

  return (
    <span className="role-badge">
      {allRoles}
      <style jsx>{`
        .role-badge {
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

function TableContent({ staff, currentUserId }: { staff: StaffUser[]; currentUserId?: string | null }) {
  return (
    <div className="staff-table">
      {/* Header Row */}
      <div className="table-row table-header">
        <div className="table-cell cell-name">
          <span className="header-label">Name</span>
        </div>
        <div className="table-cell cell-email">
          <span className="header-label">Email</span>
        </div>
        <div className="table-cell cell-role">
          <span className="header-label">Role</span>
        </div>
      </div>

      {/* Data Rows */}
      {staff.map((user) => {
        const isCurrentUser = currentUserId && user.id === currentUserId;
        return (
          <div key={user.id} className="table-row table-data">
            <div className="table-cell cell-name">
              <StaffAvatar avatar={user.avatar} firstName={user.firstName} lastName={user.lastName} />
              <span className="staff-name">
                {user.firstName} {user.lastName}
                {isCurrentUser && <span className="self-label"> (Self)</span>}
              </span>
            </div>
          <div className="table-cell cell-email">
            {user.email}
          </div>
          <div className="table-cell cell-role">
            <RoleBadge role={user.role} teamRoles={user.teamRoles} />
          </div>
        </div>
        );
      })}

      <style jsx>{`
        .staff-table {
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

        .cell-name {
          flex: 1;
          min-width: 200px;
        }

        .cell-email {
          flex: 1;
          min-width: 250px;
        }

        .cell-role {
          width: 200px;
          flex-shrink: 0;
        }

        .staff-name {
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
          transition: text-decoration-color 0.15s ease;
        }

        .table-data:hover .staff-name {
          text-decoration-color: var(--u-color-line-subtle, #c4c6c8);
        }

        .self-label {
          font-weight: var(--u-font-weight-normal, 400);
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .header-label {
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

interface StaffTableProps {
  staff: StaffUser[];
  emptyStateVariant?: EmptyStateVariant;
  searchQuery?: string;
  currentUserId?: string | null;
}

export default function StaffTable({ 
  staff, 
  emptyStateVariant = 'teams-staff',
  searchQuery,
  currentUserId
}: StaffTableProps) {
  return (
    <div className="staff-content">
      {staff.length > 0 ? (
        <TableContent staff={staff} currentUserId={currentUserId} />
      ) : (
        <EmptyState 
          variant={emptyStateVariant} 
          searchQuery={searchQuery}
        />
      )}

      <style jsx>{`
        .staff-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }
      `}</style>
    </div>
  );
}
