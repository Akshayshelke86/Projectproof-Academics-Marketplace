import express from "express";
import {
  getProjectById,
  getProjects,
  createProject,
  createProjectReview,
  updateProject,
  deleteProject,
  getProjectByUser,
  reportProject
} from "../controllers/projectController.js";
import { admin, protect, optionalProtect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(optionalProtect, getProjects).post(protect, createProject);
router.route("/user/:id").get(getProjectByUser)
router.route("/:id/reviews").post(protect, createProjectReview);
router.route("/:id/report").post(protect, reportProject);
router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, admin, deleteProject)
  .put(protect, updateProject);

export default router;
