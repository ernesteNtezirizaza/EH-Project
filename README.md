# Student Learning Platform

A comprehensive web application for managing student learning, progress tracking, and user management.

## Overview

This platform provides a robust solution for educational institutions to manage their students, track learning progress, and administer user accounts. It features a responsive dashboard interface with different access levels for students, instructors, and administrators.

## Features

- **Dashboard**: Overview of key metrics and recent activities
- **Student Progress Tracking**: Visualize and monitor learning progress with charts and detailed history
- **User Management**: Administrative tools for creating, editing, and managing user accounts
- **Quiz History**: Track student performance on assessments
- **Responsive Design**: Works on desktop and mobile devices
- **Role-based Access Control**: Different views and permissions for students, instructors, and administrators

## Tech Stack

- **Frontend**: React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/student-learning-platform.git
   cd student-learning-platform
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── layouts/        # Page layout components
├── lib/            # Utility functions and constants
├── pages/          # Page components
│   ├── Dashboard/  # Dashboard views
│   │   ├── Admin/  # Admin-specific pages
│   │   ├── Student/# Student-specific pages
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
```

## Usage

### Dashboard

The dashboard provides an overview of important metrics and recent activities. It adapts its display based on the user's role:

- **Students**: See their learning progress, upcoming assessments, and recent quiz results
- **Instructors**: View class performance metrics and student activity
- **Administrators**: Access system-wide statistics and management tools

### Student Progress

This page displays detailed learning metrics including:

- Progress charts across different subjects
- Quiz performance history
- Learning time analytics
- Achievement tracking

### User Management

Administrative interface for managing user accounts:

- Create new users with role-based permissions
- Edit existing user information
- Deactivate/reactivate user accounts
- Filter and search user database
- Bulk actions for efficient management

## Deployment

To build the application for production:

```
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to your preferred hosting platform.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
