import { Users, Search, Plus } from 'lucide-react';

export default function Students() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search students..."
          className="pl-10 input"
        />
      </div>

      {/* Content Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center py-8">
          Student management features coming soon...
        </p>
      </div>
    </div>
  );
}
