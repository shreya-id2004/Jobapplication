const express = require('express');
const router = express.Router();

const job = require('../module/jobapp.js');
const {isLoggedIn} = require('../middleware');
 
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const jobs = await job.find({ user: req.user._id }).sort({ deadline: 1 });

        res.render('home.ejs', { jobs, messages: req.flash() });
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
    
});

router.get('/add', isLoggedIn,(req, res) => {
    res.render('add.ejs');
});

router.post('/add', isLoggedIn,async(req, res) => {
    try{
        const { jobname, company, link, deadline } = req.body;
        const newJob = new job({
            jobname , company, link,
            deadline : deadline ? new Date(deadline) : null,
            user: req.user._id
        });
        await newJob.save();
        req.flash('success', 'Job added successfully!')
        res.redirect('/');
    }
    catch(err){
        console.log(err);
        req.flash('error', 'Failed to add job');
        res.redirect('/');
    }
    
});

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    try {
        const jobData = await job.findOne({_id:req.params.id, user:req.user._id});

        if (!jobData) {
            req.flash('error', 'Job not found');
            return res.redirect('/');
        }

        res.render('edit.ejs', { job: jobData,});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/edit/:id',  isLoggedIn ,async(req, res) => {
    try{
        const { id } = req.params;
        const { jobname, link, deadline } = req.body;
        await job.findByIdAndUpdate(id, { jobname, link, deadline });
        req.flash('success', 'Job updated successfully!')
        res.redirect('/');
    }
    catch(err){
        console.log(err);
        req.flash('error', 'Failed to update job');
        res.redirect('/');
    }
    
});
router.get('/delete/:id',  isLoggedIn, async(req, res) => {
    try {
        await job.findByIdAndDelete(req.params.id);
        req.flash('success', 'Job deleted successfully!');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete job');
        res.redirect('/');
    }
});

router.post("/update-notes/:id" ,isLoggedIn, async(req,res)=>{
    try{
        const {notes} = req.body;
        await job.findByIdAndUpdate(req.params.id, {notes});
        res.json({success: true , message: 'Notes updated successfully!'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: "Failed to update notes" });
    }
})

router.post("/update-status/:id",isLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        await job.findByIdAndUpdate(req.params.id, { status: status });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
});


module.exports = router;