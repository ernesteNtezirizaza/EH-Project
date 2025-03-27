import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import Register from "./pages/Register";
import UserVerificationPage from "./pages/UserVerificationPage";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, RedirectIfAuthenticated } from './components/ProtectedRoute';

// Dashboard Layout
import DashboardLayout from "./components/Dashboard/DashboardLayout";

// Student Dashboard Pages
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import StudentQuizzes from "./pages/Dashboard/Student/StudentQuizzes";

// Admin Dashboard Pages
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import AdminQuizManagement from "./pages/Dashboard/Admin/AdminQuizManagement";
import UserManagement from "./pages/Dashboard/Admin/UserManagement";

// Mentor Dashboard Pages
import MentorDashboard from "./pages/Dashboard/Mentor/MentorDashboard";
import MentorSubmissions from "./pages/Dashboard/Mentor/MentorSubmissions";

// Common Dashboard Pages
import ProfilePage from "./pages/Dashboard/Common/ProfilePage";
import RoleManagement from "./pages/Dashboard/Admin/RoleManagement";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-user/:token" element={<UserVerificationPage />} />
            </Route>

            {/* Protected Student Dashboard Routes */}
            <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout role="student" />}>
                <Route index element={<StudentDashboard />} />
                <Route path="quizzes" element={<StudentQuizzes />} />
                <Route path="notifications" element={<div>Student Notifications Page</div>} />
                <Route path="profile" element={<ProfilePage role="student" />} />
              </Route>
            </Route>
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout role="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="quizzes" element={<AdminQuizManagement />} />
                <Route path="profile" element={<ProfilePage role="admin" />} />
              </Route>
            </Route>
            
            {/* Protected Mentor Dashboard Routes */}
            <Route path="/dashboard/mentor" element={<ProtectedRoute allowedRoles={['mentor']} />}>
              <Route element={<DashboardLayout role="mentor" />}>
                <Route index element={<MentorDashboard />} />
                <Route path="progress" element={<div>Student Progress Overview Page</div>} />
                <Route path="submissions" element={<MentorSubmissions />} />
                <Route path="support" element={<div>Student Support Page</div>} />
                <Route path="notifications" element={<div>Mentor Notifications Page</div>} />
                <Route path="profile" element={<ProfilePage role="mentor" />} />
              </Route>
            </Route>

            {/* Root dashboard route that redirects based on role */}
            <Route 
              path="/dashboard" 
              element={
                <AuthRoute>
                  {({ userData }) => {
                    const role = userData?.role?.toLowerCase() || '';
                    if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
                    if (role === 'student') return <Navigate to="/dashboard/student" replace />;
                    if (role === 'mentor') return <Navigate to="/dashboard/mentor" replace />;
                    return <Navigate to="/login" replace />;
                  }}
                </AuthRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

// Helper component to render content based on auth state
interface AuthRouteProps {
  children: ({ userData }: { userData: any }) => React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated, userData } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children({ userData })}</>;
};

export default App;