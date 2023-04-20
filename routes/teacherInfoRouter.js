/*
 * @Author: 隗志勇 
 * @Date: 2023-03-06 16:51:41 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 16:18:18
 */

const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const ResultJson = require("../model/ResultJson");
// 获取列表
router.post("/getListByPage", async (req, resp) => {
    let TeacherInfoService = ServiceFactory.createTeacherInfoService();
    let TeacherList = await TeacherInfoService.getListByPage(req.body);
    let resultJson = new ResultJson(true, "教师信息获取成功", TeacherList)
    resp.json(resultJson)
})

// 删除老师
router.post("/delete", async (req, resp) => {
    let result = await ServiceFactory.createTeacherInfoService().deleteById(req.body);
    let resultJson = new ResultJson(true, "删除成功", result);
    resp.json(resultJson)
})

// 修改老师信息
router.post("/update", async (req, resp) => {
    let result = await ServiceFactory.createTeacherInfoService().update(req.body);
    let resultJson = new ResultJson(result, result ? "修改成功" : "修改失败");
    resp.json(resultJson);
})

// 新增老师
router.post("/register", async (req, resp) => {
    let result = await ServiceFactory.createTeacherInfoService().register(req.body);
    let resultJson = new ResultJson(true, "注册成功", result)
    resp.json(resultJson)
})


module.exports = router;