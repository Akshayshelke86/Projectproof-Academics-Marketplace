import asyncHandler from 'express-async-handler'
import Project from '../models/projectModel.js'
import { spawn } from 'child_process'
import path from 'path'

// @desc    Submit project for final review
// @route   POST /api/projects/:id/submit
// @access  Private (Student)
// @desc    Submit project for final review
// @route   POST /api/projects/:id/submit
// @access  Private (Student)
const submitProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)

    if (project) {
        if (project.user.toString() !== req.user._id.toString()) {
            res.status(401)
            throw new Error('Not authorized')
        }

        // Ensure Mandatory Fields are present (Check body OR existing project data)
        const githubRepoLink = req.body.githubRepoLink || project.githubRepoLink
        const videoLink = req.body.videoLink || project.videoLink
        const screenshots = req.body.screenshots || project.screenshots

        if (!githubRepoLink) {
            res.status(400)
            throw new Error('GitHub Repository Link is required')
        }

        if (!videoLink) {
            res.status(400)
            throw new Error('Project Demo Video Link (YouTube/Drive) is mandatory')
        }

        if (!screenshots || screenshots.length === 0) {
            res.status(400)
            throw new Error('At least one screenshot is required')
        }

        project.status = 'submission_requested'
        project.githubRepoLink = githubRepoLink
        project.videoLink = videoLink
        project.screenshots = screenshots

        const updatedProject = await project.save()
        res.json(updatedProject)
    } else {
        res.status(404)
        throw new Error('Project not found')
    }
})

// @desc    Run Plagiarism Check
// @route   POST /api/projects/:id/check
// @access  Private (Admin)
const checkPlagiarism = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)

    if (!project) {
        res.status(404)
        throw new Error('Project not found')
    }

    // Determine scan path
    const __dirname = path.resolve()

    // If a zip file exists, we should ideally scan that. 
    // For now, we point to the uploads directory or the zip file itself if the engine supports it.
    // checker.py currently walks a directory, so we point to 'uploads' as a realistic subset for demo.
    let scanPath = path.join(__dirname, 'uploads')

    if (project.zipFilePath) {
        // If engine supported zip directly, we'd pass project.zipFilePath
        // Since it walks, we ensure the path exists.
        const fullZipPath = path.join(__dirname, project.zipFilePath)
        console.log(`[PLAGIARISM_SCAN] Project has ZIP file at: ${fullZipPath}`);
    }

    const pythonScriptPath = path.join(__dirname, 'plagiarism-engine', 'checker.py')

    // Robust python detection
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const pythonProcess = spawn(pythonCmd, [pythonScriptPath]);

    const inputData = JSON.stringify({
        projectPath: scanPath,
        title: project.title,
        techStack: project.techStack
    });

    let resultString = '';
    let errorString = '';

    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        resultString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            console.error(`[PLAGIARISM_ERROR] Python script exited with code ${code}`);
            console.error(`[PLAGIARISM_ERROR] Stderr: ${errorString.substring(0, 500)}`);

            // Fallback (if python fails)
            project.status = 'reviewing'
            project.originalityScore = 0
            project.adminComments = `Scan Failed: ${errorString.substring(0, 100)}`
            await project.save()
            return res.status(500).json({
                message: 'Similarity Scan Failed',
                error: errorString || 'Python script crashed without stderr'
            })
        }

        try {
            console.log(`[PLAGIARISM_SUCCESS] Raw Output: ${resultString}`);
            const results = JSON.parse(resultString)

            if (results.error) {
                throw new Error(results.error);
            }

            project.originalityScore = results.originalityScore
            project.watermarkHash = results.watermarkHash
            project.diffReportPath = results.diffReportPath || "Report generation failed"

            // Save Health Report
            project.healthCheckReport = results.healthReport || {}

            const healthSummary = results.healthReport?.isRunReady ? "Health: Run-Ready" : "Health: Issues Found";
            project.adminComments = `Matched Repos: ${results.matchedRepos.length}. Top Match: ${results.matchedRepos[0]?.repo || 'None'}. ${healthSummary}`

            project.status = 'reviewing'

            await project.save()
            res.json({ results, project })
        } catch (e) {
            console.error("[PLAGIARISM_PARSE_ERROR]", e)
            console.error("Result String that failed to parse:", resultString)
            res.status(500).json({ message: 'Failed to process scan results', error: e.message })
        }
    });
})

import sendEmail from "../utils/sendEmail.js"

// @desc Approve or Reject Project
// @route PUT /api/projects/:id/decision
// @access Private (Admin)
const updateProjectStatus = asyncHandler(async (req, res) => {
    const { status, comments, licenseKey } = req.body
    const project = await Project.findById(req.params.id).populate('user', 'name email')

    if (project) {
        project.status = status // 'approved', 'rejected', 'published'
        if (comments) project.adminComments = comments
        if (licenseKey) project.licenseKey = licenseKey

        if (status === 'published' && !project.licenseKey) {
            // Generate License Key
            project.licenseKey = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        const updatedProject = await project.save()

        // --- EMAIL NOTIFICATION LOGIC ---
        try {
            const subject = `Your Project "${project.title}" has been ${status}`;
            const html = `
                <h2>Project Update: ${status.toUpperCase()}</h2>
                <p>Hello ${project.user.name},</p>
                <p>Your project submission "<b>${project.title}</b>" has been reviewed.</p>
                <p><b>Status:</b> ${status}</p>
                <p><b>Admin Comments:</b> ${comments || 'No specific comments'}</p>
                <br>
                <p>Login to your dashboard to see more details.</p>
                <p>Best regards,<br>ProjectProof Team</p>
            `;
            await sendEmail({ to: project.user.email, subject, html });
        } catch (emailError) {
            console.error("[EMAIL_NOTIF_ERROR]", emailError);
        }
        // -------------------------------

        res.json(updatedProject)
    } else {
        res.status(404)
        throw new Error('Project not found')
    }
})

export { submitProject, checkPlagiarism, updateProjectStatus }
