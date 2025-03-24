
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { CheckCircle, Clock, BarChart, TrendingUp, CalendarDays } from 'lucide-react';

const StudentProgress = () => {
  // Mock data - in a real app, fetch this from your API
  const progressData = {
    overallProgress: 68,
    completedQuizzes: 8,
    totalQuizzes: 12,
    averageScore: 85,
    studyTime: "24h 45m",
    quizHistory: [
      { id: 1, title: "JavaScript Fundamentals", score: 85, date: "2023-08-10", status: "Completed", timeSpent: "28m" },
      { id: 2, title: "CSS Flexbox & Grid", score: 92, date: "2023-08-05", status: "Completed", timeSpent: "32m" },
      { id: 3, title: "React Hooks", score: 78, date: "2023-08-01", status: "Completed", timeSpent: "45m" },
      { id: 4, title: "TypeScript Basics", score: 88, date: "2023-07-25", status: "Completed", timeSpent: "35m" },
      { id: 5, title: "Web Accessibility", score: 90, date: "2023-07-18", status: "Completed", timeSpent: "30m" },
      { id: 6, title: "GraphQL Introduction", score: 75, date: "2023-07-10", status: "Completed", timeSpent: "42m" },
      { id: 7, title: "Node.js Fundamentals", score: 82, date: "2023-07-03", status: "Completed", timeSpent: "38m" },
      { id: 8, title: "MongoDB Basics", score: 79, date: "2023-06-28", status: "Completed", timeSpent: "40m" }
    ],
    skillProgress: [
      { skill: "JavaScript", progress: 85 },
      { skill: "CSS", progress: 92 },
      { skill: "React", progress: 78 },
      { skill: "TypeScript", progress: 70 },
      { skill: "Node.js", progress: 65 }
    ],
    studyStreak: 14
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and quiz results</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-primary" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{progressData.overallProgress}%</div>
            <Progress value={progressData.overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressData.completedQuizzes} of {progressData.totalQuizzes} quizzes completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.averageScore}%</div>
            <Progress value={progressData.averageScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {progressData.completedQuizzes} completed quizzes
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Total Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.studyTime}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Average: 3h 5m per week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.studyStreak} days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep it up! You're on a roll.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl">Skills Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.skillProgress.map((skill, index) => (
              <div key={skill.skill} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiz History */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary" />
            Quiz History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressData.quizHistory.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.date}</TableCell>
                  <TableCell>{quiz.timeSpent}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.score >= 90 ? 'bg-green-100 text-green-800' : 
                      quiz.score >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {quiz.score}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {quiz.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgress;
