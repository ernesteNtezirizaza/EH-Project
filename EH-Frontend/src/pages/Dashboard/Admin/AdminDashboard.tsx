import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  UserCheck,
  UserX,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { quizService } from '@/services/quiz.service';
import { userService } from '@/services/user.service';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQuizzes: number;
  pendingReviews: number;
  recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
    joinDate: string;
  }>;
  recentQuizzes: Array<{
    id: number;
    title: string;
    created: string;
    status: string;
    attempts: number;
  }>;
  userQuizPerformance: Array<{
    category: string;
    count: number;
  }>;
  totalAttempts: number;
  weeklyAttempts: number;
  monthlyQuizzes: number;
}

const AdminDashboard = () => {
  const { userData, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [usersData, quizzesData, attemptsData] = await Promise.all([
          userService.getUserStats(),
          quizService.getQuizStats(),
          quizService.getAttemptStats()
        ]);

        // Transform data into dashboard format
        const dashboardStats: DashboardStats = {
          totalUsers: usersData.totalUsers,
          activeUsers: usersData.activeUsers,
          totalQuizzes: quizzesData.totalQuizzes,
          pendingReviews: quizzesData.pendingReviews,
          recentUsers: usersData.recentUsers.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.isActive ? 'active' : 'inactive',
            role: user.role,
            joinDate: new Date(user.createdAt).toISOString().split('T')[0]
          })),
          recentQuizzes: quizzesData.recentQuizzes.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            created: new Date(quiz.createdAt).toISOString().split('T')[0],
            status: quiz.status,
            attempts: quiz.attempts
          })),
          userQuizPerformance: [
            { category: "Excellent (90%+)", count: attemptsData.excellentScores },
            { category: "Good (70-89%)", count: attemptsData.goodScores },
            { category: "Average (50-69%)", count: attemptsData.averageScores },
            { category: "Poor (<50%)", count: attemptsData.poorScores }
          ],
          totalAttempts: attemptsData.totalAttempts,
          weeklyAttempts: attemptsData.weeklyAttempts,
          monthlyQuizzes: quizzesData.monthlyQuizzes
        };

        setStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userData) {
      fetchDashboardData();
    }
  }, [isAuthenticated, userData, toast]);

  if (!isAuthenticated || !userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {userData?.name}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center mt-2">
              <UserCheck className="h-3 w-3 mr-1 text-green-500" />
              <p className="text-xs">
                <span className="text-green-500 font-medium">{stats.activeUsers}</span> active users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Total Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.monthlyQuizzes} created this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-primary" />
              Quiz Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.weeklyAttempts} this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Require mentor attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Recent Users</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status === 'active' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">{user.role} • {user.joinDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quizzes */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Recent Quizzes</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentQuizzes.map((quiz, index) => (
                <div 
                  key={quiz.id} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div>
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Created {quiz.created} • 
                      <span className={`ml-1 ${
                        quiz.status === 'PUBLISHED' ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        {quiz.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Quiz Performance */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            User Quiz Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stats.userQuizPerformance.map((category, index) => (
              <div key={index} className="space-y-2 dash-item-animate" style={{ '--delay': index } as React.CSSProperties}>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm font-medium">{category.count} users</span>
                </div>
                <Progress 
                  value={(category.count / stats.totalUsers) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;