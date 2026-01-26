'use client';

import React from 'react';
import Button from './Button';

interface Tab {
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ActionButton {
  label: string;
  buttonStyle?: 'standard' | 'minimal';
  buttonType?: 'primary' | 'secondary' | 'subtle' | 'destroy' | 'confirm' | 'cancel';
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  actions?: ActionButton[];
}

export default function PageHeader({ 
  title, 
  description, 
  tabs, 
  actions 
}: PageHeaderProps) {
  return (
    <>
      <style jsx>{`
        .page-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
        }

        .page-header-top {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
        }

        .page-header-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 6px;
          justify-content: center;
          min-width: 0;
        }

        .page-header-title {
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-bold, 700);
          font-size: var(--u-font-size-plus-5, 32px);
          line-height: 1.2;
          letter-spacing: 0.25px;
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin: 0;
        }

        .page-header-description {
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-default, 400);
          font-size: var(--u-font-size-minus-1, 14px);
          line-height: 1.4;
          color: var(--u-color-base-foreground-default, #36485c);
          margin: 0;
        }

        .page-header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }

        .page-header-tabs {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid var(--u-color-background-canvas, #eff0f0);
        }

        .page-header-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 16px;
          font-family: var(--u-font-body);
          font-weight: var(--u-font-weight-medium, 500);
          font-size: var(--u-font-size-default, 16px);
          line-height: 1;
          color: var(--u-color-base-foreground-default, #36485c);
          cursor: pointer;
          border: none;
          background: transparent;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .page-header-tab:hover {
          color: var(--u-color-base-foreground-contrast, #071c31);
        }

        .page-header-tab.active {
          color: var(--u-color-base-foreground-contrast, #071c31);
          border-bottom-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }
      `}</style>
      
      <div className="page-header">
        <div className="page-header-top">
          <div className="page-header-content">
            <h1 className="page-header-title">{title}</h1>
            {description && (
              <p className="page-header-description">{description}</p>
            )}
          </div>
          
          {actions && actions.length > 0 && (
            <div className="page-header-actions">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  buttonStyle={action.buttonStyle || (index === actions.length - 1 ? 'standard' : 'minimal')}
                  buttonType={action.buttonType || 'primary'}
                  size="medium"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {tabs && tabs.length > 0 && (
          <div className="page-header-tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`page-header-tab ${tab.isActive ? 'active' : ''}`}
                onClick={tab.onClick}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
