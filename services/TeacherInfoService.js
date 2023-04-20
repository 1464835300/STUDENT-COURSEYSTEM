/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 11:48:12 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-09 11:49:30
 */
const BaseService = require("./BaseService")
const PageResult = require("../model/PageResult");
class TeacherInfoService extends BaseService {
    constructor() {
        super("teacherInfo");
    }
    /**
     * 根据条件来进行分页查询
     * @param {loginname,name, remark, pageIndex = 1, pageSize} param0 
     * @returns 
     */
    async getListByPage({ loginname,name, remark, pageIndex = 1, pageSize }) {
        let strSql = ` select * from ${this.tableMap[this.currentTableName]}  where isDel = 0  `;
        let { strWhere, ps } = this.paramsInit()
            .like("loginname", loginname)
            .like("name", name)
            .like("remark", remark);
        //第一条sql语句
        strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
        //第二条sql语句
        let countSql = ` select count(*) 'totalCount' from ${this.tableMap[this.currentTableName]}  where isDel = 0  `;
        countSql += strWhere;
        //现在执行的是2条sql语句，所以result里面就会有2个结果
        let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [...ps, ...ps]);
        let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
        return pageResult;
    }
    /**
     * 增加老师信息
     * @param {*} param0 
     * @returns 
     */
    async register({ loginname, email, pwd, phone, gender, birth, remark, name }) {
        pwd = md5(pwd + AppConfig);
        let strSql = `INSERT INTO course_sysdb.t_teacher(loginname, email, pwd , phone , gender , birth , remark , name) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? );`
        let result = await this.excutSql(strSql, [loginname, email, pwd, phone, gender, birth, remark, name]);
        return result.affectedRows > 0;
    }
    /**
     * 修改老师信息
     * @param {loginname, email, phone, gender, birth, remark, name} param0 
     * @returns {Promise<boolean>} true修改成功，false修改失败
     */
    async update({ loginname, email, phone, gender, birth, remark, name }) {
        let strSql = ` UPDATE course_sysdb.t_teacher SET email = ? , phone = ? , gender = ? , birth = ? , remark = ?, name = ? WHERE loginname = ? `;
        let result = await this.excutSql(strSql, [email, phone, gender, birth, remark, name, loginname]);
        return result.affectedRows > 0;
    }
    /**
     * 删除老师
     * @param {loginname} param0 
     * @returns {Promise<boolean>} true修改成功，false修改失败
    */
    async deleteById({ loginname }) {
        let strSql = `update course_sysdb.t_teacher set isDel = 1 where loginname = ?`;
        let result = await this.excutSql(strSql, [loginname]);
        return result.affectedRows > 0;
    }
}
module.exports = TeacherInfoService; 