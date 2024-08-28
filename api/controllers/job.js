const express = require('express');
const router = express.Router();
const db = require("../models");
const jobData = require("../dataset/jobs");
const { Jobs } = db;

// Create New Job
router.post('/addjob', async (req, res) => {
    try {
        const { title, description, hiringManager,company } = req.body;
        const newJob = await Jobs.create({
            title,
            description,
            hiringManager,
            company
        });
        res.status(201).json({
            message: 'Job created successfully',
            job: newJob,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the job',
            error: err.message,
        });
    }
});

// Load in prefabricated data for functionality
router.post('/dataload', async (req, res) => {
    try {
        // Bulk create jobs from the imported data
        const newJobs = await Jobs.bulkCreate(jobData);

        res.status(201).json({
            message: 'All jobs created successfully',
            jobs: newJobs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the jobs',
            error: err.message,
        });
    }
});

// Retrieve all records from job table
router.get('/getall', async (req, res) => {
    try {
        const jobs = await Jobs.findAll();

        res.status(200).json({
            message: 'Jobs retrieved successfully',
            jobs: jobs.reverse(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while retrieving jobs',
            error: err.message,
        });
    }
});

// Retrieve specific job by ID
router.get('/get/:jID', async (req, res) => {
    try {
        const { jID } = req.params;
        const job = await Jobs.findByPk(jID);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
            });
        }
        res.status(200).json({
            message: 'Job retrieved successfully',
            job: job,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while retrieving jobs',
            error: err.message,
        });
    }
});

// Update specific job by ID
router.put('/update/:jID', async (req, res) => {
    try {
        const { jID } = req.params;
        const { title, description, hiringManager, company} = req.body;

        const job = await Jobs.findByPk(jID);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
            });
        }

        job.title = title || job.title;
        job.description = description || job.description;
        job.hiringManager = hiringManager || job.hiringManager;
        job.company = company || job.company;

        await job.save();

        res.status(200).json({
            message: 'Job updated successfully',
            job: job,
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 101, error:err.message});
        }
        else{
            console.error(err);
            res.status(500).json({
                message: 'An error occurred while updating the job',
                error: err.message,
            });
        }
    }
});

router.delete('/delete/:jID', async (req, res) => {
    try {
        const { jID } = req.params;

        const job = await Jobs.findByPk(jID);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
            });
        }

        await job.destroy();

        res.status(200).json({
            message: 'Job deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while deleting the job',
            error: err.message,
        });
    }
});

module.exports = router;