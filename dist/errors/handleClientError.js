"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleClientError = (error) => {
    var _a, _b;
    let errors = [];
    let message = (_a = error.message) !== null && _a !== void 0 ? _a : "Prisma Client Error (handleClientError.ts)";
    const statusCode = 400;
    if (error.code === "P2025") {
        message = ((_b = error.meta) === null || _b === void 0 ? void 0 : _b.cause) || "Record not Found (handleClientError.ts)";
        errors = [
            {
                path: "",
                message
            }
        ];
    }
    else if (error.code === "P2003") {
        if (error === null || error === void 0 ? void 0 : error.message.includes('delete()` invocation:')) {
            message = "Delete Failed (handleCLient.ts)";
            errors = [
                {
                    path: "",
                    message
                }
            ];
        }
    }
    else if (error.code === "P2002") {
        // console.log('sssssssssss',error.message,"eeeeeeeeeeee")
        message = "The value must be unique. Violation of unique constraint failed (handleClientError.ts)";
        errors = [
            {
                path: "",
                message: error.message,
            },
        ];
    }
    return {
        statusCode,
        message,
        errorMessages: errors,
    };
};
exports.default = handleClientError;
