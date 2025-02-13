import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Building,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import type { Teacher } from "../../types/school";
import { useController } from "react-hook-form";
import cn from "classnames";

const teacherSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  department: z.string().min(1, "Department is required"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  qualifications: z
    .array(z.string())
    .min(1, "At least one qualification is required"),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  onSubmit: (data: TeacherFormData) => void;
  onCancel: () => void;
  initialData?: Partial<Teacher>;
  isSubmitting?: boolean;
}

export function TeacherForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: TeacherFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialData,
  });

  // Form-specific wrapper for MultiSelect
  const FormMultiSelect = ({
    name,
    control,
    label,
    icon: Icon,
    error,
    options,
  }: {
    name: string;
    control: any;
    label: string;
    icon: any;
    error: boolean;
    options: { value: string; label: string }[];
  }) => {
    const { field } = useController({
      name,
      control,
    });

    return (
      <div className="space-y-2">
        <label>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        </label>
        <MultiSelect
          options={options}
          selected={field.value || []}
          onChange={field.onChange}
          className={cn(error && "border-error focus:border-error focus:ring-error/20")}
        />
        {error && (
          <p className="text-sm text-error">This field is required</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins" }}>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            icon={User}
            {...register("firstName")}
            error={!!errors.firstName?.message}
          />
          <Input
            label="Last Name"
            icon={User}
            {...register("lastName")}
            error={!!errors.lastName?.message}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins" }}>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            type="email"
            icon={Mail}
            {...register("email")}
            error={!!errors.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            icon={Phone}
            {...register("phone")}
            error={!!errors.phone?.message}
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "Poppins" }}>
          Professional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Department"
            icon={Building}
            {...register("department")}
            error={!!errors.department?.message}
          >
            <option value="">Select a department</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Languages">Languages</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Arts">Arts</option>
          </Select>
          <FormMultiSelect
            name="subjects"
            control={control}
            label="Subjects"
            icon={BookOpen}
            error={!!errors.subjects?.message}
            options={[
              { value: "Mathematics", label: "Mathematics" },
              { value: "Physics", label: "Physics" },
              { value: "Chemistry", label: "Chemistry" },
              { value: "Biology", label: "Biology" },
              { value: "English", label: "English" },
              { value: "History", label: "History" },
              { value: "Geography", label: "Geography" },
            ]}
          />
          <div className="col-span-full">
            <FormMultiSelect
              name="qualifications"
              control={control}
              label="Qualifications"
              icon={GraduationCap}
              error={!!errors.qualifications?.message}
              options={[
                { value: "B.Ed", label: "B.Ed" },
                { value: "M.Ed", label: "M.Ed" },
                { value: "B.Sc", label: "B.Sc" },
                { value: "M.Sc", label: "M.Sc" },
                { value: "Ph.D", label: "Ph.D" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="px-6"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="px-6 bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {initialData ? 'Updating...' : 'Adding...'}
            </div>
          ) : (
            <>{initialData ? 'Update' : 'Add'} Teacher</>
          )}
        </Button>
      </div>
    </form>
  );
}
