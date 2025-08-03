const jobModel = require('../models/jobModel');

exports.home = (req, res) => {
  res.render('home');
};

exports.showJobs = async (req, res) => {
  try {
    const jobs = await jobModel.getAllJobs();
    res.render('jobs', { jobs: jobs.rows });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).send('Server error');
  }
};

exports.newJobPage = (req, res) => {
  // Pass default empty arrays for error/success messages
  res.render('new_job', { error: [], success: [] });
};

exports.createJob = async (req, res) => {
  const { title, description, price, contact } = req.body;
  try {
    await jobModel.createJob(title, description, price, contact, req.session.userId);
    req.flash('success', 'Job created successfully!');
    res.redirect('/jobs');
  } catch (err) {
    console.error('Error creating job:', err);
    req.flash('error', 'Error creating job.');
    res.redirect('/jobs/new');
  }
};

exports.updateJob = async (req, res) => {
  const { title, description, price, contact } = req.body;
  const jobId = parseInt(req.params.id, 10);

  if (isNaN(jobId)) {
    req.flash('error', 'Invalid job ID.');
    return res.redirect('/jobs');
  }

  try {
    await jobModel.updateJob(jobId, title, description, price, contact, req.session.userId);
    req.flash('success', 'Job updated successfully!');
    res.redirect('/jobs');
  } catch (err) {
    console.error('Error updating job:', err);
    req.flash('error', 'Error updating job.');
    res.redirect('/jobs');
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await jobModel.deleteJob(req.params.id, req.session.userId);
    req.flash('success', 'Job deleted successfully!');
    res.redirect('/jobs');
  } catch (err) {
    console.error('Error deleting job:', err);
    req.flash('error', 'Error deleting job.');
    res.redirect('/jobs');
  }
};
