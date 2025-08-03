const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

router.get('/', indexController.home);
router.get('/signup', authController.signupPage);
router.post('/signup', authController.signup);
router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/jobs', indexController.showJobs);
router.get('/jobs/new', indexController.newJobPage);
router.post('/jobs', indexController.createJob);
router.put('/jobs/:id', indexController.updateJob);
router.delete('/jobs/:id', indexController.deleteJob);

module.exports = router;
