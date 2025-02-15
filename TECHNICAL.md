# StarKid - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Components](#components)
6. [State Management](#state-management)
7. [Authentication & Authorization](#authentication--authorization)
8. [Data Models](#data-models)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Development Guidelines](#development-guidelines)
12. [Performance Considerations](#performance-considerations)

## Project Overview

StarKid is a comprehensive school management system designed to streamline educational institution operations. The application provides features for managing students, classes, attendance, assignments, and administrative tasks.

### Key Features
- Role-based access control (Admin/Teacher)
- Student management
- Class organization
- Attendance tracking
- Assignment management
- Real-time updates
- Offline capabilities

## Technology Stack

### Frontend
- **Framework**: React 19.0.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - TailwindCSS for utility-first styling
  - Radix UI for accessible components
  - Class Variance Authority for component variants
- **Form Handling**: 
  - React Hook Form
  - Zod for schema validation
- **Routing**: React Router DOM v7
- **State Management**: 
  - React Context for global state
  - Redux Toolkit for complex state
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend
- **Platform**: Firebase
- **Services**:
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage
  - Firebase Functions (planned)
- **Offline Support**: Firestore persistence

### Testing
- **Framework**: Playwright
- **Pattern**: Page Object Model
- **Coverage**: E2E and Integration tests

## Project Structure

\`\`\`
starkid/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── attendance/      # Attendance related components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard widgets and cards
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   ├── navigation/    # Navigation components
│   │   ├── shared/        # Shared utility components
│   │   ├── students/      # Student management components
│   │   └── ui/           # Base UI components
│   ├── config/            # Configuration files
│   ├── contexts/          # React contexts
│   ├── features/          # Redux slices
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utility libraries
│   ├── pages/            # Route components
│   ├── services/         # API and service layer
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── tests/                # Test files
│   ├── pages/           # Page object models
│   ├── setup/           # Test configuration
│   ├── specs/           # Test specifications
│   └── utils/           # Test utilities
└── public/              # Static assets
\`\`\`

## Architecture

### Component Architecture

#### 1. UI Components (src/components/ui)
Base components following atomic design principles:
- Atoms: Button, Input, Select, etc.
- Molecules: Forms, Cards, Modals
- Organisms: Navigation, DataList, etc.

Example Button component:
\`\`\`typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        props.className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
\`\`\`

#### 2. Feature Components
Organized by domain:
- Dashboard components
- Student management
- Attendance tracking
- Assignment management

#### 3. Layout Components
Handle page structure:
- MainLayout
- Navigation
- Sidebar

### Data Flow

1. **Service Layer**
   - API calls to Firebase
   - Data transformation
   - Error handling

2. **State Management**
   - Context for global state
   - Local state for component-specific data
   - Redux for complex state interactions

3. **Component Communication**
   - Props for parent-child
   - Context for global data
   - Custom events for cross-component

## Components

### UI Components

#### Base Components
- Button
- Input
- Select
- Modal
- Card
- Badge
- Avatar
- Progress

#### Form Components
- Form validation with Zod
- Error handling
- Async submission
- File uploads

#### Data Display
- Tables
- Lists
- Cards
- Charts

### Page Components

#### Dashboard
- Statistics overview
- Recent activities
- Quick actions
- Performance metrics

#### Student Management
- Student listing
- Profile management
- Academic records
- Parent information

#### Class Management
- Class creation
- Student assignment
- Schedule management
- Attendance tracking

## State Management

### Authentication Context
\`\`\`typescript
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
\`\`\`

### Data Models

#### User Profile
\`\`\`typescript
interface UserProfile {
  id: string;
  role: 'admin' | 'teacher';
  name: string;
  email: string;
  department?: string;
  subjects?: string[];
}
\`\`\`

#### Student
\`\`\`typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  grade: string;
  section: string;
  parentInfo: {
    name: string;
    contact: string;
    email: string;
  };
}
\`\`\`

## Testing

### E2E Tests
Using Playwright with Page Object Model:

\`\`\`typescript
test.describe('Authentication', () => {
  test('should login successfully', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
\`\`\`

### Page Objects
\`\`\`typescript
class LoginPage {
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
\`\`\`

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful comments
- Use descriptive variable names

### Component Guidelines
1. Keep components focused and single-responsibility
2. Use TypeScript interfaces for props
3. Implement error boundaries
4. Use React.memo for optimization
5. Follow accessibility guidelines

### State Management Rules
1. Use local state for UI-only state
2. Use context for shared state
3. Implement proper error handling
4. Handle loading states
5. Use proper TypeScript types

### Testing Requirements
1. Write tests for critical paths
2. Use meaningful test descriptions
3. Implement proper test cleanup
4. Mock external dependencies
5. Test error scenarios

## Performance Considerations

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports for large libraries

### Caching Strategy
- Firebase offline persistence
- Browser storage utilization
- State persistence where needed

### Optimization Techniques
1. Image optimization
2. Code minification
3. Tree shaking
4. Lazy loading
5. Memoization

## Security

### Authentication
- Firebase Authentication
- Protected routes
- Role-based access
- Session management

### Data Security
- Firestore security rules
- Input validation
- XSS prevention
- CSRF protection

## Deployment

### Build Process
\`\`\`bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Run tests
npm run test
\`\`\`

### Environment Variables
Required environment variables:
\`\`\`
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
\`\`\`

## Maintenance

### Updating Dependencies
- Regular security updates
- Compatibility checking
- Breaking changes review
- Update documentation

### Monitoring
- Error tracking
- Performance monitoring
- Usage analytics
- User feedback

### Backup Strategy
- Database backups
- Code repository
- Configuration backups
- User data protection

## Future Considerations

### Planned Features
1. Real-time notifications
2. Advanced reporting
3. Mobile application
4. Offline support
5. Multi-language support

### Technical Debt
1. Test coverage improvement
2. Performance optimization
3. Accessibility compliance
4. Documentation updates
5. Code refactoring

### Scalability
1. Database optimization
2. Caching improvements
3. Load balancing
4. API rate limiting
5. Resource optimization

## Contributing

### Getting Started
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run development server

### Pull Request Process
1. Branch naming convention
2. Code review requirements
3. Testing requirements
4. Documentation updates
5. Changelog updates

This documentation serves as a comprehensive guide for developers working on the StarKid project. It should be updated regularly as the project evolves.
