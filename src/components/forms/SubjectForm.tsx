import { zodResolver } from "@hookform/resolvers/zod";
import { Book, BookOpen, Star, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Subject } from "../../types/school";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MultiSelect } from "../ui/MultiSelect";
import { TextArea } from "../ui/TextArea";

const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  code: z.string().min(2, "Subject code must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  class: z.string().min(1, "Class is required"),
  teacherIds: z.array(z.string()).min(1, "At least one teacher is required"),
  teacherNames: z.array(z.string()).min(1, "At least one teacher is required"),
  credits: z.number().min(1, "Credits must be at least 1"),
  grade: z.string().min(1, "Grade is required"),
  schedule: z.string().min(1, "Schedule is required"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  initialData?: Partial<Subject>;
  teachers: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
}

export function SubjectForm({
  onSubmit,
  onCancel,
  initialData,
  teachers,
  isSubmitting: formSubmitting,
}: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-[#6B7FE3]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {initialData ? "Edit Subject" : "Add New Subject"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {initialData
                  ? "Update subject information"
                  : "Create a new subject record"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={formSubmitting}
              className="px-6 h-11 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={formSubmitting}
              disabled={formSubmitting}
              className="px-6 h-11 text-sm font-medium bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white rounded-xl"
            >
              {formSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <Book className="w-6 h-6 text-[#6B7FE3]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Basic Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Subject details and identification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Subject Name"
              placeholder="Enter subject name"
              {...register("name")}
              error={errors.name?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Subject Code"
              placeholder="e.g. MATH101"
              {...register("code")}
              error={errors.code?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <div className="col-span-full">
              <TextArea
                label="Description"
                placeholder="Enter subject description"
                {...register("description")}
                error={errors.description?.message}
                rows={3}
                className="block w-full rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Class Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-[#6B7FE3]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Class Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Grade, class, and scheduling details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Grade"
              placeholder="e.g. 10th"
              {...register("grade")}
              error={errors.grade?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Class"
              placeholder="e.g. A"
              {...register("class")}
              error={errors.class?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Credits"
              type="number"
              min={1}
              placeholder="e.g. 3"
              {...register("credits", { valueAsNumber: true })}
              error={errors.credits?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Schedule"
              placeholder="e.g. Mon/Wed 10:00-11:30"
              {...register("schedule")}
              error={errors.schedule?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Teacher Assignment */}
        <div className="col-span-full space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-[#6B7FE3]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Teacher Assignment
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Assign teachers to this subject
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Controller
              name="teacherIds"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Teachers
                  </label>
                  <MultiSelect
                    options={teachers.map((t) => ({
                      value: t.id,
                      label: t.name,
                    }))}
                    selected={field.value || []}
                    onChange={(value) => {
                      field.onChange(value);
                      // Update teacher names when selection changes
                      const selectedTeachers = teachers.filter((t) =>
                        value.includes(t.id)
                      );
                      setValue(
                        "teacherNames",
                        selectedTeachers.map((t) => t.name)
                      );
                    }}
                    error={errors.teacherIds?.message}
                  />
                  {errors.teacherIds?.message && (
                    <p className="text-sm text-red-500">
                      {errors.teacherIds.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
