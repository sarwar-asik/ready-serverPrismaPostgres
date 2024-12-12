"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDefinition = exports.swaggerTags = void 0;
const prisma_1 = __importDefault(require("../shared/prisma"));
const modelConverterDocs_1 = require("./modelConverterDocs");
exports.swaggerTags = [
    // use different text icons for different tags
    {
        name: "User",
        description: "👤 User profile related API"
    },
    {
        name: "Auth",
        description: "🔑 Auth related API"
    },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaModel = prisma_1.default;
exports.swaggerDefinition = (0, modelConverterDocs_1.parsePrismaSchema)(prismaModel._engineConfig.inlineSchema);
