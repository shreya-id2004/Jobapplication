const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const flash = require('express-flash');
const session = require('express-session');
const nodemailer = require('nodemailer');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))
app.use(flash());

const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//const dbUrl = process.env.ATLASDB_URL;

const mongoose = require('mongoose');
main()
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log('There is a error occured in the DB connection', err);
    })

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/jobapp');
}
//'mongodb://127.0.0.1:27017/jobapp'

const User = require('./module/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const job = require('./module/jobapp.js');
const jobRouter = require('./router/jobrouter.js');
app.use('/', jobRouter);

const userRouter = require('./router/userrouter.js');
app.use('/user',userRouter);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shreyaravisha2004@gmail.com',
        pass: 'ojvf omtx bchj yodt'
    }
})

const sendEmailReminder = (job) => {
    const mailOptions = {
        from: 'shreyaravisha2004@gmail.com',
        to: 'rekharavisha2004@gmail.com',
        subject: `Job Application Reminder: ${job.jobname}`,
        text: `You have a job application deadline for ${job.jobname} at ${job.company}. Please apply before ${job.deadline}.`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    })
}

setInterval(() => {
    console.log("Checking jobs for upcoming deadlines...");
    const today = new Date();
    job.find({}).then(jobs=>{
        jobs.forEach(job => {
            const daysLeft = (new Date(job.deadline) - today) / (1000 * 60 * 60 * 24);
            console.log(`Job: ${job.jobname}, Days Left: ${Math.ceil(daysLeft)}`);
            if (daysLeft <= 2) { // Send email 1 day before the deadline
                sendEmailReminder(job);
            }
        })
    })
}, 24 * 60 * 60 * 1000); // Check every 24 hours


app.get('/progress', (req, res) => {
    res.render('progress.ejs');
})

app.listen(8080, () => {
    console.log("Server is lisengin");
})
