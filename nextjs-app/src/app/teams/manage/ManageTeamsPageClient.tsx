'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { differenceInYears, subYears, format } from 'date-fns';
import type { TeamWithStats, Season, UpdateTeamInput } from '@/lib/actions/teams';
import { updateTeam, createTeam, deleteTeams } from '@/lib/actions/teams';
import Button from '@/components/Button';
import Select from '@/components/Select';
import { useToast } from '@/components/Toast';
import ViewHeader from '@/components/ViewHeader';
import ActionBar from '@/components/ActionBar';
import CopyTeamsModal from '@/components/CopyTeamsModal';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import Checkbox from '@/components/Checkbox';

interface ManageTeamsPageClientProps {
  teams: TeamWithStats[];
  seasons: Season[];
  initialSeasonId: string;
}

// Convert birthdate to age
function birthdateToAge(birthdate: string | null): number | null {
  if (!birthdate) return null;
  try {
    const date = new Date(birthdate);
    if (isNaN(date.getTime())) return null;
    return differenceInYears(new Date(), date);
  } catch {
    return null;
  }
}


interface EditableTextCellProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  placeholder?: string;
  className?: string;
}

function EditableTextCell({ value, onSave, onSaveSuccess, placeholder, className }: EditableTextCellProps) {
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleBlur = async () => {
    if (editValue === value) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(editValue);
      onSaveSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setEditValue(value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <div className={`inline-cell ${className || ''}`}>
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`inline-input ${error ? 'inline-input--error' : ''} ${isSaving ? 'inline-input--saving' : ''}`}
        disabled={isSaving}
      />
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

interface EditableSelectCellProps {
  value: string;
  options: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  className?: string;
}

function EditableSelectCell({ value, options, onSave, onSaveSuccess, className }: EditableSelectCellProps) {
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleChange = async (newValue: string) => {
    if (newValue === value) {
      return;
    }

    setEditValue(newValue);
    setIsSaving(true);
    setError(null);
    try {
      await onSave(newValue);
      onSaveSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setEditValue(value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`inline-cell inline-select-cell ${className || ''}`}>
      <Select
        options={options}
        value={editValue}
        onChange={handleChange}
        disabled={isSaving}
        fullWidth
      />
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

interface EditableDateCellProps {
  age: number | null;
  onSave: (age: number | null) => Promise<void>;
  onSaveSuccess?: () => void;
  className?: string;
}

function EditableDateCell({ age, onSave, onSaveSuccess, className }: EditableDateCellProps) {
  const [editValue, setEditValue] = useState(() => {
    if (age === null) return '';
    const birthdate = subYears(new Date(), age);
    return format(birthdate, 'yyyy-MM-dd');
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (age === null) {
      setEditValue('');
    } else {
      const birthdate = subYears(new Date(), age);
      setEditValue(format(birthdate, 'yyyy-MM-dd'));
    }
  }, [age]);

  const handleBlur = async () => {
    const newAge = birthdateToAge(editValue);
    if (newAge === age || (newAge === null && age === null)) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(newAge);
      onSaveSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      if (age !== null) {
        const birthdate = subYears(new Date(), age);
        setEditValue(format(birthdate, 'yyyy-MM-dd'));
      } else {
        setEditValue('');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      if (age !== null) {
        const birthdate = subYears(new Date(), age);
        setEditValue(format(birthdate, 'yyyy-MM-dd'));
      } else {
        setEditValue('');
      }
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return (
    <div className={`inline-cell inline-date-cell ${className || ''}`}>
      <input
        type="date"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`inline-input inline-date-input ${error ? 'inline-input--error' : ''} ${isSaving ? 'inline-input--saving' : ''}`}
        disabled={isSaving}
      />
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

interface EditableColorCellProps {
  value: string | null;
  onSave: (value: string | null) => Promise<void>;
  onSaveSuccess?: () => void;
  className?: string;
}

function EditableColorCell({ value, onSave, onSaveSuccess, className }: EditableColorCellProps) {
  const [hexValue, setHexValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexValue(value || '');
  }, [value]);

  const handleColorChange = async (newColor: string) => {
    const upperColor = newColor.toUpperCase();
    setHexValue(upperColor);

    if (upperColor === value) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(upperColor);
      onSaveSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setHexValue(value || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHexBlur = async () => {
    // If empty, save as null
    if (!hexValue.trim()) {
      if (value !== null) {
        setIsSaving(true);
        setError(null);
        try {
          await onSave(null);
          onSaveSuccess?.();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save');
          setHexValue(value || '');
        } finally {
          setIsSaving(false);
        }
      }
      return;
    }

    const normalizedHex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;

    if (!/^#[0-9A-F]{6}$/i.test(normalizedHex)) {
      setError('Invalid hex color');
      setHexValue(value || '');
      return;
    }

    if (normalizedHex.toUpperCase() !== value) {
      await handleColorChange(normalizedHex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setHexValue(value || '');
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const displayColor = hexValue || '#D9D9D9';
  const hasColor = !!value;

  return (
    <div className={`inline-cell inline-color-cell ${className || ''}`}>
      <div
        onClick={() => colorInputRef.current?.click()}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: displayColor,
          border: hasColor ? '1px solid var(--u-color-line-subtle, #c4c6c8)' : '2px dashed var(--u-color-line-subtle, #c4c6c8)',
          flexShrink: 0,
          cursor: 'pointer',
          opacity: hasColor ? 1 : 0.5,
        }}
      />
      <input
        ref={colorInputRef}
        type="color"
        value={displayColor}
        onChange={(e) => handleColorChange(e.target.value)}
        disabled={isSaving}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={hexValue}
        onChange={(e) => setHexValue(e.target.value.toUpperCase())}
        onBlur={handleHexBlur}
        onKeyDown={handleKeyDown}
        className={`inline-input inline-color-input ${error ? 'inline-input--error' : ''} ${isSaving ? 'inline-input--saving' : ''}`}
        placeholder="Select color..."
        maxLength={7}
        disabled={isSaving}
      />
      {error && <span className="inline-error">{error}</span>}
    </div>
  );
}

interface EditableAvatarCellProps {
  avatar: string | null;
  title: string;
  teamId: string;
  onUpload: (teamId: string, file: File) => Promise<void>;
}

function EditableAvatarCell({ avatar, title, teamId, onUpload }: EditableAvatarCellProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(teamId, file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const initials = title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isUploading}
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: '50%',
          overflow: 'hidden',
          border: 'none',
          padding: 0,
          cursor: isUploading ? 'wait' : 'pointer',
          background: avatar ? 'transparent' : 'var(--u-color-background-subtle, #f5f6f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isUploading ? 0.6 : 1,
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <span
            style={{
              color: 'var(--u-color-base-foreground-subtle, #607081)',
              fontSize: 12,
              fontFamily: 'var(--u-font-body)',
              fontWeight: 500,
            }}
          >
            {initials}
          </span>
        )}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: 'white',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}

export default function ManageTeamsPageClient({
  teams,
  seasons,
  initialSeasonId,
}: ManageTeamsPageClientProps) {
  const { showToast } = useToast();
  const [selectedSeasonId, setSelectedSeasonId] = useState(initialSeasonId);
  const [searchQuery, setSearchQuery] = useState('');
  const [localTeams, setLocalTeams] = useState<TeamWithStats[]>(teams);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update local teams when prop changes
  // Note: This only happens on page navigation, not during edits
  // (because we removed revalidatePath from updateTeam)
  useEffect(() => {
    setLocalTeams(teams);
  }, [teams]);

  // Filter teams by season and search
  const filteredTeams = localTeams.filter(team => {
    const matchesSeason = team.seasonId === selectedSeasonId;
    const matchesSearch = !searchQuery.trim() || 
      team.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.sport.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeason && matchesSearch;
  });

  const handleUpdateTeam = useCallback(async (teamId: string, updates: Partial<UpdateTeamInput>) => {
    // Client-side validation
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('Team title is required');
    }
    if (updates.sport !== undefined && !updates.sport.trim()) {
      throw new Error('Sport is required');
    }
    if (updates.gender !== undefined && !updates.gender.trim()) {
      throw new Error('Gender is required');
    }
    if (updates.ageMin !== undefined && updates.ageMax !== undefined && 
        updates.ageMin !== null && updates.ageMax !== null && 
        updates.ageMin > updates.ageMax) {
      throw new Error('Minimum age cannot be greater than maximum age');
    }
    if (updates.primaryColor !== undefined && updates.primaryColor !== null && 
        !/^#[0-9A-F]{6}$/i.test(updates.primaryColor)) {
      throw new Error('Primary color must be a valid hex color');
    }
    if (updates.secondaryColor !== undefined && updates.secondaryColor !== null && 
        !/^#[0-9A-F]{6}$/i.test(updates.secondaryColor)) {
      throw new Error('Secondary color must be a valid hex color');
    }

    const result = await updateTeam({ id: teamId, ...updates });
    if (result.success) {
      // Optimistically update local state
      setLocalTeams(prev => prev.map(team => 
        team.id === teamId ? { ...team, ...updates } : team
      ));
      showToast('Changes saved', 'success');
    } else {
      throw new Error(result.error || 'Failed to update team');
    }
  }, [showToast]);

  const handleAvatarUpload = useCallback(async (teamId: string, file: File) => {
    // For now, create a local URL preview and show a toast
    // In production, this would upload to a storage service
    const localUrl = URL.createObjectURL(file);
    
    // Update local state optimistically
    setLocalTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, avatar: localUrl } : team
    ));
    
    showToast('Avatar updated (preview only - upload not implemented)', 'success');
  }, [showToast]);

  const handleAddTeam = async () => {
    setIsCreating(true);
    try {
      const result = await createTeam({
        title: 'New Team',
        seasonId: selectedSeasonId,
      });
      
      if (result.success && result.team) {
        // Fetch the new team with all fields
        const newTeam: TeamWithStats = {
          id: result.team.id,
          title: result.team.title,
          sport: 'Football',
          gender: 'Male',
          grade: null,
          avatar: null,
          primaryColor: null,
          secondaryColor: null,
          status: 'draft',
          seasonId: selectedSeasonId,
          rosterCount: 0,
          maxRosterSize: null,
          ageMin: null,
          ageMax: null,
        };
        setLocalTeams(prev => [...prev, newTeam]);
        showToast(`Successfully created team "${result.team.title}"`, 'success');
      }
    } catch {
      showToast('Failed to create team', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const sportOptions = [
    { value: 'Football', label: 'Football' },
    { value: 'Cheerleading', label: 'Cheerleading' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Soccer', label: 'Soccer' },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Boys' },
    { value: 'Female', label: 'Girls' },
    { value: 'Coed', label: 'Coed' },
  ];

  const gradeOptions = [
    { value: '-1', label: 'Pre-K' },
    { value: '0', label: 'K' },
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
    { value: '3', label: '3rd' },
    { value: '4', label: '4th' },
    { value: '5', label: '5th' },
    { value: '6', label: '6th' },
    { value: '7', label: '7th' },
    { value: '8', label: '8th' },
    { value: '9', label: '9th' },
    { value: '10', label: '10th' },
    { value: '11', label: '11th' },
    { value: '12', label: '12th' },
  ];

  const seasonOptions = seasons.map(s => {
    return {
      value: s.id,
      label: `${s.name} Season`,
    };
  });

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

  const allSelected = filteredTeams.length > 0 && filteredTeams.every(team => selectedTeamIds.includes(team.id));
  const someSelected = filteredTeams.length > 0 && selectedTeamIds.length > 0 && !allSelected;

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
        showToast(`Successfully deleted ${result.deletedCount} team${result.deletedCount === 1 ? '' : 's'}`, 'success');
      } else {
        showToast(result.error || 'Failed to delete teams', 'error');
      }
    } catch {
      showToast('Failed to delete teams', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="manage-teams-page-wrapper">
      <ViewHeader
        title="Manage Teams"
        actionLabel="Done"
        actionNavigatesBack
      />

      <CopyTeamsModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        selectedTeamIds={selectedTeamIds}
        sourceSeasonId={selectedSeasonId}
        seasons={seasons}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        message={`If you delete ${selectedTeamIds.length === 1 ? 'this team' : `these ${selectedTeamIds.length} teams`}, ${selectedTeamIds.length === 1 ? "it" : "they"} can't be recovered. Do you want to continue?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteTeams}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <div className="manage-teams-page">
        {/* Controls */}
        <div className="manage-teams-controls-wrapper">
          <div className="manage-teams-controls">
        <Select
          options={seasonOptions}
          value={selectedSeasonId}
          onChange={setSelectedSeasonId}
          placeholder="Select season"
        />
        <div className="controls-right">
          <div className="search-input">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            buttonStyle="standard"
            buttonType="secondary"
            onClick={handleAddTeam}
            isInactive={isCreating}
          >
            + Add Team
          </Button>
        </div>
        </div>
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

      {/* Table */}
      <div className="manage-teams-table-wrapper">
        {filteredTeams.length === 0 ? (
          <EmptyState 
            variant={searchQuery.trim() ? 'search' : 'teams-season'}
            searchQuery={searchQuery}
            seasonName={seasons.find(s => s.id === selectedSeasonId)?.name}
          />
        ) : (
          <table className="manage-teams-table">
            <thead>
              <tr>
                <th className="cell-checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => {
                      // If all are selected, deselect all. Otherwise (none or some selected), select all.
                      if (allSelected) {
                        handleSelectAllChange(false);
                      } else {
                        handleSelectAllChange(true);
                      }
                    }}
                  />
                </th>
                <th className="cell-avatar">Avatar</th>
                <th className="cell-title">Title</th>
                <th className="cell-sport">Sport</th>
                <th className="cell-gender">Gender</th>
                <th className="cell-grade">Grade</th>
                <th className="cell-birthdate">Birthdate From</th>
                <th className="cell-birthdate">Birthdate To</th>
                <th className="cell-color">Primary Color</th>
                <th className="cell-color">Secondary Color</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => {
                const isSelected = selectedTeamIds.includes(team.id);
                return (
                <tr key={team.id} className={isSelected ? 'table-row--selected' : ''}>
                  <td className="cell-checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked, shiftKey) => handleTeamSelectionChange(team.id, checked, index, shiftKey)}
                    />
                  </td>
                  <td className="cell-avatar">
                    <EditableAvatarCell
                      avatar={team.avatar}
                      title={team.title}
                      teamId={team.id}
                      onUpload={handleAvatarUpload}
                    />
                  </td>
                  <td className="cell-title">
                    <EditableTextCell
                      value={team.title}
                      onSave={(value) => handleUpdateTeam(team.id, { title: value })}
                      placeholder="Team name"
                    />
                  </td>
                  <td className="cell-sport">
                    <EditableSelectCell
                      value={team.sport}
                      options={sportOptions}
                      onSave={(value) => handleUpdateTeam(team.id, { sport: value })}
                    />
                  </td>
                  <td className="cell-gender">
                    <EditableSelectCell
                      value={team.gender}
                      options={genderOptions}
                      onSave={(value) => handleUpdateTeam(team.id, { gender: value })}
                    />
                  </td>
                  <td className="cell-grade">
                    <EditableSelectCell
                      value={team.grade?.toString() || ''}
                      options={gradeOptions}
                      onSave={(value) => handleUpdateTeam(team.id, { grade: value ? parseInt(value, 10) : null })}
                    />
                  </td>
                  <td className="cell-birthdate">
                    <EditableDateCell
                      age={team.ageMin}
                      onSave={(age) => handleUpdateTeam(team.id, { ageMin: age })}
                    />
                  </td>
                  <td className="cell-birthdate">
                    <EditableDateCell
                      age={team.ageMax}
                      onSave={(age) => handleUpdateTeam(team.id, { ageMax: age })}
                    />
                  </td>
                  <td className="cell-color">
                    <EditableColorCell
                      value={team.primaryColor}
                      onSave={(value) => handleUpdateTeam(team.id, { primaryColor: value })}
                    />
                  </td>
                  <td className="cell-color">
                    <EditableColorCell
                      value={team.secondaryColor}
                      onSave={(value) => handleUpdateTeam(team.id, { secondaryColor: value })}
                    />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
        </div>
      </div>

      <style jsx>{`
        .manage-teams-page-wrapper {
          position: fixed;
          inset: 0;
          background: var(--u-color-background-canvas, #eff0f0);
          padding: 8px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .manage-teams-page {
          width: 100%;
          height: 100%;
          background: var(--u-color-background-container, #fefefe);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: var(--u-border-radius-large, 8px);
          padding: var(--u-space-one-and-half, 24px);
          gap: var(--u-space-half, 8px);
        }

        .manage-teams-controls-wrapper {
          position: relative;
          width: 100%;
        }

        .manage-teams-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--u-space-one, 16px);
          background: var(--u-color-background-container, #fefefe);
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .search-input {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          height: 40px;
          padding: 0 var(--u-space-three-quarter, 12px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          min-width: 160px;
          color: var(--u-color-base-foreground-subtle, #607081);
          transition: border-color 0.15s ease;
        }

        .search-input:focus-within {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .search-input svg {
          flex-shrink: 0;
        }

        .search-input input {
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground-contrast, #071c31);
          width: 100%;
        }

        .search-input input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .manage-teams-table-wrapper {
          flex: 1;
          overflow: auto;
          min-height: 0;
          background: var(--u-color-background-container, #fefefe);
        }

        .manage-teams-table {
          width: 100%;
          border-collapse: collapse;
        }

        .manage-teams-table thead {
          background: var(--u-color-background-container, #fefefe);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .manage-teams-table th {
          padding: var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
          text-align: left;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          white-space: nowrap;
        }

        .manage-teams-table td {
          padding: 0 var(--u-space-three-quarter, 12px);
          border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
          vertical-align: middle;
          height: 52px;
        }

        .manage-teams-table tbody tr:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .manage-teams-table tbody tr.table-row--selected {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .cell-checkbox {
          width: 40px;
          text-align: center;
        }

        .cell-avatar {
          width: 60px;
        }

        .cell-title {
          min-width: 200px;
        }

        .cell-sport,
        .cell-gender {
          min-width: 120px;
        }

        .cell-grade {
          width: 100px;
        }

        .cell-birthdate {
          min-width: 150px;
        }

        .cell-color {
          min-width: 100px;
        }

      `}</style>

      {/* Global styles for inline editable cells (rendered in child components) */}
      <style jsx global>{`
        /* Inline cell styles - consistent with toolbar inputs */
        .inline-cell {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          gap: 8px;
        }

        .inline-input {
          width: 100%;
          height: 40px;
          padding: var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground, #36485c);
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
          box-sizing: border-box;
        }

        .inline-input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .inline-input:hover:not(:focus) {
          background: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }

        .inline-input:focus {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .inline-input--error {
          border-color: var(--u-color-alert-foreground, #bb1700);
        }

        .inline-input--saving {
          opacity: 0.6;
        }

        .inline-error {
          position: absolute;
          top: 100%;
          left: 0;
          font-size: 11px;
          color: var(--u-color-alert-foreground, #bb1700);
          margin-top: 2px;
          white-space: nowrap;
          z-index: 5;
        }

        /* Select styling */
        .inline-select-cell {
          position: relative;
        }

        .inline-select {
          appearance: none;
          -webkit-appearance: none;
          height: 40px;
          padding: 0 28px 0 var(--u-space-three-quarter, 12px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23607081' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat calc(100% - 10px) center;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease, background-color 0.15s ease;
          box-sizing: border-box;
        }

        .inline-select:hover:not(:focus) {
          background-color: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }

        .inline-select:focus {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .inline-select--error {
          border-color: var(--u-color-alert-foreground, #bb1700);
        }

        .inline-select--saving {
          opacity: 0.6;
        }

        /* Date cell styling */
        .inline-date-cell {
          position: relative;
        }

        .inline-date-input {
          color: var(--u-color-base-foreground, #36485c);
        }

        .inline-date-input::-webkit-calendar-picker-indicator {
          opacity: 0.5;
          cursor: pointer;
          margin-left: 4px;
        }

        .inline-date-input::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        .date-placeholder {
          position: absolute;
          left: var(--u-space-three-quarter, 12px);
          top: 50%;
          transform: translateY(-50%);
          color: var(--u-color-base-foreground-subtle, #607081);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          pointer-events: none;
        }

        /* Color cell styling */
        .inline-color-cell {
          display: flex;
          align-items: center;
        }

        .inline-color-input {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground, #36485c);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
