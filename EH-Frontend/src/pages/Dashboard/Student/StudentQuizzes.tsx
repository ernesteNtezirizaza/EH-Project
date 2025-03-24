
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const StudentQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Mock data for available quizzes
  const allQuizzes = [
    { 
      id: 1, 
      title: "JavaScript Fundamentals", 
      description: "Learn the core concepts of JavaScript programming.",
      duration: "30 mins", 
      questions: 15, 
      difficulty: "Beginner",
      status: "available",
      category: "Programming",
      updated: "2023-08-10"
    },
    { 
      id: 2, 
      title: "CSS Flexbox", 
      description: "Master flexible box layout techniques for modern web design.",
      duration: "25 mins", 
      questions: 12, 
      difficulty: "Intermediate",
      status: "available",
      category: "Web Design",
      updated: "2023-08-05"
    },
    { 
      id: 3, 
      title: "React Hooks", 
      description: "Learn how to use React Hooks to manage state and side effects.",
      duration: "40 mins", 
      questions: 20, 
      difficulty: "Advanced",
      status: "available",
      category: "Programming",
      updated: "2023-08-01"
    },
    { 
      id: 4, 
      title: "TypeScript Basics", 
      description: "Introduction to TypeScript for JavaScript developers.",
      duration: "35 mins", 
      questions: 18, 
      difficulty: "Intermediate",
      status: "completed",
      category: "Programming",
      updated: "2023-07-25",
      score: 85
    },
    { 
      id: 5, 
      title: "Web Accessibility", 
      description: "Learn how to build accessible web applications for all users.",
      duration: "25 mins", 
      questions: 12, 
      difficulty: "Intermediate",
      status: "completed",
      category: "Web Design",
      updated: "2023-07-20",
      score: 92
    },
    { 
      id: 6, 
      title: "GraphQL Introduction", 
      description: "Learn the fundamentals of GraphQL API queries and mutations.",
      duration: "45 mins", 
      questions: 22, 
      difficulty: "Advanced",
      status: "locked",
      category: "Programming",
      updated: "2023-07-15",
      prerequisite: "JavaScript Fundamentals"
    },
  ];

  // Filter quizzes based on search query and filter
  const filteredQuizzes = allQuizzes
    .filter(quiz => quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   quiz.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(quiz => {
      if (filter === 'all') return true;
      return quiz.status === filter;
    });

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Available Quizzes</h1>
        <p className="text-muted-foreground">Browse and take quizzes to improve your skills</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Quizzes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('available')}>
                Available
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('locked')}>
                Locked
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz, index) => (
          <Card 
            key={quiz.id}
            className="hover-scale card-shadow dash-item-animate overflow-hidden"
            style={{ '--delay': index % 3 } as React.CSSProperties}
          >
            <div className={`h-2 w-full ${
              quiz.status === 'available' ? 'bg-primary' : 
              quiz.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                {quiz.status === 'completed' && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    {quiz.score}%
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  {quiz.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{quiz.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{quiz.questions} questions</span>
                </div>
              </div>

              {quiz.status === 'available' && (
                <Button className="w-full">Start Quiz</Button>
              )}
              {quiz.status === 'completed' && (
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Retake Quiz
                </Button>
              )}
              {quiz.status === 'locked' && (
                <Button variant="outline" disabled className="w-full flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Complete {quiz.prerequisite} first
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No quizzes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
