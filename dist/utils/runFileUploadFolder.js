"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectories = createDirectories;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to check and create directories
function createDirectories(baseDir, folders) {
    const defaultBaseDir = path_1.default.join(__dirname, '../../uploadFile');
    const defaultFolders = [
        'images',
        'audios',
        'pdfs',
        'videos',
        'docs',
        'others',
    ];
    const finalBaseDir = baseDir
        ? path_1.default.join(__dirname, baseDir)
        : defaultBaseDir;
    const finalFolders = folders || defaultFolders;
    // Check if base directory exists, if not create it
    if (!fs_1.default.existsSync(finalBaseDir)) {
        fs_1.default.mkdirSync(finalBaseDir);
        // eslint-disable-next-line no-console
        console.log(`Created base directory: ${finalBaseDir}`);
    }
    // Iterate through the folders and create them if they don't exist
    finalFolders.forEach(folder => {
        const folderPath = path_1.default.join(finalBaseDir, folder);
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath);
            // eslint-disable-next-line no-console
            console.log(`Created folder: ${folderPath}`.green);
        }
        else {
            // eslint-disable-next-line no-console
            // console.log(`Folder already exists: ${folderPath}`.yellow);
        }
    });
}
