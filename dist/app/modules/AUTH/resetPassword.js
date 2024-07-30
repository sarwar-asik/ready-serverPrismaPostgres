"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHTML = exports.resetPasswordSubject = void 0;
exports.resetPasswordSubject = "Reset Your Password";
const resetPasswordHTML = (link) => {
    return `<html>
    <head>
        <meta charset="UTF-8">
        <title>Password Reset - Ordain Interior</title>
        <style>
            /* Add some styling here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                font-size: 18px;
                line-height: 1.6;
                color: #666;
            }
            .button {
                display: inline-block;
                background-color: #007BFF;
                color: white;
                text-align: center;
                padding: 10px 20px;
                border: none;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Reset Your Password</h1>
            <p>
                Hello Interior User !
                <br>
                You have requested a password reset for your Ordain Interior account. Click the button below to set a new password.
            </p>
            <p>
                <a href="${link}" class="button">Reset Your Password</a>
            </p>
            <p>If you didn't request a password reset, you can ignore this email. Your account's security is important to us.</p>

            <p>@ sarwar hossain </p>
        </div>
    </body>
    </html>
    `;
};
exports.resetPasswordHTML = resetPasswordHTML;
