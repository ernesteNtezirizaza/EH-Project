export interface Quiz {
  Questions: any;
  difficulty: string;
  id: number;
  title: string;
  description: string;
  duration: number;
  status: 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  attempts: number;
  avgScore: number;
  category: string;
}

export interface Question {
  Options: any;
  id: number;
  question_text: string;
  options?: QuestionOption[];
  points: number;
}

export interface QuestionOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizAttempt {
  id: number;
  score: number;
  time_taken: string;
  completed_at: string;
  mentor_feedback: string | null;
  question_count?: number;
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
}

export interface QuizAttemptListResponse {
  total: number;
  attempts: QuizAttempt[];
}

export interface CreateQuizPayload {
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  status: 'PUBLISHED';
  questions: {
    id: number;
    question_text: string;
    options: {
      option_text: string;
      is_correct: boolean;
    }[];
    points: number;
  }[];
}

export interface UpdateQuizPayload extends Partial<CreateQuizPayload> {
  id: number;
}