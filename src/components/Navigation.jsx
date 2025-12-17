import React, { useState } from 'react'
import Button from './Button'
import SubnavItem from './SubnavItem'

// Import SVG icons
import HomeIcon from '../../icons/home.svg'
import ProgramsIcon from '../../icons/programs.svg'
import TicketsIcon from '../../icons/tickets.svg'
import FinancesIcon from '../../icons/finances.svg'
import TeamsIcon from '../../icons/teams.svg'
import MembersIcon from '../../icons/members.svg'
import SettingsIcon from '../../icons/settings.svg'
import CalendarIcon from '../../icons/calendar.svg'
import MessagesIcon from '../../icons/messages.svg'
import NotificationsIcon from '../../icons/notifications.svg'
import ExpandCollapseIcon from '../../icons/expand-collapse.svg'
import ExpandDownIcon from '../../icons/expand-down.svg'
import HudlLogoIcon from '../../icons/hudl-logo.svg'
import HudlHighSchoolLogo from '../../icons/hudl-high-school-logo.png'
import PersonalWorkspaceAvatar from '../../icons/personal-workspace-avatar.png'
import PlaceholderIcon from '../../icons/placeholder.svg'

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeItem, setActiveItem] = useState('Home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOrgPopoverOpen, setIsOrgPopoverOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState([])

  const directorNavItems = [
    { id: 'Home', icon: HomeIcon, label: 'Home' },
    { id: 'Registrations', icon: ProgramsIcon, label: 'Registrations' },
    { id: 'Tickets', icon: TicketsIcon, label: 'Tickets' },
    { id: 'Finances', icon: FinancesIcon, label: 'Finances' },
    { id: 'Teams', icon: TeamsIcon, label: 'Teams' },
    { id: 'Members', icon: MembersIcon, label: 'Members' },
    {
      id: 'Settings',
      icon: SettingsIcon,
      label: 'Settings',
      children: [
        { id: 'Ticketing', label: 'Ticketing', hasPill: false, pillText: '' },
        { id: 'Payments', label: 'Payments', hasPill: false, pillText: '' },
        { id: 'Users', label: 'Users', hasPill: false, pillText: '' },
        { id: 'Permissions', label: 'Permissions', hasPill: false, pillText: '' },
      ],
    },
  ]

  const teamNavItems = [
    { id: 'Library', icon: PlaceholderIcon, label: 'Library', hasPill: false, pillText: '' },
    { id: 'Reports', icon: PlaceholderIcon, label: 'Reports', hasPill: false, pillText: '' },
    { id: 'Exchanges', icon: PlaceholderIcon, label: 'Exchanges', hasPill: false, pillText: '' },
    {
      id: 'Team',
      icon: PlaceholderIcon,
      label: 'Team',
      children: [
        { id: 'Team Profile', label: 'Team Profile', hasPill: false, pillText: '' },
        { id: 'Manage Team', label: 'Manage Team', hasPill: false, pillText: '' },
        { id: 'Schedule', label: 'Schedule', hasPill: false, pillText: '' },
        { id: 'Team Settings', label: 'Team Settings', hasPill: false, pillText: '' },
      ],
    },
    {
      id: 'Highlights',
      icon: PlaceholderIcon,
      label: 'Highlights',
      children: [
        { id: 'Team Highlights', label: 'Team Highlights', hasPill: false, pillText: '' },
        { id: 'Your Highlights', label: 'Your Highlights', hasPill: false, pillText: '' },
      ],
    },
    {
      id: 'Recruiting',
      icon: PlaceholderIcon,
      label: 'Recruiting',
      children: [
        { id: 'Sharing', label: 'Sharing', hasPill: false, pillText: '' },
        { id: 'College Search', label: 'College Search', hasPill: false, pillText: '' },
        { id: 'Verify Athletes', label: 'Verify Athletes', hasPill: false, pillText: '' },
        { id: 'Recruiting Settings', label: 'Recruiting Settings', hasPill: false, pillText: '' },
      ],
    },
  ]

  const bottomNavItems = [
    { id: 'Calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'Messages', icon: MessagesIcon, label: 'Messages' },
    { id: 'Notifications', icon: NotificationsIcon, label: 'Notifications' },
  ]

  const parentOrg = { name: 'Hudl High School' }

  const orgWorkspace = {
    id: 'org',
    name: 'Hudl High School',
    role: 'Director',
    type: 'organization',
    avatar: 'HH'
  }

  const teamWorkspaces = [
    // Football teams
    { id: 'team1', name: 'Varsity Football', role: 'Team Admin', type: 'team', avatar: 'VF', position: 'Middle' },
    { id: 'team2', name: 'Junior Varsity Football', role: 'Team Admin', type: 'team', avatar: 'JVF', position: 'Middle' },
    { id: 'team3', name: 'Freshman Football', role: 'Team Admin', type: 'team', avatar: 'FF', position: 'Middle' },
    // Basketball teams
    { id: 'team4', name: 'Varsity Basketball', role: 'Team Admin', type: 'team', avatar: 'VB', position: 'Middle' },
    { id: 'team5', name: 'Junior Varsity Basketball', role: 'Team Admin', type: 'team', avatar: 'JVB', position: 'Middle' },
    { id: 'team6', name: 'Freshman Basketball', role: 'Team Admin', type: 'team', avatar: 'FB', position: 'Middle' },
    // Volleyball teams
    { id: 'team7', name: 'Varsity Volleyball', role: 'Team Admin', type: 'team', avatar: 'VV', position: 'Middle' },
    { id: 'team8', name: 'Junior Varsity Volleyball', role: 'Team Admin', type: 'team', avatar: 'JVV', position: 'Middle' },
    { id: 'team9', name: 'Freshman Volleyball', role: 'Team Admin', type: 'team', avatar: 'FV', position: 'Bottom' },
  ]

  const personalWorkspace = {
    id: 'personal',
    name: 'Your Hudl',
    subscriptionType: 'Personal',
    avatar: 'U'
  }

  const [selectedOrg, setSelectedOrg] = useState(orgWorkspace) // Default to organization workspace

  const isTeamWorkspaceSelected = teamWorkspaces.some(
    (workspace) => workspace.id === selectedOrg.id
  )
  const isDirectorWorkspaceSelected = selectedOrg.id === orgWorkspace.id
  const currentWorkspaceType = isTeamWorkspaceSelected
    ? 'team'
    : isDirectorWorkspaceSelected
      ? 'director'
      : 'personal'

  const currentNavItems =
    currentWorkspaceType === 'team'
      ? teamNavItems
      : currentWorkspaceType === 'personal'
        ? [{ id: 'Home', icon: HomeIcon, label: 'Home' }]
        : directorNavItems

  const findParentGroupIdForItem = (itemId) => {
    for (const item of currentNavItems) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        if (item.id === itemId) {
          return item.id
        }
        if (item.children.some((child) => child.id === itemId)) {
          return item.id
        }
      }
    }
    return null
  }

  const userMenuItems = [
    { id: 'account-settings', label: 'Account Settings' },
    { id: 'livestream-purchases', label: 'Livestream Purchases' },
    { id: 'tickets-passes', label: 'Tickets & Passes' },
    { id: 'registrations-payments', label: 'Registrations & Payments' },
    { id: 'billing-orders', label: 'Billing & Orders' },
    { id: 'add-team', label: 'Add Another Team' },
    { type: 'separator' },
    { id: 'get-help', label: 'Get Help' },
    { id: 'logout', label: 'Log Out' }
  ]

  return (
    <>
      <style>
        {`
          .navigation-container {
            display: flex;
            height: 100vh;
            background-color: var(--u-color-background-canvas, #eff0f0);
            font-family: var(--u-font-body);
          }

          .nav-sidebar {
            background-color: var(--u-color-background-canvas, #eff0f0);
            display: flex;
            flex-direction: column;
            gap: var(--u-space-half, 8px);
            padding: var(--u-space-half, 8px);
            position: relative;
            transition: width 0.3s ease;
            width: ${isExpanded ? '216px' : '72px'};
            z-index: 2;
            height: 100vh;
            overflow: visible;
          }

          .nav-logo {
            display: flex;
            gap: ${isExpanded ? 'var(--u-space-three-quarter, 12px)' : '0'};
            align-items: center;
            height: 56px;
            padding: 8px;
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
          }

          .nav-logo-icon {
            width: 40px;
            height: 40px;
            background-color: #ff6300;
            border-radius: var(--u-border-radius-medium, 4px);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 7px;
          }

          .nav-logo-icon img {
            width: 100%;
            height: 100%;
            display: block;
          }

          .nav-logo-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-450, 24px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground-contrast, #071c31);
            white-space: nowrap;
            overflow: hidden;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
          }

          .workspace-switcher {
            background-color: var(--u-color-base-background, #e0e1e1);
            display: flex;
            gap: ${isExpanded ? 'var(--u-space-half, 8px)' : '0'};
            align-items: center;
            justify-content: ${isExpanded ? 'flex-start' : 'center'};
            height: 56px;
            padding: var(--u-space-half, 8px);
            padding-right: ${isExpanded ? 'var(--u-space-three-quarter, 12px)' : 'var(--u-space-half, 8px)'};
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
            transition: background-color 0.2s linear;
            position: relative;
          }

          .workspace-switcher:hover {
            background-color: #C4C6C8;
          }

          .workspace-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }

          .workspace-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .workspace-info {
            display: flex;
            flex-direction: column;
            gap: 0;
            flex: 1;
            min-width: 0;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
            overflow: hidden;
          }

          .workspace-label {
            font-size: var(--u-font-size-150, 12px);
            color: var(--u-color-base-foreground-subtle, #607081);
            font-weight: var(--u-font-weight-medium, 500);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .workspace-name {
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
            font-weight: var(--u-font-weight-medium, 500);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .workspace-arrow {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .workspace-arrow img {
            width: 16px;
            height: 16px;
            display: block;
            transition: transform 0.2s ease;
          }

          .nav-items-container {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            flex: 1;
            min-height: 0;
            overflow-y: ${isExpanded ? 'auto' : 'visible'};
            overflow-x: visible;
            position: relative;
          }

          .nav-group-open {
            background-color: #F8F8F9;
            border-radius: var(--u-border-radius-large, 4px);
          }

          .nav-item-children {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            padding: 0px 8px 8px 44px
          }

          .nav-item-chevron {
            margin-left: auto;
            width: 24px;
            height: 24px;
            border: none;
            background-color: var(--u-color-base-background, #e0e1e1);
            border-radius: var(--u-border-radius-medium, 4px);
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .nav-item-chevron:hover {
            background-color: #C4C6C8;
          }

          .nav-item-chevron img {
            width: 16px;
            height: 16px;
            display: block;
            transition: transform 0.2s ease;
          }

          .mobile-menu-children {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
          }

          .mobile-menu-item-child {
            padding-left: var(--u-space-two, 32px);
            height: 32px;
            border-radius: var(--u-border-radius-large, 8px);
          }

          .mobile-menu-item-child .mobile-menu-item-label {
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-medium, 500);
          }

          .nav-item {
            display: flex;
            gap: ${isExpanded ? 'var(--u-space-one, 16px)' : '0'};
            align-items: center;
            justify-content: ${isExpanded ? 'flex-start' : 'center'};
            height: 40px;
            padding: ${isExpanded ? '0 var(--u-space-half, 8px) 0 var(--u-space-one, 16px)' : '0'};
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
            transition: all 0.2s ease;
            background-color: transparent;
            color: var(--u-color-base-foreground, #36485c);
            width: 100%;
            position: relative;
          }

          .nav-item:hover {
            background-color: #e0e1e1;
          }

          .nav-item.active {
            background-color: var(--u-color-emphasis-background-active, #96ccf3);
            color: var(--u-color-emphasis-foreground-contrast, #0d3673);
          }

          .nav-item.nav-item--child-active {
            background-color: #e0e1e1;
          }


          .nav-item-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .nav-item-icon img {
            width: 24px;
            height: 24px;
            display: block;
          }

          .nav-item-label {
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-medium, 500);
            white-space: nowrap;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
            overflow: hidden;
            text-overflow: ellipsis;
            display: ${isExpanded ? 'block' : 'none'};
            line-height: 1.2;
          }

          .nav-item-tooltip {
            position: absolute;
            left: calc(100% + var(--u-space-half, 8px));
            top: 50%;
            transform: translateY(-50%);
            background-color: #191F24;
            color: var(--u-color-background-container, #fefefe);
            padding: var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
            border-radius: var(--u-border-radius-medium, 4px);
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-medium, 500);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 1000;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15), 0px 0px 4px rgba(0, 0, 0, 0.1);
          }

          .nav-item-tooltip::before {
            content: '';
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border: 4px solid transparent;
            border-right-color: #191F24;
          }

          ${!isExpanded ? `
            .nav-item:hover .nav-item-tooltip {
              opacity: 1;
              visibility: visible;
            }
          ` : ''}

          .nav-bottom-items {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            margin-top: auto;
          }

          .user-settings {
            background-color: var(--u-color-base-background, #e0e1e1);
            display: flex;
            gap: ${isExpanded ? 'var(--u-space-half, 8px)' : '0'};
            align-items: center;
            justify-content: ${isExpanded ? 'flex-start' : 'center'};
            height: 56px;
            padding: var(--u-space-half, 8px);
            padding-right: ${isExpanded ? 'var(--u-space-three-quarter, 12px)' : 'var(--u-space-half, 8px)'};
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s ease;
          }

          .user-settings:hover {
            background-color: #C4C6C8;
          }

          .user-avatar {
            width: ${isExpanded ? '32px' : '40px'};
            height: ${isExpanded ? '32px' : '40px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background-color: var(--u-color-emphasis-background-active, #96ccf3);
            color: var(--u-color-emphasis-foreground-contrast, #0d3673);
            font-size: ${isExpanded ? 'var(--u-font-size-150, 12px)' : 'var(--u-font-size-200, 14px)'};
            font-weight: var(--u-font-weight-bold, 700);
          }

          .user-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
            overflow: hidden;
          }

          .user-name {
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            font-weight: var(--u-font-weight-medium, 500);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-arrow {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            opacity: ${isExpanded ? '1' : '0'};
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .user-arrow img {
            width: 16px;
            height: 16px;
            display: block;
            transition: transform 0.2s ease;
          }

          .org-popover {
            position: absolute;
            top: 0;
            left: calc(100% + var(--u-space-half, 8px));
            background-color: var(--u-color-background-popover, #fefefe);
            border-radius: var(--u-border-radius-large, 4px);
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15), 0px 0px 4px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            z-index: 9999;
            padding: var(--u-space-three-quarter, 12px);
            display: ${isOrgPopoverOpen ? 'flex' : 'none'};
            flex-direction: column;
            gap: 12px;
          }

          .org-popover-header {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-250, 16px);
            font-weight: var(--u-font-weight-bold, 700);
            line-height: 1.2;
            color: #000000;
            margin: 0;
            padding: 0;
          }

          .org-popover-teams {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
          }

          .org-popover-item {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            height: 56px;
            padding: 0 var(--u-space-one, 16px) 0 var(--u-space-half, 8px);
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
            transition: background-color 0.2s ease;
            position: relative;
          }

          .org-popover-item:hover {
            background-color: var(--u-color-background-subtle, #f5f5f5);
          }

          .org-popover-item.active {
            background-color: var(--u-color-emphasis-background-active, #96ccf3);
          }

          .org-popover-item.active .org-popover-name,
          .org-popover-item.active .org-popover-role {
            color: var(--u-color-emphasis-foreground-contrast, #0d3673);
          }

          .org-popover-separator {
            height: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            margin: 0;
            border: none;
          }

          .org-popover-item-wrapper {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .org-popover-item-wrapper.position-top {
            padding-top: var(--u-space-half, 8px);
            padding-bottom: 0;
          }

          .org-popover-item-wrapper.position-middle {
            padding-top: 0;
            padding-bottom: 0;
          }

          .org-popover-item-wrapper.position-bottom {
            padding-top: 0;
            padding-bottom: var(--u-space-half, 8px);
          }

          .org-popover-line {
            width: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            flex-shrink: 0;
          }

          .org-popover-line-above {
            height: 12px;
            margin-bottom: 4px;
          }

          .org-popover-line-below {
            height: 12px;
            margin-top: 4px;
          }

          .org-popover-line-top {
            height: 16px;
          }

          .org-popover-line-bottom {
            height: 16px;
          }

          .org-popover-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }

          .org-popover-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .org-popover-avatar.personal {
            width: 40px;
            height: 40px;
            background-color: white;
            border: 1px solid var(--u-color-line-media, rgba(254, 254, 254, 0.25));
          }

          .org-popover-info {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            flex: 1;
            min-width: 0;
          }

          .org-popover-name {
            font-size: var(--u-font-size-200, 14px);
            color: var(--u-color-base-foreground, #36485c);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .org-popover-role {
            font-size: var(--u-font-size-150, 12px);
            color: var(--u-color-base-foreground-subtle, #607081);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
          }

          .org-popover-separator-line {
            height: 0;
            width: 100%;
            margin: 0;
            border: none;
            border-top: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          }

          .user-menu-popover {
            position: absolute;
            bottom: 0;
            left: calc(100% + var(--u-space-half, 8px));
            background-color: var(--u-color-background-popover, #fefefe);
            border-radius: var(--u-border-radius-large, 4px);
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15), 0px 0px 4px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            z-index: 9999;
            padding: var(--u-space-three-quarter, 12px);
            display: ${isUserMenuOpen ? 'flex' : 'none'};
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
          }

          .user-menu-item {
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 var(--u-space-one, 16px);
            border-radius: var(--u-border-radius-large, 4px);
            cursor: pointer;
            transition: background-color 0.2s ease;
            color: var(--u-color-base-foreground, #36485c);
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-menu-item:hover {
            background-color: var(--u-color-background-subtle, #f5f5f5);
          }

          .user-menu-separator {
            height: 0;
            width: 100%;
            margin: var(--u-space-half, 8px) 0;
            border: none;
            border-top: 1px dashed var(--u-color-line-subtle, #c4c6c8);
          }

          .expand-collapse-button {
            position: absolute;
            background-color: var(--u-color-background-popover, #fefefe);
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.25), 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
            left: 100%;
            top: calc(50% + 18px);
            transform: translateX(-50%) translateY(-50%);
            z-index: 1001;
            transition: left 0.3s ease, background-color 0.2s ease;
          }

          .expand-collapse-button:hover {
            background-color: #e0e1e1;
          }

          .expand-collapse-icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .expand-collapse-icon img {
            width: 16px;
            height: 16px;
            display: block;
            transition: transform 0.3s ease;
          }

          .main-content {
            flex: 1;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: var(--u-space-half, 8px);
            padding-left: 0;
            z-index: 1;
          }

          .content-inner {
            background-color: var(--u-color-background-container, #fefefe);
            border-radius: var(--u-space-small, 8px);
            padding: var(--u-space-two, 32px) var(--u-space-four, 64px);
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-two, 32px);
            align-items: center;
            justify-content: flex-start;
          }

          .page-header {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            margin-bottom: var(--u-space-one, 16px);
          }

          .page-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--u-space-half, 8px);
            width: 100%;
          }

          .page-header-title {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-xx-large, 24px);
            font-weight: var(--u-font-weight-bold, 700);
            line-height: 1.2;
            color: var(--u-color-base-foreground-contrast, #071c31);
            white-space: nowrap;
          }

          .page-header-actions {
            display: flex;
            align-items: center;
            gap: var(--u-space-small, 8px);
          }

          .page-body {
            max-width: 1280px;
            width: 100%;
          }

          .mobile-top-nav {
            display: none;
          }

          .mobile-menu-overlay {
            display: none;
          }

          .mobile-menu-drawer {
            display: none;
          }

          @media (max-width: 767px) {
            .navigation-container {
              flex-direction: column;
              height: 100vh;
            }

            .nav-sidebar {
              display: none;
            }

            .mobile-top-nav {
              display: flex;
              background-color: var(--u-color-background-canvas, #eff0f0);
              border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
              gap: var(--u-space-three-quarter, 12px);
              align-items: center;
              padding: var(--u-space-three-quarter, 12px) var(--u-space-one-and-half, 24px);
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 100;
              width: 100%;
            }

            .mobile-menu-button {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              border: none;
              cursor: pointer;
              padding: 0;
              flex-shrink: 0;
            }

            .mobile-menu-icon {
              width: 24px;
              height: 24px;
              color: var(--u-color-base-foreground, #36485c);
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mobile-menu-icon svg {
              width: 24px;
              height: 24px;
            }

            .mobile-logo-container {
              flex: 1;
              display: flex;
              gap: 12px;
              align-items: center;
              justify-content: center;
              padding-right: var(--u-space-two, 32px);
              cursor: pointer;
            }

            .mobile-logo-icon {
              width: 40px;
              height: 40px;
              background-color: #ff6300;
              border-radius: var(--u-border-radius-medium, 4px);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              padding: 7px;
            }

            .mobile-logo-icon img {
              width: 100%;
              height: 100%;
              display: block;
            }

            .mobile-logo-text {
              font-family: var(--u-font-body);
              font-size: var(--u-font-size-450, 24px);
              font-weight: var(--u-font-weight-bold, 700);
              color: var(--u-color-base-foreground-contrast, #232a31);
              line-height: 1.2;
            }

            .mobile-menu-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              z-index: 200;
            }

            .mobile-menu-drawer {
              position: fixed;
              top: 0;
              left: 0;
              bottom: 0;
              width: 100%;
              max-width: 100vw;
              background-color: var(--u-color-background-canvas, #eff0f0);
              flex-direction: column;
              z-index: 201;
              box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
              transition: transform 0.3s ease;
              display: flex;
              padding: 0;
              padding-bottom: var(--u-space-one, 16px);
            }

            .mobile-menu-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: var(--u-space-three-quarter, 12px) var(--u-space-one-and-half, 24px);
              border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
              background-color: var(--u-color-background-canvas, #eff0f0);
              gap: var(--u-space-three-quarter, 12px);
            }

            .mobile-menu-close {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              border: none;
              cursor: pointer;
              padding: 0;
              color: var(--u-color-base-foreground, #36485c);
              flex-shrink: 0;
            }

            .mobile-menu-close svg {
              width: 24px;
              height: 24px;
            }

            .mobile-menu-content {
              display: flex;
              flex-direction: column;
              flex: 1;
              overflow-y: auto;
              padding: var(--u-space-three-quarter, 12px);
              gap: var(--u-space-half, 8px);
            }

            .mobile-workspace-switcher {
              background-color: var(--u-color-base-background, #e0e1e1);
              display: flex;
              gap: var(--u-space-half, 8px);
              align-items: center;
              height: 56px;
              padding: var(--u-space-half, 8px) var(--u-space-one, 16px) var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
              border-radius: var(--u-border-radius-large, 4px);
              cursor: pointer;
            }

            .mobile-workspace-avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              overflow: hidden;
              background-color: white;
              padding: 2px;
            }

            .mobile-workspace-avatar img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
              display: block;
            }

            .mobile-workspace-info {
              display: flex;
              flex-direction: column;
              gap: 2px;
              flex: 1;
              min-width: 0;
            }

            .mobile-workspace-label {
              font-size: var(--u-font-size-150, 12px);
              color: var(--u-color-base-foreground, #36485c);
              font-weight: var(--u-font-weight-medium, 500);
              line-height: 1.4;
            }

            .mobile-workspace-name {
              font-size: var(--u-font-size-250, 16px);
              color: var(--u-color-base-foreground, #36485c);
              font-weight: var(--u-font-weight-medium, 500);
              line-height: 1.4;
            }

            .mobile-workspace-arrow {
              width: 16px;
              height: 16px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mobile-workspace-arrow img {
              width: 16px;
              height: 16px;
              display: block;
              transition: transform 0.2s ease;
            }

            .mobile-menu-items {
              display: flex;
              flex-direction: column;
              gap: var(--u-space-zero, 0px);
            }

            .mobile-menu-item {
              display: flex;
              gap: var(--u-space-one-and-quarter, 20px);
              align-items: center;
              height: 48px;
              padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
              border-radius: var(--u-border-radius-large, 4px);
              cursor: pointer;
              background-color: transparent;
              color: var(--u-color-base-foreground, #36485c);
            }

            .mobile-menu-item:hover {
              background-color: var(--u-color-background-subtle, #f5f5f5);
            }

            .mobile-menu-item.active {
              background-color: var(--u-color-emphasis-background-active, #96ccf3);
              color: var(--u-color-emphasis-foreground-contrast, #0d3673);
            }

            .mobile-menu-item-icon {
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .mobile-menu-item-icon img {
              width: 24px;
              height: 24px;
              display: block;
            }

            .mobile-menu-item-label {
              font-size: var(--u-font-size-200, 14px);
              font-weight: var(--u-font-weight-medium, 500);
              line-height: 1.4;
            }

            .mobile-menu-bottom-section {
              display: flex;
              flex-direction: column;
              gap: var(--u-space-half, 8px);
              margin-top: auto;
            }

            .mobile-user-settings {
              background-color: var(--u-color-base-background, #e0e1e1);
              display: flex;
              gap: var(--u-space-half, 8px);
              align-items: center;
              height: 56px;
              padding: var(--u-space-half, 8px) var(--u-space-one, 16px) var(--u-space-half, 8px) var(--u-space-three-quarter, 12px);
              border-radius: var(--u-border-radius-large, 4px);
            }

            .mobile-user-avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              background-color: white;
              padding: 2px;
            }

            .mobile-user-avatar-text {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--u-color-emphasis-background-active, #96ccf3);
              color: var(--u-color-emphasis-foreground-contrast, #0d3673);
              font-size: var(--u-font-size-150, 12px);
              font-weight: var(--u-font-weight-bold, 700);
            }

            .mobile-user-info {
              display: flex;
              flex-direction: column;
              flex: 1;
              min-width: 0;
            }

            .mobile-user-name {
              font-size: var(--u-font-size-250, 16px);
              color: var(--u-color-base-foreground, #36485c);
              font-weight: var(--u-font-weight-medium, 500);
              line-height: 1.4;
            }

            .mobile-user-arrow {
              width: 16px;
              height: 16px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mobile-user-arrow img {
              width: 16px;
              height: 16px;
              display: block;
            }

            .main-content {
              padding-top: 64px;
              width: 100%;
            }
          }
        `}
      </style>
      <div 
        className="navigation-container"
        onClick={(e) => {
          // Close popovers when clicking outside
          if (isOrgPopoverOpen && !e.target.closest('.workspace-switcher') && !e.target.closest('.org-popover')) {
            setIsOrgPopoverOpen(false)
          }
          if (isUserMenuOpen && !e.target.closest('.user-settings') && !e.target.closest('.user-menu-popover')) {
            setIsUserMenuOpen(false)
          }
        }}
      >
        {/* Mobile Top Navigation */}
          <div className="mobile-top-nav">
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="mobile-menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </button>
          <div
            className="mobile-logo-container"
            onClick={() => {
              const defaultItem = currentWorkspaceType === 'team' ? 'Library' : 'Home'
              setActiveItem(defaultItem)
              setOpenGroups([])
            }}
          >
            <div className="mobile-logo-icon">
              <img src={HudlLogoIcon} alt="Hudl" />
            </div>
            <div className="mobile-logo-text">Hudl</div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className="mobile-menu-drawer"
          style={{
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
        >
          <div className="mobile-menu-header">
            <button
              className="mobile-menu-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div
              className="mobile-logo-container"
              style={{ paddingRight: 0, justifyContent: 'center' }}
              onClick={() => {
                const defaultItem = currentWorkspaceType === 'team' ? 'Library' : 'Home'
                setActiveItem(defaultItem)
                setIsMobileMenuOpen(false)
              }}
            >
              <div className="mobile-logo-icon">
                <img src={HudlLogoIcon} alt="Hudl" />
              </div>
              <div className="mobile-logo-text">Hudl</div>
            </div>
          </div>
          <div className="mobile-menu-content">
            <div 
              className="mobile-workspace-switcher"
              onClick={(e) => {
                e.stopPropagation()
                setIsOrgPopoverOpen(!isOrgPopoverOpen)
              }}
              style={{ position: 'relative' }}
            >
              <div className="mobile-workspace-avatar">
                <img src={selectedOrg.id === personalWorkspace.id ? PersonalWorkspaceAvatar : HudlHighSchoolLogo} alt={selectedOrg.name} />
              </div>
              <div className="mobile-workspace-info">
                <div className="mobile-workspace-label">
                  {selectedOrg.id === personalWorkspace.id ? 'Personal' : parentOrg.name}
                </div>
                <div className="mobile-workspace-name">{selectedOrg.name}</div>
              </div>
              <div className="mobile-workspace-arrow">
                <img
                  src={ExpandDownIcon}
                  alt=""
                  width="16"
                  height="16"
                  style={{
                    transform: isOrgPopoverOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                  }}
                />
              </div>
              {isOrgPopoverOpen && (
                <div className="org-popover" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, width: '100%' }}>
                  <p className="org-popover-header">{parentOrg.name}</p>
                  <div className="org-popover-teams">
                    {/* Organization option */}
                    <div
                      className={`org-popover-item ${selectedOrg.id === orgWorkspace.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrg(orgWorkspace)
                        setActiveItem('Home')
                        setOpenGroups([])
                        setIsOrgPopoverOpen(false)
                      }}
                    >
                      <div className="org-popover-item-wrapper position-top">
                        <div className="org-popover-avatar">
                          <img src={HudlHighSchoolLogo} alt={orgWorkspace.name} />
                        </div>
                        <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                      </div>
                      <div className="org-popover-info">
                        <div className="org-popover-name">{orgWorkspace.name}</div>
                        <div className="org-popover-role">{orgWorkspace.role}</div>
                      </div>
                    </div>
                    {/* Team options */}
                    {teamWorkspaces.map((workspace) => (
                      <React.Fragment key={workspace.id}>
                        <div
                          className={`org-popover-item ${selectedOrg.id === workspace.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrg(workspace)
                            setActiveItem('Library')
                            setOpenGroups([])
                            setIsOrgPopoverOpen(false)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <div className={`org-popover-item-wrapper position-${workspace.position.toLowerCase()}`}>
                            {workspace.position === 'Middle' && (
                              <>
                                <div className="org-popover-line org-popover-line-above" />
                                <div className="org-popover-avatar">
                                  <img src={HudlHighSchoolLogo} alt={workspace.name} />
                                </div>
                                <div className="org-popover-line org-popover-line-below" />
                              </>
                            )}
                            {workspace.position === 'Top' && (
                              <>
                                <div className="org-popover-avatar">
                                  <img src={HudlHighSchoolLogo} alt={workspace.name} />
                                </div>
                                <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                              </>
                            )}
                            {workspace.position === 'Bottom' && (
                              <>
                                <div className="org-popover-line org-popover-line-above org-popover-line-bottom" />
                                <div className="org-popover-avatar">
                                  <img src={HudlHighSchoolLogo} alt={workspace.name} />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="org-popover-info">
                            <div className="org-popover-name">{workspace.name}</div>
                            <div className="org-popover-role">{workspace.role}</div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="org-popover-separator-line" />
                  <div
                    className={`org-popover-item ${selectedOrg.id === personalWorkspace.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrg(personalWorkspace)
                      setActiveItem('Home')
                      setOpenGroups([])
                      setIsOrgPopoverOpen(false)
                    }}
                  >
                    <div className="org-popover-item-wrapper">
                      <div className="org-popover-avatar personal">
                        <img src={PersonalWorkspaceAvatar} alt={personalWorkspace.name} />
                      </div>
                    </div>
                    <div className="org-popover-info">
                      <div className="org-popover-name">{personalWorkspace.name}</div>
                      <div className="org-popover-role">{personalWorkspace.subscriptionType}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mobile-menu-items">
              {currentNavItems.map((item) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0
                const isGroupOpen = openGroups.includes(item.id)
                const isItemActive = activeItem === item.id

                return (
                  <React.Fragment key={item.id}>
                    <div
                      className={`mobile-menu-item ${isItemActive ? 'active' : ''} ${
                        hasChildren && isGroupOpen ? 'mobile-menu-item--open' : ''
                      }`}
                      onClick={() => {
                        if (hasChildren) {
                          setOpenGroups((prev) => {
                            if (prev.includes(item.id)) {
                              return []
                            }
                            return [item.id]
                          })
                          setActiveItem(item.id)
                        } else {
                          setActiveItem(item.id)
                          setOpenGroups([])
                          setIsMobileMenuOpen(false)
                        }
                      }}
                    >
                      <div className="mobile-menu-item-icon">
                        <img src={item.icon} alt="" width="24" height="24" />
                      </div>
                      <div className="mobile-menu-item-label">{item.label}</div>
                    </div>
                    {hasChildren && isGroupOpen && (
                      <div className="mobile-menu-children">
                        {item.children.map((child) => (
                          <div
                            key={child.id}
                            className={`mobile-menu-item mobile-menu-item-child ${
                              activeItem === child.id ? 'active' : ''
                            }`}
                            onClick={() => {
                              setActiveItem(child.id)
                              const parentGroupId = findParentGroupIdForItem(child.id)
                              setOpenGroups((prev) => {
                                if (!parentGroupId) {
                                  return []
                                }
                                return prev.includes(parentGroupId) ? [parentGroupId] : []
                              })
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <div className="mobile-menu-item-label">
                              {child.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
            <div className="mobile-menu-bottom-section">
              <div className="mobile-menu-items">
                {bottomNavItems.map((item) => (
                  <div
                    key={item.id}
                    className={`mobile-menu-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <div className="mobile-menu-item-icon">
                      <img src={item.icon} alt="" width="24" height="24" />
                    </div>
                    <div className="mobile-menu-item-label">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="mobile-user-settings">
                <div className="mobile-user-avatar">
                  <div className="mobile-user-avatar-text">JS</div>
                </div>
                <div className="mobile-user-info">
                  <div className="mobile-user-name">John Smith</div>
                </div>
                <div className="mobile-user-arrow">
                  <img src={ExpandDownIcon} alt="" width="16" height="16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="nav-sidebar">
          <div
            className="nav-logo"
            onClick={() => {
              const defaultItem = currentWorkspaceType === 'team' ? 'Library' : 'Home'
              setActiveItem(defaultItem)
              setOpenGroups([])
            }}
          >
            <div className="nav-logo-icon">
              <img src={HudlLogoIcon} alt="Hudl" />
            </div>
            <div className="nav-logo-text">Hudl</div>
          </div>

          <div 
            className="workspace-switcher"
            onClick={() => setIsOrgPopoverOpen(!isOrgPopoverOpen)}
          >
            <div className="workspace-avatar">
              <img src={selectedOrg.id === personalWorkspace.id ? PersonalWorkspaceAvatar : HudlHighSchoolLogo} alt={selectedOrg.name} />
            </div>
            {isExpanded && (
              <div className="workspace-info">
                <div className="workspace-name">{selectedOrg.name}</div>
                <div className="workspace-label">
                  {selectedOrg.id === personalWorkspace.id ? 'Personal' : parentOrg.name}
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="workspace-arrow">
                <img
                  src={ExpandDownIcon}
                  alt=""
                  width="16"
                  height="16"
                  style={{
                    transform: isOrgPopoverOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                  }}
                />
              </div>
            )}
            {isOrgPopoverOpen && (
              <div className="org-popover">
                <p className="org-popover-header">{parentOrg.name}</p>
                <div className="org-popover-teams">
                  {/* Organization option */}
                  <div
                    className={`org-popover-item ${selectedOrg.id === orgWorkspace.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrg(orgWorkspace)
                      setActiveItem('Home')
                      setOpenGroups([])
                      setIsOrgPopoverOpen(false)
                    }}
                  >
                    <div className="org-popover-item-wrapper position-top">
                      <div className="org-popover-avatar">
                        <img src={HudlHighSchoolLogo} alt={orgWorkspace.name} />
                      </div>
                      <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                    </div>
                    <div className="org-popover-info">
                      <div className="org-popover-name">{orgWorkspace.name}</div>
                      <div className="org-popover-role">{orgWorkspace.role}</div>
                    </div>
                  </div>
                  {/* Team options */}
                  {teamWorkspaces.map((workspace) => (
                    <React.Fragment key={workspace.id}>
                      <div
                        className={`org-popover-item ${selectedOrg.id === workspace.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOrg(workspace)
                          setActiveItem('Library')
                          setOpenGroups([])
                          setIsOrgPopoverOpen(false)
                        }}
                      >
                        <div className={`org-popover-item-wrapper position-${workspace.position.toLowerCase()}`}>
                          {workspace.position === 'Middle' && (
                            <>
                              <div className="org-popover-line org-popover-line-above" />
                              <div className="org-popover-avatar">
                                <img src={HudlHighSchoolLogo} alt={workspace.name} />
                              </div>
                              <div className="org-popover-line org-popover-line-below" />
                            </>
                          )}
                          {workspace.position === 'Top' && (
                            <>
                              <div className="org-popover-avatar">
                                <img src={HudlHighSchoolLogo} alt={workspace.name} />
                              </div>
                              <div className="org-popover-line org-popover-line-below org-popover-line-top" />
                            </>
                          )}
                          {workspace.position === 'Bottom' && (
                            <>
                              <div className="org-popover-line org-popover-line-above org-popover-line-bottom" />
                              <div className="org-popover-avatar">
                                <img src={HudlHighSchoolLogo} alt={workspace.name} />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="org-popover-info">
                          <div className="org-popover-name">{workspace.name}</div>
                          <div className="org-popover-role">{workspace.role}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="org-popover-separator-line" />
                <div
                  className={`org-popover-item ${selectedOrg.id === personalWorkspace.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                      setSelectedOrg(personalWorkspace)
                      setActiveItem('Home')
                      setOpenGroups([])
                      setIsOrgPopoverOpen(false)
                  }}
                >
                  <div className="org-popover-item-wrapper">
                    <div className="org-popover-avatar personal">
                      <img src={PersonalWorkspaceAvatar} alt={personalWorkspace.name} />
                    </div>
                  </div>
                  <div className="org-popover-info">
                    <div className="org-popover-name">{personalWorkspace.name}</div>
                    <div className="org-popover-role">{personalWorkspace.subscriptionType}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-items-container">
            {currentNavItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              const isGroupOpen = openGroups.includes(item.id)
              const isItemActive = activeItem === item.id
              const hasActiveChild =
                hasChildren &&
                Array.isArray(item.children) &&
                item.children.some((child) => child.id === activeItem)
              const groupWrapperClass =
                hasChildren && isGroupOpen && isExpanded ? 'nav-group-open' : ''

              return (
                <div key={item.id} className={groupWrapperClass}>
                  <div
                    className={`nav-item ${isItemActive ? 'active' : ''} ${
                      hasChildren && isGroupOpen ? 'nav-item--open' : ''
                    } ${
                      hasChildren && !isGroupOpen && hasActiveChild ? 'nav-item--child-active' : ''
                    }`}
                    onClick={() => {
                      setActiveItem(item.id)
                      const parentGroupId = findParentGroupIdForItem(item.id)
                      setOpenGroups((prev) => {
                        if (!parentGroupId) {
                          return []
                        }
                        return prev.includes(parentGroupId) ? [parentGroupId] : []
                      })
                    }}
                  >
                    <div className="nav-item-icon">
                      <img src={item.icon} alt="" width="24" height="24" />
                    </div>
                    {isExpanded && (
                      <>
                        <div className="nav-item-label">{item.label}</div>
                        {hasChildren && (
                          <button
                            type="button"
                            className="nav-item-chevron"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenGroups((prev) => {
                                if (prev.includes(item.id)) {
                                  return []
                                }
                                return [item.id]
                              })
                            }}
                          >
                            <img
                              src={ExpandDownIcon}
                              alt=""
                              width="16"
                              height="16"
                              style={{
                                transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </button>
                        )}
                      </>
                    )}
                    {!isExpanded && (
                      <div className="nav-item-tooltip">{item.label}</div>
                    )}
                  </div>
                  {hasChildren && isGroupOpen && isExpanded && (
                    <div className="nav-item-children">
                      {item.children.map((child) => (
                        <div key={child.id} className="nav-item-child">
                          <SubnavItem
                            label={child.label}
                            active={activeItem === child.id}
                            hasPill={!!child.hasPill}
                            pillText={child.pillText}
                            onClick={() => {
                              setActiveItem(child.id)
                              const parentGroupId = findParentGroupIdForItem(child.id)
                              setOpenGroups((prev) => {
                                if (!parentGroupId) {
                                  return []
                                }
                                return prev.includes(parentGroupId) ? [parentGroupId] : []
                              })
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="nav-bottom-items">
            {bottomNavItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <div className="nav-item-icon">
                  <img src={item.icon} alt="" width="24" height="24" />
                </div>
                {isExpanded && <div className="nav-item-label">{item.label}</div>}
                {!isExpanded && (
                  <div className="nav-item-tooltip">{item.label}</div>
                )}
              </div>
            ))}
          </div>

          <div 
            className="user-settings"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="user-avatar">JS</div>
            {isExpanded && (
              <>
                <div className="user-info">
                  <div className="user-name">John Smith</div>
                </div>
                <div className="user-arrow">
                  <img
                    src={ExpandDownIcon}
                    alt=""
                    width="16"
                    height="16"
                    style={{
                      transform: isUserMenuOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                    }}
                  />
                </div>
              </>
            )}
            {isUserMenuOpen && (
              <div className="user-menu-popover">
                {userMenuItems.map((item, index) => (
                  item.type === 'separator' ? (
                    <div key={`separator-${index}`} className="user-menu-separator" />
                  ) : (
                    <div
                      key={item.id}
                      className="user-menu-item"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsUserMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          <button
            className="expand-collapse-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
          >
            <div className="expand-collapse-icon">
              <img 
                src={ExpandCollapseIcon} 
                alt="" 
                width="16" 
                height="16" 
                style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }} 
              />
            </div>
          </button>
        </div>

        <div className="main-content">
          <div className="content-inner">
            <div className="page-header">
              <div className="page-header-row">
                <div className="page-header-title">{activeItem}</div>
                <div className="page-header-actions">
                  <Button
                    buttonStyle="minimal"
                    buttonType="secondary"
                    size="medium"
                  >
                    Secondary action
                  </Button>
                  <Button
                    buttonStyle="standard"
                    buttonType="primary"
                    size="medium"
                  >
                    Primary action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation