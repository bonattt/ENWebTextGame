var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    res.render('game', { 
        title: 'Express',
        eventTitle: "Event",
        eventText: "stuff is happening!"
    });
});


router.get('/users', function(req, res) {
	console.log('GET: "users"');
	mongoose.model('users').find(function(err, users) {
		console.log("users: " + users);
		res.send(users);
	});
});


router.post('/users', function(req, res) {
	console.log('POST: "users"');
	mongoose.model('users').insert()
});


router.get('/gameTeXtArEa', function(req, res) {
	res.render('textarea', {
        title: 'game!',
        eventTitle: "Event",
        eventText: "stuff is happening!"
    });
});


module.exports = router;
