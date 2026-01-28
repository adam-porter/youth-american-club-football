'use client';

import Button from './Button';

interface ActionBarProps {
  selectedCount: number;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
  onClearSelection: () => void;
  deleteDisabled?: boolean;
}

function DuplicateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6667 6H8.66667C7.93029 6 7.33333 6.59695 7.33333 7.33333V13.3333C7.33333 14.0697 7.93029 14.6667 8.66667 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6H11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6667 6V4.66667C10.6667 3.93029 10.0697 3.33333 9.33333 3.33333H4.66667C3.93029 3.33333 3.33333 3.93029 3.33333 4.66667V9.33333C3.33333 10.0697 3.93029 10.6667 4.66667 10.6667H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 4V2.66667C6 2.29848 6.29848 2 6.66667 2H9.33333C9.70152 2 10 2.29848 10 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.6667 4V13.3333C12.6667 14.0697 12.0697 14.6667 11.3333 14.6667H4.66667C3.93029 14.6667 3.33333 14.0697 3.33333 13.3333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66667 7.33333V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33333 7.33333V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ActionBar({ selectedCount, onDuplicate, onDelete, onClose, onClearSelection, deleteDisabled = false }: ActionBarProps) {
  return (
    <div className="action-bar">
      <div className="action-bar-left">
        <span className="action-bar-count">
          {selectedCount} {selectedCount === 1 ? 'team' : 'teams'} selected
        </span>
        <Button
          buttonStyle="standard"
          buttonType="primary"
          size="medium"
          onClick={onClearSelection}
          className="action-bar-button"
        >
          Clear Selection
        </Button>
      </div>
      <div className="action-bar-right">
        <Button
          buttonStyle="standard"
          buttonType="primary"
          size="medium"
          iconAlignment="left"
          onClick={onDuplicate}
          className="action-bar-button"
        >
          <span className="action-bar-button-content">
            <DuplicateIcon />
            <span>Duplicate</span>
          </span>
        </Button>
        <Button
          buttonStyle="standard"
          buttonType="primary"
          size="medium"
          iconAlignment="left"
          onClick={onDelete}
          className={`action-bar-button${deleteDisabled ? ' action-bar-button--disabled' : ''}`}
          disabled={deleteDisabled}
        >
          <span className="action-bar-button-content">
            <DeleteIcon />
            <span>Delete</span>
          </span>
        </Button>
        <Button
          buttonStyle="standard"
          buttonType="primary"
          size="medium"
          iconAlignment="icon only"
          onClick={onClose}
          aria-label="Close"
          className="action-bar-button action-bar-close"
        >
          <CloseIcon />
        </Button>
      </div>

      <style jsx>{`
        .action-bar {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0273e3;
          padding: var(--u-space-quarter, 4px) var(--u-space-quarter, 4px) var(--u-space-quarter, 4px) var(--u-space-one, 16px);
          border-radius: var(--u-border-radius-medium, 4px);
          width: 100%;
          box-sizing: border-box;
        }

        .action-bar-left {
          display: flex;
          align-items: center;
          gap: var(--u-space-one, 16px);
        }

        .action-bar-count {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          font-weight: var(--u-font-weight-default, 400);
          color: #fefefe;
        }

        .action-bar-right {
          display: flex;
          align-items: center;
          gap: var(--u-space-eighth, 2px);
        }

        .action-bar-button-content {
          display: flex !important;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .action-bar-button svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .action-bar-close .action-bar-button-content {
          display: none;
        }

        .action-bar-button--disabled {
          opacity: 0.2 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
        }

        :global(.action-bar-button--disabled) {
          opacity: 0.2 !important;
        }

        :global(.action-bar-button--disabled *) {
          opacity: 1 !important;
        }

        :global(.action-bar-button--disabled button) {
          opacity: 0.2 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
