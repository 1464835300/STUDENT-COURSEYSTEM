/*
 * @Author: 隗志勇 
 * @Date: 2023-03-06 16:51:33 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 17:42:19
 */

const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const jwt = require("jsonwebtoken")
const ResultJson = require("../model/ResultJson");
const PageResult = require("../model/PageResult");
const AppConfig = require("../config/AppConfig");

// 获取列表
router.post("/getListByPage", async (req, resp) => {
    let AdminInfoService = ServiceFactory.createAdminInfoService();
    let adminInfoList = await AdminInfoService.getListByPage(req.body);
    Reflect.deleteProperty(adminInfoList.listData, "isDel");
    Reflect.deleteProperty(adminInfoList.listData, "ano");
    Reflect.deleteProperty(adminInfoList.listData, "pwd");
    let resultJson = new ResultJson(true, "管理员信息获取成功", adminInfoList)
    resp.json(resultJson)
})

// 验证登录名是否能用
router.post("/checkLoginname", async (req, resp) => {
    let result = await ServiceFactory.createAdminInfoService().checkLoginname(req.body);
    let resultJson = new ResultJson(result, result ? "验证成功可以使用" : "登录名已被使用", result);
    resp.json(resultJson)
})

// 验证登录
router.post("/checkLogin", async (req, resp) => {
    let AdminInfoService = ServiceFactory.createAdminInfoService();
    let result = await AdminInfoService.checkLogin(req.body);
    let resultJson = null;
    if (typeof result != "object") {
        if (result === 0) {
            resultJson = new ResultJson(Boolean(result), "账号已被冻结", result);
        } else {
            resultJson = new ResultJson(Boolean(result), "用户名或密码错误", result);
        }

    } else {
        let token = jwt.sign({
            loginInfo: result
        }, AppConfig.secret, {
            expiresIn: "1h"
        })
        resultJson = {};
        // token赋值
        resultJson.token = token;
        resultJson.status = "success";
        resultJson.msg = '登录成功';
        // 处理数据
        Reflect.deleteProperty(result, "pwd");
        Reflect.deleteProperty(result, "isDel");
        resultJson.data = result;
        resultJson.data.type = req.body.type;
    }
    resp.json(resultJson);
})

// 激活冻结
router.post("/freeze", async (req, resp) => {
    let result = await ServiceFactory.createAdminInfoService().onFreeze(req.body);
    let resultJson = new ResultJson(true, "操作成功", result);
    resp.json(resultJson)
})

// 新增管理员
router.post("/register", async (req, resp) => {
    let result = await ServiceFactory.createAdminInfoService().register(req.body);
    let resultJson = new ResultJson(true, "注册成功", result)
    resp.json(resultJson)
})

// 删除管理员
router.post("/delete", async (req, resp) => {
    let result = await ServiceFactory.createAdminInfoService().deleteById(req.body);
    let resultJson = new ResultJson(true, "删除成功", result);
    resp.json(resultJson)
})



module.exports = router;