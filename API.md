# StarKid API Documentation

## Table of Contents
1. [Authentication API](#authentication-api)
2. [Class Management API](#class-management-api)
3. [Student Management API](#student-management-api)
4. [Attendance API](#attendance-api)
5. [Assignment API](#assignment-api)
6. [Teacher API](#teacher-api)
7. [Subject API](#subject-api)
8. [Parent API](#parent-api)
9. [Quiz API](#quiz-api)
10. [Timeline API](#timeline-api)

## Authentication API

Service for managing user authentication and profiles.

### Types

\`\`\`typescript
interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserRole = 'admin' | 'teacher';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}
\`\`\`

### Methods

#### Sign In
\`\`\`typescript
async signIn(email: string, password: string): Promise<{ user: User; profile: UserProfile }>
\`\`\`
Authenticates a user and returns their Firebase user object and profile.

**Parameters:**
- email: User's email address
- password: User's password

**Returns:**
- user: Firebase User object
- profile: User's profile data

**Errors:**
- FirebaseAuthError: Invalid credentials
- FirebaseError: Database connection issues

#### Register
\`\`\`typescript
async register(data: RegisterData): Promise<UserProfile>
\`\`\`
Creates a new user account and profile.

**Parameters:**
- data: User registration data including email, password, name, and role

**Returns:**
- Created user profile

**Errors:**
- FirebaseAuthError: Email already in use
- ValidationError: Invalid data format

#### Reset Password
\`\`\`typescript
async resetPassword(email: string): Promise<void>
\`\`\`
Sends a password reset email to the user.

**Parameters:**
- email: User's email address

**Errors:**
- FirebaseAuthError: Invalid email
- FirebaseError: Email sending failed

## Class Management API

Service for managing school classes.

### Types

\`\`\`typescript
interface Class {
  id: string;
  grade: string;
  section: string;
  teacherId: string;
  academicYear: string;
  subjects: string[];
  schedule: ClassSchedule[];
  maxStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
}
\`\`\`

### Methods

#### Get All Classes
\`\`\`typescript
async getAll(): Promise<Class[]>
\`\`\`
Retrieves all classes, ordered by grade and section.

**Returns:**
- Array of Class objects

**Errors:**
- FirebaseError: Database connection issues

#### Get Class by ID
\`\`\`typescript
async getById(id: string): Promise<Class | null>
\`\`\`
Retrieves a specific class by its ID.

**Parameters:**
- id: Class ID

**Returns:**
- Class object if found, null otherwise

#### Create Class
\`\`\`typescript
async create(classData: Omit<Class, "id" | "createdAt" | "updatedAt">): Promise<Class>
\`\`\`
Creates a new class.

**Parameters:**
- classData: Class data without ID and timestamps

**Returns:**
- Created Class object

**Errors:**
- ValidationError: Invalid class data
- FirebaseError: Database write failed

#### Update Class
\`\`\`typescript
async update(id: string, data: Partial<Omit<Class, "id">>): Promise<void>
\`\`\`
Updates an existing class.

**Parameters:**
- id: Class ID
- data: Partial class data to update

**Errors:**
- NotFoundError: Class not found
- ValidationError: Invalid update data

#### Delete Class
\`\`\`typescript
async delete(id: string): Promise<void>
\`\`\`
Deletes a class.

**Parameters:**
- id: Class ID

**Errors:**
- NotFoundError: Class not found
- ValidationError: Class has active students

#### Get Classes by Teacher
\`\`\`typescript
async getByTeacher(teacherId: string): Promise<Class[]>
\`\`\`
Retrieves all classes assigned to a specific teacher.

**Parameters:**
- teacherId: Teacher's user ID

**Returns:**
- Array of Class objects

## Student Management API

Service for managing student records.

### Types

\`\`\`typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  classId: string;
  rollNumber: string;
  parentId: string;
  address: Address;
  contactInfo: ContactInfo;
  academicInfo: AcademicInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface AcademicInfo {
  admissionDate: Date;
  previousSchool?: string;
  academicYear: string;
  achievements?: string[];
}
\`\`\`

## Attendance API

Service for managing student attendance.

### Types

\`\`\`typescript
interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AttendanceReport {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}
\`\`\`

## Assignment API

Service for managing assignments and submissions.

### Types

\`\`\`typescript
interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: Date;
  points: number;
  attachments: Attachment[];
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  attachments: Attachment[];
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'late' | 'graded';
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}
\`\`\`

## Error Handling

All API methods may throw the following errors:

### Firebase Errors
\`\`\`typescript
interface FirebaseError {
  code: string;
  message: string;
  details?: any;
}
\`\`\`

Common error codes:
- \`permission-denied\`: User doesn't have required permissions
- \`not-found\`: Requested resource doesn't exist
- \`already-exists\`: Resource already exists
- \`invalid-argument\`: Invalid input data
- \`unauthenticated\`: User is not authenticated

### Application Errors
\`\`\`typescript
interface ValidationError {
  field: string;
  message: string;
}

interface NotFoundError {
  resource: string;
  id: string;
}

interface BusinessError {
  code: string;
  message: string;
  details?: any;
}
\`\`\`

## API Best Practices

1. **Error Handling**
   - Always catch and handle errors appropriately
   - Use type-safe error handling with TypeScript
   - Return meaningful error messages

2. **Data Validation**
   - Validate input data using Zod schemas
   - Sanitize user input
   - Check for required fields

3. **Performance**
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Optimize queries with proper indexes

4. **Security**
   - Always check user permissions
   - Validate user session
   - Sanitize file uploads

5. **Testing**
   - Write unit tests for each API method
   - Test error cases
   - Mock Firebase services in tests

## Rate Limiting

The Firebase backend implements the following rate limits:

- Read operations: 50,000/day (free tier)
- Write operations: 20,000/day (free tier)
- Delete operations: 20,000/day (free tier)
- Storage: 5GB (free tier)

## Offline Support

The API supports offline data persistence through Firebase:

1. **Caching**
   - Firestore cache size: 100MB
   - Persistence enabled by default
   - Automatic conflict resolution

2. **Sync**
   - Automatic background sync
   - Queue offline writes
   - Handle sync conflicts

## API Versioning

The API version is managed through the Firebase Rules version:

- Current version: v1
- Deprecation policy: 6 months notice
- Breaking changes require version bump

## Security Rules

Example Firestore security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Classes
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Students
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher');
    }
  }
}
\`\`\`

## API Examples

### Authentication Example

\`\`\`typescript
// Sign in
try {
  const { user, profile } = await authService.signIn('teacher@school.com', 'password123');
  console.log('Signed in as:', profile.firstName);
} catch (error) {
  if (error.code === 'auth/wrong-password') {
    console.error('Invalid password');
  }
}

// Create new class
try {
  const newClass = await classService.create({
    grade: '10',
    section: 'A',
    teacherId: 'teacher123',
    academicYear: '2025-2026',
    subjects: ['MATH101', 'PHY101'],
    maxStudents: 30
  });
  console.log('Created class:', newClass.id);
} catch (error) {
  console.error('Failed to create class:', error);
}
\`\`\`

## Webhooks

Future implementation planned for webhooks to handle:
- Student enrollment notifications
- Assignment submissions
- Attendance updates
- Grade changes

## API Monitoring

Metrics tracked:
- Request success rate
- Response times
- Error rates
- Active users
- Database operations

## Support

For API support:
- Documentation: /docs
- Issues: GitHub repository
- Email: support@starkid.com
