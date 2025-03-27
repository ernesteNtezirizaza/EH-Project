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
  authJwt.protect,  // Add this middleware
  quizController.submitQuiz
);

router.post(
  '/attempts/:id/feedback',
  authJwt.protect,  // Add this middleware
  quizController.addMentorFeedback
);

router.get(
  '/student/attempts',
  authJwt.protect,  // Add this middleware
  quizController.getStudentAttempts
);

module.exports = router;