'use client';

import { useState, useRef, useEffect } from 'react';

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

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.33337 2.66667C1.33337 2.29848 1.63185 2 2.00004 2H14C14.3682 2 14.6667 2.29848 14.6667 2.66667C14.6667 3.03486 14.3682 3.33333 14 3.33333H2.00004C1.63185 3.33333 1.33337 3.03486 1.33337 2.66667Z" fill="currentColor"/>
      <path d="M3.33337 6.66667C3.33337 6.29848 3.63185 6 4.00004 6H12C12.3682 6 12.6667 6.29848 12.6667 6.66667C12.6667 7.03486 12.3682 7.33333 12 7.33333H4.00004C3.63185 7.33333 3.33337 7.03486 3.33337 6.66667Z" fill="currentColor"/>
      <path d="M6.00004 10C5.63185 10 5.33337 10.2985 5.33337 10.6667C5.33337 11.0349 5.63185 11.3333 6.00004 11.3333H10C10.3682 11.3333 10.6667 11.0349 10.6667 10.6667C10.6667 10.2985 10.3682 10 10 10H6.00004Z" fill="currentColor"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.66663 6.66667L7.99996 10L11.3333 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SegmentDropdown({ segment }: { segment: SegmentConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = segment.value 
    ? segment.options.find(o => o.value === segment.value)?.label 
    : segment.placeholder;

  const handleSelect = (value: string) => {
    segment.onChange?.(value);
    setIsOpen(false);
  };

  const menuStyles: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    minWidth: '100%',
    background: '#fefefe',
    border: '1px solid #c4c6c8',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    overflow: 'hidden',
  };

  const optionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    fontFamily: 'var(--u-font-body)',
    fontSize: '16px',
    color: '#36485c',
    cursor: 'pointer',
    textAlign: 'left',
  };

  const selectedOptionStyles: React.CSSProperties = {
    ...optionStyles,
    color: '#0273e3',
    fontWeight: 500,
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        className="segment-select" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="segment-label">{selectedLabel}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div style={menuStyles} role="listbox">
          {segment.options.map((option) => (
            <button
              key={option.value}
              style={segment.value === option.value ? selectedOptionStyles : optionStyles}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={segment.value === option.value}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f6f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ flex: 1 }}>{option.label}</span>
              {segment.value === option.value && <CheckIcon />}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .segment-select {
          display: flex;
          align-items: center;
          gap: var(--u-space-one, 16px);
          height: 40px;
          padding: 0 var(--u-space-one, 16px);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          background: var(--u-color-background-container, #fefefe);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-250, 16px);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          min-width: 120px;
        }

        .segment-select:hover {
          background: var(--u-color-background-subtle, #f5f6f7);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }

        .segment-label {
          flex: 1;
          text-align: left;
        }
      `}</style>
    </div>
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
              <FilterIcon />
            </button>
            <div className="toolbar-divider" />
          </>
        )}
        
        <div className="toolbar-segments">
          {segments.map((segment, index) => (
            <SegmentDropdown key={index} segment={segment} />
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
            <DownloadIcon />
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
