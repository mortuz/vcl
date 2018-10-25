const express = require('express');
const router = express.Router();
var User = require('../../models/user');

router.get('/', function (req, res) {
    res.render('auth/signin');
})

router.post('/', function (req, res) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password must have atleast 4 characters').isLength({ min: 4 });

    var errors = req.validationErrors();
    
    if (errors) {
        console.log(errors);
        res.redirect('/auth/signin');
    } else {

        User.findOne({email: req.body.email}, (err, user) => {

            if (err) {
                req.flash('error', 'Email is not registered.');
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