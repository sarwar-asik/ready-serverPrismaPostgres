"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const listLogFiles_1 = require("../../../helpers/listLogFiles");
const getAllErrorLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errorFiles = (0, listLogFiles_1.listLogFiles)("errors");
    if (errorFiles.length === 0) {
        res.status(200).send(`<h1>Error Logs...</h1><p>No error logs. available.</p>`);
    }
    else {
        const fileListHTML = errorFiles
            .map((file) => `
      <li><a href="/logs/errors/${file}">${file}</a></li>
    `)
            .join("");
        res.status(200).send(`
    <html>
      <head>
        <title>Error Logs.</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Error Logs.</h1>
        <ul>${fileListHTML}</ul>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
    }
});
const getAllSuccessLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const successFiles = (0, listLogFiles_1.listLogFiles)("successes");
    if (successFiles.length === 0) {
        res
            .status(200)
            .send(`<h1>Success Logs</h1><p>No success logs available.</p>`);
    }
    else {
        const fileListHTML = successFiles
            .map((file) => `
      <li><a href="/logs/successes/${file}">${file}</a></li>
    `)
            .join("");
        res.status(200).send(`
    <html>
      <head>
        <title>Success Logs..</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Success Logs</h1>
        <ul>${fileListHTML}</ul>
        <a href="/">Back to Home.</a>

      </body>
    </html>
  `);
    }
});
const getSpecificErrorLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logfile = req.params.logfile;
    const logPath = path_1.default.join(process.cwd(), "logs", "winston", "errors", logfile);
    if (fs_1.default.existsSync(logPath)) {
        fs_1.default.readFile(logPath, "utf8", (err, data) => {
            if (err) {
                res.status(500).send(`
          <html>
            <head>
              <title>Error</title>
              <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
              <h1>Error</h1>
              <p>Failed to read log file.</p>
              <a href="/logs/errors">Back to Error Logs.</a>
            </body>
          </html>
        `);
            }
            else {
                res.status(200).send(`
          <html>
            <head>
              <title>Log File: ${logfile}</title>
              <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
              <h1>Log File: ${logfile}</h1>
              <pre>${data}</pre>
              <a href="/logs/errors">Back to Error Logs.</a>
            </body>
          </html>
        `);
            }
        });
    }
    else {
        res.status(404).send(`
      <html>
        <head>
          <title>Log Not Found</title>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <h1>Log Not Found</h1>
          <p>The log file ${logfile} does not exist.</p>
          <a href="/logs/errors">Back to Error Logs.</a>
        </body>
      </html>
    `);
    }
});
const getSpecificSuccessLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logfile = req.params.logfile;
    const logPath = path_1.default.join(process.cwd(), "logs", "winston", "successes", logfile);
    if (fs_1.default.existsSync(logPath)) {
        fs_1.default.readFile(logPath, "utf8", (err, data) => {
            if (err) {
                res.status(500);
                res.status(500).send(`
          <html>
            <head>
              <title>Error</title>
              <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
              <h1>Error</h1>
              <p>Failed to read log file.</p>
              <a href="/logs/successes">Back to Success Logs</a>
            </body>
          </html>
        `);
            }
            else {
                res.status(200).send(`
          <html>
            <head>
              <title>Log File: ${logfile}</title>
              <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
              <h1>Log File: ${logfile}</h1>
              <pre>${data}</pre>
              <a href="/logs/successes">Back to Success Logs</a>
            </body>
          </html>
        `);
            }
        });
    }
    else {
        res.status(404).send(`
        <html>
          <head>
            <title>Log Not Found</title>
            <link rel="stylesheet" href="/styles.css">
          </head>
          <body>
            <h1>Log Not Found</h1>
            <p>The log file ${logfile} does not exist.</p>
            <a href="/logs/successes">Back to Success Logs</a>
          </body>
        </html>
      `);
    }
});
exports.logsController = {
    getAllSuccessLogs,
    getAllErrorLogs,
    getSpecificSuccessLog,
    getSpecificErrorLog,
};
