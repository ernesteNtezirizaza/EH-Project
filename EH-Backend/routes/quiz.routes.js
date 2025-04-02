const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const quizController = require('../controllers/quiz.controller');

// Admin Quiz Routes
/**
 * @swagger
 * /quiz/create:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_text:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           option_text:
 *                             type: string
 *                           is_correct:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       403:
 *         description: Only Admin can create quizzes
 *       500:
 *         description: Error creating quiz
 */
router.post('/quiz/create', authJwt.protect, quizController.createQuiz);

/**
 * @swagger
 * /quiz/all:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of quizzes
 *       500:
 *         description: Error retrieving quizzes
 */
router.get('/quiz/all', 
  quizController.getAllQuizzes
);

/**
 * @swagger
 * /quiz/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz details
 *       403:
 *         description: Quiz not active
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Error retrieving quiz
 */
router.get('/quiz/:id', 
  quizController.getQuizById
);

/**
 * @swagger
 * /quiz/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       403:
 *         description: Only Admin can update quizzes
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Error updating quiz
 */
router.put('/quiz/:id', 
  quizController.updateQuiz
);

/**
 * @swagger
 * /quiz/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       403:
 *         description: Only Admin can delete quizzes
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Error deleting quiz
 */
router.delete('/quiz/:id', 
  quizController.deleteQuiz
);

// Quiz Attempt Routes
router.post(
  '/quiz/:id/submit',
  authJwt.protect,
  quizController.submitQuiz
);

router.post(
  '/attempts/:id/feedback',
  authJwt.protect,
  quizController.addMentorFeedback
);

router.get(
  '/student/attempts',
  authJwt.protect,
  quizController.getStudentAttempts
);

/**
 * @swagger
 * /attempts/{id}/details:
 *   get:
 *     summary: Get detailed attempt information
 *     tags: [Quiz Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz attempt ID
 *     responses:
 *       200:
 *         description: Detailed attempt information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizAttemptDetails'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Error retrieving attempt details
 */
router.get(
  '/attempts/:id/details',
  authJwt.protect,
  quizController.getAttemptDetails
);

/**
 * @swagger
 * /mentor/submissions:
 *   get:
 *     summary: Get completed quiz attempts for mentor review
 *     tags: [Quiz Attempts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed attempts needing review
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error retrieving attempts
 */
router.get(
  '/mentor/submissions',
  authJwt.protect,
  quizController.getCompletedAttempts
);

/**
 * @swagger
 * /mentor/attempts:
 *   get:
 *     summary: Get quiz attempts with search and filtering
 *     tags: [Quiz Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (student name or quiz title)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, graded]
 *         description: Filter by review status
 *     responses:
 *       200:
 *         description: List of quiz attempts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error retrieving attempts
 */
router.get(
  '/mentor/attempts',
  authJwt.protect,
  quizController.getAttemptsForMentor
);

module.exports = router;