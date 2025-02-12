import { Settings as SettingsIcon, User, Bell, Lock, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <SettingsIcon className="h-6 w-6 text-blue-500 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
          </div>
          <p className="text-gray-500 text-center py-4">
            Profile settings coming soon...
          </p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
          </div>
          <p className="text-gray-500 text-center py-4">
            Notification settings coming soon...
          </p>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
          </div>
          <p className="text-gray-500 text-center py-4">
            Security settings coming soon...
          </p>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Language Settings</h2>
          </div>
          <p className="text-gray-500 text-center py-4">
            Language settings coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
