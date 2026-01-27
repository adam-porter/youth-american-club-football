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
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }

        .confirm-dialog {
          background: #2a2a2a;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
        }

        .confirm-dialog-message {
          color: #ffffff;
          font-family: var(--u-font-body);
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        .confirm-dialog-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .confirm-dialog-cancel {
          background: transparent;
          border: none;
          color: #888888;
          font-family: var(--u-font-body);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          padding: 12px 16px;
          transition: color 0.15s ease;
        }

        .confirm-dialog-cancel:hover:not(:disabled) {
          color: #ffffff;
        }

        .confirm-dialog-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-dialog-confirm {
          background: #e53935;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-family: var(--u-font-body);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 12px 32px;
          transition: background 0.15s ease;
        }

        .confirm-dialog-confirm:hover:not(:disabled) {
          background: #c62828;
        }

        .confirm-dialog-confirm:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
