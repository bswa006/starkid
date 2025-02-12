import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Events() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium text-gray-900">{currentMonth}</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Placeholder */}
        <div className="border rounded-lg p-4">
          <p className="text-gray-500 text-center py-8">
            Calendar view coming soon...
          </p>
        </div>
      </div>

      {/* Upcoming Events List Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        <p className="text-gray-500 text-center py-4">
          Event list coming soon...
        </p>
      </div>
    </div>
  );
}
