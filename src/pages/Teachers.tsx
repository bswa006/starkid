import { useState, useEffect } from "react";
import { User, Search, Plus, Mail, Phone, BookOpen, GraduationCap, Building } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { teacherService } from "@/services/teacher.service";
import type { Teacher } from "@/types/school";
import toast from "@/utils/toast";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAll();
      setTeachers(data);
      toast.success('Teachers loaded successfully');
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast.error('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    
    try {
      await teacherService.delete(teacherToDelete.id);
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      toast.success('Teacher deleted successfully');
      setTeacherToDelete(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  const handleSubmit = async (data: Omit<Teacher, "id">) => {
    setIsSubmitting(true);
    try {
      if (isAddingNew) {
        const newTeacher = await teacherService.create(data);
        setTeachers(prev => [newTeacher, ...prev]);
        toast.success('Teacher added successfully');
      } else if (selectedTeacher) {
        await teacherService.update(selectedTeacher.id, data);
        // Refresh the entire list to ensure we have the latest data
        const updatedTeachers = await teacherService.getAll();
        setTeachers(updatedTeachers);
        toast.success('Teacher updated successfully');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error('Failed to save teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      teacher.firstName.toLowerCase().includes(searchTerm) ||
      teacher.lastName.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm) ||
      teacher.department.toLowerCase().includes(searchTerm) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm))
    );
  });

  const handleAddNew = () => {
    setSelectedTeacher(null);
    setIsAddingNew(true);
  };

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsAddingNew(false);
  };

  const handleClose = () => {
    setSelectedTeacher(null);
    setIsAddingNew(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Teachers</h1>
        <Button 
          onClick={handleAddNew} 
          className="bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <Input
          icon={Search}
          type="text"
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 px-4 text-base shadow-sm border-slate-200 focus:border-[#6B7FE3] focus:ring-[#6B7FE3] rounded-xl"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7FE3]"></div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="col-span-full">
          <p className="text-slate-500 text-center py-8">
            {searchQuery
              ? "No teachers found matching your search."
              : 'No teachers added yet. Click "Add Teacher" to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 rounded-2xl relative overflow-hidden group"
              onClick={() => handleTeacherClick(teacher)}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3 mb-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6B7FE3]/10 text-[#6B7FE3]">
                      <User className="h-5 w-5" />
                    </span>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div className="space-y-1 ml-13">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {teacher.department}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {teacher.subjects.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                    <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                      <GraduationCap className="h-4 w-4 mr-2 text-slate-400" />
                      {teacher.qualifications.join(", ")}
                    </p>
                    <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      {teacher.email}
                    </p>
                    <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      {teacher.phone}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(teacher);
                    }}
                  >
                    Delete Teacher
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddingNew || selectedTeacher !== null}
        onClose={handleClose}
        title={isAddingNew ? "Add New Teacher" : "Edit Teacher"}
      >
        <TeacherForm
          initialData={selectedTeacher || undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="mt-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to delete {teacherToDelete?.firstName} {teacherToDelete?.lastName}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setTeacherToDelete(null)}
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
