const express = require("express");
const router = express.Router();

// controller imports
const candidateController = require('./candidate');
const jobController = require('./job');
const candidatejobController = require('./candidatejob');
const adminController = require('./auth');

// route assignments
router.use('/candidates', candidateController);
router.use('/jobs', jobController);
router.use('/candidatejobs', candidatejobController);
router.use('/admin', adminController);

module.exports = router;