const Job = require('../module/jobapp.js');
const mongoose = require('mongoose');
const moment = require('moment');

//Get Dashboard with stats
const getDashboard = async (req, res) => {
    try {

        const user = req.user._id 

        // Check all jobs
        const allJobs = await Job.find();
        console.log('Total jobs in DB:', allJobs.length)

        const pendingJobs = await Job.countDocuments({
            user: user,
            status: 'pending'
        });

        const interviewJobs = await Job.countDocuments({
            user: user,
            status: 'interview'
        });

        const declinedJobs = await Job.countDocuments({
            user: user,
            status: 'declined'
        });

        const sixMonthsAgo = moment().subtract(6, 'months').toDate();

        const monthlyData = await Job.aggregate([
            {
                $match: {
                    user: new  mongoose.Types.ObjectId(user),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format monthly data for Chart.js
        const chartData = monthlyData.map(item => {
            const monthName = moment()
                .month(item._id.month - 1)
                .format('MMM');
            return {
                month: `${monthName} ${item._id.year}`,
                count: item.count
            };
        });

        // Render dashboard page
        res.render('dashboard', {
            title: 'Dashboard',
            status: {
                pending: pendingJobs,
                interview: interviewJobs,
                declined: declinedJobs,
                total: pendingJobs + interviewJobs + declinedJobs
            },
            chartData: chartData
        });

    } catch (err) {
        console.error('Dashboard Error:', err);
        res.status(500).send('Error loading dashboard');
    }
};

module.exports = {
  getDashboard
};