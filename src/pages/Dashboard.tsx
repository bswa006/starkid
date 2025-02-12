import { useState } from 'react';
import {
  Book,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="mt-1 text-xl font-semibold text-text-primary">{value}</p>
          </div>
          <div
            className={cn(
              'p-2 rounded-lg',
              trend === 'up'
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            )}
          >
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <TrendingUp
            size={16}
            className={cn(
              trend === 'up' ? 'text-success' : 'text-error rotate-180'
            )}
          />
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' ? 'text-success' : 'text-error'
            )}
          >
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimelineItemProps {
  title: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  icon: React.ReactNode;
}

function TimelineItem({ title, time, status, icon }: TimelineItemProps) {
  const statusColors = {
    upcoming: 'bg-primary text-primary',
    ongoing: 'bg-warning text-warning',
    completed: 'bg-success text-success',
  };

  return (
    <div className="flex gap-3 p-3 rounded-xl hover:bg-surface transition-colors">
      <div className="relative flex-shrink-0">
        <div className="p-2 rounded-lg bg-surface-hover">{icon}</div>
        <div
          className={cn(
            'absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full',
            statusColors[status].split(' ')[0]
          )}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary">{time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedMonth] = useState('This Month');

  return (
    <div className="space-y-6 pt-4">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Students"
          value="2,420"
          change="+5.2% this month"
          icon={<Users size={20} />}
          trend="up"
        />
        <StatCard
          title="Assignments"
          value="48"
          change="+12% this week"
          icon={<BookOpen size={20} />}
          trend="up"
        />
        <StatCard
          title="Events"
          value="12"
          change="-2.4% this month"
          icon={<Calendar size={20} />}
          trend="down"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <TimelineItem
                title="Math Assignment Due"
                time="2 hours left"
                status="ongoing"
                icon={<BookOpen size={20} className="text-primary" />}
              />
              <TimelineItem
                title="Science Quiz"
                time="Completed at 2:30 PM"
                status="completed"
                icon={<CheckCircle size={20} className="text-success" />}
              />
              <TimelineItem
                title="Parent Meeting"
                time="Tomorrow, 10:00 AM"
                status="upcoming"
                icon={<Calendar size={20} className="text-primary" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progress</CardTitle>
              <Button variant="outline" size="sm">
                {selectedMonth}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Attendance</span>
                  <span className="font-medium text-text-primary">92%</span>
                </div>
                <Progress value={92} variant="success" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Assignments</span>
                  <span className="font-medium text-text-primary">85%</span>
                </div>
                <Progress value={85} variant="default" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Tests</span>
                  <span className="font-medium text-text-primary">78%</span>
                </div>
                <Progress value={78} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Book size={20} className="text-primary" />
                <span className="font-medium">View Assignments</span>
              </div>
              <p className="text-sm text-text-secondary">
                Check your pending and upcoming assignments
              </p>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-accent" />
                <span className="font-medium">View Calendar</span>
              </div>
              <p className="text-sm text-text-secondary">
                See upcoming events and schedule
              </p>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-success" />
                <span className="font-medium">View Progress</span>
              </div>
              <p className="text-sm text-text-secondary">
                Track your academic performance
              </p>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-secondary" />
                <span className="font-medium">Settings</span>
              </div>
              <p className="text-sm text-text-secondary">
                Configure your preferences
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const stats = [
    {
      title: 'Total Students',
      value: '2,420',
      change: '+5.2% this month',
      icon: <Users size={20} />,
      trend: 'up' as const,
    },
    {
      title: 'Assignments',
      value: '48',
      change: '+12% this week',
      icon: <BookOpen size={20} />,
      trend: 'up' as const,
    },
    {
      title: 'Events',
      value: '12',
      change: '-2.4% this month',
      icon: <Calendar size={20} />,
      trend: 'down' as const,
    },
  ];

  const timeline = [
    {
      title: 'Math Assignment Due',
      time: '2 hours left',
      status: 'ongoing' as const,
      icon: <BookOpen size={20} className="text-primary" />,
    },
    {
      title: 'Science Quiz',
      time: 'Completed at 2:30 PM',
      status: 'completed' as const,
      icon: <CheckCircle size={20} className="text-success" />,
    },
    {
      title: 'Parent Meeting',
      time: 'Tomorrow, 10:00 AM',
      status: 'upcoming' as const,
      icon: <Calendar size={20} className="text-primary" />,
    },
  ];

  const quickActions = [
    {
      title: 'View Assignments',
      description: 'Check your pending and upcoming assignments',
      icon: <Book className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Submit Work',
      description: 'Upload and submit your completed work',
      icon: <FileText className="h-5 w-5 text-success" />,
    },
    {
      title: 'View Grades',
      description: 'Check your latest grades and feedback',
      icon: <TrendingUp className="h-5 w-5 text-secondary" />,
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <Settings className="h-5 w-5 text-text-tertiary" />,
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, Alex!
        </h1>
        <p className="mt-1 text-text-secondary">
          Track your progress and stay updated
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timeline</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {timeline.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-sm text-text-secondary">
                  {action.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress</CardTitle>
            <Button variant="outline" size="sm">
              {selectedMonth}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-text-secondary">Attendance</span>
                <span className="font-medium text-text-primary">92%</span>
              </div>
              <Progress value={92} variant="success" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-text-secondary">Assignments</span>
                <span className="font-medium text-text-primary">85%</span>
              </div>
              <Progress value={85} variant="default" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-text-secondary">Tests</span>
                <span className="font-medium text-text-primary">78%</span>
              </div>
              <Progress value={78} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
