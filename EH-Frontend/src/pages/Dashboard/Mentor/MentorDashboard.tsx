
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
  MessageSquare,
  User,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from "@/contexts/AuthContext";

const MentorDashboard = () => {
  const { userData, isAuthenticated } = useAuth();
  // Mock data - in a real app, fetch this from your API
  const data = {
    totalStudents: 1,
    pendingReviews: 1,
    messagesReceived: 24,
    averageReviewTime: "1.5 days",
    students: [
      { 
        id: 1, 
        name: "Emma Wilson", 
        email: "emma@example.com", 
        progress: 85, 
        lastActivity: "2 hours ago",
        pendingQuizzes: 1
      },
      { 
        id: 2, 
        name: "James Brown", 
        email: "james@example.com", 
        progress: 62, 
        lastActivity: "1 day ago",
        pendingQuizzes: 0
      },
      { 
        id: 3, 
        name: "Sophia Lee", 
        email: "sophia@example.com", 
        progress: 93, 
        lastActivity: "5 hours ago",
        pendingQuizzes: 2
      }
    ],
    pendingSubmissions: [
      { 
        id: 1, 
        studentName: "Emma Wilson", 
        quizTitle: "JavaScript Fundamentals", 
        submitted: "2023-08-15"
      },
      { 
        id: 2, 
        studentName: "Sophia Lee", 
        quizTitle: "CSS Flexbox", 
        submitted: "2023-08-14"
      },
      { 
        id: 3, 
        studentName: "Sophia Lee", 
        quizTitle: "React Hooks", 
        submitted: "2023-08-14"
      }
    ],
    recentMessages: [
      {
        id: 1,
        studentName: "James Brown",
        message: "Could you provide more resources on TypeScript interfaces?",
        time: "2 hours ago"
      },
      {
        id: 2,
        studentName: "Emma Wilson",
        message: "Thank you for the detailed feedback on my quiz!",
        time: "1 day ago"
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {userData?.name}</h1>
        <p className="text-muted-foreground">Monitor student progress and provide feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Assigned to you
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingReviews}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Quiz submissions to review
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.messagesReceived}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Student inquiries this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Average Review Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageReviewTime}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Time to review submissions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Progress */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Student Progress</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.students.map((student, index) => (
                <div 
                  key={student.id} 
                  className="space-y-2 p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-xs text-muted-foreground">Last active: {student.lastActivity}</p>
                      </div>
                    </div>
                    {student.pendingQuizzes > 0 && (
                      <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                        {student.pendingQuizzes} pending
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Quiz Submissions */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.pendingSubmissions.map((submission, index) => (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                  style={{ '--delay': index } as React.CSSProperties}
                >
                  <div>
                    <h3 className="font-medium">{submission.quizTitle}</h3>
                    <p className="text-xs text-muted-foreground">
                      By: {submission.studentName} • Submitted: {submission.submitted}
                    </p>
                  </div>
                  <Button size="sm">Grade</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Recent Messages</CardTitle>
          <Button variant="outline" size="sm">All Messages</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentMessages.map((message, index) => (
              <div 
                key={message.id} 
                className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg dash-item-animate"
                style={{ '--delay': index } as React.CSSProperties}
              >
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{message.studentName}</h3>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDashboard;
