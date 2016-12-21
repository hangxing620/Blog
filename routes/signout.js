'use strict'

var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	res.send(res.flash());
});

module.exports = router;
