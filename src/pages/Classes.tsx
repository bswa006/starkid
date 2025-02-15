import { useState, useEffect } from "react";
import { Plus, Search, User, Users, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/contexts/AuthContext";
import { classService } from "@/services/class.service";
import type { Class } from "@/types/school";

const classSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.enum(["playschool", "nursery", "lkg", "ukg"]),
  section: z.string().min(1, "Section is required"),
  academicYear: z.string().min(4, "Academic year is required"),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
});

type ClassFormData = z.infer<typeof classSchema>;

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      maxStudents: 30,
    },
  });

  const { currentUser } = useAuth();

  const loadClasses = async () => {
    if (!currentUser) {
      console.log('No user found, skipping class load');
      return;
    }
    
    setLoading(true);
    setLoading(true);
    try {
      const allClasses = await classService.getAll();
      setClasses(allClasses);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('User authenticated, loading classes...');
      loadClasses();
    } else {
      console.log('No authenticated user');
      setClasses([]);
    }
  }, [currentUser]);

  const onSubmit = async (data: ClassFormData) => {
    console.log("currentUser:", currentUser);
    if (!currentUser) return;

    try {
      if (selectedClass) {
        await classService.update(selectedClass.id, data);
      } else {
        await classService.create({
          ...data,
          subjects: [],
          classTeacherId: "",
          status: "active",
        });
      }
      await loadClasses();
      handleClose();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const handleClose = () => {
    setSelectedClass(null);
    setIsAddingNew(false);
    reset();
  };

  const handleClassClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsAddingNew(true);
    // Set form values
    setValue("name", classItem.name);
    setValue("grade", classItem.grade);
    setValue("section", classItem.section);
    setValue("academicYear", classItem.academicYear);
    setValue("maxStudents", classItem.maxStudents);
  };

  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!classToDelete) return;

    try {
      await classService.delete(classToDelete.id);
      await loadClasses();
      setShowDeleteDialog(false);
      setClassToDelete(null);
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      searchQuery.toLowerCase() === "" ||
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
        </div>
        <Button variant="primary" onClick={() => setIsAddingNew(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="p-6 flex flex-col h-[120px]">
              <div className="flex flex-col gap-0.5">
                <div className="w-5 h-5 text-white mb-1">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-sm text-white/90 leading-none">
                  Total Classes
                </h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {classes.length}
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600">
            <div className="p-6 flex flex-col h-[120px]">
              <div className="flex flex-col gap-0.5">
                <div className="w-5 h-5 text-white mb-1">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-sm text-white/90 leading-none">
                  Active Classes
                </h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {classes.filter((c) => c.status === "active").length}
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600">
            <div className="p-6 flex flex-col h-[120px]">
              <div className="flex flex-col gap-0.5">
                <div className="w-5 h-5 text-white mb-1">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-sm text-white/90 leading-none">
                  Total Students
                </h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {classes.reduce((sum, c) => sum + (c.maxStudents || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classes List */}
        <div>
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredClasses.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Grade: {classItem.grade.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Section: {classItem.section}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClassClick(classItem)}
                        className="text-primary hover:bg-primary/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(classItem)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Class Distribution */}
        <div>
          <Card className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
            <div className="space-y-3">
              {Array.from(new Set(classes.map((c) => c.grade)))
                .sort()
                .map((grade) => {
                  const count = classes.filter((c) => c.grade === grade).length;
                  return (
                    <div
                      key={grade}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {grade.toUpperCase()}
                      </span>
                      <span className="font-semibold text-primary">
                        {count} classes
                      </span>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Class Modal */}
      <Modal
        isOpen={isAddingNew}
        onClose={handleClose}
        title={selectedClass ? "Edit Class" : "Add New Class"}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Class Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="Enter class name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grade
                    </label>
                    <Select id="grade" {...register("grade")}>
                      <option value="">Select grade</option>
                      <option value="playschool">Play School</option>
                      <option value="nursery">Nursery</option>
                      <option value="lkg">LKG</option>
                      <option value="ukg">UKG</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="section"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Section
                    </label>
                    <Input
                      id="section"
                      type="text"
                      {...register("section")}
                      placeholder="Enter section"
                    />
                    {errors.section && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.section.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="maxStudents"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Maximum Students
                    </label>
                    <Input
                      id="maxStudents"
                      type="number"
                      min="1"
                      {...register("maxStudents", { valueAsNumber: true })}
                      placeholder="Enter maximum students"
                    />
                    {errors.maxStudents && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxStudents.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div>
                    <label
                      htmlFor="academicYear"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Academic Year
                    </label>
                    <Input
                      id="academicYear"
                      type="text"
                      {...register("academicYear")}
                      placeholder="Enter academic year"
                    />
                    {errors.academicYear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.academicYear.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-auto pt-4 flex justify-end gap-4 border-t">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Class"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this class? This action cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
