import { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Parent } from '@/types/parent';
import { parentService } from '@/services/parent.service';

interface ParentInfoProps {
  parentId: string;
}

export function ParentInfo({ parentId }: ParentInfoProps) {
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParent = async () => {
      try {
        const data = await parentService.getById(parentId);
        setParent(data);
      } catch (error) {
        console.error('Error loading parent:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParent();
  }, [parentId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading parent information...</p>;
  }

  if (!parent) {
    return <p className="text-sm text-slate-500">Parent information not found</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
        <User className="h-4 w-4 mr-2 text-slate-400" />
        {parent.name}
      </p>
      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
        <Mail className="h-4 w-4 mr-2 text-slate-400" />
        {parent.email}
      </p>
      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
        <Phone className="h-4 w-4 mr-2 text-slate-400" />
        {parent.phone}
      </p>
    </div>
  );
}
