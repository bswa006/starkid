import { ClipboardList, Search, Plus, Filter } from 'lucide-react';

export default function Assignments() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ClipboardList className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Create Assignment
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search assignments..."
            className="pl-10 input"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-5 w-5 mr-1" />
          Filter
        </button>
      </div>

      {/* Content Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">
          Assignment management features coming soon...
        </p>
      </div>
    </div>
  );
}
