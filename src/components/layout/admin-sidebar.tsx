import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Link2,
  LogOut,
  Package,
  UserPlus,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPortalLabel, isVerifier } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const adminNavGroups: NavGroup[] = [
  {
    label: 'Platform',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/products', label: 'Products', icon: Package },
      { to: '/users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/users/create', label: 'Create user', icon: UserPlus },
      { to: '/users/assign', label: 'Assign requesters', icon: Link2 },
    ],
  },
];

const verifierNavGroups: NavGroup[] = [
  {
    label: 'Verification',
    items: [
      { to: '/', label: 'Your analytics', icon: LayoutDashboard, end: true },
      { to: '/products', label: 'My queue', icon: Package },
      { to: '/requesters', label: 'Assigned requesters', icon: Users },
    ],
  },
];

export function PortalSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const navGroups = isVerifier(user) ? verifierNavGroups : adminNavGroups;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border/70 bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border/70 px-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {getPortalLabel(user)}
          </p>
          <p className="font-serif text-lg font-medium tracking-wide">
            Tag-It
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground',
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border/70 p-4">
        <div className="mb-3 min-w-0">
          <p className="truncate text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

// Backward-compatible export for existing imports
export { PortalSidebar as AdminSidebar };
