"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdfFile = exports.uploadFile = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
// Configure the storage engine
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadFilePath = '../../../uploadFile';
        // console.log(file, 'file');
        let destinationPath;
        if (file.mimetype.includes('image')) {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/images/`);
        }
        else if (file.mimetype.includes('pdf')) {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/pdfs/`);
        }
        else if (file.mimetype.includes('application')) {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/docs/`);
        }
        else if (file.mimetype.includes('video')) {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/videos/`);
        }
        else if (file.mimetype.includes('audio')) {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/audios/`);
        }
        else {
            destinationPath = path_1.default.join(__dirname, `${uploadFilePath}/others/`);
        }
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
// Define the file filter function
const fileFilterFun = (req, file, cb) => {
    const allowedMimeTypes = [
        // 'image/jpg',
        // 'image/png',
        // 'image/jpeg',
        // 'image/heic',
        // 'image/heif',
        // 'image/gif',
        // 'image/avif',
        'application/pdf',
        'application/x-x509-ca-cert',
        'application/octet-stream',
        'application/pkix-cert',
        'application/pkcs8',
        'application/msword',
        // Video formats
        'video/mp4',
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/x-msvideo', // .avi
        'video/x-flv', // .flv
        'video/quicktime', // .mov
        'video/x-ms-wmv', // .wmv
    ];
    if (allowedMimeTypes.includes(file.mimetype) ||
        file.mimetype.includes('image') || // allow all image types
        file.mimetype.includes('video') // allow all video types
    ) {
        cb(null, true);
    }
    else {
        cb(new Error('Only ' +
            allowedMimeTypes.map(type => type.split('/')[1]).join(', ') +
            'format is allowed!'));
    }
};
// Configure the multer upload
exports.uploadFile = (0, multer_1.default)({
    storage: fileStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 10 MB
    },
    fileFilter: fileFilterFun,
});
//! another pdf uploader//
const pdfStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../../uploadFile/pdfs/'));
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});
const fileFilterPdf = (req, file, cb) => {
    if (file.mimetype === 'file/pdf' || file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Only pdf format is allowed!'));
    }
};
exports.uploadPdfFile = (0, multer_1.default)({
    storage: pdfStorage,
    // limits: {
    //   fileSize: 10 * 1024 * 1024, // 10 MB
    // },
    fileFilter: fileFilterPdf,
}).single('pdf');
