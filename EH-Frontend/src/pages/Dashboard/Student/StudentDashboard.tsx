
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Clock, Bell } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { userData, isAuthenticated } = useAuth();
    
  // Mock data - in a real app, fetch this from your API
  const student = {
    name: "Alex Johnson",
    progress: 65,
    completedQuizzes: 8,
    totalQuizzes: 12,
    recentQuizzes: [
      { id: 1, title: "JavaScript Fundamentals", score: 85, date: "2023-08-10" },
      { id: 2, title: "CSS Flexbox", score: 92, date: "2023-08-05" },
      { id: 3, title: "React Hooks", score: 78, date: "2023-08-01" }
    ],
    availableQuizzes: [
      { id: 4, title: "TypeScript Basics", duration: "30 mins", questions: 15 },
      { id: 5, title: "Web Accessibility", duration: "25 mins", questions: 12 },
      { id: 6, title: "GraphQL Introduction", duration: "40 mins", questions: 20 }
    ],
    notifications: [
      { id: 1, message: "Your 'JavaScript Fundamentals' quiz has been graded", time: "2 hours ago" },
      { id: 2, message: "New quiz available: 'Node.js Essentials'", time: "1 day ago" },
      { id: 3, message: "Mentor feedback on your 'CSS Flexbox' quiz", time: "3 days ago" }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Progress */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {userData?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{student.progress}%</div>
            <Progress value={student.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {student.completedQuizzes} of {student.totalQuizzes} quizzes completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on your last {student.completedQuizzes} quizzes
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h 30m</div>
            <p className="text-xs text-muted-foreground mt-2">
              This month's learning time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Quiz Results */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Recent Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.recentQuizzes.map((quiz, index) => (
                <div 
                  key={quiz.id} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div>
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{quiz.date}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-semibold ${
                      quiz.score >= 90 ? 'text-green-500' : 
                      quiz.score >= 70 ? 'text-blue-500' : 'text-amber-500'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Quizzes */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">Available Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.availableQuizzes.map((quiz, index) => (
                <div 
                  key={quiz.id} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div>
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.duration} • {quiz.questions} questions
                    </p>
                  </div>
                  <button className="bg-primary text-primary-foreground rounded-full text-xs px-3 py-1">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className="flex items-start gap-3 p-3 border-b last:border-0 dash-item-animate"
                style={{ '--delay': index } as React.CSSProperties}
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
