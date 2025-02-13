import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardTimeline } from '@/components/dashboard/DashboardTimeline';
import { DashboardProgress } from '@/components/dashboard/DashboardProgress';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { userProfile } = useAuth();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {userProfile?.role === 'student' ? 'My Dashboard' : 'Class Dashboard'}
        </h2>
      </div>

      {/* Stats */}
      <DashboardStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Progress Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardProgress />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardTimeline />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
