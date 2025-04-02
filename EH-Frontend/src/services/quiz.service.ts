import axios from 'axios';
import { CreateQuizPayload, Quiz, UpdateQuizPayload } from '../types/quiz';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create a function to get the auth token
const getAuthHeaders = () => {
  const storedData = localStorage.getItem('user_data');
  if (!storedData) {
    console.error('No user data found in localStorage');
    throw new Error('Authentication token not found');
  }

  try {
    const userData = JSON.parse(storedData);
    const userToken = userData.userToken || userData.token; // Add fallback for token key

    if (!userToken) {
      console.error('No token found in user data', userData);
      throw new Error('Authentication token is missing');
    }

    return {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
  } catch (error) {
    console.error('Error parsing auth token:', error);
    throw new Error('Failed to retrieve authentication token');
  }
};

export const quizService = {
  // Create a new quiz
  createQuiz: async (quizData: CreateQuizPayload): Promise<Quiz> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/quiz/create`,
        quizData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  // Get all quizzes with pagination
  getAllPublishedQuizzes: async (page: number, limit: number): Promise<{ quizzes: Quiz[]; total: number }> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/quiz/all?page=${page}&limit=${limit}`,
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  // Get quiz by ID
  getQuizById: async (id: number): Promise<Quiz> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/quiz/${id}`,
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching quiz with ID ${id}:`, error);
      throw error;
    }
  },

  // Update quiz
  updateQuiz: async (quizData: UpdateQuizPayload): Promise<Quiz> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/quiz/${quizData.id}`,
        quizData,
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  // Delete quiz
  deleteQuiz: async (id: number): Promise<void> => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/quiz/${id}`,
        // getAuthHeaders()
      );
    } catch (error) {
      console.error(`Error deleting quiz with ID ${id}:`, error);
      throw error;
    }
  },

  // Add to quizService object
  getMentorAttempts: async (page: number, limit: number, search: string = '', status: string = 'all') => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/mentor/attempts`,
        {
          ...getAuthHeaders(),
          params: { page, limit, search, status }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor attempts:', error);
      throw error;
    }
  },

  // Submit quiz attempt
  submitQuiz: async (quizId: number, answers: Array<{ questionId: number, optionId: number }>, timeTaken: number) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/quiz/${quizId}/submit`,
        {
          quizId,
          answers,
          timeTaken
        },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  // Add mentor feedback to quiz attempt
  addMentorFeedback: async (attemptId: number, feedback: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/attempts/${attemptId}/feedback`,
        {
          attemptId,
          feedback
        },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding mentor feedback:', error);
      throw error;
    }
  },

  // Get student's quiz attempts
  getStudentAttempts: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/student/attempts`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching student attempts:', error);
      throw error;
    }
  },

  // Get completed quiz attempts for mentor review
  getCompletedAttempts: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/mentor/submissions?page=${page}&limit=${limit}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching completed attempts:', error);
      throw error;
    }
  },

  // Get detailed attempt information
  getAttemptDetails: async (attemptId: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/attempts/${attemptId}/details`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching attempt details for ID ${attemptId}:`, error);
      throw error;
    }
  },

  getQuizStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/quiz-stats`,
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw error;
    }
  },
  
  getAttemptStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admin/attempt-stats`,
        // getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching attempt stats:', error);
      throw error;
    }
  }
};