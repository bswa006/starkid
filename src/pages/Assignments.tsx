import { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  User,
  Calendar,
  Award,
} from "lucide-react";
import { DetailView } from "@/components/shared/DetailView";
import { AssignmentForm } from "@/components/forms/AssignmentForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Assignment, Subject, Teacher } from "@/types/school";

const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH101",
    description: "Basic Mathematics",
    class: "10",
    credits: 4,
    status: "active",
    teacherId: "1",
    teacherName: "John Doe",
    grade: "A",
    schedule: "Mon/Wed 10:00-11:30",
  },
  {
    id: "2",
    name: "Science",
    code: "SCI101",
    description: "General Science",
    class: "10",
    credits: 4,
    status: "active",
    teacherId: "2",
    teacherName: "Jane Smith",
    grade: "A",
    schedule: "Tue/Thu 11:00-12:30",
  },
];

const mockTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    subjects: ["1"],
    qualifications: ["B.Ed", "M.Ed"],
    department: "Science",
    classes: ["10"],
    joinDate: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "0987654321",
    subjects: ["2"],
    qualifications: ["B.Ed", "M.A."],
    department: "English",
    classes: ["9"],
    joinDate: "2024-01-15",
    status: "active",
  },
];

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Algebra Basics",
    description: "Complete exercises 1-10 from Chapter 3",
    subjectId: "1",
    teacherId: "1",
    dueDate: "2024-02-20",
    points: 100,
    status: "published",
    createdAt: "2024-02-13",
    class: "10",
    section: "A",
  },
  {
    id: "2",
    title: "Science Project",
    description: "Research and present on renewable energy sources",
    subjectId: "2",
    teacherId: "2",
    dueDate: "2024-02-25",
    points: 150,
    status: "draft",
    createdAt: "2024-02-13",
    class: "10",
    section: "A",
  },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNew = () => {
    setSelectedAssignment(null);
    setIsAddingNew(true);
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsAddingNew(false);
  };

  const handleClose = () => {
    setSelectedAssignment(null);
    setIsAddingNew(false);
  };

  const handleSubmit = (
    data: Omit<Assignment, "id" | "status" | "createdAt">
  ) => {
    if (isAddingNew) {
      const newAssignment: Assignment = {
        ...data,
        id: crypto.randomUUID(),
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      setAssignments([...assignments, newAssignment]);
    } else if (selectedAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === selectedAssignment.id ? { ...a, ...data } : a
        )
      );
    }
    handleClose();
  };

  const getSubjectName = (subjectId: string) => {
    return (
      mockSubjects.find((s) => s.id === subjectId)?.name || "Unknown Subject"
    );
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    return teacher
      ? `${teacher.firstName} ${teacher.lastName}`
      : "Unknown Teacher";
  };

  const getStatusBadgeClass = (status: Assignment["status"]) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSubjectName(assignment.subjectId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      getTeacherName(assignment.teacherId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ClipboardList className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-semibold">Assignments</h1>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-5 w-5 mr-1" />
          Create Assignment
        </Button>
      </div>

      {(selectedAssignment || isAddingNew) && (
        <DetailView
          title={isAddingNew ? "Create Assignment" : "Edit Assignment"}
          onClose={handleClose}
        >
          <AssignmentForm
            onSubmit={handleSubmit}
            subjects={mockSubjects}
            teachers={mockTeachers}
            initialData={selectedAssignment || undefined}
          />
        </DetailView>
      )}

      {/* Search and Filter Bar */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            icon={Search}
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="h-5 w-5 mr-1" />
          Filter
        </Button>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAssignmentClick(assignment)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getSubjectName(assignment.subjectId)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {assignment.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {getTeacherName(assignment.teacherId)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      Points: {assignment.points}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      Class {assignment.class}-{assignment.section}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    assignment.status
                  )}`}
                >
                  {assignment.status.charAt(0).toUpperCase() +
                    assignment.status.slice(1)}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-gray-500 text-center py-8">
              {searchQuery
                ? "No assignments found matching your search."
                : 'No assignments added yet. Click "Create Assignment" to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
