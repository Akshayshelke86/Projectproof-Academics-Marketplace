import express from "express";
import {
    submitProject,
    checkPlagiarism,
    updateProjectStatus
} from "../controllers/submissionController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.put("/:id/submit", protect, submitProject);
router.post("/:id/check", protect, admin, checkPlagiarism);
router.put("/:id/decision", protect, admin, updateProjectStatus);

// Serve Report
router.get("/report/:id", protect, async (req, res) => {
    const Project = (await import('../models/projectModel.js')).default;
    const project = await Project.findById(req.params.id);
    if (project && project.diffReportPath) {
        const path = (await import('path')).default;
        const __dirname = path.resolve();
        const absolutePath = path.join(__dirname, project.diffReportPath);
        res.download(absolutePath);
    } else {
        res.status(404).send('Report not found');
    }
});

export default router;
