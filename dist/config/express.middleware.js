"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiterRate = exports.compressionOptions = void 0;
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//!  compressor
exports.compressionOptions = {
    threshold: 2048, //! Only compress responses larger than 1KB
    filter: function (req, res) {
        if (req.headers['x-no-compression']) {
            // Don't compress responses if this request header is present
            return false;
        }
        // Use the default filter function from compression
        return compression_1.default.filter(req, res);
    },
};
const hitCounts = {};
exports.limiterRate = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded the allowed number of requests. Please try again later.',
    },
    skip: (req) => {
        const trustedIPs = ['192.168.12.31', '192.168.12.37', ''];
        return trustedIPs.includes(req.ip);
    },
    keyGenerator: (req) => {
        const ip = req.ip;
        const path = req.path;
        const now = new Date();
        if (!hitCounts[ip]) {
            hitCounts[ip] = {
                count: 1,
                firstHit: now,
                lastHit: now,
                pathCounts: { [path]: 1 }
            };
        }
        else {
            hitCounts[ip].count++;
            hitCounts[ip].lastHit = now;
            hitCounts[ip].pathCounts[path] = (hitCounts[ip].pathCounts[path] || 0) + 1;
        }
        // eslint-disable-next-line no-console
        console.log(`from ${ip} | Total: ${hitCounts[ip].count} | First: ${hitCounts[ip].firstHit.toLocaleString()} | Last: ${hitCounts[ip].lastHit.toLocaleTimeString()} on ${hitCounts[ip].pathCounts[path]} on ${path} | ${hitCounts[ip].pathCounts[path]}`.grey);
        return ip;
    },
});
