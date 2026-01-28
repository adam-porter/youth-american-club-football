'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';
import Icon from './Icon';
import { copyTeams, type Season, type TeamWithStats } from '@/lib/actions/teams';
import { useToast } from './Toast';

interface CopyTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamIds: string[];
  sourceSeasonId: string;
  seasons: Season[];
  onSuccess?: (newTeams: TeamWithStats[]) => void;
}

interface CopyOptions {
  name: boolean;
  colors: boolean;
  avatar: boolean;
  sport: boolean;
  gender: boolean;
  grade: boolean;
}

export default function CopyTeamsModal({
  isOpen,
  onClose,
  selectedTeamIds,
  sourceSeasonId,
  seasons,
  onSuccess,
}: CopyTeamsModalProps) {
  const { showToast } = useToast();
  const [targetSeasonId, setTargetSeasonId] = useState('');
  const [copyOptions, setCopyOptions] = useState<CopyOptions>({
    name: true,
    colors: true,
    avatar: true,
    sport: true,
    gender: true,
    grade: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Allow all seasons including the current season
  const availableSeasons = seasons;

  useEffect(() => {
    if (isOpen && sourceSeasonId) {
      setTargetSeasonId(sourceSeasonId);
    }
  }, [isOpen, sourceSeasonId]);

  const handleSubmit = async () => {
    if (!targetSeasonId) {
      setError('Please select a destination season');
      return;
    }

    if (selectedTeamIds.length === 0) {
      setError('No teams selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await copyTeams({
      sourceTeamIds: selectedTeamIds,
      targetSeasonId,
      copyOptions,
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast(`Successfully duplicated ${selectedTeamIds.length} ${selectedTeamIds.length === 1 ? 'team' : 'teams'}`, 'success');
      if (result.teams && onSuccess) {
        onSuccess(result.teams);
      }
      onClose();
    } else {
      setError(result.error || 'Failed to copy teams');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const seasonOptions = availableSeasons.map(s => ({
    value: s.id,
    label: `${s.name} Season`,
  }));

  const handleOptionChange = (key: keyof CopyOptions) => {
    setCopyOptions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  function AttributeCheckbox({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: () => void;
    label: string;
  }) {
    return (
      <label className="attribute-option">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isSubmitting}
          className="attribute-checkbox-input"
        />
        <Icon
          src={checked ? '/icons/checkbox-filled.svg' : '/icons/checkbox-empty.svg'}
          alt={checked ? 'Checked' : 'Unchecked'}
          width={16}
          height={16}
          className="attribute-checkbox-icon"
        />
        <span>{label}</span>
        <style jsx>{`
          .attribute-option {
            display: flex;
            align-items: center;
            gap: var(--u-space-half, 8px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
            cursor: pointer;
          }

          .attribute-checkbox-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
          }

          .attribute-checkbox-icon {
            display: block;
            flex-shrink: 0;
            transition: opacity 0.15s ease;
          }

          .attribute-option:hover .attribute-checkbox-icon {
            opacity: 0.8;
          }

          .attribute-option span {
            line-height: 1.5;
          }
        `}</style>
      </label>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Duplicate Teams">
      <div className="form-content">
        <div className="form-field">
          <label className="form-label">Select Season</label>
          <Select
            options={seasonOptions}
            value={targetSeasonId}
            placeholder="Select season"
            onChange={setTargetSeasonId}
            disabled={isSubmitting}
          />
          <p className="form-helper-text">
            Select the destination season for these teams
          </p>
        </div>

        <div className="form-field">
          <label className="form-label">What attributes do you want to copy about each team?</label>
          <div className="attribute-options">
            <AttributeCheckbox
              checked={copyOptions.name}
              onChange={() => handleOptionChange('name')}
              label="Name"
            />
            <AttributeCheckbox
              checked={copyOptions.colors}
              onChange={() => handleOptionChange('colors')}
              label="Colors"
            />
            <AttributeCheckbox
              checked={copyOptions.avatar}
              onChange={() => handleOptionChange('avatar')}
              label="Avatar"
            />
            <AttributeCheckbox
              checked={copyOptions.sport}
              onChange={() => handleOptionChange('sport')}
              label="Sport"
            />
            <AttributeCheckbox
              checked={copyOptions.gender}
              onChange={() => handleOptionChange('gender')}
              label="Gender"
            />
            <AttributeCheckbox
              checked={copyOptions.grade}
              onChange={() => handleOptionChange('grade')}
              label="Grade"
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <Button
            buttonStyle="standard"
            buttonType="cancel"
            onClick={handleClose}
            isInactive={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            buttonStyle="standard"
            buttonType="primary"
            onClick={handleSubmit}
            isInactive={isSubmitting || !targetSeasonId}
          >
            {isSubmitting ? 'Duplicating...' : `Duplicate ${selectedTeamIds.length} ${selectedTeamIds.length === 1 ? 'Team' : 'Teams'}`}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-quarter, 20px);
        }

        .form-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.5;
          margin: 0;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .form-helper-text {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-micro, 12px);
          font-weight: var(--u-font-weight-default, 400);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
        }

        .attribute-options {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-error {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-alert-foreground, #bb1700);
          margin: 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--u-space-half, 8px);
          padding-top: var(--u-space-half, 8px);
        }
      `}</style>
    </Modal>
  );
}
