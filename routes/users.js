var express    	= require('express');
var app        	= express();
var router 		= express.Router();
var user 		= require('../lib/user');

router.use(user.midleware);

router.get('/users', user.fetchUsers);
router.post('/auth', user.auth);
router.post('/new-user', user.newUser);
router.post('/delete-user', user.delete);

module.exports = router;