import React, { useState, useEffect } from 'react';
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
  User,
  CheckCircle,
  X,
  Loader2
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
import { quizService } from '@/services/quiz.service';
import { useToast } from '@/components/ui/use-toast';

interface QuizAttempt {
  question_count: number;
  id: number;
  score: number;
  time_taken: string;
  completed_at: string;
  mentor_feedback: string | null;
  Quiz: {
    id: number;
    title: string;
    description: string;
    category: string;
    status: 'PUBLISHED' | 'COMPLETED' | 'REVIEWED';
  };
  Student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  Mentor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  Answers?: {
    id: number;
    question_id: number;
    option_id: number;
    is_correct: boolean;
    Question: {
      id: number;
      question_text: string;
      points: number;
      Options: {
        id: number;
        option_text: string;
        is_correct: boolean;
      }[];
    };
    Option: {
      id: number;
      option_text: string;
      is_correct: boolean;
    };
  }[];
}

const AdminSubmissions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizAttempt | null>(null);
  const [submissions, setSubmissions] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch submissions from backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await quizService.getCompletedAttempts(page, 10);
        setSubmissions(response.attempts);
        setTotalPages(Math.ceil(response.total / 10));
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch submissions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [page]);

  // Filter submissions based on search query and status filter
  const filteredSubmissions = submissions
    .filter(submission => {
      const studentName = `${submission.Student?.firstName} ${submission.Student?.lastName}`.toLowerCase();
      return (
        studentName.includes(searchQuery.toLowerCase()) ||
        submission.Quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter(submission => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'pending') return !submission.mentor_feedback;
      return !!submission.mentor_feedback;
    });

  // Function to open grading dialog and fetch detailed attempt data
  const openGrading = async (submission: QuizAttempt) => {
    try {
      setIsLoading(true);
      const detailedAttempt = await quizService.getAttemptDetails(submission.id);
      setSelectedSubmission(detailedAttempt);
      setFeedback(detailedAttempt.mentor_feedback || '');
      setOpenGradeDialog(true);
    } catch (error) {
      console.error('Error fetching attempt details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attempt details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle grade submission
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      setIsSubmitting(true);
      await quizService.addMentorFeedback(selectedSubmission.id, feedback);

      // Update local state
      setSubmissions(submissions.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, mentor_feedback: feedback }
          : sub
      ));

      toast({
        title: 'Success',
        description: 'Feedback submitted successfully',
      });
      setOpenGradeDialog(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time taken (assuming time_taken is in minutes)
  const formatTimeTaken = (timeTaken: string) => {
    const minutes = parseInt(timeTaken);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  // Replace the useEffect and filteredSubmissions logic with:

  const [searchParams, setSearchParams] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 10
  });

  // Fetch submissions from backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await quizService.getMentorAttempts(
          searchParams.page,
          searchParams.limit,
          searchParams.search,
          searchParams.status
        );
        setSubmissions(response.attempts);
        setTotalPages(Math.ceil(response.total / searchParams.limit));
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch submissions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSubmissions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchParams]);

  // Update search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({
      ...prev,
      search: e.target.value,
      page: 1 // Reset to first page on new search
    }));
  };

  // Update status filter handler
  const handleStatusChange = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  // Update pagination handler
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Quiz Submissions</h1>
        <p className="text-muted-foreground">Check </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student name or quiz title..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={searchParams.status}
          onValueChange={handleStatusChange}
        >
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

      {/* Loading State */}
      {isLoading && !openGradeDialog && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Submissions List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredSubmissions.map((submission, index) => {
            const studentName = `${submission.Student?.firstName} ${submission.Student?.lastName}`;
            const isGraded = !!submission.mentor_feedback;

            return (
              <Card
                key={submission.id}
                className={`overflow-hidden hover-scale card-shadow dash-item-animate ${!isGraded ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-green-500'
                  }`}
                style={{ '--delay': index * 0.1 } as React.CSSProperties}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{submission.Quiz.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1" />
                        {studentName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        !isGraded
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                          : 'bg-green-100 text-green-800 hover:bg-green-100'
                      }>
                        {!isGraded ? 'Pending Review' : 'Graded'}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {Math.round(submission.score)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium">{formatDate(submission.completed_at)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatTimeTaken(submission.time_taken)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Questions</p>
                      <p className="font-medium">{submission?.question_count || 0}</p>
                    </div>
                  </div>

                  {isGraded && submission.mentor_feedback && (
                    <div className="bg-gray-50 p-3 rounded-md mt-2">
                      <p className="font-medium text-sm">Feedback:</p>
                      <p className="text-sm text-muted-foreground">{submission.mentor_feedback}</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {!isGraded ? (
                      <Button disabled onClick={() => openGrading(submission)}>Provide Feedback</Button>
                    ) : (
                      <Button variant="outline" onClick={() => openGrading(submission)}>View Details</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {!isLoading && filteredSubmissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-muted-foreground">
            All quizzes have been reviewed, or no submissions match your filters
          </p>
        </div>
      )}

      {/* Grading Dialog */}
      <Dialog open={openGradeDialog} onOpenChange={setOpenGradeDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedSubmission?.Quiz?.title} - {selectedSubmission?.Student?.firstName} {selectedSubmission?.Student?.lastName}
              </span>
              <Button variant="outline" size="sm" onClick={() => setOpenGradeDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Review student answers and provide feedback
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="answers">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="answers">Student Answers</TabsTrigger>
                <TabsTrigger value="feedback">Provide Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="answers" className="space-y-4 py-4">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Submitted: {selectedSubmission && formatDate(selectedSubmission.completed_at)} •
                    Duration: {selectedSubmission && formatTimeTaken(selectedSubmission.time_taken)}
                  </span>
                  <Badge variant="outline" className={
                    !selectedSubmission?.mentor_feedback
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }>
                    {!selectedSubmission?.mentor_feedback ? 'Pending Review' : 'Reviewed'}
                  </Badge>
                </div>

                {selectedSubmission?.Answers?.map((answer, index) => (
                  <Card key={answer.id} className="card-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {index + 1}. {answer.Question.question_text}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border p-3 rounded-md bg-gray-50">
                        <p className="text-sm font-medium">Student's Answer:</p>
                        <p className="text-sm">{answer.Option.option_text}</p>
                      </div>

                      <div className="flex items-center mt-3">
                        <Badge variant="outline" className={
                          answer.is_correct
                            ? 'bg-green-100 text-green-800 flex items-center gap-1'
                            : 'bg-red-100 text-red-800 flex items-center gap-1'
                        }>
                          {answer.is_correct ? (
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

                      {!answer.is_correct && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md">
                          <p className="text-xs font-medium text-blue-800">Correct Answer:</p>
                          <p className="text-xs text-blue-800">
                            {answer.Question.Options.find(opt => opt.is_correct)?.option_text}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4 py-4">
                <form onSubmit={handleGradeSubmit} className="space-y-6">
                  {/* <div className="space-y-2">
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={selectedSubmission?.score ? Math.round(selectedSubmission.score) : ''}
                      readOnly
                      className="w-full"
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Detailed Feedback</Label>
                    <Textarea
                      id="feedback"
                      rows={5}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide constructive feedback to the student..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Explain what they did well and areas for improvement
                    </p>
                  </div>

                  <DialogFooter className="flex justify-between sm:justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => setOpenGradeDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {selectedSubmission?.mentor_feedback ? 'Update Feedback' : 'Submit Feedback'}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;