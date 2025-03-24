
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import Register from "./pages/Register";
import UserVerificationPage from "./pages/UserVerificationPage";
import { AuthProvider } from './contexts/AuthContext';

// Dashboard Layout
import DashboardLayout from "./components/Dashboard/DashboardLayout";

// Student Dashboard Pages
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import StudentQuizzes from "./pages/Dashboard/Student/StudentQuizzes";
import StudentProgress from "./pages/Dashboard/Student/StudentProgress";

// Admin Dashboard Pages
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import AdminQuizManagement from "./pages/Dashboard/Admin/AdminQuizManagement";
import UserManagement from "./pages/Dashboard/Admin/UserManagement";

// Mentor Dashboard Pages
import MentorDashboard from "./pages/Dashboard/Mentor/MentorDashboard";
import MentorSubmissions from "./pages/Dashboard/Mentor/MentorSubmissions";

// Common Dashboard Pages
import ProfilePage from "./pages/Dashboard/Common/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-user/:token" element={<UserVerificationPage />} />

          {/* Student Dashboard Routes */}
          <Route path="/dashboard/student" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="quizzes" element={<StudentQuizzes />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="notifications" element={<div>Student Notifications Page</div>} />
            <Route path="profile" element={<ProfilePage role="student" />} />
          </Route>
          
          {/* Admin Dashboard Routes */}
          <Route path="/dashboard/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="quizzes" element={<AdminQuizManagement />} />
            <Route path="progress" element={<div>User Progress Tracking Page</div>} />
            <Route path="notifications" element={<div>Admin Notifications Page</div>} />
            <Route path="profile" element={<ProfilePage role="admin" />} />
          </Route>
          
          {/* Mentor Dashboard Routes */}
          <Route path="/dashboard/mentor" element={<DashboardLayout role="mentor" />}>
            <Route index element={<MentorDashboard />} />
            <Route path="progress" element={<div>Student Progress Overview Page</div>} />
            <Route path="submissions" element={<MentorSubmissions />} />
            <Route path="support" element={<div>Student Support Page</div>} />
            <Route path="notifications" element={<div>Mentor Notifications Page</div>} />
            <Route path="profile" element={<ProfilePage role="mentor" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </AuthProvider>
);

export default App;
