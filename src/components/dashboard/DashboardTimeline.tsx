import React, { useEffect, useState } from 'react';
import { Calendar, BookOpen, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { timelineService } from '@/services/timeline.service';
import type { TimelineEvent, TimelineEventType } from '@/types/school';
import { format, formatDistanceToNow } from 'date-fns';

interface TimelineItemProps {
  event: TimelineEvent;
}

const eventTypeConfig: Record<TimelineEventType, {
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  assignment_created: {
    icon: React.createElement(FileText),
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  assignment_submitted: {
    icon: React.createElement(CheckCircle),
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-100',
  },
  assignment_graded: {
    icon: React.createElement(TrendingUp),
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
  quiz_started: {
    icon: React.createElement(BookOpen),
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  quiz_completed: {
    icon: React.createElement(CheckCircle),
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-100',
  },
  attendance_marked: {
    icon: React.createElement(Calendar),
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
  },
  grade_updated: {
    icon: React.createElement(TrendingUp),
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-100',
  },
  note_added: {
    icon: React.createElement(FileText),
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-100',
  },
};

function TimelineItem({ event }: TimelineItemProps) {
  const config = eventTypeConfig[event.type];
  const timeAgo = formatDistanceToNow(event.timestamp, { addSuffix: true });
  const fullDate = format(event.timestamp, 'PPp');

  return (
    <div className="group relative flex gap-4 pb-8 last:pb-0">
      <div className="absolute left-[25px] top-12 h-full w-px -translate-x-1/2 bg-border group-last:hidden" />

      <div className="relative">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${config.bgColor} ${config.borderColor}`}>
          <div className={`h-5 w-5 ${config.color}`}>{config.icon}</div>
        </div>
        <div className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white ${config.bgColor}`} />
      </div>

      <div className="flex-1 pt-1.5">
        <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <time className="text-xs text-muted-foreground" title={fullDate}>
          {timeAgo}
        </time>
      </div>
    </div>
  );
}

export function DashboardTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const recentEvents = await timelineService.getRecentEvents(10);
        setEvents(recentEvents);
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No recent activity
          </p>
        ) : (
          events.map((event) => (
            <TimelineItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
