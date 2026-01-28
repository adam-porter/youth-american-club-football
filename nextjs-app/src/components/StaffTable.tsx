'use client';

import { useState } from 'react';
import type { StaffUser } from '@/lib/actions/teams';
import EmptyState from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';
import Checkbox from './Checkbox';

function StaffAvatar({ avatar, firstName, lastName }: { avatar: string | null; firstName: string; lastName: string }) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className={`staff-avatar ${avatar ? 'staff-avatar--has-image' : ''}`}>
      <div className="staff-avatar-inner">
        {avatar ? (
          <img src={avatar} alt={`${firstName} ${lastName}`} className="staff-avatar-img" />
        ) : (
          <span className="staff-avatar-initials">{initials}</span>
        )}
      </div>
      <style jsx>{`
        .staff-avatar {
          width: 32px;
          height: 32px;
          padding: 2px;
          flex-shrink: 0;
        }
        .staff-avatar-inner {
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
        .staff-avatar--has-image .staff-avatar-inner {
          background: var(--u-color-background-container, #fefefe);
        }
        .staff-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .staff-avatar-initials {
          font-family: var(--u-font-body);
          font-size: 11px;
          font-weight: var(--u-font-weight-bold, 700);
          color: white;
          text-transform: uppercase;
          letter-spacing: -0.3px;
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

function TableContent({ 
  staff, 
  currentUserId,
  selectedIds,
  onSelectionChange,
  lastClickedIndex,
  onLastClickedIndexChange
}: { 
  staff: StaffUser[]; 
  currentUserId?: string | null;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  lastClickedIndex: number | null;
  onLastClickedIndexChange: (index: number | null) => void;
}) {
  const allSelected = staff.length > 0 && staff.every(u => selectedIds.includes(u.id));
  const someSelected = staff.some(u => selectedIds.includes(u.id));

  const handleSelect = (userId: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const rangeIds = staff.slice(start, end + 1).map(u => u.id);
      const isDeselecting = selectedIds.includes(userId);
      if (isDeselecting) {
        onSelectionChange(selectedIds.filter(id => !rangeIds.includes(id)));
      } else {
        onSelectionChange(Array.from(new Set([...selectedIds, ...rangeIds])));
      }
    } else {
      onSelectionChange(
        selectedIds.includes(userId)
          ? selectedIds.filter(id => id !== userId)
          : [...selectedIds, userId]
      );
    }
    onLastClickedIndexChange(index);
  };

  return (
    <div className="staff-table">
      {/* Header Row */}
      <div className="table-row table-header">
        <div className="table-cell cell-checkbox">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => {
              if (allSelected) {
                onSelectionChange([]);
              } else {
                onSelectionChange(staff.map(u => u.id));
              }
            }}
          />
        </div>
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
      {staff.map((user, index) => {
        const isCurrentUser = currentUserId && user.id === currentUserId;
        const isSelected = selectedIds.includes(user.id);
        return (
          <div 
            key={user.id} 
            className={`table-row table-data ${isSelected ? 'table-data--selected' : ''}`}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('.cell-checkbox')) return;
              handleSelect(user.id, index, e.shiftKey);
            }}
          >
            <div className="table-cell cell-checkbox">
              <Checkbox
                checked={isSelected}
                onChange={(checked, shiftKey) => handleSelect(user.id, index, shiftKey || false)}
              />
            </div>
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

        .cell-checkbox {
          flex-shrink: 0;
          justify-content: center;
          padding-left: 16px;
          padding-right: 2px;
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  return (
    <div className="staff-content">
      {staff.length > 0 ? (
        <TableContent 
          staff={staff} 
          currentUserId={currentUserId}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          lastClickedIndex={lastClickedIndex}
          onLastClickedIndexChange={setLastClickedIndex}
        />
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
