import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardTimeline } from "@/components/dashboard/DashboardTimeline";
import { DashboardProgress } from "@/components/dashboard/DashboardProgress";

export default function Dashboard() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Class Dashboard</h2>

      {/* Stats */}
      <div className="mb-6">
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
          <DashboardProgress />
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <DashboardTimeline />
        </div>
      </div>
    </div>
  );
}
