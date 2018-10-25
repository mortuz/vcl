const express = require('express');
const router = express.Router();
var mailer = require("../utils/mailer");
var jwt = require("jsonwebtoken");
var secret = "ssshhhhkoihai";

var User = require('../models/user');

router.get('/activate', function (req, res) {
    var token = req.query.token;

    User.findOne({ active_token: token }, (err, user) => {
        
        if (user) {
            console.log(user);

            // verify a token symmetric
            jwt.verify(token, secret, function (err, decoded) {

                var email = decoded.email;
                console.log(email);

                if (email == user.email) {
                    // activate user
                    console.log('activate user')
                    user.active_token = '';
                    user.save();
                    console.log(user);

                    res.redirect("/auth/signin");

                } else {
                    // redirect to 404
                    res.redirect("/not-found");
                }
            });

        } else {
            res.redirect("/auth/signin");
        }
    });
    
})

router.get('/recover', (req, res) => {
    res.render('auth/recover');
});

router.post('/recover', (req, res) => {
    var email = req.body.email;
    req.check("email", "Invalid email address").isEmail();

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/auth/recover');
    } else {
        User.findOne({ 'email': email }, (err, user)=> {
            if (err) {
                req.session.errors = [{"msg": "Unexpected error occured"}]
                res.redirect('/auth/recover');
            } else {
                if (!user) {
                    req.session.errors = [{ "msg": "Email not registered" }]
                    res.redirect('/auth/recover');
                } else {
                    var token = jwt.sign({ email: email }, secret);

                    user.recovery_token = token;
                    user.save();

                    mailer.sendMail(email, 'VCL Password Recover', '<p>To recover your account click <a href="http://localhost:3000/auth/reset?token='+ token +'">here</a>.</p>');
                    // flash message instructions send
                    res.redirect('/auth/recover');
                }
            }
        })
    }
});

router.get('/reset', (req, res) => {
    var token = req.query.token;

    res.render('auth/reset', { token: token });
})

router.post('/reset', (req, res) => {
    var token = req.body.token;
    req
        .check("password", "Password must have atleast 4 characters")
        .isLength({ min: 4 });
    req.check("confirm_password", "Password do not match").matches(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        // error messages
        res.render("/auth/reset", { token: token });
    } else {
        //
        User.findOne({ 'recovery_token': token }, (err, user) => {
            if (err) {
                console.log(err)
                // unexpected error occued
                req.flash('error', 'Enexpected error occured');
                res.redirect("/auth/recover");
            } else {
                if (!user) {
                    // unexpected error occued
                    req.flash("error", "Enexpected error occured");
                    res.redirect("/auth/recover");
                } else {
                    jwt.verify(token, secret, function (err, decoded) {

                        var email = decoded.email;

                        if (email == user.email) {
                            // activate user
                            user.recovery_token = '';
                            user.password = req.body.password;
                            user.save();
                            // password reset
                            req.flash('success', 'Password has been reset');
                            res.redirect("/auth/signin");

                        } else {
                            // redirect to 404
                            req.flash("error", "Enexpected error occured");
                            res.redirect("/not-found");
                        }
                    });
                }
            }
        })
    }
});

router.get('/signout', (req, res) => {
    req.flash("success", "You have successfully logged out");
    req.session.destroy();
    res.redirect('/auth/signin');
});

module.exports = router;