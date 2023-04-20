/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 11:48:03 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-09 11:49:32
 */
const BaseService = require("./BaseService")
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
    async getListByPage({ cname, tno, remark, startDate, endDate, pageIndex = 1, pageSize }) {
        let strSql = 'SELECT a.*,b.`name`,b.remark FROM t_course a INNER JOIN t_teacher b ON a.tno = b.tno AND a.isDel = 0 AND b.isDel = 0';
        let { strWhere, ps } = this.paramsInit()
            .like("a.endDate", endDate)
            .like("a.startDate", startDate)
            .like("a.cname", cname)
            .like("b.tno", tno)
            .like("b.remark", remark);
        strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
        //第二条sql语句sno, classno, , pageIndex, pageSize
        let countSql = ` select count(*) 'totalCount' from t_course a INNER JOIN t_teacher b ON  a.tno = b.tno AND b.isDel = 0 AND a.isDel = 0  `;
        countSql += strWhere;
        //现在执行的是2条sql语句，所以result里面就会有2个结果
        let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [...ps, ...ps]);
        listData.forEach(item => {
            Reflect.deleteProperty(item, "tno")
        })
        let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
        return pageResult;
    }
    /**
     * 增加课程
     * @param { cname, credit, startDate, endDate, tno} param0 
     * @returns {Promise<boolean>} true删除成功，false删除失败
     */
    async addCourse({ cname, credit, startDate, endDate, tno, selectMax }) {
        let strSql = `INSERT INTO course_sysdb.t_course(cname, credit, startDate , endDate , tno , selectMax) VALUES ( ? , ? , ? , ? , ? , ? );`
        let result = await this.excutSql(strSql, [cname, credit, startDate, endDate, tno, selectMax]);
        return result.affectedRows > 0;
    }
    /**
     * 修改课程
     * @param {*} param0 
     * @returns {Promise<boolean>} true删除成功，false删除失败
     */
    async update({ cno, cname, credit, startDate, endDate, tno, selectMax }) {
        let strSql = ` UPDATE course_sysdb.t_course SET cname = ? , credit = ? , startDate = ? , endDate = ? , selectMax = ? , tno = ? WHERE cno = ? `;
        let result = await this.excutSql(strSql, [cname, credit, startDate, selectMax, endDate, tno, cno]);
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
        let strSql = `SELECT cno,cname FROM course_sysdb.t_course; `
        let result = await this.excutSql(strSql);
        return result
    }

    /**
     * 已选课程列表
     * @param {*} param0 
     * @returns 
     */
    async getSeletedByCourse({ cname , tname , sname , pageIndex = 1, pageSize }) {
        let strSql = "SELECT b.*, c.`name` as studentName ,c.sno FROM t_student_course, d.`name` as teacherName a INNER JOIN t_course b ON a.cno = b.cno INNER JOIN t_student c ON a.sno = c.sno INNER JOIN t_teacher d ON b.tno = d.tno AND a.isDel = 0  AND b.isDel = 0  AND c.isDel = 0";
        let { strWhere, ps } = this.paramsInit()
            .like("b.cname", cname)
            .like("d.name", tname)
            .like("c.name", sname)
        strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
        //第二条sql语句sno, classno, , pageIndex, pageSize
        let countSql = ` select count(*) 'totalCount' from t_course a INNER JOIN t_teacher b ON  a.tno = b.tno AND b.isDel = 0 AND a.isDel = 0  `;
        countSql += strWhere;
        //现在执行的是2条sql语句，所以result里面就会有2个结果
        let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [...ps, ...ps]);
        listData.forEach(item => {
            Reflect.deleteProperty(item, "tno")
        })
        let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
        return pageResult;
    }

}
module.exports = CourseInfoService; 