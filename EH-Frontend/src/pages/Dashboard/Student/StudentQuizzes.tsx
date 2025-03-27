import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  X,
  FileText,
  CheckCircle2
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { quizService } from '../../../services/quiz.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Type definitions
interface Option {
  id: number;
  option_text: string;
  is_correct?: boolean;
  text?: string;
  isCorrect?: boolean;
}

interface Question {
  id: number;
  question_text: string;
  points: number;
  text?: string;
  Options: Option[];
  options?: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  status: string;
  Questions: Question[];
}

const StudentQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  // Quiz taking states
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  // Fetch quizzes using React Query
  const { data: quizzesData, isLoading, error } = useQuery({
    queryKey: ['student-quizzes', currentPage, pageSize],
    queryFn: () => quizService.getAllQuizzes(currentPage - 1, pageSize)
  });

  // Fetch single quiz details when needed
  const { data: quizDetails, isLoading: isQuizLoading, refetch: refetchQuizDetails } = useQuery({
    queryKey: ['quiz-details', activeQuiz?.id],
    queryFn: () => activeQuiz ? quizService.getQuizById(activeQuiz.id) : null,
    enabled: !!activeQuiz && quizOpen,
  });

  // Filter quizzes based on search query and filter
  const filteredQuizzes = quizzesData?.quizzes
    ? quizzesData.quizzes
      .filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate total pages
  const totalPages = quizzesData ? Math.ceil(quizzesData.total / pageSize) : 0;

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Start quiz handler
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizOpen(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setQuizCompleted(false);
    setScore(null);
    setQuizStarted(false);

    // Refetch quiz details to get questions
    if (quiz.id) {
      refetchQuizDetails();
    }
  };

  // Actually start the quiz and timer
  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle quiz timer
  useEffect(() => {
    if (quizOpen && activeQuiz && timeRemaining > 0 && !quizCompleted && quizStarted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizOpen, activeQuiz, quizCompleted, quizStarted]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Get current question
  const currentQuestion = quizDetails?.Questions?.[currentQuestionIndex] || null;

  // Handle answer selection
  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Navigate between questions
  const goToNextQuestion = () => {
    if (quizDetails?.Questions && currentQuestionIndex < quizDetails.Questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!quizDetails?.Questions?.length) return 0;
    const answeredCount = Object.keys(selectedAnswers).length;
    return (answeredCount / quizDetails.Questions.length) * 100;
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !quizDetails) return;

    setIsSubmitting(true);

    try {
      // Prepare answers for submission
      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        optionId: optionId
      }));

      // Calculate time taken in seconds
      const timeTaken = (activeQuiz.duration * 60) - timeRemaining;

      // Submit to backend
      const result = await quizService.submitQuiz(
        activeQuiz.id,
        answers,
        timeTaken
      );

      // Update state with results
      setScore(result.data.score);
      setQuizCompleted(true);

      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to submit quiz. Please try again.");
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close quiz dialog
  const handleCloseQuiz = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setQuizOpen(false);
    setActiveQuiz(null);
    setQuizStarted(false);

    // Short timeout to allow the dialog close animation
    setTimeout(() => {
      setSelectedAnswers({});
      setQuizCompleted(false);
      setScore(null);
    }, 300);
  };

  // Check if user has answered the current question
  const hasAnsweredCurrentQuestion = () => {
    return currentQuestion ? !!selectedAnswers[currentQuestion.id] : false;
  };

  // Calculate total answered questions
  const getTotalAnsweredQuestions = () => {
    return Object.keys(selectedAnswers).length;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-3xl font-semibold tracking-tight">Available Quizzes</h1>
          <p className="text-muted-foreground">Browse and take quizzes to test your knowledge</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="pl-9 h-10 bg-background border border-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 flex items-center gap-2">
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            variants={itemVariants}
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading quizzes...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={itemVariants}
          >
            <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">Error loading quizzes</h3>
              <p className="text-sm">There was a problem fetching quizzes. Please try refreshing the page.</p>
            </div>
          </motion.div>
        )}

        {/* Quiz Grid */}
        {!isLoading && !error && (
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{quiz.title}</CardTitle>
                          <Badge variant="outline" className="ml-2">
                            {quiz.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty || 'Not specified'}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            {quiz.category || 'Uncategorized'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {quiz.description || 'No description provided'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.Questions?.length || 0} questions</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleStartQuiz(quiz)}
                        >
                          Start Quiz
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredQuizzes.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={itemVariants}
          >
            <div className="bg-muted/50 rounded-lg p-8 max-w-md">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are currently no available quizzes'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Quiz Taking Dialog */}
        <Dialog open={quizOpen} onOpenChange={(open) => !open && handleCloseQuiz()}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            {!quizStarted && !quizCompleted && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl">{activeQuiz?.title}</DialogTitle>
                  <DialogDescription>
                    {activeQuiz?.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Duration</div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        <span className="font-medium">{activeQuiz?.duration} minutes</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Questions</div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        <span className="font-medium">{quizDetails?.Questions?.length || 0} questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-amber-600" />
                      <div className="space-y-1">
                        <h4 className="font-medium">Important Information</h4>
                        <ul className="text-sm space-y-1">
                          <li>• The timer will start as soon as you begin the quiz</li>
                          <li>• You can navigate between questions using the buttons at the bottom</li>
                          <li>• Submit your answers before the time runs out</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseQuiz}>Cancel</Button>
                  <Button onClick={startQuiz} className="gap-2">
                    Begin Quiz <ChevronRight className="h-4 w-4" />
                  </Button>
                </DialogFooter>
              </motion.div>
            )}

            {quizStarted && !quizCompleted && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="font-medium">{activeQuiz?.title}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseQuiz}
                      className="h-8 w-8 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isQuizLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading quiz questions...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Question {currentQuestionIndex + 1} of {quizDetails?.Questions?.length}</span>
                        <span>Answered: {getTotalAnsweredQuestions()} of {quizDetails?.Questions?.length}</span>
                      </div>
                      <Progress value={calculateProgress()} className="h-2" />
                    </div>

                    {currentQuestion && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium">
                              {currentQuestion.question_text || currentQuestion.text}
                            </h3>
                            <Badge variant="outline">
                              {currentQuestion.points} points
                            </Badge>
                          </div>
                          <Separator />
                        </div>

                        <RadioGroup
                          value={selectedAnswers[currentQuestion.id]?.toString()}
                          onValueChange={(value) => handleSelectAnswer(currentQuestion.id, parseInt(value))}
                          className="space-y-3"
                        >
                          {(currentQuestion.Options || currentQuestion.options || []).map((option) => (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-center space-x-2 rounded-md border p-4 transition-colors",
                                selectedAnswers[currentQuestion.id] === option.id
                                  ? "border-primary bg-primary/5"
                                  : "border-muted hover:bg-muted/50"
                              )}
                            >
                              <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                              <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                                {option.option_text || option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>

                      <div className="flex gap-2">
                        {currentQuestionIndex === (quizDetails?.Questions?.length || 0) - 1 ? (
                          <Button
                            onClick={handleSubmitQuiz}
                            disabled={isSubmitting}
                            className="gap-1"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Quiz <CheckCircle className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={goToNextQuestion}
                            className="gap-1"
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {quizCompleted && score !== null && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle>Quiz Results</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className={cn(
                      "rounded-full p-6 mb-4",
                      score >= 70 ? "bg-green-50" : score >= 40 ? "bg-amber-50" : "bg-red-50"
                    )}>
                      <div className={cn(
                        "text-4xl font-bold rounded-full h-24 w-24 flex items-center justify-center border-4",
                        score >= 70 ? "text-green-600 border-green-200" :
                          score >= 40 ? "text-amber-600 border-amber-200" :
                            "text-red-600 border-red-200"
                      )}>
                        {score}%
                      </div>
                    </div>

                    <h3 className="text-xl font-medium mb-1">
                      {score >= 70 ? "Great job!" : score >= 40 ? "Not bad!" : "Keep practicing!"}
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {score >= 70
                        ? "Excellent work! You've demonstrated a strong understanding of the material."
                        : score >= 40
                          ? "Good effort! You're on the right track, but there's room for improvement."
                          : "Don't worry! Learning takes time. Review the material and try again."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Score</div>
                      <div className="font-medium">{score}%</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Time Taken</div>
                      <div className="font-medium">{formatTime((activeQuiz?.duration || 0) * 60 - timeRemaining)}</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Questions</div>
                      <div className="font-medium">{quizDetails?.Questions?.length || 0} questions</div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Answered</div>
                      <div className="font-medium">{getTotalAnsweredQuestions()} questions</div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseQuiz}>Close</Button>
                  <Button onClick={handleCloseQuiz} className="gap-2">
                    Return to Quizzes <ChevronRight className="h-4 w-4" />
                  </Button>
                </DialogFooter>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination (if needed) */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentQuizzes;