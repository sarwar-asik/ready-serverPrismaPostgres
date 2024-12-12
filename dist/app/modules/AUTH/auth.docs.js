"use strict";
// User Authentication Routes
/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: User Registration (JSON)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               user_name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: sarwarasik@gmail.com
 *               self_pronoun:
 *                 type: string
 *                 enum: [he, she, they]
 *                 example: he
 *               date_of_birth:
 *                 type: string
 *                 example: "1990-01-01"
 *               password:
 *                 type: string
 *                 example: map
 *                 minLength: 6
 *                 maxLength: 30
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: OTP sent for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: sent OTP. Please, verify your email/finger
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *
 * /api/v1/auth/sign-up-form:
 *   post:
 *     summary: User Registration with Profile Image
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing user data
 *                 example: '{"full_name":"John Doe","user_name":"johndoe","email":"sarwarasik@gmail.com","self_pronoun":"he","date_of_birth":"1990-01-01","password":"password123"}'
 *               profile_img:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *             required:
 *               - data
 *               - profile_img
 *     responses:
 *       200:
 *         description: OTP sent for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: sent OTP. Please, verify your email/finger
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: sarwarasik@gmail.com
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Data is required
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *
 * /api/v1/auth/verify-signup-otp:
 *   post:
 *     summary: Verify Sign Up OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example:  sarwarasik@gmail.com
 *               otp:
 *                 type: string
 *                 example: "1234"
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example:  sarwarasik@gmail.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: User Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example:  sarwarasik@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User sign In successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: your_access_token_here
 *
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change Password
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Updated your password
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example:  sarwarasik@gmail.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Check your email
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Account recovered
 *                 success:
 *                   type: boolean
 *                   example: true
 */
