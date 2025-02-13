import { StudentForm } from "@/components/forms/StudentForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { studentService } from "@/services/student.service";
import type { Student } from "@/types/school";
import toast from "@/utils/toast";
import { Plus, Search, User } from "lucide-react";
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
            s.id === selectedStudent.id ? { ...s, ...data, updatedAt: new Date() } : s
          )
        );
        toast.success("Student updated successfully");
      } else {
        const newStudentData = {
          ...data,
          classId: "", // This should be set based on your application's needs
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
    <div className="container mx-auto px-4 py-6 max-w-7xl bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-heading text-text">
          Students
        </h1>
        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50" size={20} />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-text/10 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white text-text placeholder-text/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white border border-text/10 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-subheading text-text">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-caption text-text/70">
                      Roll Number: {student.rollNumber}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(student)}
                  className="text-accent hover:text-accent/90 hover:bg-accent/10 rounded-lg"
                >
                  Delete
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-body text-text/80">
                  <span className="font-medium text-text">Grade:</span> {student.grade} |{" "}
                  <span className="font-medium text-text">Section:</span>{" "}
                  {student.section}
                </p>
                <p className="text-body text-text/80">
                  <span className="font-medium text-text">Email:</span> {student.email}
                </p>
                <p className="text-body text-text/80">
                  <span className="font-medium text-text">Phone:</span> {student.phone}
                </p>
              </div>
              <Button
                onClick={() => handleStudentClick(student)}
                className="mt-4 w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors duration-200"
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddingNew}
        onClose={handleClose}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      >
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          initialData={selectedStudent || undefined}
          isSubmitting={isSubmitting}
        />
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
