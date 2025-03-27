const db = require("../models");
const { Op } = require('sequelize');

const Quiz = db.Quiz;
const Question = db.Question;
const Option = db.Option;
const QuizAttempt = db.QuizAttempt;
const QuizAttemptAnswer = db.QuizAttemptAnswer;
const User = db.User;

// Admin Quiz Management
exports.createQuiz = async (req, res) => {
  try {
    // Explicitly check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        message: "Unauthorized. User not found.",
        error: "Authentication required to create a quiz"
      });
    }

    const {
      title,
      description,
      duration,
      questions = [],
      category,
      difficulty,
      status = 'DRAFT'
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).send({
        message: "Quiz title is required"
      });
    }

    // Create Quiz with more comprehensive data
    const quiz = await Quiz.create({
      title,
      description: description,
      duration: duration, // Default duration if not provided
      admin_id: req.user.id, // Use the authenticated user's ID
      category: category,
      difficulty: difficulty,
      status: status.toUpperCase(), // Ensure uppercase
      total_questions: questions.length,
      avg_score: 0,
      attempts: 0
    });

    // Create Questions and Options
    if (questions && questions.length > 0) {
      const questionRecords = [];
      const optionRecords = [];

      for (const questionData of questions) {
        // Validate question text
        if (!questionData.question_text) {
          continue; // Skip invalid questions
        }

        const question = await Question.create({
          quiz_id: quiz.id,
          question_text: questionData.question_text,
          question_type: 'MULTIPLE_CHOICE',
          points: questionData.points
        });

        questionRecords.push(question);

        // Create Options for each question
        if (questionData.options && questionData.options.length > 0) {
          const options = questionData.options.map(option => ({
            question_id: question.id,
            option_text: option.option_text || '',
            is_correct: option.is_correct || false
          })).filter(opt => opt.option_text); // Filter out empty options

          if (options.length > 0) {
            const createdOptions = await Option.bulkCreate(options);
            optionRecords.push(...createdOptions);
          }
        }
      }

      // Update quiz with total questions
      await quiz.update({
        total_questions: questionRecords.length
      });
    }

    res.status(201).send({
      message: "Quiz created successfully",
      data: quiz
    });
  } catch (err) {
    console.error('Quiz Creation Error:', err);

    // More detailed error response
    res.status(500).send({
      message: "Error creating quiz",
      error: err.message,
      details: err.errors ? err.errors.map(e => e.message) : null
    });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const offset = parseInt(page) * parseInt(limit);

    const quizzes = await Quiz.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Question,
          include: [{ model: Option }]
        }
      ]
    });

    res.status(200).send({
      total: quizzes.count,
      quizzes: quizzes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retrieving quizzes", error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          include: [{ model: Option }]
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!quiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }

    res.status(200).send(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retrieving quiz", error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, status, questions } = req.body;

    // Find the quiz
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }

    // Update basic quiz details
    await quiz.update({
      title,
      description,
      duration,
      status
    });

    // If questions are provided, update them
    if (questions && questions.length > 0) {
      // First, delete existing questions and options
      await Question.destroy({ where: { quiz_id: id } });

      // Create new questions and options
      for (const questionData of questions) {
        const question = await Question.create({
          quiz_id: quiz.id,
          question_text: questionData.question_text,
          question_type: 'MULTIPLE_CHOICE'
        });

        // Create Options for each question
        if (questionData.options && questionData.options.length > 0) {
          await Option.bulkCreate(
            questionData.options.map(option => ({
              question_id: question.id,
              option_text: option.option_text,
              is_correct: option.is_correct || false
            }))
          );
        }
      }
    }

    res.status(200).send({
      message: "Quiz updated successfully",
      data: quiz
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating quiz", error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {

    const { id } = req.params;

    // Check if quiz exists
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }

    // Delete quiz (this will cascade delete questions and options due to model relationships)
    await quiz.destroy();

    res.status(200).send({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting quiz", error: err.message });
  }
};

// Submit quiz and calculate score
exports.submitQuiz = async (req, res) => {
  try {
    // Explicitly check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        message: "Unauthorized. User not found.",
        error: "Authentication required to submit a quiz"
      });
    }

    const { quizId, answers, timeTaken } = req.body;

    // Validate required fields
    if (!quizId || !answers || !timeTaken) {
      return res.status(400).send({
        message: "Quiz ID, answers, and time taken are required"
      });
    }

    // Get the quiz with questions and correct answers
    const quiz = await Quiz.findByPk(quizId, {
      include: [{
        model: Question,
        include: [Option]
      }]
    });

    if (!quiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }

    // Calculate score
    let correctAnswers = 0;
    const attemptAnswers = [];

    for (const question of quiz.Questions) {
      const userAnswer = answers.find(a => a.questionId === question.id);

      if (userAnswer) {
        const selectedOption = question.Options.find(o => o.id === userAnswer.optionId);
        const isCorrect = selectedOption ? selectedOption.is_correct : false;

        if (isCorrect) {
          correctAnswers++;
        }

        attemptAnswers.push({
          question_id: question.id,
          option_id: userAnswer.optionId,
          is_correct: isCorrect
        });
      }
    }

    const score = (correctAnswers / quiz.Questions.length) * 100;

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      quiz_id: quizId,
      user_id: req.user.id,
      score: score,
      time_taken: timeTaken
    });

    // Create attempt answers
    const answersWithAttemptId = attemptAnswers.map(answer => ({
      attempt_id: attempt.id,
      ...answer
    }));

    await QuizAttemptAnswer.bulkCreate(answersWithAttemptId);

    // Update quiz statistics
    const totalAttempts = await db.QuizAttempt.count({ where: { quiz_id: quizId } });
    const avgScore = await db.QuizAttempt.findAll({
      where: { quiz_id: quizId },
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('score')), 'avg_score']],
      raw: true
    });

    // Update quiz with statistics AND set status to COMPLETED
    await quiz.update({
      attempts: totalAttempts,
      avg_score: avgScore[0].avg_score || 0,
      status: 'COMPLETED'  // Add this line to update the status
    });

    res.status(201).send({
      message: "Quiz submitted successfully",
      data: {
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: quiz.Questions.length,
        attemptId: attempt.id,
        quizStatus: 'COMPLETED'  // Optional: include new status in response
      }
    });
  } catch (err) {
    console.error('Quiz Submission Error:', err);
    res.status(500).send({
      message: "Error submitting quiz",
      error: err.message
    });
  }
};

