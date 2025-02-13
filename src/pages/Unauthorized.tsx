import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is a mistake.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white"
          >
            Go to Dashboard
          </Button>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#6B7FE3] hover:text-[#5A6ED0]"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
