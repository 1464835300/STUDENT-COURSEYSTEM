/*
 * @Author: 隗志勇
 * @Date: 2023-03-06 16:51:05
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 16:18:23
 */

const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const ResultJson = require("../model/ResultJson");
// 获取列表
router.post("/getListByPage", async (req, resp) => {
  let CourseInfoService = ServiceFactory.createCourseInfoService();
  let courseList = await CourseInfoService.getListByPage(req.body);
  let resultJson = new ResultJson(true, "课程信息获取成功", courseList);
  resp.json(resultJson);
});

// 新增课程
router.post("/addCourse", async (req, resp) => {
  let result = await ServiceFactory.createCourseInfoService().addCourse(
    req.body
  );
  let resultJson = new ResultJson(true, "新增成功", result);
  resp.json(resultJson);
});

// 删除课程
router.post("/delete", async (req, resp) => {
  let result = await ServiceFactory.createCourseInfoService().deleteById(
    req.body
  );
  let resultJson = new ResultJson(true, "删除成功", result);
  resp.json(resultJson);
});

// 修改课程信息
router.post("/update", async (req, resp) => {
  let result = await ServiceFactory.createCourseInfoService().update(req.body);
  let resultJson = new ResultJson(result, result ? "修改成功" : "修改失败");
  resp.json(resultJson);
});

// 已选课程列表
router.post("/getSeletedByCourse", async (req, resp) => {
  console.log(req.body);
  let result =
    await ServiceFactory.createCourseInfoService().getSeletedByCourse(req.body);
  let resultJson = new ResultJson(true, "选课信息获取成功", result);
  resp.json(resultJson);
});

// 退课
router.post("/dropCourse", async (req, resp) => {
  console.log(req.body);
  let result = await ServiceFactory.createCourseInfoService().dropCourse(
    req.body
  );
  let resultJson = new ResultJson(true, "退课成功", result);
  resp.json(resultJson);
});

module.exports = router;
