import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|zip/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype =
        filetypes.test(file.mimetype) || file.originalname.endsWith(".zip");

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb("Images or ZIP files only");
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "project_marketplace/images"
        });

        // Remove local file
        fs.unlinkSync(req.file.path);

        res.send(result.secure_url);
    } catch (error) {
        console.error("Cloudinary Image Upload Error:", error);
        res.status(500).send("Image upload failed");
    }
});

router.post("/project-file", upload.single("zipFile"), (req, res) => {
    const uploadedFile = req.file.path;
    const pythonScript = path.join(process.cwd(), 'plagiarism-engine', 'analyze_zip.py');

    // Execute Python Analysis FIRST (on local file)
    exec(`python "${pythonScript}" "${uploadedFile}"`, async (error, stdout, stderr) => {
        let techStack = '';
        let description = '';

        if (!error) {
            try {
                const analysis = JSON.parse(stdout);
                techStack = analysis.techStack || '';
                description = analysis.description || '';
            } catch (parseError) {
                console.error("Parse Error from Python:", parseError, stdout);
            }
        } else {
            console.error(`Exec Error from Python: ${error}`);
        }

        try {
            // Upload to Cloudinary as "raw" resource (for ZIP files)
            const result = await cloudinary.uploader.upload(uploadedFile, {
                folder: "project_marketplace/zips",
                resource_type: "raw"
            });

            // Remove local file after successful upload
            fs.unlinkSync(uploadedFile);

            res.json({
                path: result.secure_url,
                techStack,
                description
            });
        } catch (uploadError) {
            console.error("Cloudinary ZIP Upload Error:", uploadError);
            res.status(500).send("ZIP file upload failed");
        }
    });
});

export default router;

