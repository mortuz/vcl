var express = require('express');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var secret = 'ssshhhhkoihai';
var User = require('../models/user');
var router = express.Router();

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
    	user: 'mortuzalam@gmail.com',
    	pass: 'wtdajwdwaddTAZ1'
    }
});

router.get('/', function (req, res) {
	res.render('messages', {message: 'Link has been expired', type: 'error'});
});

router.post('/email/resend', ensureToken, function(req, res) {
	var token = req.query.token;

	jwt.verify(token, secret, function (err, decode) {
		if(err) {
			res.json({
				success: false,
				message: 'You are not authorized'
			});
		}
		var email = decode.email;

		var newToken = jwt.sign({ email: email}, secret);

		User.findOne({ token: token })
			.select('password email')
			.exec(function(err, user) {
				if (err) {
					res.json({
						success: false,
						message: 'Unable to send verfication email at this moment'
					});
				}

				if(user.email != email) {
					res.json({
						success: false,
						message: 'You are not authorized to make changes'
					});
				}

				// send response
				res.json({
					success: true,
					message: 'Your account is created. Please check your email for activation link.'
				});

				user.active_token = newToken;
				user.save(function(err) {
					if (err) {
							res.json({
							success: false,
							message: 'Could not make changes'
						});
					}

					// send mail
					// setup email data with unicode symbols
					let mailOptions = {
					    from: '"Animango team" <animango@idevia.in>', // sender address
					    to: email, // list of receivers
					    subject: 'Verify Email', // Subject line
					    html: `
					    <b>Hello,</b><br/>
					    <p>You need to verify your email. To activate your account please click the link below</p>
					    <a href="https://animango.herokuapp.com/auth/email/active?t=${newToken}">${newToken}</a>
					    `
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message %s sent: %s', info.messageId, info.response);
					});

					res.json({
						success: true,
						message: 'Profile updated'
					});
				})		
			});		
	});
});

router.get('/info', ensureToken, function (req, res) {
	var token = req.query.token;

	jwt.verify(token, secret, function (err, decode) {
		if(err) {
			res.json({
				success: false,
				message: 'You are not authorized'
			});
		}
		var email = decode.email;

		var newToken = jwt.sign({ email: email}, secret);

		User.findOne({ token: token })
			.select('name email profilePicture created active favourites isPrime role subscriptions')
			.exec(function(err, user) {
				if (err) {
					res.json({
						success: false,
						message: 'Unable to get info at this moment'
					});
				}
				if(user.email != email) {
					res.json({
						success: false,
						message: 'You are not authorized to make changes'
					});
				}

				res.json(user);

			});		
	});
});

router.get('/email/active', function(req, res){
	var token = req.query.t;

	// get user by token
	User.findOne({ active_token: token })
	.select('active_token active password')
	.exec(function(err, user) {
		if (err) {
			console.log(err);
			res.render('messages', {
				success: 'error',
				message: 'Could not active your email'
			});
		}
		if(!user) {
			res.render('messages', {
				type: 'error',
				message: 'Could not activate your email'
			});
		} else {

				// if user found verify token
				jwt.verify(token, secret, function (err, decode) {
					if(err) {
						res.render('messages', {
							type: 'error',
							message: 'Activation link expired'
						})
					} else {
						// set temporary token null
						user.active_token = '';
						// activate user
						user.active = true;
						user.save();
						
						res.render('messages', {
							type: 'success',
							message: 'Account activated successfully'
						})
						// res.json({
						// 	success: true,
						// 	message: 'Account activated successfully'
						// })
					}
				});
			}
		})

});

router.post('/password/request', function (req, res){
	var email = req.param('email');
	req.check('email', 'Invalid email address').isEmail();

	req.getValidationResult().then(function(result) {
		if(!result.isEmpty()) {
			res.json({
				success: false,
				errors: result.array()
			});
		} 

		User.findOne({ email: email })
		.select('password recoveryToken email')
		.exec(function (err, user) {
			if(err) {
				res.json({
					errors: err
				})
			}
			if(user) {
				// send mail
				var token = jwt.sign({ email: email }, secret, { expiresIn: '48h'});
				user.recoveryToken = token;
				user.save(); 
				// setup email data with unicode symbols
				let mailOptions = {
				    from: '"Animango Team" <animango@idevia.in>', // sender address
				    to: email, // list of receivers
				    subject: 'Password Recover', // Subject line
				    html: `
				    <b>Hello,</b><br/>
				    <p>To recover your password click the link below. This link will be activated for 48h</p>
				    <a href="https://animango.herokuapp.com/user/password/recover?t=${token}">${token}</a>
				    `
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					console.log('Message %s sent: %s', info.messageId, info.response);
				});
			}
			res.json({
				message: 'Instructions for recovering have been sent to your email'
			});
		});
			
	});
});

