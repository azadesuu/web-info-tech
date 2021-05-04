
var express = require('express');
var router = express.Router();
var User = require('../model/users');

 
 
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/login', function (req, res) {
    res.render('login');
});
router.get('/regist', function (req, res) {
    res.render('regist');
});



router.post('/login', function (req, res) {
	var postData = {
        username: req.body.username,
        password: req.body.password
    };
    User.findOne({
        username: postData.username,
        password: postData.password
    }, function (err, data) {
        if(err) throw err;
        if(data){
            res.send('Login successed');
        }else{
            res.send('Login failed')
        }
    } )
});

router.post('/regist', function (req, res) {
      
    var postData = {
        username: req.body.username,
        password: req.body.password,
    };
  
    User.findOne({username: postData.username}, function (err, data) {
        if (data) {
            res.send('username must be different');
        } else {
            User.create(postData, function (err, data) {
                if (err) throw err;
                console.log('regist successed');
                res.redirect('/userList');  
            }) 
        }
    });
});
 

router.get('/userList', function (req, res) {
    var userList = User.find({}, function (err, data) {
        if (err) throw  err;
        res.send(data)
    });
});
 
module.exports = router;
