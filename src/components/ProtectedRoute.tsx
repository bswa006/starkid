import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser || !userProfile) {
    return <Navigate to="/login" />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    // Redirect admin to admin dashboard, teachers to teacher dashboard
    const redirectPath = userProfile.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
}
