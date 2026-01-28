'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { differenceInYears, subYears, format } from 'date-fns';
import type { TeamWithStats, Season } from '@/lib/actions/teams';
import { updateTeam, createTeam, type UpdateTeamInput } from '@/lib/actions/teams';
import Button from './Button';
import Select from './Select';
import { useToast } from './Toast';

interface ManageTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamWithStats[];
  seasons: Season[];
  initialSeasonId: string;
}

// Convert age to approximate birthdate (for display)
function ageToBirthdate(age: number | null): string {
  if (age === null) return '';
  const birthdate = subYears(new Date(), age);
  return format(birthdate, 'MMM dd, yyyy');
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

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface EditableTextCellProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

function EditableTextCell({ value, onSave, placeholder, className }: EditableTextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(editValue);
      setIsEditing(false);
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
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell ${className || ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-input ${error ? 'editable-input--error' : ''}`}
          disabled={isSaving}
        />
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={`editable-cell editable-cell--readonly ${className || ''}`}
      onClick={() => setIsEditing(true)}
    >
      {value || <span className="placeholder-text">{placeholder || '—'}</span>}
    </div>
  );
}

interface EditableSelectCellProps {
  value: string;
  options: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
  className?: string;
}

function EditableSelectCell({ value, options, onSave, className }: EditableSelectCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleChange = async (newValue: string) => {
    if (newValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(newValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setEditValue(value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell ${className || ''}`}>
        <Select
          value={editValue}
          options={options}
          onChange={handleChange}
          disabled={isSaving}
        />
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div
      className={`editable-cell editable-cell--readonly ${className || ''}`}
      onClick={() => setIsEditing(true)}
    >
      {selectedOption?.label || value || '—'}
    </div>
  );
}

interface EditableNumberCellProps {
  value: number | null;
  onSave: (value: number | null) => Promise<void>;
  placeholder?: string;
  className?: string;
}

