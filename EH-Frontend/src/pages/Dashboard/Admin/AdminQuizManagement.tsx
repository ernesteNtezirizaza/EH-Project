
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Copy,
  X,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminQuizManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  
  // Mock data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the core concepts of JavaScript programming.",
      createdDate: "2023-08-10",
      status: "published",
      questions: 15,
      attempts: 87,
      avgScore: 76,
      category: "Programming"
    },
    {
      id: 2,
      title: "CSS Flexbox",
      description: "Master flexible box layout techniques for modern web design.",
      createdDate: "2023-08-05",
      status: "draft",
      questions: 12,
      attempts: 0,
      avgScore: 0,
      category: "Web Design"
    },
    {
      id: 3,
      title: "React Hooks",
      description: "Learn how to use React Hooks to manage state and side effects.",
      createdDate: "2023-08-01",
      status: "published",
      questions: 20,
      attempts: 42,
      avgScore: 82,
      category: "Programming"
    },
    {
      id: 4,
      title: "TypeScript Basics",
      description: "Introduction to TypeScript for JavaScript developers.",
      createdDate: "2023-07-25",
      status: "published",
      questions: 18,
      attempts: 35,
      avgScore: 70,
      category: "Programming" 
    },
  ];
  
  // Filter quizzes based on search query and status filter
  const filteredQuizzes = quizzes
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(quiz => statusFilter === 'all' ? true : quiz.status === statusFilter);

  // Sample quiz questions for the selected quiz
  const quizQuestions = [
    {
      id: 1,
      question: "What is JavaScript primarily used for?",
      options: [
        "Styling web pages",
        "Creating interactive web pages",
        "Database management",
        "Server configuration"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript data type?",
      options: [
        "String",
        "Boolean",
        "Integer",
        "Object"
      ],
      correctAnswer: 2,
      points: 5
    },
    {
      id: 3,
      question: "Which method is used to add an element at the end of an array?",
      options: [
        "push()",
        "append()",
        "add()",
        "insert()"
      ],
      correctAnswer: 0,
      points: 5
    }
  ];

  // Function to handle quiz deletion
  const handleDeleteQuiz = () => {
    // Delete logic would go here
    setShowDeleteConfirm(false);
  };

  // Function to handle edit quiz
  const handleEditQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
  };

  // Function to confirm quiz deletion
  const confirmDelete = (quiz: any) => {
    setSelectedQuiz(quiz);
    setShowDeleteConfirm(true);
  };

  // Function to view quiz questions
  const viewQuizQuestions = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsQuestionDialogOpen(true);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
        <p className="text-muted-foreground">Create and manage quizzes for your students</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-shrink-0 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new quiz. You can add questions after creating the quiz.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input id="title" placeholder="Enter quiz title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter quiz description" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="webdesign">Web Design</SelectItem>
                        <SelectItem value="databases">Databases</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input id="time-limit" type="number" min="5" step="5" defaultValue="30" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="publish" />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Quiz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quiz List */}
      <div className="space-y-4">
        {filteredQuizzes.map((quiz, index) => (
          <Card 
            key={quiz.id} 
            className="overflow-hidden hover-scale card-shadow dash-item-animate"
            style={{ '--delay': index * 0.1 } as React.CSSProperties}
          >
            <div className={`h-1 w-full ${quiz.status === 'published' ? 'bg-primary' : 'bg-amber-500'}`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {quiz.description}
                  </CardDescription>
                </div>
                <div className="flex items-start space-x-2">
                  <Badge variant={quiz.status === 'published' ? 'default' : 'outline'} className={
                    quiz.status === 'published' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                    'bg-amber-100 text-amber-800 hover:bg-amber-100'
                  }>
                    {quiz.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditQuiz(quiz)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Quiz
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => viewQuizQuestions(quiz)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => confirmDelete(quiz)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{quiz.createdDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-medium">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Attempts</p>
                  <p className="font-medium">{quiz.attempts}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg. Score</p>
                  <p className="font-medium">{quiz.avgScore > 0 ? `${quiz.avgScore}%` : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No quizzes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or create a new quiz
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the quiz "{selectedQuiz?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuiz}>
              Delete Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Questions Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Quiz Questions: {selectedQuiz?.title}</span>
              <Button variant="outline" size="sm" onClick={() => setIsQuestionDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              View and manage questions for this quiz
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="questions">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="add">Add Question</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="space-y-4 py-4">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {quizQuestions.length} questions | Total: {quizQuestions.reduce((acc, q) => acc + q.points, 0)} points
                </span>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
              
              {quizQuestions.map((question, qIndex) => (
                <Card key={question.id} className="card-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">
                        {qIndex + 1}. {question.question}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2">{question.points} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            index === question.correctAnswer 
                              ? 'bg-green-50 border border-green-200' 
                              : 'border border-gray-200'
                          }`}
                        >
                          {index === question.correctAnswer && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          <span className={index === question.correctAnswer ? 'font-medium' : ''}>
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="add" className="space-y-4 py-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question-text">Question</Label>
                  <Textarea id="question-text" placeholder="Enter your question" rows={2} />
                </div>
                
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Input placeholder={`Option ${String.fromCharCode(65 + index)}`} />
                      <Button type="button" size="icon" variant="ghost" className="text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Option A</SelectItem>
                      <SelectItem value="1">Option B</SelectItem>
                      <SelectItem value="2">Option C</SelectItem>
                      <SelectItem value="3">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input id="points" type="number" min="1" defaultValue="5" />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Question</Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passing-score">Passing Score (%)</Label>
                  <Input id="passing-score" type="number" min="0" max="100" defaultValue="70" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input id="time-limit" type="number" min="1" defaultValue="30" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="randomize-questions">Randomize Questions</Label>
                    <Switch id="randomize-questions" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-answers">Show Answers After Completion</Label>
                    <Switch id="show-answers" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multiple-attempts">Allow Multiple Attempts</Label>
                    <Switch id="multiple-attempts" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Quiz Status</Label>
                  <Select defaultValue={selectedQuiz?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Settings</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizManagement;
