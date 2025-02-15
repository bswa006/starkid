import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Bell,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Classes", href: "/classes", icon: BookOpen },
  { name: "Assignments", href: "/assignments", icon: Calendar },
  { name: "Events", href: "/events", icon: Calendar },
];

const adminNavigation = [
  ...mainNavItems,
  { name: "Teachers", href: "/teachers", icon: GraduationCap },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

const teacherNavigation = [
  ...mainNavItems,
  { name: "Notifications", href: "/notifications", icon: Bell },
];

interface NavigationProps {
  variant?: "mobile" | "desktop";
}

export function Navigation({ variant = "desktop" }: NavigationProps) {
  const { currentUser, userProfile, loading } = useAuth();

  // Debug loading state
  console.log("Navigation Debug - Loading:", loading);

  // Debug auth state
  console.log("Navigation Debug - Auth:", {
    currentUser: currentUser?.email,
    userProfile,
    role: userProfile?.role,
    isAdmin: userProfile?.role === "admin",
    isTeacher: userProfile?.role === "teacher",
  });

  // Determine which navigation items to show based on variant and user role
  const isMobileView = variant === "mobile";
  const navigation =
    userProfile?.role === "admin" ? adminNavigation : teacherNavigation;
  const displayItems = isMobileView ? mainNavItems : navigation;

  // Log navigation state
  console.log("Navigation Debug - Menu:", {
    variant,
    isMobileView,
    items: displayItems?.map((item) => item.name) || [],
  });

  // Don't render anything while loading
  if (loading) {
    return <div>Loading navigation...</div>;
  }

  // Don't render if no user profile
  if (!userProfile) {
    console.log("Navigation Debug - No user profile");
    return null;
  }

  return (
    <nav
      className={
        isMobileView ? "flex justify-around" : "flex flex-col space-y-1"
      }
    >
      {displayItems.map((item) => {
        console.log("Rendering nav item:", item.name); // Debug each item
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => {
              const baseClasses = "flex transition-colors";
              const mobileClasses = "flex-col items-center justify-center py-2";
              const desktopClasses =
                "items-center px-4 py-2.5 text-sm font-medium rounded-lg w-full";
              const activeClasses = isActive
                ? "text-primary"
                : "text-gray-500 hover:text-primary";
              const desktopActiveClasses = isActive
                ? "bg-primary/10"
                : "hover:bg-gray-100/80";

              return `${baseClasses} ${
                isMobileView
                  ? `${mobileClasses} ${activeClasses}`
                  : `${desktopClasses} ${activeClasses} ${desktopActiveClasses}`
              }`;
            }}
          >
            <item.icon
              className={isMobileView ? "w-6 h-6 mb-1" : "w-5 h-5 mr-3"}
              aria-hidden="true"
            />
            <span
              className={isMobileView ? "text-[11px] font-medium" : "text-sm"}
            >
              {item.name}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
