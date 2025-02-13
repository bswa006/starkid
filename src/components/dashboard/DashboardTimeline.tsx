import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, FileText } from "lucide-react";
import { timelineService } from "@/services/timeline.service";
import type { TimelineEvent, TimelineEventType } from "@/types/school";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";

interface TimelineItemProps {
  event: TimelineEvent;
}

const eventTypeConfig: Record<
  TimelineEventType,
  {
    icon: React.ReactElement;
    gradient: string;
    iconColor: string;
  }
> = {
  assignment_created: {
    icon: <FileText className="h-5 w-5" />,
    gradient: "from-blue-500 to-blue-600",
    iconColor: "text-blue-100",
  },
  attendance_marked: {
    icon: <Calendar className="h-5 w-5" />,
    gradient: "from-green-500 to-green-600",
    iconColor: "text-green-100",
  },
  assignment_graded: {
    icon: <FileText className="h-5 w-5" />,
    gradient: "from-purple-500 to-purple-600",
    iconColor: "text-purple-100",
  },
  quiz_published: {
    icon: <TrendingUp className="h-5 w-5" />,
    gradient: "from-orange-500 to-orange-600",
    iconColor: "text-orange-100",
  },
  quiz_graded: {
    icon: <TrendingUp className="h-5 w-5" />,
    gradient: "from-orange-500 to-orange-600",
    iconColor: "text-orange-100",
  },
  class_announcement: {
    icon: <Calendar className="h-5 w-5" />,
    gradient: "from-pink-500 to-pink-600",
    iconColor: "text-pink-100",
  },
};

const convertToDate = (date: Date | Timestamp): Date => {
  return date instanceof Timestamp ? date.toDate() : date;
};

function TimelineItem({ event }: TimelineItemProps) {
  const config = eventTypeConfig[event.type];
  const timeAgo = formatDistanceToNow(convertToDate(event.timestamp), {
    addSuffix: true,
  });
  const fullDate = format(convertToDate(event.timestamp), "PPp");

  return (
    <div className="group relative flex gap-4 pb-8 last:pb-0">
      <div className="absolute left-[25px] top-12 h-full w-px -translate-x-1/2 bg-gray-200 group-last:hidden" />

      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg transform transition-all duration-200 hover:scale-105`}
        >
          <div className={config.iconColor}>{config.icon}</div>
        </div>
        <div
          className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white bg-gradient-to-br ${config.gradient}`}
        />
      </div>

      <div className="flex-1 pt-1.5">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {event.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {event.description}
        </p>
        <time
          className="text-xs text-gray-500 dark:text-gray-500"
          title={fullDate}
        >
          {timeAgo}
        </time>
      </div>
    </div>
  );
}

export function DashboardTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const { userProfile } = useAuth();

  useEffect(() => {
    async function fetchEvents() {
      if (!userProfile) return;

      try {
        let recentEvents;
        setLoading(true);

        if (userProfile.role === "admin") {
          recentEvents = await timelineService.getRecentEvents(10);
        } else if (userProfile.role === "teacher") {
          try {
            recentEvents = await timelineService.getTeacherEvents(
              userProfile.id,
              10
            );
          } catch (error: any) {
            // If the error is about missing index, show a loading state
            if (error.message?.includes("index")) {
              console.log("Waiting for index to be created...");
              return; // Keep loading state true
            }
            throw error;
          }
        }

        setEvents(recentEvents || []);
      } catch (error) {
        console.error("Error fetching timeline events:", error);
        setEvents([]); // Set empty state on error
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse shadow-md" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No recent activity
          </p>
        ) : (
          events.map((event) => <TimelineItem key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
