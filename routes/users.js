module.exports = (function() {
	'use strict';

	var express    = require('express');
	var app        = express();
	var apiRoutes = express.Router();

	apiRoutes.post('/auth', function(req, res) {

		User.findOne({
			login: req.body.login
		}, function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({ success: false, message: 'Authentication failed. User not found for: ' + req.body.login });
				return;
			}

			if (user) {

				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					return;
				}

				var token = jwt.sign(user, app.get('superSecret'), {
					expireInMinutes: 1440
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		});
	});

	apiRoutes.use(function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (!token) {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}

		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			}

			req.decoded = decoded;
			next();
		});
	});

	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to the coolest API!' });
	});

	apiRoutes.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			res.json(users);
		});
	});

	apiRoutes.post('/new-user', function(req, res) {

		if (!(req.body.login | req.body.password | req.body.role)) {
			res.json({ success: false, message: 'Complete the form!' });
			return;
		}

		var user = new User({
			login: req.body.login,
			password: req.body.password,
			name: req.body.name,
			role: req.body.role
		});

		user.save(function(err) {
			if (err) throw err;
			res.json({ success: true, message: 'User created!' });
		});
	});

	apiRoutes.post('/delete-user', function(req, res) {
		var userRole = jwt.decode( req.header( 'x-access-token' ) )._doc.role;

		if( userRole != 1 ) {
			res.json({ success: false, message: "You do not have sufficient permissions to delete some user." });
		}

		if (!req.body.id) {
			res.json({ success: false, message: 'Invalid ID' })
		}
	});

	app.use('/api', apiRoutes);

	return users;
})();