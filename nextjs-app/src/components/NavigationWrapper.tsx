'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LegacyNavigation = dynamic(
  () => import('./LegacyNavigation'),
  { ssr: false }
);

interface Organization {
  id: string;
  name: string;
  primary_sport: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface Team {
  id: string;
  title: string;
  sport: string | null;
  gender: string | null;
  avatar: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}

interface NavItemChild {
  id: string;
  label: string;
  route: string | null;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string | null;
  children: NavItemChild[];
}

interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface NavigationWrapperProps {
  organization: Organization | null;
  teams: Team[];
  navItems: NavItem[];
  currentUser: CurrentUser | null;
  children: React.ReactNode;
}

export default function NavigationWrapper({ 
  organization, 
  teams,
  navItems,
  currentUser,
  children 
}: NavigationWrapperProps) {
  return (
    <LegacyNavigation 
      organization={organization} 
      teams={teams} 
      navItems={navItems}
      currentUser={currentUser}
    >
      {children}
    </LegacyNavigation>
  );
}
