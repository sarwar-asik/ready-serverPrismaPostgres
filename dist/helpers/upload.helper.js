"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocalServerImageFile = exports.uploadLocalFileURL = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadLocalFileURL = (req, fileType, fieldName) => {
    let profile_image = null;
    if (fileType === 'single') {
        const { file } = req;
        if (file && file.filename) {
            const fileData = file;
            profile_image = `/uploadFile/images/${fileData.filename}`;
            req.body[fieldName] = profile_image;
            return {
                original_filename: fileData === null || fileData === void 0 ? void 0 : fileData.filename,
                fileType: fileData === null || fileData === void 0 ? void 0 : fileData.mimetype,
                path: '/uploadFile/images',
                img_url: `/uploadFile/images/${fileData.filename}`,
                size: file === null || file === void 0 ? void 0 : file.size,
            };
        }
    }
    if (fileType === 'multiple') {
        const files = req.files;
        profile_image = [];
        const profileData = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                // eslint-disable-line
                profile_image.push(`/images/${files[i].filename}`);
                profileData.push({
                    original_filename: files[i].originalname,
                    fileType: files[i].mimetype,
                    path: 'uploadFile/images',
                    img_url: `uploadFile/images/${files[i].filename}`,
                    size: files[i].size,
                });
            }
            req.body[fieldName] = profile_image;
            return profileData;
        }
    }
    return undefined;
};
exports.uploadLocalFileURL = uploadLocalFileURL;
const deleteLocalServerImageFile = (filePath) => {
    const absolutePath = path_1.default.join(process.cwd(), filePath);
    fs_1.default.access(absolutePath, fs_1.default.constants.F_OK, err => {
        if (err) {
            console.error(`File not found: ${absolutePath}`);
            return;
        }
        fs_1.default.unlink(absolutePath, err => {
            if (err) {
                console.error(`Error deleting file: ${absolutePath}`, err);
            }
            else {
                console.log(`Successfully deleted file: ${absolutePath}`);
            }
        });
    });
};
exports.deleteLocalServerImageFile = deleteLocalServerImageFile;
