import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdOn: {
      type: String,
      required: true,
      default: Date.now(),
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    techStack: {
      type: String,
      required: true,
    },
    features: [{ type: String, required: true }],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // ProjectProof Specific Fields
    status: {
      type: String,
      enum: ['draft', 'submission_requested', 'reviewing', 'approved', 'rejected', 'published'],
      default: 'draft'
    },
    githubRepoLink: { type: String },
    zipFilePath: { type: String },

    // Media & Validation
    videoLink: { type: String }, // Mandatory screen recording
    demoLink: { type: String, default: "" }, // Optional Live Demo Link
    screenshots: [{ type: String }], // Mandatory screenshots
    healthCheckReport: { type: Object }, // Automated health scan result

    originalityScore: { type: Number, default: 0 }, // 0 to 100
    diffReportPath: { type: String },
    licenseKey: { type: String },
    watermarkHash: { type: String },

    // Admin & Feedback
    adminComments: { type: String },
    reportCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 } // Analytics: Page Views
  },
  {
    timestamps: true,
  }
)

const Project = mongoose.model('Project', projectSchema)

export default Project