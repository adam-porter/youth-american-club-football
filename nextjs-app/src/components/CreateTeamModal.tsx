'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';
import { createTeam, type Season } from '@/lib/actions/teams';
import { useToast } from './Toast';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasons: Season[];
  initialSeasonId: string;
}

export default function CreateTeamModal({ isOpen, onClose, seasons, initialSeasonId }: CreateTeamModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [seasonId, setSeasonId] = useState(initialSeasonId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update seasonId when initialSeasonId changes (e.g., when modal opens)
  React.useEffect(() => {
    setSeasonId(initialSeasonId);
  }, [initialSeasonId]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please enter a team name');
      return;
    }

    if (!seasonId) {
      setError('Please select a season');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createTeam({ title: title.trim(), seasonId });

    setIsSubmitting(false);

    if (result.success) {
      showToast(`Successfully created team "${result.team?.title || title.trim()}"`, 'success');
      setTitle('');
      onClose();
    } else {
      setError(result.error || 'Failed to create team');
    }
  };

  const handleClose = () => {
    setTitle('');
    setError(null);
    onClose();
  };

  const seasonOptions = seasons.map(s => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Team">
      <div className="form-content">
        <div className="form-field">
          <label className="form-label">Season</label>
          <Select
            options={seasonOptions}
            value={seasonId}
            placeholder="Select season"
            onChange={setSeasonId}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="team-title" className="form-label">
            Team Name
          </label>
          <input
            id="team-title"
            type="text"
            className={`form-input ${error ? 'form-input--error' : ''}`}
            placeholder="e.g., Varsity Football"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
        </div>

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
            isInactive={isSubmitting}
          >
            Save
          </Button>
        </div>
      </div>

      <style jsx>{`
        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one-and-half, 24px);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-half, 8px);
        }

        .form-label {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .form-input {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground-contrast, #071c31);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          box-shadow: 0 0 0 3px rgba(2, 115, 227, 0.15);
        }

        .form-input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .form-input--error {
          border-color: var(--u-color-alert-foreground, #bb1700);
        }

        .form-input--error:focus {
          border-color: var(--u-color-alert-foreground, #bb1700);
          box-shadow: 0 0 0 3px rgba(187, 23, 0, 0.15);
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
