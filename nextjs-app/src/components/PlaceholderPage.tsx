'use client';

import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ 
  title, 
  description = 'This page is under construction.' 
}: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <style jsx>{`
        .placeholder-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 2rem;
          text-align: center;
        }

        .placeholder-icon {
          width: 80px;
          height: 80px;
          background-color: var(--u-color-base-background, #e0e1e1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .placeholder-icon svg {
          width: 40px;
          height: 40px;
          color: var(--u-color-base-foreground-subtle, #607081);
        }

        .placeholder-title {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-450, 24px);
          font-weight: var(--u-font-weight-bold, 700);
          color: var(--u-color-base-foreground-contrast, #071c31);
          margin-bottom: 0.5rem;
        }

        .placeholder-description {
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground-subtle, #607081);
          max-width: 400px;
        }
      `}</style>
      <div className="placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="placeholder-title">{title}</h1>
      <p className="placeholder-description">{description}</p>
    </div>
  );
}
