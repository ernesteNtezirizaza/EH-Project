
import React from 'react';
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
  UserX 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AdminDashboard = () => {
  // Mock data - in a real app, fetch this from your API
  const stats = {
    totalUsers: 324,
    activeUsers: 298,
    totalQuizzes: 56,
    pendingReviews: 12,
    recentUsers: [
      { id: 1, name: "Emma Wilson", email: "emma@example.com", status: "active", role: "student", joinDate: "2023-08-15" },
      { id: 2, name: "James Brown", email: "james@example.com", status: "inactive", role: "student", joinDate: "2023-08-12" },
      { id: 3, name: "Sophia Lee", email: "sophia@example.com", status: "active", role: "mentor", joinDate: "2023-08-10" }
    ],
    recentQuizzes: [
      { id: 1, title: "JavaScript Fundamentals", created: "2023-08-14", status: "published", attempts: 87 },
      { id: 2, title: "CSS Flexbox", created: "2023-08-10", status: "draft", attempts: 0 },
      { id: 3, title: "React Hooks", created: "2023-08-05", status: "published", attempts: 42 }
    ],
    userQuizPerformance: [
      { category: "Excellent (90%+)", count: 118 },
      { category: "Good (70-89%)", count: 156 },
      { category: "Average (50-69%)", count: 42 },
      { category: "Poor (<50%)", count: 8 }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform and users</p>
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
              12 created this month
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground mt-2">
              187 this week
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
                        quiz.status === 'published' ? 'text-green-500' : 'text-amber-500'
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
