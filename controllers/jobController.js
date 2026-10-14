const {
    createJob: createJobModel,
    getAllJobs,
    getJobById: findJobById,
    updateJob: updateJobModel,
    deleteJob: deleteJobModel
} = require("../models/jobModel");

const validJobTypes = [
    "full_time",
    "part_time",
    "internship",
    "contract"
];

const validJobData = (data) => {
    const { title, company, description, job_type, deadline } = data;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof company !== "string" || !company.trim() ||
        typeof description !== "string" || !description.trim()
    ) {
        return "Title, company, and description are required";
    }

    if (!validJobTypes.includes(job_type)) {
        return "Invalid job type";
    }

    if (
        deadline &&
        !/^\d{4}-\d{2}-\d{2}$/.test(deadline)
    ) {
        return "Deadline must use YYYY-MM-DD format";
    }

    return null;
};

// Create a job
const addJob = async (req, res) => {
    try {
        if (!["alumni", "admin"].includes(req.user.role)) {
            return res.status(403).json({
                message: "Only alumni or admins can create jobs"
            });
        }

        const validationError = validJobData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const jobId = await createJobModel(
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            message: "Job created successfully",
            job_id: jobId
        });
    } catch (error) {
        console.error("Create job error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();

        return res.status(200).json({
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error("Get jobs error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Get job details
const getJobDetails = async (req, res) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await findJobById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({ job });
    } catch (error) {
        console.error("Get job error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Update a job
const editJob = async (req, res) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await findJobById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner =
            Number(job.posted_by) === Number(req.user.userId);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: "You can only edit your own job listings"
            });
        }

        const validationError = validJobData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        await updateJobModel(jobId, req.body);

        return res.status(200).json({
            message: "Job updated successfully"
        });
    } catch (error) {
        console.error("Update job error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Delete a job
const removeJob = async (req, res) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await findJobById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner =
            Number(job.posted_by) === Number(req.user.userId);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: "You can only delete your own job listings"
            });
        }

        const deletedRows = await deleteJobModel(jobId);

        if (!deletedRows) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error("Delete job error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addJob,
    getJobs,
    getJobDetails,
    editJob,
    removeJob
};