
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  FileText, 
  Clock, 
  Search, 
  Filter, 
  User, 
  CheckCircle, 
  X,
  Star,
  MessageSquare,
  SendHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const MentorSubmissions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  
  // Mock data for quiz submissions
  const submissions = [
    {
      id: 1,
      studentName: "Emma Wilson",
      studentId: "EW2023",
      quizTitle: "JavaScript Fundamentals",
      submittedDate: "2023-08-15 14:30",
      duration: "28 mins",
      status: "pending",
      score: null,
      answers: [
        { question: "What is JavaScript primarily used for?", answer: "Creating interactive web pages", correct: true },
        { question: "Which of the following is NOT a JavaScript data type?", answer: "Integer", correct: true },
        { question: "Which method is used to add an element at the end of an array?", answer: "push()", correct: true }
      ]
    },
    {
      id: 2,
      studentName: "Sophia Lee",
      studentId: "SL2023",
      quizTitle: "CSS Flexbox",
      submittedDate: "2023-08-14 10:15",
      duration: "22 mins",
      status: "pending",
      score: null,
      answers: [
        { question: "What is the main axis in flexbox?", answer: "The axis defined by flex-direction", correct: true },
        { question: "Which property aligns flex items along the cross axis?", answer: "align-items", correct: true },
        { question: "What is the default value of flex-direction?", answer: "column", correct: false }
      ]
    },
    {
      id: 3,
      studentName: "Sophia Lee",
      studentId: "SL2023",
      quizTitle: "React Hooks",
      submittedDate: "2023-08-14 11:45",
      duration: "35 mins",
      status: "pending",
      score: null,
      answers: [
        { question: "What hook is used to add state to a functional component?", answer: "useState", correct: true },
        { question: "Which hook replaces componentDidMount lifecycle method?", answer: "useEffect", correct: true },
        { question: "What hook is used for context in functional components?", answer: "useContext", correct: true }
      ]
    },
    {
      id: 4,
      studentName: "James Brown",
      studentId: "JB2023",
      quizTitle: "TypeScript Basics",
      submittedDate: "2023-08-13 09:30",
      duration: "32 mins",
      status: "graded",
      score: 85,
      feedback: "Good understanding of TypeScript concepts. Work on understanding generics better.",
      answers: [
        { question: "What is TypeScript?", answer: "A superset of JavaScript that adds static typing", correct: true },
        { question: "What symbol is used for type annotation in TypeScript?", answer: ":", correct: true },
        { question: "What is the 'any' type in TypeScript?", answer: "A type that can be assigned any value", correct: true }
      ]
    },
    {
      id: 5,
      studentName: "Emma Wilson",
      studentId: "EW2023",
      quizTitle: "Web Accessibility",
      submittedDate: "2023-08-12 16:20",
      duration: "24 mins",
      status: "graded",
      score: 92,
      feedback: "Excellent understanding of accessibility principles. Very thorough answers.",
      answers: [
        { question: "What does WCAG stand for?", answer: "Web Content Accessibility Guidelines", correct: true },
        { question: "What is the purpose of alt text for images?", answer: "To provide a text alternative for screen readers", correct: true },
        { question: "What is the minimum contrast ratio recommended for text?", answer: "4.5:1", correct: true }
      ]
    }
  ];
  
  // Filter submissions based on search query and status filter
  const filteredSubmissions = submissions
    .filter(submission => 
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      submission.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(submission => statusFilter === 'all' ? true : submission.status === statusFilter);

  // Function to open grading dialog
  const openGrading = (submission: any) => {
    setSelectedSubmission(submission);
    setOpenGradeDialog(true);
  };

  // Function to handle grade submission
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Grade submission logic would go here
    setOpenGradeDialog(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Pending Submissions</h1>
        <p className="text-muted-foreground">Review and grade student quiz submissions</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student name, ID, or quiz title..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission, index) => (
          <Card 
            key={submission.id} 
            className={`overflow-hidden hover-scale card-shadow dash-item-animate ${
              submission.status === 'pending' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-green-500'
            }`}
            style={{ '--delay': index * 0.1 } as React.CSSProperties}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{submission.quizTitle}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-1" />
                    {submission.studentName} ({submission.studentId})
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={
                    submission.status === 'pending' 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' 
                      : 'bg-green-100 text-green-800 hover:bg-green-100'
                  }>
                    {submission.status === 'pending' ? 'Pending Review' : 'Graded'}
                  </Badge>
                  {submission.status === 'graded' && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {submission.score}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">{submission.submittedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{submission.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-medium">{submission.answers.length}</p>
                </div>
              </div>
              
              {submission.status === 'graded' && (
                <div className="bg-gray-50 p-3 rounded-md mt-2">
                  <p className="font-medium text-sm">Feedback:</p>
                  <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                {submission.status === 'pending' ? (
                  <Button onClick={() => openGrading(submission)}>Grade Submission</Button>
                ) : (
                  <Button variant="outline" onClick={() => openGrading(submission)}>View Details</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-muted-foreground">
            All quizzes have been graded, or no submissions match your filters
          </p>
        </div>
      )}

      {/* Grading Dialog */}
      <Dialog open={openGradeDialog} onOpenChange={setOpenGradeDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedSubmission?.quizTitle} - {selectedSubmission?.studentName}
              </span>
              <Button variant="outline" size="sm" onClick={() => setOpenGradeDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Review student answers and provide feedback
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="answers">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="answers">Student Answers</TabsTrigger>
              <TabsTrigger value="grade">Grade & Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="answers" className="space-y-4 py-4">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Submitted: {selectedSubmission?.submittedDate} • Duration: {selectedSubmission?.duration}
                </span>
                <Badge variant="outline" className={
                  selectedSubmission?.status === 'pending' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-green-100 text-green-800'
                }>
                  {selectedSubmission?.status === 'pending' ? 'Pending Review' : 'Graded'}
                </Badge>
              </div>
              
              {selectedSubmission?.answers.map((answer: any, index: number) => (
                <Card key={index} className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {index + 1}. {answer.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border p-3 rounded-md bg-gray-50">
                      <p className="text-sm font-medium">Student's Answer:</p>
                      <p className="text-sm">{answer.answer}</p>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <Badge variant="outline" className={
                        answer.correct 
                          ? 'bg-green-100 text-green-800 flex items-center gap-1' 
                          : 'bg-red-100 text-red-800 flex items-center gap-1'
                      }>
                        {answer.correct ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Correct
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" />
                            Incorrect
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="grade" className="space-y-4 py-4">
              <form onSubmit={handleGradeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="score">Score (%)</Label>
                  <Input 
                    id="score" 
                    type="number" 
                    min="0" 
                    max="100" 
                    defaultValue={selectedSubmission?.score || ""}
                    placeholder="Enter score (0-100)"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    rows={5} 
                    defaultValue={selectedSubmission?.feedback || ""}
                    placeholder="Provide constructive feedback to the student..."
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Overall Assessment</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Excellent", "Good Work", "Needs Improvement", "Review Concepts", "Good Effort"].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personal-note">Personal Note to Student</Label>
                  <div className="relative">
                    <Textarea 
                      id="personal-note" 
                      rows={3} 
                      placeholder="Add an encouraging note or suggestion for improvement..."
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-2 bottom-2"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between sm:justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setOpenGradeDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {selectedSubmission?.status === 'pending' ? 'Submit Grade' : 'Update Grade'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorSubmissions;
