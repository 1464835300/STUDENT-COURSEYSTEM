// var createError = require('http-errors');
const express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
const bodyPaser = require("body-parser");
const ResultJson = require("./model/ResultJson");
const AppConfig = require("./config/AppConfig");
const jwt = require("jsonwebtoken")
// var logger = require('morgan');


const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// 可能以json送到后台
app.use(bodyPaser.json({ limit: "20mb" }));
// 可能在地址栏

app.use((req, resp, next) => {
    console.log(req);
    //req：浏览器到服务器的请求
    //resp:服务器返回浏览器的
    //next:是否放行
    //颁发跨域通行证
    resp.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    resp.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Type,authorization");
    next();
});

app.use((req, resp, next) => {
    //检测是否为预检请求
    if (req.method.toUpperCase() === "OPTIONS") {
        next();
    } else {
        let token = req.header("authorization") || req.query.authorization;
        if (token) {
            try {
                let decode = jwt.verify(token, AppConfig.secret);
                next();
            } catch (e) {
                let resultJson = new ResultJson(false, "请求未授权");
                resp.status(403).json(resultJson)
                console.log(e);
            }
        } else {
            let flag = AppConfig.noRequireAuth.some(item => item.test(req.path));
            if (flag) {
                next()
            } else {
                let resultJson = new ResultJson(false, "请求未授权");
                resp.status(403).json(resultJson)
            }
        }
    }

})
//连接路由文件 
app.use("/adminInfo", require("./routes/adminInfoRouter"));
app.use("/couerInfo", require("./routes/courseInfoRouter"));
app.use("/studentInfo", require("./routes/studentInfoRouter"));
app.use("/teacherInfo", require("./routes/teacherInfoRouter"));

//全局处理异常
app.use((err, req, resp, next) => {
    let resultJson = new ResultJson(false, "服务器错误", err);
    resp.json(resultJson);
    next();
});
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.listen('16888', () => {
    console.log(`服务器启动成功`);
});
// module.exports = app;