router.get('/password/recover', function (req, res) {
	var token = req.query.t;
	if(!token) {
		res.render('messages', { 
			type: 'error',
			message: 'Lost your way?'
		});
	}
	// check token
	jwt.verify(token, secret, function (err, decode){
		if (err) {
			res.render('message', { message: err.message, type: 'error' });
		}
		var email = decode.email;
		// get user
		User.findOne({ recoveryToken: token })
		.select('email password')
		.exec(function (err, user) {
			if(err) {
				res.json({
					error: err
				})
			}
			if(!user) {
				res.render('messages', { 
					type: 'error',
					message: 'Lost your way'
				});
			}

			if(user.email != email) {
					// token mismactch can not recover password
					res.render('messages', { 
						type: 'error', 
						message: 'We are unable to reset your password. Please try again' 
					});
				} else {
					// render page
					res.render('forgot', { token: token })
				}
			});
	});
});

router.post('/password/recover', function (req, res) {
	// get token from param
	var token = req.param('t');
	if(!token) {
		res.render('messages', { message: 'Lost your way?' });
	}

	var password = req.param('password');
	var confirmPassword = req.param('confirmPassword');

	// password validation
	req.check('password', 'Password must have atleast 4 characters').isLength({ min: 4}).equals(confirmPassword);

	var errors = req.validationErrors();

	if (errors) {
		res.render('forgot', { errors: errors, token: token });
	} else {
		// check token
		var tokenObject = jwt.verify(token, secret, function (err, decode) {
			if(err) {
				res.render('messages', { message: err.message, type: 'error' });
			}

			var email = decode.email;
			User.findOne({ recoveryToken: token })
			.select('recoveryToken password email')
			.exec(function (err, user) {
				if(err) {
					res.render('messages', { message: 'Lost your way?', type: 'error' })
				}
				if(!user) {
					res.render('messages', { message: 'Lost your way?', type: 'error' })
				}
				// password update
				if (user.email !== email) {
					res.render('messages', {message: 'You are not allowed', type: 'warning'})
				}
				user.password = password;
				user.recovery_token = '';
				user.save(function(err) {
					if(err) {
						res.render('messages', { message: message, type: 'error'});
					} else {
						res.render('messages', { message: 'Your password has been reset.', type: 'success' })
					}
				});
			});
		});
	}
});

router.post('/profile/update', ensureToken, function (req, res) {
	var token = req.query.token;
	var name = req.query.name;
	var profileImg = req.query.profileImg;
	req.check('name', 'Name is not valid').isLength({min: 3}).isAlpha();
	req.check('profileImg', 'Profile picture is not available').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		res.json({
			success: false,
			message: 'name or image missing'
		});
	}

	jwt.verify(token, secret, function (err, decode) {
		if(err) {
			res.json({
				success: false,
				message: 'You are not authorized'
			});
		}
		var email = decode.email;

		User.findOne({ token: token })
			.select('password profilePicture name')
			.exec(function(err, user) {
				if (err) {
					res.json({
						success: false,
						message: 'Unable to update your profile at this moment'
					});
				}

				if(user.email != email) {
					res.json({
						success: false,
						message: 'You are not authorized to make changes'
					});
				}

				user.profilePicture = profileImg;
				user.name = name;
				user.save(function(err) {
					if (err) {
							res.json({
							success: false,
							message: 'Couldn\'t save changes'
						});
					}
					res.json({
						success: true,
						message: 'Profile updated'
					});
				})		
			});		
	});
});

router.post('/password/change', ensureToken, function (req, res){
	var token = req.query.token;
	var result = jwt.verify(token, secret);
	var password = req.query.password;
	req.check('password', 'Password must have atleast 4 characters').isLength({ min: 4});

	var errors = req.validationErrors();

	if(errors) {
		res.json({
			success: false,
			message: "Could not change password",
			errors: errors
		});
	} else {
		User.findOne({ token: token })
		.select('password token email')
		.exec(function (err, user) {
			if (err) throw err;
			if(result.email != user.email) {
				res.json({
					success: false,
					message: 'Encoding error'
				})
			} else {
				user.password = password;
				user.save();
				res.json({
					success: true,
					message: 'Password changed'
				});
			}
		});
	}
});

router.get('/favourites', ensureToken, function (req, res) {
	var token = req.query.token;
	var result = jwt.verify(token, secret);
	var action = req.query.action;
	var password = req.query.password;
	req.check('comic', 'Invalid comic id').isAlphanumeric();

	var errors = req.validationErrors();

	if(errors) {
		res.json({
			success: false,
			message: "Could add to favourites",
			errors: errors
		});
	} else {
		User.findOne({ token: token })
		.select('password favourites')
		.exec(function (err, user) {
			if (err) throw err;
			if(result.email != user.email) {
				res.json({
					success: false,
					message: 'Encoding error'
				})
			} else {
				if(action == 'add') {
					user.favourites.push(comic);
				}
				if(action == 'remove') {
					var index = user.favourites.indexOf(comic);
					user.favourites.splice(index, 1);
				}
				user.save(function (err) {
					if(err) {
						res.json({
							success: false,
							message: 'Unable to make changes'
						})
					}
					res.json({
						success: true,
						message: 'Password changed'
					});
				});				
			}
		});
	}
});

function ensureToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.query.token = bearerToken;
		next();
	} else {
		res.json({
			success: false,
			message: 'Missing authorization header'
		});
	}
}

module.exports = router;