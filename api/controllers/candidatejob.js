const express = require('express');
const router = express.Router();
const db = require("../models");
const assignmentData = require("../dataset/assignments");

const { Candidatejobs, Jobs, Candidates } = db;

// retrieves every job with associated Candidates
router.get('/get', async (req, res) => {
    try {
        const jobsWithCandidates = await Jobs.findAll({
            include: [
                {
                    model: Candidatejobs,
                    required: true, // Ensures that only jobs with candidates are included
                    include: [
                        {
                            model: Candidates,
                            attributes: ['cID', 'firstName', 'lastName', 'email']
                        }
                    ]
                }
            ]
        });

        // clean structure for front end
        const formattedData = jobsWithCandidates.map(job => ({
            job: {
                jID: job.jID,
                title: job.title,
                company: job.company,
                description: job.description,
                hiringManager: job.hiringManager
            },
            candidates: job.Candidatejobs.map(cj => ({
                cID: cj.Candidate.cID,
                firstName: cj.Candidate.firstName,
                lastName: cj.Candidate.lastName,
                email: cj.Candidate.email
            }))
        }));

        res.json({ assignments: formattedData });
    } catch (error) {
        console.error('Error fetching jobs with candidates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get every job associated with specific candidate
router.get('/getjobsfor/:cID', async (req, res) => {
    const { cID } = req.params;
    try {
        const jobs = await Candidatejobs.findAll({
            where: { cID },
            include: [
                {
                    model: Jobs,
                    attributes: ['jID', 'title', 'description', 'hiringManager', 'company'],
                },
            ],
        });
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this candidate.' });
        }
        res.status(200).json({ jobs: jobs.map(job => job.Job) });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get every candidate associated with specific job
router.get('/getcandidatesfor/:jID', async (req, res) => {
    const { jID } = req.params;
    try {
        const candidates = await Candidatejobs.findAll({
            where: { jID },
            include: [
                {
                    model: Candidates,
                    attributes: ['cID', 'firstName', 'lastName', 'email'],
                },
            ],
        });
        if (candidates.length === 0) {
            return res.status(404).json({ message: 'No Candidates found for this Job.' });
        }
        res.status(200).json({ candidates: candidates.map(candidate => candidate.Candidate) });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Load in prefabricated data for functionality
router.post('/dataload', async (req, res) => {
    try {
        // Bulk create jobs from the imported data
        const newAssignments = await Candidatejobs.bulkCreate(assignmentData);

        res.status(201).json({
            message: 'All Assignments created successfully',
            newAssignments: newAssignments,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the assignments',
            error: err.message,
        });
    }
});

// create new assignemnt in Candidatejobs table
router.post('/add/:cID/:jID/:admin', async (req, res) => {
    try {
        const { cID, jID, admin } = req.params;
        const newCandidateJob = await Candidatejobs.create({
            admin,
            cID,
            jID,
        });

        res.status(201).json({
            message: 'CandidateJob created successfully',
            candidateJob: newCandidateJob,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the candidateJob',
            error: err.message,
        });
    }
});

// delete specific assignment
router.delete('/delete/:cID/:jID', async (req, res) => {
    try {
        const { cID, jID } = req.params;

        const candidateJob = await Candidatejobs.findOne({
            where: {
                cID,
                jID,
            },
        });

        if (!candidateJob) {
            return res.status(404).json({
                message: 'CandidateJob not found',
            });
        }
        await candidateJob.destroy();
        res.status(200).json({
            message: 'CandidateJob deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while deleting the candidateJob',
            error: err.message,
        });
    }
});

// Fetch jobs that candidate is not assigned too
router.get('/unassigned-jobs/:cID', async (req, res) => {
    try {
        const { cID } = req.params;

        const unassignedJobs = await Jobs.findAll({
            where: {
                jID: {
                    // not join on tables 
                    [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT "jID" FROM "Candidatejobs" WHERE "cID" = ${cID})`)
                }
            },
            attributes: ['jID', 'title', 'company', 'hiringManager']
        });

        res.status(200).json({
            message: 'Unassigned jobs retrieved successfully',
            jobs: unassignedJobs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while retrieving unassigned jobs',
            error: err.message,
        });
    }
});

// Fetch candidates that job is not assigned too
router.get('/unassigned-candidates/:jID', async (req, res) => {
    const { jID } = req.params;
    try {
        const unassignedCandidates = await Candidates.findAll({
            where: {
                cID: {
                    // not join on tables 
                    [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT "cID" FROM "Candidatejobs" WHERE "jID" = ${jID})`)
                }
            },
            attributes: ['cID', 'firstName', 'lastName', 'email'],
        });

        res.status(200).json({
            candidates: unassignedCandidates,
        });
    } catch (error) {
        console.error("Error Fetching Unassigned Candidates:", error);
        res.status(500).json({
            message: 'An error occurred while fetching unassigned candidates',
            error: error.message,
        });
    }
});


module.exports = router;
