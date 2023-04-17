/*
 * @Author: 隗志勇 
 * @Date: 2023-03-06 16:51:16 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 17:42:21
 */

const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const ResultJson = require("../model/ResultJson");

// 获取列表
router.post("/getListByPage", async (req, resp) => {
    let StudentInfoService = ServiceFactory.createStudentInfoService();
    let studentInList = await StudentInfoService.getListByPage(req.body);
    Reflect.deleteProperty(studentInList.listData, "isDel");
    Reflect.deleteProperty(studentInList.listData, "pwd");
    let resultJson = new ResultJson(true, "学生信息获取成功", studentInList)
    resp.json(resultJson)
})
// 获取教室列表
router.post("/getClassList", async (req, resp) => {
    let StudentInfoService = ServiceFactory.createStudentInfoService();
    let classInList = await StudentInfoService.getClassList();
    let resultJson = new ResultJson(true, "教室信息获取成功", classInList)
    resp.json(resultJson)
})


module.exports = router;