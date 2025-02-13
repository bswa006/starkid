import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Student } from "../../types/school";

const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  parentPhone: z
    .string()
    .min(10, "Parent phone number must be at least 10 digits"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Student>;
  isSubmitting?: boolean;
}

export function StudentForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting: externalSubmitting,
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData,
  });

  const isSubmitting = formSubmitting || externalSubmitting;

  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      await onSubmit(data);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl"
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-[#6B7FE3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {initialData ? 'Edit Student' : 'Add New Student'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {initialData ? 'Update student information' : 'Create a new student record'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="px-6 h-11 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="px-6 h-11 text-sm font-medium bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-[#6B7FE3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Basic student details and identification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="First Name"
              placeholder="Enter first name"
              {...register("firstName")}
              error={errors.firstName?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register("lastName")}
              error={errors.lastName?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <Input
              label="Roll Number"
              placeholder="e.g. STU001"
              {...register("rollNumber")}
              error={errors.rollNumber?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Grade"
                placeholder="e.g. 10th"
                {...register("grade")}
                error={errors.grade?.message}
                className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
              />
              <Input
                label="Section"
                placeholder="e.g. A"
                {...register("section")}
                error={errors.section?.message}
                className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-[#6B7FE3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Student's contact details and address
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="student@example.com"
                {...register("email")}
                error={errors.email?.message}
                className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                error={errors.phone?.message}
                className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
              />
            </div>
            <Input
              label="Address"
              placeholder="Enter complete address"
              {...register("address")}
              error={errors.address?.message}
              className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="px-8 py-6 space-y-4 border-t border-slate-200 dark:border-slate-700 col-span-1 md:col-span-2">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#6B7FE3]/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-[#6B7FE3]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Parent/Guardian Information
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Emergency contact details
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label="Parent Name"
            placeholder="Enter parent's name"
            {...register("parentName")}
            error={errors.parentName?.message}
            className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
          />
          <Input
            label="Parent Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register("parentPhone")}
            error={errors.parentPhone?.message}
            className="block w-full h-11 rounded-xl border-slate-200 bg-white focus:border-[#6B7FE3] focus:ring-[#6B7FE3] transition-colors text-sm placeholder:text-slate-400"
          />
        </div>
      </div>
    </form>
  );
}
