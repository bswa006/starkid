import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { CalendarIcon } from 'lucide-react';
import type { Assignment, Subject, Teacher } from '../../types/school';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  points: z.number().min(0, 'Points must be 0 or greater'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => void;
  subjects: Subject[];
  teachers: Teacher[];
  initialData?: Partial<Assignment>;
}

export function AssignmentForm({ onSubmit, subjects, teachers, initialData }: AssignmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subjectId: initialData?.subjectId || '',
      teacherId: initialData?.teacherId || '',
      class: initialData?.class || '',
      section: initialData?.section || '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      points: initialData?.points || 0,
    },
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          error={errors.title?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register('description')}
            className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter assignment description..."
          />
          {errors.description && (
            <p className="text-sm text-error">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              {...register('subjectId')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && (
              <p className="text-sm text-error mt-1">{errors.subjectId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teacher</label>
            <select
              {...register('teacherId')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="text-sm text-error mt-1">{errors.teacherId.message}</p>
            )}
          </div>

          <Input
            label="Class"
            {...register('class')}
            error={errors.class?.message}
          />

          <Input
            label="Section"
            {...register('section')}
            error={errors.section?.message}
          />

          <Input
            type="date"
            label="Due Date"
            icon={CalendarIcon}
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <Input
            type="number"
            label="Points"
            {...register('points', { valueAsNumber: true })}
            error={errors.points?.message}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            loading={isSubmitting}
          >
            {initialData ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
