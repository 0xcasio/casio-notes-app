# Team Task Manager

A collaborative task manager application that allows users to manage personal tasks and view team tasks in a shared environment.

## Requirements

### Functional Requirements
- User authentication and authorization
- Profile management
- Task CRUD operations (Create, Read, Update, Delete)
- Team task visibility
- Responsive design for multiple devices

### User Requirements
- Users can register and log in securely
- Users can update their profile information
- Users can create, view, update, and delete their own tasks
- Users can view tasks created by team members
- Users can filter and sort tasks

## Tech Stack

- **Frontend**: Next.js (React framework)
- **UI Components**: shadcn/ui
- **Backend/Database**: Supabase
  - PostgreSQL database
  - Authentication services
  - Realtime subscriptions for task updates
- **Styling**: Tailwind CSS
- **State Management**: React Context API and/or SWR for data fetching
- **Deployment**: Vercel (for Next.js frontend)

## Milestones

### Milestone 1: Profile Management
- Set up Next.js project structure
- Implement Supabase authentication
- Create login and signup pages
- Develop user profile page
- Enable profile update functionality

### Milestone 2: Personal Task View
- Design and implement user dashboard
- Create personal task list view
- Implement task status indicators
- Add sorting and filtering options
- Set up data fetching from Supabase

### Milestone 3: Task CRUD Operations
- Implement "Create Task" functionality
- Build task detail view
- Develop task edit interface
- Create task deletion with confirmation
- Add task status toggle feature

### Milestone 4: Team Task Feed
- Design team feed interface
- Implement team member task visibility
- Create activity feed for recent team tasks
- Add team filtering options
- Implement real-time updates for team activities
