'use client';

import { useState } from 'react';
import Select from './Select';
import Icon from './Icon';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentConfig {
  placeholder: string;
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
}

interface ToolbarProps {
  segments?: SegmentConfig[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onExport?: () => void;
  showFilter?: boolean;
  showExport?: boolean;
}


function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


export default function Toolbar({
  segments = [],
  onSearch,
  searchPlaceholder = 'Search for...',
  onFilter,
  onExport,
  showFilter = true,
  showExport = true,
}: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {showFilter && (
          <>
            <button 
              className="toolbar-icon-btn" 
              onClick={onFilter}
              aria-label="Filter"
            >
              <Icon src="/icons/filter.svg" alt="Filter" width={20} height={20} />
            </button>
            <div className="toolbar-divider" />
          </>
        )}
        
        <div className="toolbar-segments">
          {segments.map((segment, index) => (
            <Select
              key={index}
              options={segment.options}
              value={segment.value}
              placeholder={segment.placeholder}
              onChange={segment.onChange}
            />
          ))}
        </div>
      </div>

      <div className="toolbar-right">
        <div className="search-input">
          <SearchIcon />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {showExport && (
          <button 
            className="toolbar-icon-btn" 
            onClick={onExport}
            aria-label="Export"
          >
            <Icon src="/icons/download.svg" alt="Download" width={20} height={20} />
          </button>
        )}
      </div>

      <style jsx>{`
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: var(--u-space-one, 16px);
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: var(--u-space-three-quarter, 12px);
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .toolbar-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .toolbar-icon-btn:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: var(--u-color-line-subtle, #c4c6c8);
        }

        .toolbar-segments {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
        }

        .search-input {
          display: flex;
          align-items: center;
          gap: var(--u-space-half, 8px);
          height: 40px;
          padding: 0 var(--u-space-three-quarter, 12px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground, #36485c);
          min-width: 160px;
          transition: border-color 0.15s ease;
        }

        .search-input:focus-within {
          border-color: var(--u-color-emphasis-background-contrast, #0273e3);
        }

        .search-input input {
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-250, 16px);
          color: var(--u-color-base-foreground-contrast, #071c31);
          width: 100%;
        }

        .search-input input::placeholder {
          color: var(--u-color-base-foreground-subtle, #607081);
        }
      `}</style>
    </div>
  );
}
