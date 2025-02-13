import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, MessageCircle, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: Users,
    label: 'Attendance',
    path: '/attendance',
  },
  {
    icon: BookOpen,
    label: 'Assignments',
    path: '/assignments',
  },
  {
    icon: MessageCircle,
    label: 'Messages',
    path: '/messages',
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors"
            >
              <Icon
                size={22}
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs mt-1 font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
