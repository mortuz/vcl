const express = require('express');
const router = express.Router();
var User = require('../../models/user');

router.get('/', function (req, res) {
    var errors = req.session.errors || {};
    var value = req.session.formValues || {};
    req.session.formValues = {};
    req.session.errors = {};
    res.render('auth/signin', { success: req.session.success, value: value, errors: errors });
})

router.post('/', function (req, res) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password must have atleast 4 characters').isLength({ min: 6 });

    var errors = req.validationErrors();
    
    if (errors) {
        var formatterErrors = {};
        req.session.formValues = req.body;
        errors.forEach(err => {
            formatterErrors[err.param] = err.msg;
        });
        req.session.errors = formatterErrors;
        
        req.session.success = false;
        res.redirect('/auth/signin');
    } else {
        req.session.success = true;
        User.findOne({email: req.body.email}, (err, user) => {

            if (err) {
                req.flash('error', 'Enexpected error occured.');
                // no user found
                res.redirect("/auth/signin");
            } else {

                if(!user) {
                    req.flash('error', 'Email is not registered.');
                    res.redirect('/auth/signin');

                } else {

                    var validPassword = user.comparePassword(req.body.password);

                    if (!validPassword) {
                        // password do not match
                        req.flash("error", "Invalid credentials.");
                        res.redirect("/auth/signin");
                    } else {
                        // log user in
                        console.log(user);
                        req.session.user = user._id;
                        res.redirect("/widgets");
                    }

                }
                
            }

        })
    }
})

module.exports = router;