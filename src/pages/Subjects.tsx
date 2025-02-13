import { SubjectForm } from "@/components/forms/SubjectForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  addSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/services/subject.service";
import type { Subject } from "@/types/school";
import toast from "@/utils/toast";
import { BookOpen, Clock, Plus, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

const teachers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error loading subjects:", error);
        toast.error("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    `${subject.name} ${subject.code} ${subject.teacherNames.join(", ")} ${
      subject.grade
    }`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedSubject(null);
    setIsAddingNew(true);
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsAddingNew(false);
  };

  const handleClose = () => {
    setSelectedSubject(null);
    setIsAddingNew(false);
  };

  const handleSubmit = async (data: Omit<Subject, "id" | "status">) => {
    setIsSubmitting(true);
    try {
      const selectedTeachers = teachers.filter((t) =>
        data.teacherIds.includes(t.id)
      );
      if (selectedTeachers.length === 0) {
        toast.error("No selected teachers found");
        return;
      }

      const subjectData: Omit<Subject, "id"> = {
        ...data,
        teacherNames: selectedTeachers.map((t) => t.name),
        status: "active" as const,
      };

      if (isAddingNew) {
        const newSubject = await addSubject(subjectData);
        setSubjects([...subjects, newSubject]);
        toast.success("Subject added successfully");
      } else if (selectedSubject) {
        await updateSubject(selectedSubject.id, subjectData);
        // Refresh the list to ensure we have the latest data
        const updatedSubjects = await getSubjects();
        setSubjects(updatedSubjects);
        toast.success("Subject updated successfully");
      }
      handleClose();
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error("Failed to save subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    try {
      await deleteSubject(subjectToDelete.id);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectToDelete.id));
      toast.success("Subject deleted successfully");
      setSubjectToDelete(null);
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Subjects
        </h1>
        <Button
          onClick={handleAddNew}
          className="bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white flex items-center gap-2 px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <Input
          icon={Search}
          type="text"
          placeholder="Search subjects..."
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
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <Card
                key={subject.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-800 rounded-2xl relative overflow-hidden group"
                onClick={() => handleSubjectClick(subject)}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3 mb-1">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6B7FE3]/10 text-[#6B7FE3]">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      {subject.name}
                    </h3>
                    <div className="space-y-1 ml-13">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Code: {subject.code}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Grade {subject.grade}-{subject.class}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Teachers
                    </h4>
                    <div className="space-y-2">
                      {subject.teacherNames.map((teacher, index) => (
                        <p
                          key={index}
                          className="text-sm flex items-center text-slate-600 dark:text-slate-400"
                        >
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          {teacher}
                        </p>
                      ))}
                      <p className="text-sm flex items-center text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        {subject.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#6B7FE3]/10 text-[#6B7FE3]">
                        {subject.credits} Credits
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {subject.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {subject.description}
                    </p>
                    <Button
                      variant="danger"
                      className="w-full text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(subject);
                      }}
                    >
                      Delete Subject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-slate-500 text-center py-8">
                {searchQuery
                  ? "No subjects found matching your search."
                  : 'No subjects added yet. Click "Add Subject" to get started.'}
              </p>
            </div>
          )}
        </div>
      )}

      <Modal
        open={isAddingNew || selectedSubject !== null}
        onClose={handleClose}
        title={isAddingNew ? "Add New Subject" : "Edit Subject"}
        maxWidth="xl"
      >
        <div className="p-6">
          <SubjectForm
            initialData={selectedSubject || undefined}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            teachers={teachers}
            isSubmitting={isSubmitting}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={subjectToDelete !== null}
        onClose={() => setSubjectToDelete(null)}
        title="Delete Subject"
      >
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Are you sure you want to delete the subject "{subjectToDelete?.name}
            "? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => setSubjectToDelete(null)}
              className="px-6 h-11 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="px-6 h-11 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete Subject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={subjectToDelete !== null}
        onClose={() => setSubjectToDelete(null)}
        title="Delete Subject"
      >
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Are you sure you want to delete the subject "{subjectToDelete?.name}
            "? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => setSubjectToDelete(null)}
              className="px-6 h-11 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="px-6 h-11 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete Subject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
