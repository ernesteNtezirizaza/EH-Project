
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { quizService } from '../../../services/quiz.service';
import { Quiz, CreateQuizPayload, UpdateQuizPayload, Question, QuestionOption } from '../../../types/quiz';
import { motion, AnimatePresence } from 'framer-motion';

const AdminQuizManagement = () => {
  const queryClient = useQueryClient();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Form state for creating/editing quizzes
  const [formData, setFormData] = useState<Partial<CreateQuizPayload>>({
    title: '',
    description: '',
    duration: 30,
    // difficulty: 'intermediate',
    status: 'PUBLISHED',
    category: '',
    questions: []
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleQuestionForm = () => {
    setIsFormVisible(prev => !prev);
    // Reset editing state when toggling
    setEditingQuestionIndex(null);
    // Reset current question when opening new form
    if (!isFormVisible) {
      setCurrentQuestion({
        question_text: '',
        points: 1,
        options: [
          { option_text: '', is_correct: true },
          { option_text: '', is_correct: false }
        ]
      });
    }
  };

  // Current question being edited or added
  const [currentQuestion, setCurrentQuestion] = useState<{
    id?: number;
    question_text: string;
    points: number;
    options: {
      id?: number;
      option_text: string;
      is_correct: boolean;
    }[];
  }>({
    question_text: '',
    points: 0,
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false }
    ]
  });

  // React Query hooks for data fetching and mutations
  const { data: quizzesData, isLoading, error } = useQuery({
    queryKey: ['quizzes', currentPage, pageSize],
    queryFn: () => quizService.getAllQuizzes(currentPage - 1, pageSize)
  });

  const createQuizMutation = useMutation({
    mutationFn: (quizData: CreateQuizPayload) => quizService.createQuiz(quizData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz created successfully!');
      resetForm();
      setIsQuizFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz. Please try again.');
    }
  });

  const updateQuizMutation = useMutation({
    mutationFn: (quizData: UpdateQuizPayload) => quizService.updateQuiz(quizData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz updated successfully!');
      resetForm();
      setIsQuizFormOpen(false);
    },
    onError: (error) => {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz. Please try again.');
    }
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (id: number) => quizService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz deleted successfully!');
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz. Please try again.');
    }
  });

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 30,
      // difficulty: 'intermediate',
      status: 'PUBLISHED',
      category: '',
      questions: []
    });
    setSelectedQuiz(null);
    resetQuestionForm();
  };

  // Reset question form
  const resetQuestionForm = () => {
    setCurrentQuestion({
      question_text: '',
      points: 0,
      options: [
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false }
      ]
    });
    setEditingQuestionIndex(null);
  };

  // Handle input changes for quiz form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === 'duration' ? parseInt(value) : value
    });
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle switch toggle for publish status
  const handlePublishToggle = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? 'PUBLISHED' : 'DRAFT'
    });
  };

  // Question form management
  const handleQuestionTextChange = (value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      question_text: value
    });
  };

  const handleQuestionPointsChange = (value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      points: parseInt(value)
    });
  };

  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], option_text: value };
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      is_correct: i === index
    }));
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addOption = () => {
    if (currentQuestion.options.length >= 6) {
      toast.warning('Maximum 6 options allowed');
      return;
    }
    setCurrentQuestion({
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { option_text: '', is_correct: false }
      ]
    });
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length <= 2) {
      toast.warning('Minimum 2 options required');
      return;
    }

    // If removing the correct option, make the first remaining option correct
    const isRemovingCorrect = currentQuestion.options[index].is_correct;

    const newOptions = currentQuestion.options.filter((_, i) => i !== index);

    if (isRemovingCorrect && newOptions.length > 0) {
      newOptions[0] = { ...newOptions[0], is_correct: true };
    }

    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  // Add/Save question to quiz
  const saveQuestion = () => {
    // Validate the question
    if (!currentQuestion.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (!currentQuestion.options.some(opt => opt.is_correct)) {
      toast.error('You must select a correct answer');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.option_text.trim())) {
      toast.error('All options must have text');
      return;
    }

    const updatedQuestions = [...(formData.questions || [])];

    if (editingQuestionIndex !== null) {
      // Update existing question
      updatedQuestions[editingQuestionIndex] = currentQuestion;
      toast.success('Question updated');
    } else {
      // Add new question
      updatedQuestions.push(currentQuestion);
      toast.success('Question added');
    }

    setFormData({
      ...formData,
      questions: updatedQuestions
    });

    resetQuestionForm();
  };

  // Edit existing question
  const editQuestion = (index: number) => {
    if (formData.questions && formData.questions[index]) {
      setCurrentQuestion(formData.questions[index]);
      setEditingQuestionIndex(index);
    }
  };

  // Delete question
  const deleteQuestion = (index: number) => {
    if (!formData.questions) return;

    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);

    setFormData({
      ...formData,
      questions: updatedQuestions
    });

    toast.success('Question removed');
  };

  // Create or update quiz
  const handleSaveQuiz = () => {
    // Validate the quiz
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.questions || formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Create or update quiz
    if (selectedQuiz) {
      // Update existing quiz
      const updateData: UpdateQuizPayload = {
        id: selectedQuiz.id,
        ...formData as CreateQuizPayload
      };
      updateQuizMutation.mutate(updateData);
    } else {
      // Create new quiz
      createQuizMutation.mutate(formData as CreateQuizPayload);
    }
  };

  // Handle edit quiz
  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      difficulty: quiz.difficulty,
      category: quiz.category,
      status: quiz.status,
      questions: quiz.questions
    });
    setIsQuizFormOpen(true);
  };

  // Confirm quiz deletion
  const confirmDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteConfirm(true);
  };

  // Handle actual quiz deletion
  const handleDeleteQuiz = () => {
    if (!selectedQuiz) return;
    deleteQuizMutation.mutate(selectedQuiz.id);
  };

  const [showQuestionsList, setShowQuestionsList] = useState(false);

  // Show questions list
  const showQuizQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestionsList(true);
  };

  // Calculate total pages
  const totalPages = quizzesData ? Math.ceil(quizzesData.total / pageSize) : 0;

  // Filter quizzes based on search query and status filter
  const filteredQuizzes = quizzesData?.quizzes
    ? quizzesData.quizzes
      .filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(quiz => statusFilter === 'all' ? true : quiz.status === statusFilter)
    : [];

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

  const isPending = createQuizMutation.isPending || updateQuizMutation.isPending || deleteQuizMutation.isPending;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-3xl font-semibold tracking-tight">Quiz Management</h1>
          <p className="text-muted-foreground">Create, edit and manage quizzes with their questions</p>
        </motion.div>

        {/* Action Bar */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center">
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
          <div className="flex gap-3 w-full sm:w-auto">
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select> */}
            <Button
              className="h-10 gap-1.5"
              onClick={() => {
                resetForm();
                setIsQuizFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>
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
              <p className="text-sm">There was a problem fetching your quizzes. Please try refreshing the page.</p>
            </div>
          </motion.div>
        )}

        {/* Quiz Table */}
        {!isLoading && !error && (
          <motion.div variants={itemVariants} className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-medium">Title</TableHead>
                  <TableHead className="font-medium">Category</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Questions</TableHead>
                  <TableHead className="font-medium">Duration</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredQuizzes.map((quiz) => (
                    <motion.tr
                      key={quiz.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{quiz.category}</TableCell>
                      <TableCell>
                        <Badge variant={quiz.status === 'PUBLISHED' ? 'default' : 'outline'} className="font-normal">
                          {quiz.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{quiz.Questions?.length || 0}</TableCell>
                      <TableCell>{quiz.duration} min</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => showQuizQuestions(quiz)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(quiz)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredQuizzes.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            variants={itemVariants}
          >
            <div className="bg-muted/50 rounded-lg p-8 max-w-md">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first quiz'}
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsQuizFormOpen(true);
                }}
                className="mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <motion.div
            className="flex items-center justify-between py-4"
            variants={itemVariants}
          >
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredQuizzes.length}</span> of{' '}
              <span className="font-medium">{quizzesData?.total || 0}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quiz Form Dialog */}
        <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
          <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </DialogTitle>
              <DialogDescription>
                {selectedQuiz
                  ? 'Update quiz details and questions below'
                  : 'Fill in the details and add questions to create a new quiz'
                }
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <div className="px-6">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="details">Quiz Details</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>
              </div>

              <div className="px-6 max-h-[70vh] overflow-y-auto pb-6">
                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter quiz title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter quiz description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Programming">Programming</SelectItem>
                            <SelectItem value="Web Design">Web Design</SelectItem>
                            <SelectItem value="Databases">Databases</SelectItem>
                            <SelectItem value="Networking">Networking</SelectItem>
                            <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                            <SelectItem value="DevOps">DevOps</SelectItem>
                            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* 
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={formData.difficulty}
                          onValueChange={(value) => handleSelectChange('difficulty', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="5"
                          step="5"
                          value={formData.duration}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="flex items-center space-x-2">
                      <Switch
                        id="publish"
                        checked={formData.status === 'PUBLISHED'}
                        onCheckedChange={handlePublishToggle}
                      />
                      <Label htmlFor="publish">Publish immediately</Label>
                    </div> */}
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-0 space-y-6">
                  <div className="space-y-6">
                    {/* Questions List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          Questions ({formData.questions?.length || 0})
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={toggleQuestionForm}
                          disabled={editingQuestionIndex !== null}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add Question
                        </Button>
                      </div>

                      <div className="space-y-3 mt-4">
                        <AnimatePresence>
                          {formData.questions && formData.questions.length > 0 ? (
                            formData.questions.map((question, qIndex) => (
                              <motion.div
                                key={qIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="border border-border shadow-sm">
                                  <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-base font-medium flex items-center justify-between">
                                      <span className="mr-2 overflow-hidden text-ellipsis">
                                        {qIndex + 1}. {question.question_text}
                                      </span>
                                      <Badge variant="outline" className="ml-auto flex-shrink-0">
                                        {question.points} pts
                                      </Badge>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="py-3 px-4">
                                    <div className="grid grid-cols-2 gap-2">
                                      {question.options.map((option, oIndex) => (
                                        <div
                                          key={oIndex}
                                          className={`p-2 rounded-md text-sm flex items-center
                                ${option.is_correct
                                              ? 'bg-green-50 border border-green-200 text-green-800'
                                              : 'bg-muted/40 border border-border'
                                            }`}
                                        >
                                          {option.is_correct && (
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                                          )}
                                          <span className="truncate">
                                            {option.option_text}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex justify-end mt-3 space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => editQuestion(qIndex)}
                                        disabled={editingQuestionIndex !== null}
                                        className="h-8 text-xs"
                                      >
                                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteQuestion(qIndex)}
                                        className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                        Delete
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/30">
                              <FileText className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                              <p className="text-sm text-muted-foreground mb-4">No questions added yet</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleQuestionForm}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add Your First Question
                              </Button>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Question Form */}
                    {isFormVisible && (
                      <div className="border border-border rounded-lg p-4 mt-6 bg-card">
                        <h3 className="font-medium mb-4">
                          {editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="question_text">Question Text</Label>
                            <Textarea
                              id="question_text"
                              placeholder="Enter your question"
                              rows={2}
                              value={currentQuestion.question_text}
                              onChange={(e) => handleQuestionTextChange(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Answer Options</Label>
                            <div className="space-y-2">
                              {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                          ${option.is_correct ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                        `}
                                    onClick={() => handleCorrectAnswerChange(index)}
                                  >
                                    {String.fromCharCode(65 + index)}
                                  </div>
                                  <Input
                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                    value={option.option_text}
                                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeOption(index)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                                className="w-full mt-2 text-xs h-8"
                              >
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add Option
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="points">Points</Label>
                              <Input
                                id="points"
                                type="number"
                                min="1"
                                max="100"
                                value={currentQuestion.points}
                                onChange={(e) => handleQuestionPointsChange(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Correct Answer</Label>
                              <Select
                                value={currentQuestion.options.findIndex(opt => opt.is_correct).toString()}
                                onValueChange={(value) => handleCorrectAnswerChange(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currentQuestion.options.map((_, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                      Option {String.fromCharCode(65 + index)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            {editingQuestionIndex !== null && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsFormVisible(false);
                                  setEditingQuestionIndex(null);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              type="button"
                              onClick={saveQuestion}
                            >
                              {editingQuestionIndex !== null ? 'Update Question' : 'Save Question'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsQuizFormOpen(false);
                  resetForm();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveQuiz}
                disabled={isPending || !formData.title || !formData.description || !formData.questions?.length}
              >
                {isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {selectedQuiz ? 'Update Quiz' : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Questions List Dialog */}
        <Dialog open={showQuestionsList} onOpenChange={setShowQuestionsList}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Questions for "{selectedQuiz?.title}"</DialogTitle>
              <DialogDescription>
                View all questions in this quiz
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedQuiz?.Questions && selectedQuiz.Questions.length > 0 ? (
                selectedQuiz.Questions.map((question: Question, qIndex: number) => (
                  <Card key={question.id} className="border border-border shadow-sm">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-base font-medium flex items-center justify-between">
                        <span className="mr-2 overflow-hidden text-ellipsis">
                          {qIndex + 1}. {question.question_text}
                        </span>
                        <Badge variant="outline" className="ml-auto flex-shrink-0">
                          {question.points} pts
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <div className="grid grid-cols-2 gap-2">
                        {question.Options && question.Options.map((option, oIndex) => (
                          <div
                            key={option.id}
                            className={`p-2 rounded-md text-sm flex items-center
                              ${option.is_correct
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-muted/40 border border-border'
                              }`}
                          >
                            {option.is_correct && (
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                            )}
                            <span className="truncate">
                              {option.option_text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/30">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-sm text-muted-foreground">No questions in this quiz</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
              <Button
                variant="destructive"
                onClick={handleDeleteQuiz}
                disabled={deleteQuizMutation.isPending}
              >
                {deleteQuizMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Delete Quiz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default AdminQuizManagement;