// Add mentor feedback to quiz attempt
exports.addMentorFeedback = async (req, res) => {
  try {

    const { attemptId, feedback } = req.body;

    if (!attemptId || !feedback) {
      return res.status(400).send({
        message: "Attempt ID and feedback are required"
      });
    }

    const attempt = await QuizAttempt.findByPk(attemptId);
    if (!attempt) {
      return res.status(404).send({ message: "Quiz attempt not found" });
    }

    // Update attempt with mentor feedback
    await attempt.update({
      mentor_feedback: feedback,
      mentor_id: req.user.id
    });

    res.status(200).send({
      message: "Feedback added successfully",
      data: attempt
    });
  } catch (err) {
    console.error('Feedback Error:', err);
    res.status(500).send({
      message: "Error adding feedback",
      error: err.message
    });
  }
};

// Get quiz attempts for a student
exports.getStudentAttempts = async (req, res) => {
  try {

    const attempts = await QuizAttempt.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Quiz,
          attributes: ['id', 'title', 'description', 'category']
        },
        {
          model: User,
          as: 'Mentor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['completed_at', 'DESC']]
    });

    res.status(200).send(attempts);
  } catch (err) {
    console.error('Get Attempts Error:', err);
    res.status(500).send({
      message: "Error retrieving quiz attempts",
      error: err.message
    });
  }
};