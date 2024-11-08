import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Briefcase,
  Calculator,
  Building2,
  HelpCircle,
  User,
  Settings,
  LogOut,
  FolderKanban,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  Ticket,
  ScrollText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user';
import clsx from 'clsx';

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
  subItems?: NavItem[];
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    icon: LayoutGrid, 
    href: '/dashboard', 
    roles: ['ADMIN', 'DISPATCHER', 'TECHNICIAN', 'SUBCONTRACTOR'] 
  },
  { 
    name: 'Interventions', 
    icon: Briefcase, 
    href: '/interventions', 
    roles: ['ADMIN', 'DISPATCHER', 'TECHNICIAN', 'SUBCONTRACTOR'],
    subItems: [
      { 
        name: 'Tickets', 
        icon: Ticket, 
        href: '/tickets', 
        roles: ['ADMIN', 'DISPATCHER', 'TECHNICIAN', 'SUBCONTRACTOR'] 
      },
      { 
        name: 'Projets', 
        icon: FolderKanban, 
        href: '/projects', 
        roles: ['ADMIN', 'DISPATCHER'] 
      }
    ]
  },
  { 
    name: 'Clients', 
    icon: Users, 
    href: '/clients', 
    roles: ['ADMIN', 'DISPATCHER'],
    subItems: [
      { 
        name: 'Liste des clients', 
        icon: Building2, 
        href: '/clients/list', 
        roles: ['ADMIN', 'DISPATCHER'] 
      },
      { 
        name: 'Contrats', 
        icon: ScrollText, 
        href: '/clients/contracts', 
        roles: ['ADMIN', 'DISPATCHER'] 
      },
      { 
        name: 'Grille tarifaire', 
        icon: FileText, 
        href: '/clients/pricing-grid', 
        roles: ['ADMIN', 'DISPATCHER'] 
      }
    ]
  },
  { 
    name: 'Comptabilité', 
    icon: Calculator, 
    href: '/comptabilite', 
    roles: ['ADMIN'] 
  },
  { 
    name: 'Entreprise', 
    icon: Building2, 
    href: '/entreprise', 
    roles: ['ADMIN'] 
  },
  { 
    name: 'Aide', 
    icon: HelpCircle, 
    href: '/aide', 
    roles: ['ADMIN', 'DISPATCHER', 'TECHNICIAN', 'SUBCONTRACTOR'] 
  },
  { 
    name: 'Mon Compte', 
    icon: User, 
    href: '/compte', 
    roles: ['ADMIN', 'DISPATCHER', 'TECHNICIAN', 'SUBCONTRACTOR'] 
  },
  { 
    name: 'Panel Admin', 
    icon: Settings, 
    href: '/admin', 
    roles: ['ADMIN'] 
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const filteredNavigation = navigation.filter(
    item => item.roles.includes(user.role as UserRole)
  );

  const isActive = (item: NavItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href);
    }
    return location.pathname === item.href;
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const active = isActive(item);
    const showSubItems = hasSubItems && isExpanded;

    return (
      <div key={item.name}>
        <div
          className={clsx(
            'flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer',
            active
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50',
            level > 0 && 'ml-6'
          )}
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.name);
            } else {
              navigate(item.href);
            }
          }}
        >
          <item.icon className="h-5 w-5 mr-3" />
          <span className="flex-1">{item.name}</span>
          {hasSubItems && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </div>
        {showSubItems && (
          <div className="mt-1">
            {item.subItems.map(subItem => renderNavItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">DeltAPP</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredNavigation.map(item => renderNavItem(item))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}