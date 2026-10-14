const db = require("../config/db");

// Create a job
const createJob = async (postedBy, data) => {
    const {
        title, company, description, location,
        job_type, application_url, deadline
    } = data;

    const [result] = await db.query(
        `INSERT INTO jobs
         (posted_by, title, company, description, location,
          job_type, application_url, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            postedBy, title, company, description,
            location || null, job_type,
            application_url || null, deadline || null
        ]
    );

    return result.insertId;
};

// Get all jobs
const getAllJobs = async () => {
    const [rows] = await db.query(
        `SELECT j.*, u.name AS poster_name
         FROM jobs j
         INNER JOIN users u ON j.posted_by = u.user_id
         ORDER BY j.created_at DESC`
    );

    return rows;
};

// Get a job by ID
const getJobById = async (jobId) => {
    const [rows] = await db.query(
        `SELECT j.*, u.name AS poster_name
         FROM jobs j
         INNER JOIN users u ON j.posted_by = u.user_id
         WHERE j.job_id = ?`,
        [jobId]
    );

    return rows[0];
};

// Update a job
const updateJob = async (jobId, data) => {
    const {
        title, company, description, location,
        job_type, application_url, deadline
    } = data;

    await db.query(
        `UPDATE jobs SET
            title = ?,
            company = ?,
            description = ?,
            location = ?,
            job_type = ?,
            application_url = ?,
            deadline = ?
         WHERE job_id = ?`,
        [
            title, company, description, location || null,
            job_type, application_url || null,
            deadline || null, jobId
        ]
    );
};

// Delete a job
const deleteJob = async (jobId) => {
    const [result] = await db.query(
        "DELETE FROM jobs WHERE job_id = ?",
        [jobId]
    );

    return result.affectedRows;
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};