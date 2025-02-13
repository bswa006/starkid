import {
  AcademicCapIcon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Students", href: "/students", icon: UserGroupIcon },
  { name: "Teachers", href: "/teachers", icon: AcademicCapIcon },
  { name: "Assignments", href: "/assignments", icon: BookOpenIcon },
  { name: "Events", href: "/events", icon: CalendarIcon },
  { name: "Notifications", href: "/notifications", icon: BellIcon },
  { name: "Settings", href: "/settings", icon: CogIcon },
];

const teacherNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Students", href: "/students", icon: UserGroupIcon },
  { name: "Assignments", href: "/assignments", icon: BookOpenIcon },
  { name: "Events", href: "/events", icon: CalendarIcon },
  { name: "Notifications", href: "/notifications", icon: BellIcon },
];

export function Navigation() {
  const { userProfile } = useAuth();

  const navigation =
    userProfile?.role === "admin" ? adminNavigation : teacherNavigation;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col space-y-1">
        {navigation.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface-hover"
                }`
              }
            >
              <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => {
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex flex-col items-center px-2 py-1 text-xs font-medium rounded-md ${
                    isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                  }`
                }
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
                <span className="mt-1">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
