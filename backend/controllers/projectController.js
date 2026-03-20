import asyncHandler from 'express-async-handler'
import Project from '../models/projectModel.js'

//@desc fetch all the products
//@route GET /api/products
//@access public

const getProjects = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    }
    : {}

  // ProjectProof: Allow filtering by status
  let statusFilter = {}
  if (req.user && (req.user.isAdmin || req.user.role === 'guide' || req.user.role === 'admin')) {
    if (req.query.status) {
      // Handle both single status and array of statuses
      const statuses = Array.isArray(req.query.status) ? req.query.status : [req.query.status];
      statusFilter = { status: { $in: statuses } }
    } else {
      statusFilter = {}
    }
  } else {
    statusFilter = { status: 'published' }
  }

  const count = await Project.countDocuments({ ...keyword, ...statusFilter })
  const projects = await Project.find({ ...keyword, ...statusFilter }).sort({ createdAt: -1 })
  res.json(projects)
})

//@desc fetch single products
//@route GET /api/products/:id
//@access public

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('user', 'name email role')

  if (project) {
    project.views = (project.views || 0) + 1;
    await project.save();
    res.json(project)
  } else {
    res.status(404)
    throw new Error('Project not found')
  }
})

//@desc fetch single products
//@route GET /api/products/:id
//@access public

const getProjectByUser = asyncHandler(async (req, res) => {
  const project = await Project.find({ user: req.params.id })

  if (project) {
    res.json(project)
  } else {
    res.status(404)
    throw new Error('Project not found')
  }
})

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    // Check ownership or admin
    if (project.user.toString() !== req.user._id.toString() && !req.user.isAdmin && req.user.role !== 'admin') {
      res.status(401)
      throw new Error('Not authorized')
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

// @desc Create a product
// @route POST /api/products/
// @access Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { title, price, description, image, category, techStack, features, githubRepoLink, videoLink, screenshots, zipFilePath } = req.body;

  const project = new Project({
    title: title || "Sample Project",
    price: Number(price) || 0,
    user: req.user._id,
    image: image || "/images/sample.jpg",
    category: category || "Sample Category",
    techStack: techStack || "MERN",
    features: features || ["Sample Feature"],
    description: description || "Sample description",
    githubRepoLink: githubRepoLink || "",
    videoLink: videoLink || "",
    screenshots: screenshots || [],
    zipFilePath: zipFilePath || "",
    status: 'draft'
  });
  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc Update a product
// @route PUT /api/products/
// @access Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { title, price, description, image, category, techStack, features, githubRepoLink, videoLink, screenshots, zipFilePath, status } =
    req.body;
  const project = await Project.findById(req.params.id);
  if (project) {
    // Check ownership or admin
    if (project.user.toString() !== req.user._id.toString() && !req.user.isAdmin && req.user.role !== 'admin') {
      res.status(401)
      throw new Error('Not authorized')
    }

    // Allow editing only if NOT published or reviewing (unless admin)
    // EXCEPTION: Allow Owner to set status to 'submitted_for_review' or 'unpublished'
    const isUnpublishing = status === 'unpublished';

    if (project.status === 'published' && (!req.user.isAdmin && req.user.role !== 'admin' && !isUnpublishing)) {
      res.status(400)
      throw new Error("Cannot edit published projects. Please Unpublish first.")
    }

    project.title = req.body.title || project.title;
    project.price = req.body.price !== undefined ? Number(req.body.price) : project.price;
    project.description = req.body.description || project.description;
    project.image = req.body.image || project.image;
    project.category = req.body.category || project.category;
    project.techStack = req.body.techStack || project.techStack;
    project.features = req.body.features || project.features;
    project.githubRepoLink = req.body.githubRepoLink || project.githubRepoLink;
    project.videoLink = req.body.videoLink || project.videoLink;
    project.screenshots = req.body.screenshots || project.screenshots;
    project.zipFilePath = req.body.zipFilePath || project.zipFilePath;

    // Status can only be updated to 'submission_requested' by student, or others by admin
    if (status) {
      // Allow Admin
      if (req.user.isAdmin || req.user.role === 'admin') {
        project.status = status;
      }
      // Allow Owner to Submission Request or Unpublish
      else if (status === 'submission_requested' || status === 'unpublished') {
        project.status = status;
      }
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private

const createProjectReview = asyncHandler(async (req, res) => {
  const { rating, comment } =
    req.body;
  const project = await Project.findById(req.params.id);
  if (project) {
    const alreadyReviewed = project.reviews.find(r => r.user.toString() === req.user._id.toString())
    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product already reviewed")
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    project.reviews.push(review)
    project.numReviews = project.reviews.length;
    project.rating = project.reviews.reduce((acc, item) => item.rating + acc, 0) / project.reviews.length;
    await project.save()
    res.status(201).json({ message: "Review added successfully" })
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});


// @desc Report a project
// @route POST /api/projects/:id/report
// @access Private
const reportProject = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.reportCount = (project.reportCount || 0) + 1;

    // Auto-flag if reports > 3
    if (project.reportCount > 3) {
      project.status = 'reviewing'; // Or specific 'flagged' status, but reusing 'reviewing' hides it from marketplace usually
      project.adminComments = `System: Auto-flagged due to multiple user reports. Latest reason: ${reason}`;
    }

    await project.save();
    res.status(200).json({ message: 'Project reported successfully', reportCount: project.reportCount });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  getProjectById,
  getProjects,
  getProjectByUser,
  createProject,
  createProjectReview,
  updateProject,
  deleteProject,
  reportProject
};
