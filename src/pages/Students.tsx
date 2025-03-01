import { StudentForm } from "@/components/forms/StudentForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { studentService } from "@/services/student.service";
import type { Student } from "@/types/school";
import toast from "@/utils/toast";
import { Plus, Search, User, Users, GraduationCap } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Form data type for student creation/editing
type StudentFormData = {
  firstName: string;
  lastName: string;
  rollNumber: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        searchQuery.toLowerCase() === "" ||
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const { currentUser, userProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    console.log("Auth state in Students:", {
      authLoading,
      currentUser: currentUser?.email,
      userProfile,
    });

    if (authLoading) {
      console.log("Auth is still loading...");
      return;
    }

    if (!currentUser || !userProfile) {
      console.log("No user logged in or profile not loaded");
      setStudents([]);
      return;
    }

    if (!["admin", "teacher"].includes(userProfile.role)) {
      console.log("User does not have required role");
      setStudents([]);
      return;
    }

    console.log("Auth ready, loading students...");
    loadStudents();
  }, [authLoading, currentUser, userProfile]);

  const loadStudents = async () => {
    console.log("Starting to load students...", { currentUser, userProfile });
    try {
      setLoading(true);
      console.log("Calling studentService.getAll()...");
      let data;

      if (userProfile?.role === "teacher") {
        data = await studentService.getByTeacher(currentUser!.uid);
      } else {
        data = await studentService.getAll();
      }

      console.log("Received data:", data);
      if (Array.isArray(data)) {
        setStudents(data);
        if (data.length === 0) {
          console.log("No students found");
          toast.info("No students found");
        } else {
          console.log(`Loaded ${data.length} students successfully`);
          toast.success(`Loaded ${data.length} students successfully`);
        }
      } else {
        console.error("Received non-array data:", data);
        setStudents([]);
        toast.error("Invalid data format received");
      }
    } catch (error: any) {
      console.error("Error loading students:", {
        error,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      });
      setStudents([]);
      toast.error(error?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      await studentService.delete(studentToDelete.id);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      toast.success("Student deleted successfully");
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsAddingNew(true);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsAddingNew(true);
  };

  const handleClose = () => {
    setIsAddingNew(false);
    setSelectedStudent(null);
  };

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.id, {
          ...data,
          updatedAt: new Date(),
        });
        setStudents(
          students.map((s) =>
            s.id === selectedStudent.id
              ? { ...s, ...data, updatedAt: new Date() }
              : s
          )
        );
        toast.success("Student updated successfully");
      } else {
        // Create a classId based on grade and section
        const classId = `${data.grade}-${data.section}`;
        
        const newStudentData = {
          ...data,
          classId,
          // If current user is a teacher, set them as the teacher
          teacherId: userProfile?.role === 'teacher' ? currentUser?.uid : undefined,
          status: "active" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const newStudent = await studentService.create(newStudentData);
        setStudents([...students, newStudent]);
        toast.success("Student added successfully");
      }
      handleClose();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("Rendering Students page:", {
    loading,
    students: students.length,
    filteredStudents: filteredStudents?.length,
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Students Management</h2>
        <Button onClick={handleAddNew} variant={"primary"}>
          <Plus className="h-4 w-4" />
          Add Student
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
                <h3 className="text-sm text-white/90 leading-none">Total Students</h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {students.length}
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
                <h3 className="text-sm text-white/90 leading-none">Active Students</h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {students.filter((s) => s.status === "active").length}
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
                <h3 className="text-sm text-white/90 leading-none">Total Classes</h3>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-semibold text-white leading-none">
                  {new Set(students.map((s) => `${s.grade}-${s.section}`)).size}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Students List */}
        <div>
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search students..."
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
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Roll Number: {student.rollNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Class: {student.grade}-{student.section}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStudentClick(student)}
                        className="text-primary hover:bg-primary/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(student)}
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
            <h3 className="text-lg font-semibold mb-4">Class Distribution</h3>
            <div className="space-y-3">
              {Array.from(
                new Set(students.map((s) => `${s.grade}-${s.section}`))
              )
                .sort()
                .map((classSection) => {
                  const count = students.filter(
                    (s) => `${s.grade}-${s.section}` === classSection
                  ).length;
                  return (
                    <div
                      key={classSection}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        Class {classSection}
                      </span>
                      <span className="font-semibold text-primary">
                        {count} students
                      </span>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isAddingNew}
        onClose={handleClose}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 pb-8">
            <StudentForm
              onSubmit={handleSubmit}
              onCancel={handleClose}
              initialData={selectedStudent || undefined}
              submitButtonRef={(submitForm) => {
                // Store submit function in modal state
                (window as any).submitStudentForm = submitForm;
              }}
            />
          </div>
          <div className="mt-auto pt-4 flex justify-end gap-4 border-t">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                // Call the stored submit function
                (window as any).submitStudentForm?.();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Student"
      >
        <div className="mt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete {studentToDelete?.firstName}{" "}
            {studentToDelete?.lastName}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
