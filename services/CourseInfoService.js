/*
 * @Author: 隗志勇
 * @Date: 2023-03-09 11:48:03
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-09 11:49:32
 */
const BaseService = require("./BaseService");
const PageResult = require("../model/PageResult");
class CourseInfoService extends BaseService {
  constructor() {
    super("courseInfo");
  }
  /**
   * 分页查询课程信息
   * @param {*} param0
   * @returns
   */
  async getListByPage({ cname, tname, remark, pageIndex = 1, pageSize }) {
    let strSql =
      "SELECT a.*,b.`name`,b.remark,b.phone,b.tno FROM t_course a INNER JOIN t_teacher b ON a.tno = b.tno AND a.isDel = 0 AND b.isDel = 0 ";
    let { strWhere, ps } = this.paramsInit()
      .like("a.cname", cname)
      .like("b.name", tname)
      .like("b.remark", remark);
    strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
    //第二条sql语句sno, classno, , pageIndex, pageSize
    let countSql = ` select count(*) 'totalCount' from t_course a INNER JOIN t_teacher b ON  a.tno = b.tno AND b.isDel = 0 AND a.isDel = 0  `;
    countSql += strWhere;
    //现在执行的是2条sql语句，所以result里面就会有2个结果
    let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [
      ...ps,
      ...ps,
    ]);
    // 清除多余数据，加入已选课程人数
    for (let i = 0; i < listData.length; i++) {
      console.log(i);
      let sql = `select count(*) 'totalCount' from t_student_course a INNER JOIN t_course b ON b.cno = a.cno AND b.isDel = 0 AND a.isDel = 0 AND b.cno = ${listData[i].cno}`;
      let res = await this.excutSql(sql);
      listData[i].selectPerson = res[0].totalCount;
      if (listData[i].endDate && listData[i].endDate instanceof Date) {
        listData[i].endDate = listData[i].endDate.toJSON().substring(0, 10);
      }
      if (listData[i].startDate && listData[i].startDate instanceof Date) {
        listData[i].startDate = listData[i].startDate.toJSON().substring(0, 10);
      }
    }
    let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
    return pageResult;
  }
  /**
   * 增加课程
   * @param { cname, credit, startDate, endDate, tno} param0
   * @returns {Promise<boolean>} true删除成功，false删除失败
   */
  async addCourse({ cname, credit, startDate, endDate, tno, selectMax }) {
    let strSql = `INSERT INTO course_sysdb.t_course(cname, credit, startDate , endDate , tno , selectMax) VALUES ( ? , ? , ? , ? , ? , ? );`;
    let result = await this.excutSql(strSql, [
      cname,
      credit,
      startDate,
      endDate,
      tno,
      selectMax,
    ]);
    return result.affectedRows > 0;
  }
  /**
   * 修改课程
   * @param {*} param0
   * @returns {Promise<boolean>} true删除成功，false删除失败
   */
  async update({ cno, cname, credit, startDate, endDate, tno, selectMax }) {
    let strSql = ` UPDATE course_sysdb.t_course SET cname = ? , credit = ? , startDate = ? , endDate = ? , selectMax = ? , tno = ? WHERE cno = ? `;
    let result = await this.excutSql(strSql, [
      cname,
      credit,
      startDate,
      endDate,
      selectMax,
      tno,
      cno,
    ]);
    return result.affectedRows > 0;
  }
  /**
   * 删除课程
   * @param {cno} param0 课程编号
   * @returns {Promise<boolean>} true删除成功，false删除失败
   */
  async deleteById({ cno }) {
    let strSql = `update course_sysdb.t_course set isDel = 1 where cno = ?`;
    let result = await this.excutSql(strSql, [cno]);
    return result.affectedRows > 0;
  }

  /**
   * 获取所有课程列表
   * @returns
   */
  async getCourseList() {
    let strSql = `SELECT cno,cname FROM course_sysdb.t_course; `;
    let result = await this.excutSql(strSql);
    return result;
  }

  /**
   * 已选课程列表
   * @param {*} param0
   * @returns
   */
  async getSeletedByCourse({
    cname,
    tname,
    sname,
    sno,
    pageIndex = 1,
    pageSize,
  }) {
    let strSql =
      "SELECT b.*, c.`name` as studentName ,c.sno, d.`name` as teacherName,a.id FROM t_student_course a INNER JOIN t_course b ON a.cno = b.cno INNER JOIN t_student c ON a.sno = c.sno INNER JOIN t_teacher d ON b.tno = d.tno AND a.isDel = 0  AND b.isDel = 0  AND c.isDel = 0 ";
    let { strWhere, ps } = this.paramsInit()
      .like("b.cname", cname)
      .like("d.name", tname)
      .like("c.name", sname)
      .like("c.sno", sno);
    strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
    //第二条sql语句sno, classno, , pageIndex, pageSize
    let countSql = ` select count(*) 'totalCount' from t_student_course a INNER JOIN t_course b ON a.cno = b.cno INNER JOIN t_student c ON a.sno = c.sno INNER JOIN t_teacher d ON b.tno = d.tno AND a.isDel = 0  AND b.isDel = 0  AND c.isDel = 0  `;
    countSql += strWhere;
    //现在执行的是2条sql语句，所以result里面就会有2个结果
    let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [
      ...ps,
      ...ps,
    ]);
    listData.forEach((item) => {
      Reflect.deleteProperty(item, "tno");
      if (item.endDate && item.endDate instanceof Date) {
        item.endDate = item.endDate.toJSON().substring(0, 10);
      }
      if (item.startDate && item.startDate instanceof Date) {
        item.startDate = item.startDate.toJSON().substring(0, 10);
      }
    });
    let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
    return pageResult;
  }
  /**
   * 退课
   * @param {id} param0
   * @returns
   */
  async dropCourse({ id }) {
    let strSql = ` UPDATE course_sysdb.t_student_course SET isDel = 1  `;
    let arr = id.split(",");
    arr.forEach((item, index) => {
      if (index === 0) {
        strSql += `where id = ${item} `;
      } else {
        strSql += `or id = ${item} `;
      }
    });
    let result = await this.excutSql(strSql);
    return result.affectedRows > 0;
  }
  /**
   * 选课
   * @param {*} param0
   */
  async chooseCourse({ ChooseList }) {
    let sql = "";
    console.log(ChooseList);
    let arr = JSON.parse(ChooseList);
    console.log(ChooseList, arr);
    arr.forEach((item) => {
      let strSql = ` INSERT INTO course_sysdb.t_student_course(sno, cno) VALUES ( ${item.sno} ,  ${item.cno} ); `;
      sql += strSql;
    });
    console.log(sql);

    let res = await this.excutSql(sql);
    let flag = false;
    if (res instanceof Array) {
      flag = res.some((item) => item.affectedRows > 0);
    } else {
      flag = res.affectedRows > 0;
    }

    return flag;
  }
}
module.exports = CourseInfoService;
