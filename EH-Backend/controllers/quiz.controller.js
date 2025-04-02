const db = require("../models");
const { Op, where } = require('sequelize');

const Quiz = db.Quiz;
const Question = db.Question;
const Option = db.Option;
const QuizAttempt = db.QuizAttempt;
const QuizAttemptAnswer = db.QuizAttemptAnswer;
const sendEmail = require('../Utils/SendEmail')
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
      where: { status: "PUBLISHED" }, // Moved outside `include`
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

// Get detailed attempt information with questions and answers
exports.getAttemptDetails = async (req, res) => {
  try {
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        message: "Unauthorized. User not found.",
        error: "Authentication required"
      });
    }

    const { id } = req.params;

    // Find the attempt with all related data
    const attempt = await QuizAttempt.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Quiz,
          attributes: ['id', 'title', 'description', 'category']
        },
        {
          model: User,
          as: 'Mentor',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: QuizAttemptAnswer,
          include: [
            {
              model: Question,
              attributes: ['id', 'question_text', 'points'],
              include: [
                {
                  model: Option,
                  attributes: ['id', 'option_text', 'is_correct']
                }
              ]
            },
            {
              model: Option,
              attributes: ['id', 'option_text', 'is_correct']
            }
          ]
        }
      ]
    });

    if (!attempt) {
      return res.status(404).send({ message: "Quiz attempt not found" });
    }

    // Format the response data
    const responseData = {
      id: attempt.id,
      score: attempt.score,
      time_taken: attempt.time_taken,
      completed_at: attempt.completed_at,
      mentor_feedback: attempt.mentor_feedback,
      Quiz: attempt.Quiz,
      Mentor: attempt.Mentor,
      Answers: attempt.QuizAttemptAnswers.map(answer => ({
        id: answer.id,
        question_id: answer.question_id,
        option_id: answer.option_id,
        is_correct: answer.is_correct,
        Question: answer.Question,
        Option: answer.Option
      }))
    };

    res.status(200).send(responseData);
  } catch (err) {
    console.error('Get Attempt Details Error:', err);
    res.status(500).send({
      message: "Error retrieving attempt details",
      error: err.message
    });
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
    // Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        message: "Unauthorized. User not found.",
        error: "Authentication required to submit a quiz"
      });
    }

    const { quizId, answers, timeTaken } = req.body;

    // Validate required fields
    if (!quizId) {
      return res.status(400).send({
        message: "Quiz ID is required"
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

    // Calculate score and prepare attempt answers
    let correctAnswers = 0;
    const attemptAnswers = [];

    for (const question of quiz.Questions) {
      const userAnswer = answers ? answers.find(a => a.questionId === question.id) : null;

      // Handle both answered and unanswered questions
      if (userAnswer && userAnswer.optionId) {
        // Case 1: Student answered this question
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
      } else {
        // Case 2: Student didn't answer this question (time ran out or skipped)
        attemptAnswers.push({
          question_id: question.id,
          option_id: null,  // Mark as unanswered
          is_correct: false // Count as incorrect
        });
      }
    }

    // Calculate score (protect against division by zero)
    const totalQuestions = quiz.Questions.length || 1;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      quiz_id: quizId,
      user_id: req.user.id,
      score: score,
      time_taken: timeTaken || 0 // Default to 0 if timeTaken not provided
    });

    // Create attempt answers (including unanswered questions)
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

    // Update quiz status
    await quiz.update({
      attempts: totalAttempts,
      avg_score: avgScore[0].avg_score || 0,
      status: 'COMPLETED'
    });

    res.status(201).send({
      message: "Quiz submitted successfully",
      data: {
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        attemptId: attempt.id,
        quizStatus: 'COMPLETED',
        unansweredQuestions: totalQuestions - answers.length // Add count of unanswered questions
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

// Get quiz attempts with search and status filtering
exports.getAttemptsForMentor = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    // Build the where clause for QuizAttempt
    const attemptWhere = {};
    if (status === 'pending') {
      attemptWhere.mentor_feedback = null;
    } else if (status === 'graded') {
      attemptWhere.mentor_feedback = { [Op.ne]: null };
    }

    // Build the where clause for search
    const searchWhere = search ? {
      [Op.or]: [
        { '$Student.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$Student.lastName$': { [Op.iLike]: `%${search}%` } },
        { '$Quiz.title$': { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const attempts = await QuizAttempt.findAndCountAll({
      where: {
        ...attemptWhere,
        ...searchWhere
      },
      include: [
        {
          model: Quiz,
          where: { status: 'COMPLETED' },
          attributes: ['id', 'title', 'description', 'category'],
          include: [{
            model: Question,
            attributes: ['id'],
            required: false
          }]
        },
        {
          model: User,
          as: 'Student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'Mentor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['completed_at', 'DESC']]
    });

    // Format response with question counts
    const formattedAttempts = attempts.rows.map(attempt => ({
      ...attempt.get({ plain: true }),
      question_count: attempt.Quiz.Questions?.length || 0
    }));

    res.status(200).send({
      total: attempts.count,
      attempts: formattedAttempts
    });
  } catch (err) {
    console.error('Get Attempts Error:', err);
    res.status(500).send({
      message: "Error retrieving quiz attempts",
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

    const attempt = await QuizAttempt.findByPk(attemptId, {
      include: [
        {
          model: User,
          as: 'Student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Quiz,
          attributes: ['id', 'title', 'status']
        }
      ]
    });

    if (!attempt) {
      return res.status(404).send({ message: "Quiz attempt not found" });
    }

    // Get mentor info
    const mentor = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName']
    });

    if (!mentor) {
      return res.status(404).send({ message: "Mentor not found" });
    }

    // Update attempt with mentor feedback
    await attempt.update({
      mentor_feedback: feedback,
      mentor_id: req.user.id
    });

    // Update quiz status to REVIEWED
    await Quiz.update(
      { status: 'REVIEWED' },
      { where: { id: attempt.quiz_id } }
    );

    // Send email to student
    const studentName = `${attempt.Student.firstName} ${attempt.Student.lastName}`;
    const mentorName = `${mentor.firstName} ${mentor.lastName}`;
    const quizTitle = attempt.Quiz.title;
    const subject = `Feedback on your ${quizTitle} submission`;

    const html = `
      <p>Hi <b>${studentName}</b>,</p>
      <p>Your submission for <b>${quizTitle}</b> has been reviewed by <b>${mentorName}</b>.</p>
      <p><b>Feedback:</b></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${feedback}
      </div>
      <p>Score: <b>${attempt.score}%</b></p>
      <br />
      <p>Best Regards,<br />
      Learning Platform Team</p>
      <br />
      <p>DISCLAIMER<br />
      ------------------<br />
      This email contains confidential information about your submission.<br />
      If you did not expect this feedback, please contact support.</p>
    `;

    await sendEmail({
      email: attempt.Student.email,
      subject: subject,
      html: html
    });

    res.status(200).send({
      message: "Feedback added successfully, quiz marked as REVIEWED, and email sent to student",
      data: {
        ...attempt.get({ plain: true }),
        quiz_status: 'REVIEWED' // Include the new status in response
      }
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

exports.getCompletedAttempts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send({
        message: "Unauthorized. User not found.",
        error: "Authentication required"
      });
    }

    const attempts = await QuizAttempt.findAndCountAll({
      where: {
        mentor_feedback: null
      },
      include: [
        {
          model: Quiz,
          where: { status: 'COMPLETED' },
          attributes: ['id', 'title', 'description', 'category'],
          include: [{
            model: Question,
            attributes: ['id'],
            required: false
          }]
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
          as: 'Student'
        },
        {
          model: User,
          as: 'Mentor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['completed_at', 'DESC']]
    });

    // Get question counts for all quizzes in one query
    const quizIds = attempts.rows.map(attempt => attempt.quiz_id);
    const questionCounts = await Question.findAll({
      attributes: [
        'quiz_id',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'question_count']
      ],
      where: {
        quiz_id: quizIds
      },
      group: ['quiz_id'],
      raw: true
    });

    // Create a map of quiz_id to question_count
    const questionCountMap = questionCounts.reduce((acc, curr) => {
      acc[curr.quiz_id] = curr.question_count;
      return acc;
    }, {});

    // Format the response with question count
    const formattedAttempts = attempts.rows.map(attempt => ({
      ...attempt.get({ plain: true }),
      question_count: questionCountMap[attempt.quiz_id] || 0
    }));

    res.status(200).send({
      total: attempts.count,
      attempts: formattedAttempts
    });
  } catch (err) {
    console.error('Get Completed Attempts Error:', err);
    res.status(500).send({
      message: "Error retrieving completed attempts",
      error: err.message
    });
  }
};