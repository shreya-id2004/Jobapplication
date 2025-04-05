const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../module/user.js');

router.get('/signup',(req,res)=>{
    res.render('signup.ejs');
});

router.post('/signup',async(req,res)=>{
    const {username,password,email}  = req.body;
    const newUser = new User({username , email});
    const regUser = await User.register(newUser,password);

    req.login(regUser , (err)=>{
        if(err) return next(err);
        req.flash('success','Welcome');
        res.redirect('/');
    })
});

router.get('/login',(req,res)=>{
    res.render('login.ejs');
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", 
    failureRedirect: "/user/login",
    failureFlash: true 
}));

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err)return next(err);
        req.flash('success','Logged out successfully');
        res.redirect('/user/login');
    })
})

module.exports = router;

