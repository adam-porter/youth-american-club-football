'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import EmptyState, { type EmptyStateVariant } from '@/components/EmptyState';
import Toolbar from '@/components/Toolbar';

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState('Events');
  const [statusFilter, setStatusFilter] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset status filter to appropriate default when switching tabs
    if (tab === 'Events') {
      setStatusFilter('published');
    } else if (tab === 'Passes') {
      setStatusFilter('current');
    }
    setSearchQuery('');
  };

  // Get the appropriate empty state variant based on tab and status
  const getEventsEmptyStateVariant = (): EmptyStateVariant => {
    if (searchQuery.trim()) return 'search';
    switch (statusFilter) {
      case 'published': return 'tickets-events-published';
      case 'non-ticketed': return 'tickets-events-non-ticketed';
      case 'draft': return 'tickets-events-draft';
      case 'past': return 'tickets-events-past';
      default: return 'tickets-events';
    }
  };

  const getPassesEmptyStateVariant = (): EmptyStateVariant => {
    if (searchQuery.trim()) return 'search';
    switch (statusFilter) {
      case 'current': return 'tickets-passes-current';
      case 'draft': return 'tickets-passes-draft';
      case 'past': return 'tickets-passes-past';
      default: return 'tickets-passes';
    }
  };

  const tabs = [
    { label: 'Events', isActive: activeTab === 'Events', onClick: () => handleTabChange('Events') },
    { label: 'Passes', isActive: activeTab === 'Passes', onClick: () => handleTabChange('Passes') },
  ];

  const eventsSegments = [
    {
      placeholder: 'Status',
      value: statusFilter,
      options: [
        { value: 'published', label: 'Published' },
        { value: 'non-ticketed', label: 'Non-Ticketed' },
        { value: 'draft', label: 'Draft' },
        { value: 'past', label: 'Past' },
      ],
      onChange: (value: string) => setStatusFilter(value),
    },
  ];

  const passesSegments = [
    {
      placeholder: 'Status',
      value: statusFilter,
      options: [
        { value: 'current', label: 'Current' },
        { value: 'draft', label: 'Draft' },
        { value: 'past', label: 'Past' },
      ],
      onChange: (value: string) => setStatusFilter(value),
    },
  ];

  return (
    <div className="tickets-page">
      <PageHeader 
        title="Tickets"
        description="Manage event tickets, sales, and attendance tracking."
        actions={[
          { label: 'View Reports', buttonStyle: 'minimal' },
          { label: 'New Event', buttonStyle: 'standard' }
        ]}
        tabs={tabs}
      />

      {activeTab === 'Events' && (
        <div className="tickets-content">
          <Toolbar
            segments={eventsSegments}
            searchPlaceholder="Search events..."
            onSearch={(query) => setSearchQuery(query)}
            showFilter={true}
            showExport={true}
          />
          <EmptyState variant={getEventsEmptyStateVariant()} searchQuery={searchQuery} />
        </div>
      )}

      {activeTab === 'Passes' && (
        <div className="tickets-content">
          <Toolbar
            segments={passesSegments}
            searchPlaceholder="Search passes..."
            onSearch={(query) => setSearchQuery(query)}
            showFilter={true}
            showExport={true}
          />
          <EmptyState variant={getPassesEmptyStateVariant()} searchQuery={searchQuery} />
        </div>
      )}

      <style jsx>{`
        .tickets-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .tickets-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }
      `}</style>
    </div>
  );
}
