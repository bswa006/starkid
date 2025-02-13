import { useState, useEffect } from "react";
import { User, Search, Plus, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StudentForm } from "@/components/forms/StudentForm";
import { studentService } from "@/services/student.service";
import toast from "@/utils/toast";
import type { Student } from "@/types/school";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      toast.success('Students loaded successfully');
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    try {
      await studentService.delete(studentToDelete.id);
      setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
      toast.success('Student deleted successfully');
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.rollNumber}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsAddingNew(true);
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsAddingNew(false);
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setIsAddingNew(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Student, "id">) => {
    setIsSubmitting(true);
    try {
      if (isAddingNew) {
        const newStudent = await studentService.create(data);
        setStudents(prev => [newStudent, ...prev]);
        toast.success('Student added successfully');
      } else if (selectedStudent) {
        await studentService.update(selectedStudent.id, data);
        // Refresh the entire list to ensure we have the latest data
        const updatedStudents = await studentService.getAll();
        setStudents(updatedStudents);
        toast.success('Student updated successfully');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Students</h1>
        <Button 
          onClick={handleAddNew} 
          className="bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <Input
          icon={Search}
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 px-4 text-base shadow-sm border-slate-200 focus:border-[#6B7FE3] focus:ring-[#6B7FE3] rounded-xl"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7FE3]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <Card
                key={student.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 rounded-2xl relative overflow-hidden group"
                onClick={() => handleStudentClick(student)}
              >

                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3 mb-1">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6B7FE3]/10 text-[#6B7FE3]">
                        <User className="h-5 w-5" />
                      </span>
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="space-y-1 ml-13">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Roll No: {student.rollNumber}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Grade {student.grade}-{student.section}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Guardian Details
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        {student.parentName}
                      </p>
                      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        {student.email}
                      </p>
                      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        {student.parentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(student);
                      }}
                    >
                      Delete Student
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-slate-500 text-center py-8">
                {searchQuery
                  ? "No students found matching your search."
                  : 'No students added yet. Click "Add Student" to get started.'}
              </p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isAddingNew || selectedStudent !== null}
        onClose={handleClose}
        title={isAddingNew ? "Add New Student" : "Edit Student"}
      >
        <StudentForm
          initialData={selectedStudent || undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="mt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete {studentToDelete?.firstName} {studentToDelete?.lastName}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setStudentToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
