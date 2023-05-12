/*
 * @Author: 隗志勇
 * @Date: 2023-03-09 11:48:07
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-11 09:29:39
 */
const BaseService = require("./BaseService");
const PageResult = require("../model/PageResult");
const md5 = require("md5");
const AppConfig = require("../config/AppConfig");
class StudentInfoService extends BaseService {
  constructor() {
    super("studentInfo");
  }
  /**
   * 根据条件来进行分页查询
   * @param {sno, classno, name, pageIndex, pageSize} param0 参数
   * @returns
   */
  async getListByPage({ sno, classno, name, pageIndex = 1, pageSize }) {
    let strSql = `SELECT a.*,b.cname FROM t_student a INNER JOIN t_class b ON a.classno = b.classno AND a.isDel = 0 AND b.isDel = 0  `;
    let { strWhere, ps } = this.paramsInit()
      .like("a.sno", sno)
      .like("a.classno", classno)
      .like("a.name", name);
    //第一条sql语句
    strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
    //第二条sql语句sno, classno, name, pageIndex, pageSize
    let countSql = ` select count(*) 'totalCount' from t_student a INNER JOIN t_class b ON  a.classno = b.classno AND b.isDel = 0 AND a.isDel = 0  `;
    countSql += strWhere;
    //现在执行的是2条sql语句，所以result里面就会有2个结果
    let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [
      ...ps,
      ...ps,
    ]);
    let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
    return pageResult;
  }

  /**
   * 获取所有教室信息
   * @returns
   */
  async getClassList() {
    let strSql = `SELECT classno,cname FROM course_sysdb.t_class; `;
    let result = await this.excutSql(strSql);
    return result;
  }
  /**
   * 注册
   * @param {email, pwd,phone,gender,birth,remark,name} param0
   * @returns {Promise<Boolean>}  true成功，false失败
   */
  async register({ classno, email, pwd, phone, gender, birth, remark, name }) {
    pwd = md5(pwd + AppConfig);
    let snoSql = `SELECT sno FROM t_student ORDER BY sno DESC LIMIT 1;`;
    let lastSno = await this.excutSql(snoSql);
    let nowDate = new Date().toISOString().substring(0, 7).replace(/\-/g, "");
    let sno = !lastSno ? +(nowDate + "0001") : lastSno[0].sno + 1;
    console.log(lastSno[0]);
    if ((lastSno[0].sno + "").substring(0, 6) != nowDate) {
      sno = +(nowDate + "0001");
    }
    let loginname = sno + "";
    let strSql = `INSERT INTO course_sysdb.t_student(sno, loginname, classno, email, pwd , phone , gender , birth , remark , name) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? );`;
    let result = await this.excutSql(strSql, [
      sno,
      loginname,
      classno,
      email,
      pwd,
      phone,
      gender,
      birth,
      remark,
      name,
    ]);
    return result.affectedRows > 0;
  }

  /**
   * 修改学生信息
   * @param {{classno, email, pwd, phone, gender, birth, remark, name}} param0
   * @returns {Promise<boolean>} true修改成功，false修改失败
   */
  async update({ classno, email, phone, gender, birth, remark, name, sno }) {
    let strSql = ` UPDATE course_sysdb.t_student SET classno = ?, email = ? , phone = ? , gender = ? , birth = ? , remark = ?, name = ? WHERE sno = ? `;
    let result = await this.excutSql(strSql, [
      classno,
      email,
      phone,
      gender,
      birth,
      remark,
      name,
      sno,
    ]);
    return result.affectedRows > 0;
  }
  /**
   * 删除学生
   * @param {sno} param0
   * @returns {Promise<boolean>} true修改成功，false修改失败
   */
  async deleteById({ sno }) {
    let strSql = `update course_sysdb.t_student set isDel = 1 where sno = ?`;
    let result = await this.excutSql(strSql, [sno]);
    return result.affectedRows > 0;
  }
  /**
   * 查询学生可选课程列表
   * @param {*} param0
   */
  async getStudentChooseList({ sno, pageIndex = 1, pageSize }) {
    let strSql1 = ` select * from  t_student_course  WHERE isDel = 0 AND sno = ? `;
    let res1 = await this.excutSql(strSql1, [sno]);
    let cnoarr = res1.map((item) => item.cno);
    let strSql2 = ` select * from  t_course c,t_teacher t WHERE c.tno = t.tno AND C.isDel = 0 AND t.isDel = 0; `;
    let res2 = await this.excutSql(strSql2);
    let newArr = res2.filter((item) => cnoarr.indexOf(item.cno) < 0);
    let totalCount = newArr.length;
    let listData = newArr.slice(
      (pageIndex - 1) * pageSize,
      pageSize * pageIndex
    );

    // 增加选课人数
    for (let i = 0; i < listData.length; i++) {
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
}
module.exports = StudentInfoService;
