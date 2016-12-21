'use strict'

var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session 中间件
app.use(session({
	name: config.session.key, // 设置cookie 中保存session id 的字段名称
	secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使产生的signedCookie防篡改
	cookie: {
		maxAge: config.session.maxAge// 过期时间，过期后cookie 中的session id 自动删除
	},
	store: new MongoStore({ // 将session存储到mongodb
		url: config.mongodb // mongodb 地址
	})
}));

// flash 中间价，用来显示通知
app.use(flash());

// 设置模板全局变量
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});

app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
	keepExtensions: true // 保留后缀
}));

// 路由
routes(app);



// 监听端口，启动程序
app.listen(config.port, function() {
	console.log(`${pkg.name} listening on port ${config.port}`);
});