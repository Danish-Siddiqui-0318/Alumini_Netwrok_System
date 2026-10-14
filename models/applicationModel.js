const db = require("../config/db");

// Apply for a job
const createApplication = async (
    jobId, userId, coverLetter, resumeUrl
) => {
    const [result] = await db.query(
        `INSERT INTO job_applications
         (job_id, user_id, cover_letter, resume_url)
         VALUES (?, ?, ?, ?)`,
        [jobId, userId, coverLetter, resumeUrl]
    );

    return result.insertId;
};

// Get an application by ID
const getApplicationById = async (applicationId) => {
    const [rows] = await db.query(
        "SELECT * FROM job_applications WHERE application_id = ?",
        [applicationId]
    );

    return rows[0];
};

// Get applications for a particular job
const getApplicationsByJobId = async (jobId) => {
    const [rows] = await db.query(
        `SELECT
            a.application_id,
            a.job_id,
            a.user_id,
            u.name AS applicant_name,
            u.email AS applicant_email,
            p.phone AS applicant_phone,
            a.cover_letter,
            a.resume_url,
            a.status,
            a.applied_at,
            a.updated_at
         FROM job_applications a
         INNER JOIN users u ON a.user_id = u.user_id
         LEFT JOIN profiles p ON a.user_id = p.user_id
         WHERE a.job_id = ?
         ORDER BY a.applied_at DESC`,
        [jobId]
    );

    return rows;
};

// Get applications submitted by a user
const getApplicationsByUserId = async (userId) => {
    const [rows] = await db.query(
        `SELECT
            a.application_id,
            a.job_id,
            a.cover_letter,
            a.resume_url,
            a.status,
            a.applied_at,
            a.updated_at,
            j.title AS job_title,
            j.company,
            j.location,
            j.job_type,
            j.deadline,
            j.posted_by
         FROM job_applications a
         INNER JOIN jobs j ON a.job_id = j.job_id
         WHERE a.user_id = ?
         ORDER BY a.applied_at DESC`,
        [userId]
    );

    return rows;
};

// Update application status
const updateApplicationStatus = async (
    applicationId, status
) => {
    await db.query(
        `UPDATE job_applications
         SET status = ?
         WHERE application_id = ?`,
        [status, applicationId]
    );
};

// Withdraw an application
const deleteApplication = async (applicationId) => {
    const [result] = await db.query(
        "DELETE FROM job_applications WHERE application_id = ?",
        [applicationId]
    );

    return result.affectedRows;
};

module.exports = {
    createApplication,
    getApplicationById,
    getApplicationsByJobId,
    getApplicationsByUserId,
    updateApplicationStatus,
    deleteApplication
};