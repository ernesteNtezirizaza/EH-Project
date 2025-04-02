import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BookOpen,
    Clock,
    CheckCircle2,
    X,
    AlertCircle,
    Loader2,
    FileText,
    Eye,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { quizService } from '../../../services/quiz.service';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuizAttemptAnswer {
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
}

interface QuizAttempt {
    id: number;
    score: number;
    time_taken: number;
    completed_at: string;
    mentor_feedback?: string;
    Quiz: {
        id: number;
        title: string;
        description: string;
        category: string;
    };
    Mentor?: {
        firstName: string;
        lastName: string;
    };
    Answers?: QuizAttemptAnswer[];
}

const StudentAttempts = () => {
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

    // Fetch student attempts using React Query
    const { data: attempts, isLoading, error, refetch } = useQuery({
        queryKey: ['student-attempts'],
        queryFn: () => quizService.getStudentAttempts()
    });

    // Fetch detailed attempt data when an attempt is selected
    const { data: attemptDetails } = useQuery({
        queryKey: ['attempt-details', selectedAttempt?.id],
        queryFn: () => selectedAttempt ? quizService.getAttemptDetails(selectedAttempt.id) : null,
        enabled: !!selectedAttempt,
    });

    // Format time taken
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle question expansion
    const toggleQuestion = (questionId: number) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
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

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500">
            <motion.div
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="space-y-2" variants={itemVariants}>
                    <h1 className="text-3xl font-semibold tracking-tight">My Quiz Attempts</h1>
                    <p className="text-muted-foreground">View your previous quiz attempts and results</p>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div
                        className="flex flex-col items-center justify-center py-16"
                        variants={itemVariants}
                    >
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading your attempts...</p>
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
                            <h3 className="text-lg font-medium mb-2">Error loading attempts</h3>
                            <p className="text-sm">There was a problem fetching your quiz attempts. Please try refreshing the page.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => refetch()}
                            >
                                Retry
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Attempts List */}
                {!isLoading && !error && (
                    <motion.div variants={itemVariants} className="space-y-4">
                        {attempts?.length === 0 ? (
                            <motion.div
                                className="flex flex-col items-center justify-center py-16 text-center"
                                variants={itemVariants}
                            >
                                <div className="bg-muted/50 rounded-lg p-8 max-w-md">
                                    <FileText className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                                    <h3 className="text-lg font-medium mb-2">No attempts found</h3>
                                    <p className="text-muted-foreground">
                                        You haven't completed any quizzes yet
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {attempts?.map((attempt: QuizAttempt) => (
                                    <motion.div
                                        key={attempt.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Card
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => setSelectedAttempt(attempt)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-xl">{attempt.Quiz.title}</CardTitle>
                                                    <Badge
                                                        className={
                                                            attempt.score >= 70 ? "bg-green-100 text-green-800" :
                                                                attempt.score >= 40 ? "bg-amber-100 text-amber-800" :
                                                                    "bg-red-100 text-red-800"
                                                        }
                                                    >
                                                        {attempt.score}%
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                                        {attempt.Quiz.category || 'Uncategorized'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {formatTime(attempt.time_taken)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {new Date(attempt.completed_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Attempt Details Dialog */}
                {selectedAttempt && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-background rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold">{selectedAttempt.Quiz.title}</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedAttempt(null);
                                        setExpandedQuestions({});
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Attempt Summary */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Score</p>
                                        <p className="text-2xl font-bold">
                                            {selectedAttempt.score}%
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Time Taken</p>
                                        <p className="text-2xl font-bold">
                                            {formatTime(selectedAttempt.time_taken)}
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="text-2xl font-bold">
                                            {new Date(selectedAttempt.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Questions List */}
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Questions ({attemptDetails?.Answers?.reduce((sum, answer) => sum + answer.Question.points, 0)} points total)
                                    </h3>
                                    {attemptDetails?.Answers?.map((answer, index) => {
                                        const totalPoints = attemptDetails?.Answers?.reduce((sum, a) => sum + a.Question.points, 0) || 0;
                                        const earnedPoints = answer.is_correct ? answer.Question.points : 0;

                                        return (
                                            <Card key={answer.question_id} className="overflow-hidden">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between p-4 cursor-pointer"
                                                    onClick={() => toggleQuestion(answer.question_id)}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="font-medium whitespace-nowrap">{index + 1}.</span>
                                                            <p className="font-medium truncate">
                                                                {answer.Question.question_text}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "h-8 px-2 flex items-center justify-center whitespace-nowrap",
                                                                answer.is_correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            )}
                                                        >
                                                            {earnedPoints}/{answer.Question.points} pts
                                                        </Badge>
                                                        <Button variant="ghost" size="icon">
                                                            {expandedQuestions[answer.question_id] ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </CardHeader>

                                                {expandedQuestions[answer.question_id] && (
                                                    <CardContent className="p-4 pt-0 space-y-3">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-sm font-medium">Your Answer:</p>
                                                                <Badge variant="outline">
                                                                    {earnedPoints}/{answer.Question.points} points
                                                                </Badge>
                                                            </div>
                                                            <div className={cn(
                                                                "p-3 rounded-md border",
                                                                answer.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                                            )}>
                                                                <p>{answer.Option.option_text}</p>
                                                                <p className="text-sm mt-1">
                                                                    {answer.is_correct ? (
                                                                        <span className="text-green-600">✓ Correct Answer (+{answer.Question.points} points)</span>
                                                                    ) : (
                                                                        <span className="text-red-600">✗ Incorrect Answer (0 points)</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {!answer.is_correct && (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-sm font-medium">Correct Answer:</p>
                                                                    <Badge variant="outline">
                                                                        {answer.Question.points}/{answer.Question.points} points
                                                                    </Badge>
                                                                </div>
                                                                <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                                                                    <p>{answer.Question.Options.find(opt => opt.is_correct)?.option_text}</p>
                                                                    <p className="text-sm text-green-600 mt-1">
                                                                        ✓ Correct Answer (+{answer.Question.points} points)
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Mentor Feedback */}
                                {(selectedAttempt.mentor_feedback || attemptDetails?.mentor_feedback) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium mb-2">Mentor Feedback</h3>
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <p>{selectedAttempt.mentor_feedback || attemptDetails?.mentor_feedback}</p>
                                                {(selectedAttempt.Mentor || attemptDetails?.Mentor) && (
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        - {(selectedAttempt.Mentor || attemptDetails?.Mentor)?.firstName} {(selectedAttempt.Mentor || attemptDetails?.Mentor)?.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end">
                                    <Button onClick={() => {
                                        setSelectedAttempt(null);
                                        setExpandedQuestions({});
                                    }}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default StudentAttempts;