const passport = require('passport');
const controller = require("../controllers/auth.controller");
const verifySignUp = require("../middleware/verifySignUp");
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string 
 *               lastName:
 *                 type: string 
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Some server error
 */

router.post("/auth/signup",[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted],controller.signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid email/username or password
 *       500:
 *         description: Server error
 */

router.post("/auth/signin", controller.signin);

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify a user account
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid verification token
 *       500:
 *         description: Some server error
 */

router.get("/auth/verify/:token", controller.verifyUser);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 *       404:
 *         description: User not found
 *       400:
 *         description: User already verified
 *       500:
 *         description: Some server error
 */

router.post("/auth/resend-verification", controller.resendVerificationEmail);

/**
 * @swagger
 * /auth/google-signin:
 *  post:
 *    summary: Sign in with Google account
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - tokenId
 *            properties:
 *              tokenId:
 *                type: string
 *    responses:
 *      200:
 *        description: User signed in successfully
 *      500:
 *        description: Server error
 */

router.post('/auth/reset-password', controller.initiatePasswordReset);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Server error
 */

router.post('/auth/reset-password/:token', controller.resetPassword);

module.exports = router
