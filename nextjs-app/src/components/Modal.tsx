'use client';

import React, { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(7, 28, 49, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--u-space-one, 16px);
        }

        .modal-content {
          background: var(--u-color-background-container, #fefefe);
          border-radius: var(--u-border-radius-large, 8px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
          border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
        }

        .modal-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-300, 18px);
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
        }

        .modal-close {
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

        .modal-close:hover {
          background: var(--u-color-background-default, #e8eaec);
        }

        .modal-body {
          padding: var(--u-space-one-and-half, 24px);
        }
      `}</style>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
