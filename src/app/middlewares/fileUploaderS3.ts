/* eslint-disable no-unused-vars */
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { Request,Express } from 'express';
import path from 'path';
// import config from '../config';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config';


const s3Config = new S3Client({
    region: config.s3.region as string,
    credentials: {
        accessKeyId: config.s3.accessKeyId as string,
        secretAccessKey: config.s3.secretAccessKey as string
    }
})

// Define the storage engine
const fileLocalStorage: StorageEngine = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        const uploadFilePath = '../../../uploadFile';
        let destinationPath;

        if (file.mimetype.includes('image')) {
            destinationPath = path.join(__dirname, `${uploadFilePath}/images/`);
        } else if (file.mimetype.includes('pdf')) {
            destinationPath = path.join(__dirname, `${uploadFilePath}/pdfs/`);
        } else if (file.mimetype.includes('application')) {
            destinationPath = path.join(__dirname, `${uploadFilePath}/docs/`);
        } else if (file.mimetype.includes('video')) {
            destinationPath = path.join(__dirname, `${uploadFilePath}/videos/`);
        } else if (file.mimetype.includes('audio')) {
            destinationPath = path.join(__dirname, `${uploadFilePath}/audios/`);
        } else {
            destinationPath = path.join(__dirname, `${uploadFilePath}/others/`);
        }

        cb(null, destinationPath);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-') +
            '-' +
            Date.now();
        cb(null, fileName + fileExt);
    },
});

// Define the S3 storage engine
const fileS3Storage = multerS3({
    s3: s3Config,
    bucket: config.s3.bucket as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file: Express.Multer.File, cb) => {
        const fileName = `${Date.now().toString()}_${file.originalname}`;
        cb(null, fileName);
    },
});

// Define the file filter function
const fileFilterFun = (req: Request, file: any, cb: FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/x-x509-ca-cert',
        'application/octet-stream',
        'application/pkix-cert',
        'application/pkcs8',
        'application/msword',
        'video/mp4',
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/x-msvideo',
        'video/x-flv',
        'video/quicktime',
        'video/x-ms-wmv',
    ];

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        file.mimetype.includes('image') ||
        file.mimetype.includes('video')
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Only ' +
                    allowedMimeTypes.map((type) => type.split('/')[1]).join(', ') +
                    ' formats are allowed!'
            )
        );
    }
};

// Multer configuration with switchable storage
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const uploadFileS3 = (useS3: boolean = false) =>
    multer({
        storage: useS3 ? fileS3Storage : fileLocalStorage,
        limits: { fileSize: 50 * 1024 * 1024 },
        fileFilter: fileFilterFun,
    });

// Example usage
// Single file upload
// app.post('/upload/single', uploadFileS3(true).single('img'), (req: Request, res: Response) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }
//     res.status(200).json({
//         message: 'File uploaded successfully',
//         file: req.file,
//     });
// });

// Multiple files upload
// app.post(
//     '/upload/multiple',
//     uploadFileS3(true).fields([
//         { name: 'img', maxCount: 1 },
//         { name: 'equipment_img', maxCount: 1 },
//         { name: 'muscle_group_img', maxCount: 1 },
//     ]),
//     (req: Request, res: Response) => {
//         if (!req.files) {
//             return res.status(400).json({ message: 'No files uploaded' });
//         }
//         res.status(200).json({
//             message: 'Files uploaded successfully',
//             files: req.files,
//         });
//     }
// );
