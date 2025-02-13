import React from "react";
import { useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Users,
  Book,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  time: string;
  status: "ongoing" | "completed" | "upcoming";
  icon: React.ReactElement;
}

function TimelineItem({ title, time, status, icon }: TimelineItemProps) {
  const statusConfig = {
    upcoming: {
      bg: "bg-primary-light",
      icon: "text-primary",
      dot: "bg-primary",
      border: "border-primary/10",
    },
    ongoing: {
      bg: "bg-accent-light",
      icon: "text-accent",
      dot: "bg-accent",
      border: "border-accent/10",
    },
    completed: {
      bg: "bg-emerald-50",
      icon: "text-emerald-500",
      dot: "bg-emerald-500",
      border: "border-emerald-500/10",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="group relative flex gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-gray-50">
      {/* Vertical line connecting timeline items */}
      <div className="absolute -top-4 bottom-0 left-6 w-px bg-gray-100 group-first:top-8 group-last:hidden" />

      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
            config.bg,
            "border-2",
            config.border
          )}
        >
          <div className={cn("h-5 w-5", config.icon)}>{icon}</div>
        </div>
        <div
          className={cn(
            "absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white",
            config.dot
          )}
        />
      </div>

      <div className="flex-1 pt-1">
        <h4 className="text-sm font-medium text-gray-900 leading-none mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  const stats = [
    {
      title: "Total Students",
      value: "2,420",
      change: "+5.2% this month",
      icon: <Users size={20} />,
      trend: { value: 5.2, timeframe: "this month" },
    },
    {
      title: "Assignments",
      value: "48",
      change: "+12% this week",
      icon: <BookOpen size={20} />,
      trend: { value: 12, timeframe: "this week" },
    },
  ];

  const timeline = [
    {
      title: "Math Assignment Due",
      time: "2 hours left",
      status: "ongoing" as const,
      icon: <BookOpen size={20} className="text-[#6B7FE3]" />,
    },
    {
      title: "Science Quiz",
      time: "Completed at 2:30 PM",
      status: "completed" as const,
      icon: <CheckCircle size={20} className="text-emerald-500" />,
    },
    {
      title: "Parent Meeting",
      time: "Tomorrow, 10:00 AM",
      status: "upcoming" as const,
      icon: <Calendar size={20} className="text-[#6B7FE3]" />,
    },
  ];

  const quickActions = [
    {
      title: "View Assignments",
      description: "Check your pending and upcoming assignments",
      icon: <Book className="h-5 w-5 text-[#6B7FE3]" />,
    },
    {
      title: "Submit Work",
      description: "Upload and submit your completed work",
      icon: <FileText className="h-5 w-5 text-[#A78BFA]" />,
    },
    {
      title: "View Grades",
      description: "Check your latest grades and feedback",
      icon: <TrendingUp className="h-5 w-5 text-[#FFB86C]" />,
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: <Settings className="h-5 w-5 text-slate-400" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="bg-[#6B7FE3]/5 rounded-2xl p-6 md:p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Welcome back, Alex!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your progress and stay updated
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Progress Section */}
      <Card className="mb-8 overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl hover:shadow-lg transition-all duration-200">
        <CardContent className="p-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Progress Overview
              </h2>
              <div className="flex bg-slate-100 rounded-2xl p-1.5">
                <Button
                  onClick={() => setSelectedTimeRange("week")}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedTimeRange === "week"
                      ? "bg-[#6B7FE3] text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  )}
                >
                  THIS WEEK
                </Button>
                <Button
                  onClick={() => setSelectedTimeRange("month")}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedTimeRange === "month"
                      ? "bg-[#6B7FE3] text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  )}
                >
                  THIS MONTH
                </Button>
              </div>
            </div>

            {/* Progress Items */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    Attendance Rate
                  </span>
                  <span className="text-lg font-semibold text-emerald-500">
                    94%
                  </span>
                </div>
                <Progress 
                  value={94} 
                  className="h-3 bg-slate-100"
                >
                  <div 
                    className="h-full bg-[#6B7FE3] rounded-full transition-all duration-300" 
                    style={{ width: `94%` }}
                  />
                </Progress>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    Assignment Completion
                  </span>
                  <span className="text-lg font-semibold text-[#6B7FE3]">
                    85%
                  </span>
                </div>
                <Progress 
                  value={85} 
                  className="h-3 bg-slate-100"
                >
                  <div 
                    className="h-full bg-[#6B7FE3] rounded-full transition-all duration-300" 
                    style={{ width: `85%` }}
                  />
                </Progress>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    Quiz Performance
                  </span>
                  <span className="text-lg font-semibold text-[#6B7FE3]">
                    78%
                  </span>
                </div>
                <Progress 
                  value={78} 
                  className="h-3 bg-slate-100"
                >
                  <div 
                    className="h-full bg-[#6B7FE3] rounded-full transition-all duration-300" 
                    style={{ width: `78%` }}
                  />
                </Progress>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <Card className="lg:col-span-2 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-lg transition-all duration-200">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Timeline
              </CardTitle>
              <Button 
                className="text-[#6B7FE3] bg-[#6B7FE3]/5 hover:bg-[#6B7FE3]/10 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {timeline.map((item) => (
                <TimelineItem key={item.title} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#6B7FE3]/5 flex items-center justify-center group-hover:bg-[#6B7FE3]/10 transition-colors duration-200">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#6B7FE3] transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
