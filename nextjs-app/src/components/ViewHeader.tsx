'use client';

import { useRouter } from 'next/navigation';

interface ViewHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  /** If true, action button will use router.back() like the back button */
  actionNavigatesBack?: boolean;
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ViewHeader({
  title,
  onBack,
  showBackButton = true,
  actionLabel,
  onAction,
  actionNavigatesBack = false
}: ViewHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionNavigatesBack) {
      router.back();
    }
  };

  return (
    <div className="view-header">
      {showBackButton && (
        <button className="back-button" onClick={handleBack} aria-label="Back">
          <BackIcon />
        </button>
      )}
      <h2 className="view-header-title">{title}</h2>
      {actionLabel && (onAction || actionNavigatesBack) && (
        <button className="action-button" onClick={handleAction}>
          {actionLabel}
        </button>
      )}

      <style jsx>{`
        .view-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--u-color-background-canvas, #eff0f0);
          padding: 0 var(--u-space-one-and-half, 24px);
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

        .view-header-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-default, 16px);
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground, #36485c);
          margin: 0;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 20px;
          border: none;
          background: var(--u-color-emphasis-background-contrast, #0273e3);
          border-radius: var(--u-border-radius-medium, 4px);
          cursor: pointer;
          color: white;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          transition: background 0.15s ease;
        }

        .action-button:hover {
          background: var(--u-color-emphasis-background-contrast-hover, #0261c2);
        }
      `}</style>
    </div>
  );
}
