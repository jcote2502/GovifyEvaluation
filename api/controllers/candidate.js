const express = require("express");
const router = express.Router();
const db = require("../models");
const { Candidates } = db;
const candidateData = require("../dataset/candidates")


// Create new candidate
router.post("/create", async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const newCandidate = await Candidates.create({
            firstName,
            lastName,
            email,
        });
        res.status(201).json({
            message: 'Candidate created successfully',
            candidate: newCandidate,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the candidate',
            error: err.message,
        });
    }
});

// load in prefabricated data for functionality
router.post("/dataload", async (req, res) => {
    try {
        // Bulk create candidates from the imported data
        const newCandidates = await Candidates.bulkCreate(candidateData);

        res.status(201).json({
            message: 'All candidates created successfully',
            candidates: newCandidates,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while creating the candidates',
            error: err.message,
        });
    }
});

// Delete specific candidate record
router.delete('/delete/:cID', async (req, res) => {
    try {
        const { cID } = req.params;

        const candidate = await Candidates.findByPk(cID);

        if (!candidate) {
            return res.status(404).json({
                message: 'Candidate not found',
            });
        }

        await candidate.destroy();

        res.status(200).json({
            message: 'Candidate deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while deleting the candidate',
            error: err.message,
        });
    }
});

// Update specific candidate by ID
router.put('/update/:cID', async (req, res) => {
    try {
        const { cID } = req.params;
        const { firstName, lastName, email } = req.body;

        const candidate = await Candidates.findByPk(cID);

        if (!candidate) {
            return res.status(404).json({
                message: 'Candidate not found',
            });
        }

        // Update the candidate's details
        candidate.firstName = firstName || candidate.firstName;
        candidate.lastName = lastName || candidate.lastName;
        candidate.email = email || candidate.email;

        await candidate.save();

        res.status(200).json({
            message: 'Candidate updated successfully',
            candidate: candidate,
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 102, error: err.message });
        }
        else {
            console.error(err);
            res.status(500).json({
                message: 'An error occurred while updating the candidate',
                error: err.message,
            });
        }

    }
});

// Retrieve all records from candidates table
router.get('/getall', async (req, res) => {
    try {
        const candidates = await Candidates.findAll();

        res.status(200).json({
            message: 'Candidates retrieved successfully',
            candidates: candidates.reverse(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while retrieving candidates',
            error: err.message,
        });
    }
});

// Fetch single candidate by ID
router.get('/get/:cID', async (req, res) => {
    try {
        const { cID } = req.params;
        const candidate = await Candidates.findByPk(cID);
        if (!candidate) {
            return res.status(404).json({
                message: 'Candidate not found',
            });
        }
        res.status(200).json({
            message: 'Candidate retrieved successfully',
            candidate: candidate,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'An error occurred while retrieving candidates',
            error: err.message,
        });
    }
});

module.exports = router;