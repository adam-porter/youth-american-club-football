'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
        <style jsx>{`
          .toast-container {
            position: fixed;
            bottom: var(--u-space-one, 16px);
            right: var(--u-space-one, 16px);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-half, 8px);
            pointer-events: none;
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`toast toast--${toast.type || 'success'}`}>
      <div className="toast-content">
        {isSuccess && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {isError && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)} aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <style jsx>{`
        .toast {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 300px;
          max-width: 400px;
          padding: var(--u-space-one, 16px);
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: auto;
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast--success {
          border-left: 3px solid var(--u-color-success-foreground, #2e7d32);
        }

        .toast--error {
          border-left: 3px solid var(--u-color-alert-foreground, #bb1700);
        }

        .toast--info {
          border-left: 3px solid var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          flex: 1;
        }

        .toast-content svg {
          flex-shrink: 0;
          color: var(--u-color-success-foreground, #2e7d32);
        }

        .toast--error .toast-content svg {
          color: var(--u-color-alert-foreground, #bb1700);
        }

        .toast--info .toast-content svg {
          color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .toast-message {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          font-weight: var(--u-font-weight-medium, 500);
          color: var(--u-color-base-foreground-contrast, #071c31);
          line-height: 1.4;
        }

        .toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-left: var(--u-space-half, 8px);
          border: none;
          background: transparent;
          border-radius: var(--u-border-radius-medium, 4px);
          cursor: pointer;
          color: var(--u-color-base-foreground-subtle, #607081);
          transition: background 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          color: var(--u-color-base-foreground, #36485c);
        }
      `}</style>
    </div>
  );
}