function EditableNumberCell({ value, onSave, placeholder, className }: EditableNumberCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value?.toString() || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    const numValue = editValue === '' ? null : parseInt(editValue, 10);
    if (numValue === value || (numValue === null && value === null)) {
      setIsEditing(false);
      return;
    }

    if (editValue !== '' && isNaN(numValue!)) {
      setError('Please enter a valid number');
      setEditValue(value?.toString() || '');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(numValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setEditValue(value?.toString() || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setEditValue(value?.toString() || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell ${className || ''}`}>
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-input ${error ? 'editable-input--error' : ''}`}
          placeholder={placeholder}
          disabled={isSaving}
        />
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={`editable-cell editable-cell--readonly ${className || ''}`}
      onClick={() => setIsEditing(true)}
    >
      {value !== null ? value : <span className="placeholder-text">{placeholder || '—'}</span>}
    </div>
  );
}

interface EditableDateCellProps {
  age: number | null;
  onSave: (age: number | null) => Promise<void>;
  placeholder?: string;
  className?: string;
}

function EditableDateCell({ age, onSave, placeholder, className }: EditableDateCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(() => {
    if (age === null) return '';
    const birthdate = subYears(new Date(), age);
    return format(birthdate, 'yyyy-MM-dd');
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (age === null) {
      setEditValue('');
    } else {
      const birthdate = subYears(new Date(), age);
      setEditValue(format(birthdate, 'yyyy-MM-dd'));
    }
  }, [age]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = async () => {
    const newAge = birthdateToAge(editValue);
    if (newAge === age || (newAge === null && age === null)) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(newAge);
      setIsEditing(false);
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
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell ${className || ''}`}>
        <input
          ref={inputRef}
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-input ${error ? 'editable-input--error' : ''}`}
          disabled={isSaving}
        />
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  const displayValue = age !== null ? ageToBirthdate(age) : '';
  return (
    <div
      className={`editable-cell editable-cell--readonly ${className || ''}`}
      onClick={() => setIsEditing(true)}
    >
      {displayValue || <span className="placeholder-text">{placeholder || '—'}</span>}
    </div>
  );
}

interface EditableColorCellProps {
  value: string | null;
  onSave: (value: string | null) => Promise<void>;
  className?: string;
}

function EditableColorCell({ value, onSave, className }: EditableColorCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '#D9D9D9');
  const [hexValue, setHexValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hexInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value || '#D9D9D9');
    setHexValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && hexInputRef.current) {
      hexInputRef.current.focus();
      hexInputRef.current.select();
    }
  }, [isEditing]);

  const handleColorChange = async (newColor: string) => {
    setEditValue(newColor);
    setHexValue(newColor.toUpperCase());
    const finalValue = newColor || null;
    
    if (finalValue === value || (finalValue === null && value === null)) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(finalValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setEditValue(value || '#D9D9D9');
      setHexValue(value || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHexBlur = async () => {
    if (!/^#[0-9A-F]{6}$/i.test(hexValue)) {
      setError('Invalid hex color');
      setHexValue(value || '');
      setEditValue(value || '#D9D9D9');
      setIsEditing(false);
      return;
    }
    await handleColorChange(hexValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.currentTarget as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setEditValue(value || '#D9D9D9');
      setHexValue(value || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell editable-color-cell ${className || ''}`}>
        <div className="color-picker-wrapper">
          <input
            type="color"
            value={editValue}
            onChange={(e) => handleColorChange(e.target.value)}
            className="color-picker"
          />
          <input
            ref={hexInputRef}
            type="text"
            value={hexValue}
            onChange={(e) => setHexValue(e.target.value.toUpperCase())}
            onBlur={handleHexBlur}
            onKeyDown={handleKeyDown}
            className="color-hex-input"
            placeholder="#000000"
            maxLength={7}
          />
        </div>
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={`editable-cell editable-cell--readonly editable-color-cell ${className || ''}`}
      onClick={() => setIsEditing(true)}
    >
      <div className="color-swatch" style={{ backgroundColor: value || '#D9D9D9' }} />
      <span className="color-hex">{value || '#D9D9D9'}</span>
    </div>
  );
}

export default function ManageTeamsModal({
  isOpen,
  onClose,
  teams,
  seasons,
  initialSeasonId,
}: ManageTeamsModalProps) {
  const { showToast } = useToast();
  const [selectedSeasonId, setSelectedSeasonId] = useState(initialSeasonId);
  const [searchQuery, setSearchQuery] = useState('');
  const [localTeams, setLocalTeams] = useState<TeamWithStats[]>(teams);
  const [isCreating, setIsCreating] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Update local teams when prop changes
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
    } else {
      throw new Error(result.error || 'Failed to update team');
    }
  }, []);

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
          grades: null,
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
    { value: 'Cheer', label: 'Cheer' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Soccer', label: 'Soccer' },
  ];

  const genderOptions = [
    { value: 'Male', label: 'Boys' },
    { value: 'Female', label: 'Girls' },
    { value: 'Coed', label: 'Co-ed' },
  ];

  const seasonOptions = seasons.map(s => ({
    value: s.id,
    label: `${s.name} Season`,
  }));

  if (!isOpen) return null;

  return (
    <div className="manage-teams-modal-overlay">
      <div className="manage-teams-modal-content">
        {/* Header */}
        <div className="manage-teams-header">
          <button className="back-button" onClick={onClose} aria-label="Back">
            <BackIcon />
          </button>
          <h2 className="manage-teams-title">Manage Teams</h2>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            onClick={onClose}
          >
            Done
          </Button>
        </div>

        {/* Controls */}
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
              buttonType="primary"
              onClick={handleAddTeam}
              isInactive={isCreating}
            >
              + Add Team
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="manage-teams-table-wrapper">
          {filteredTeams.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">
                {searchQuery.trim() 
                  ? 'No teams found matching your search.'
                  : selectedSeasonId
                  ? 'No teams in this season. Click "+ Add Team" to create one.'
                  : 'Select a season to view teams.'}
              </p>
            </div>
          ) : (
            <table className="manage-teams-table">
              <thead>
                <tr>
                  <th className="cell-checkbox"></th>
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
                {filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td className="cell-checkbox">
                      <input type="checkbox" />
                    </td>
                    <td className="cell-avatar">
                      <div className="team-avatar-placeholder">
                        {team.sport === 'Cheer' ? '📣' : '🏈'}
                      </div>
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
                      <EditableNumberCell
                        value={team.grades ? parseInt(team.grades.split(',')[0], 10) : null}
                        onSave={(value) => handleUpdateTeam(team.id, { grades: value !== null ? value.toString() : null })}
                        placeholder="Grade"
                      />
                    </td>
                    <td className="cell-birthdate">
                      <EditableDateCell
                        age={team.ageMin}
                        onSave={(age) => handleUpdateTeam(team.id, { ageMin: age })}
                        placeholder="Birthdate from"
                      />
                    </td>
                    <td className="cell-birthdate">
                      <EditableDateCell
                        age={team.ageMax}
                        onSave={(age) => handleUpdateTeam(team.id, { ageMax: age })}
                        placeholder="Birthdate to"
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        <style jsx>{`
          .manage-teams-modal-overlay {
            position: fixed;
            inset: 0;
            background: var(--u-color-background-canvas, #eff0f0);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .manage-teams-modal-content {
            background: var(--u-color-background-container, #fefefe);
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .manage-teams-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
            border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          }

          .back-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            border-radius: var(--u-border-radius-medium, 4px);
            cursor: pointer;
            color: var(--u-color-base-foreground, #36485c);
            transition: background 0.15s ease;
          }

          .back-button:hover {
            background: var(--u-color-background-subtle, #f5f6f7);
          }

          .manage-teams-title {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-300, 18px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground-contrast, #071c31);
            margin: 0;
          }

          .manage-teams-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
            border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
            gap: var(--u-space-one, 16px);
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
            min-width: 200px;
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .search-input svg {
            flex-shrink: 0;
          }

          .search-input input {
            border: none;
            outline: none;
            background: transparent;
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
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
          }

          .empty-state {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--u-space-four, 64px) var(--u-space-one, 16px);
            min-height: 200px;
          }

          .empty-state-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground-subtle, #607081);
            text-align: center;
            margin: 0;
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
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            text-align: left;
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground-contrast, #071c31);
            border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
            white-space: nowrap;
          }

          .manage-teams-table td {
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
          }

          .manage-teams-table tbody tr:hover {
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
            min-width: 180px;
          }

          .team-avatar-placeholder {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--u-color-background-subtle, #f5f6f7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .editable-cell {
            position: relative;
            min-height: 24px;
          }

          .editable-cell--readonly {
            cursor: pointer;
            padding: 4px 8px;
            border-radius: var(--u-border-radius-medium, 4px);
            transition: background 0.15s ease;
          }

          .editable-cell--readonly:hover {
            background: var(--u-color-background-subtle, #f5f6f7);
          }

          .editable-cell--readonly:focus-within {
            outline: 2px solid var(--u-color-emphasis-background-contrast, #0273e3);
            outline-offset: 2px;
          }

          .editable-input {
            width: 100%;
            padding: 4px 8px;
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-medium, 4px);
            background: var(--u-color-background-container, #fefefe);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            outline: none;
          }

          .editable-input:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
            box-shadow: 0 0 0 3px rgba(2, 115, 227, 0.15);
          }

          .editable-input--error {
            border-color: var(--u-color-alert-foreground, #bb1700);
          }

          .placeholder-text {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .saving-indicator {
            position: absolute;
            top: 100%;
            left: 0;
            font-size: 11px;
            color: var(--u-color-base-foreground-subtle, #607081);
            margin-top: 2px;
          }

          .error-message {
            position: absolute;
            top: 100%;
            left: 0;
            font-size: 11px;
            color: var(--u-color-alert-foreground, #bb1700);
            margin-top: 2px;
          }

          .editable-color-cell {
            display: flex;
            align-items: center;
            gap: var(--u-space-half, 8px);
          }

          .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: var(--u-space-half, 8px);
          }

          .color-picker {
            width: 32px;
            height: 32px;
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-medium, 4px);
            cursor: pointer;
          }

          .color-hex-input {
            width: 80px;
            padding: 4px 8px;
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-medium, 4px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            text-transform: uppercase;
          }

          .color-swatch {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            flex-shrink: 0;
          }

          .color-hex {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
          }
        `}</style>
      </div>
    </div>
  );
}
