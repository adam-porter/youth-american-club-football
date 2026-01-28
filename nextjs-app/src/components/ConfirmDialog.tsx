'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={() => !isLoading && onCancel()}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className="confirm-dialog-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirm-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }

        .confirm-dialog {
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-large, 8px);
          padding: var(--u-space-one-and-half, 24px);
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        }

        .confirm-dialog-message {
          color: var(--u-color-base-foreground-contrast, #071c31);
          font-family: var(--u-font-body);
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        .confirm-dialog-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .confirm-dialog-cancel {
          background: transparent;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          color: var(--u-color-base-foreground, #36485c);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          cursor: pointer;
          height: 40px;
          padding: 0 var(--u-space-one, 16px);
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .confirm-dialog-cancel:hover:not(:disabled) {
          background: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }

        .confirm-dialog-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-dialog-confirm {
          background: var(--u-color-alert-foreground, #bb1700);
          border: none;
          border-radius: var(--u-border-radius-medium, 4px);
          color: #ffffff;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          cursor: pointer;
          height: 40px;
          padding: 0 var(--u-space-one, 16px);
          transition: background 0.15s ease;
        }

        .confirm-dialog-confirm:hover:not(:disabled) {
          background: #a01400;
        }

        .confirm-dialog-confirm:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
