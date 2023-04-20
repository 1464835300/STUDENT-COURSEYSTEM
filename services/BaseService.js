/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 10:43:26 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 10:25:01
 */
const DBUtils = require("../Utils/DBUtils");
const md5 = require("md5");
const AppConfig = require("../config/AppConfig")
class BaseService extends DBUtils {
    constructor(currentTableName) {
        super();
        this.currentTableName = currentTableName;
        this.tableMap = {
            adminInfo: "t_admin",
            courseInfo: "t_course",
            studentInfo: "t_student",
            teacherInfo: "t_teacher",
        }
    }

    /**
     * 获取所有数据
     * @returns {Promise<Array>} 
     */
    async getAllList() {
        let strSql = `select * from ${this.tableMap[this.currentTableName]} where isDel = 0`;
        let result = await this.excutSql(strSql)
        return result;
    }
    /**
     * 登录验证
     * @param {{type,loginname,pwd}} 三种登录人学生,教师,管理员 ,账号,密码
     * @returns {Promise<Array>} 
     */
    async checkLogin({ type, loginname, pwd }) {
        switch (type) {
            case 0:
                type = 'adminInfo';
                break;
            case 1:
                type = 'studentInfo';
                break;
            case 2:
                type = 'teacherInfo';
                break;
        }
        pwd = md5(pwd + AppConfig);
        let strSql = `SELECT * FROM ${this.tableMap[type]} WHERE isDel = 0 AND ${this.tableMap[type]}.loginname=?  AND ${this.tableMap[type]}.pwd=?`;
        let result = await this.excutSql(strSql, [loginname, pwd]);
        if (result.length > 0 && result[0].isFreeze === 0) {
            if (result[0].isFreeze === 0) {
                return result[0];
            }
            return 0;
        } else {
            return result[0]
        }

    }

    /**
     * 验证登录名是否可用
     * @param {loginname} 登录名 
     * @returns {Promise<Boolean>} true成功，false失败
     */
    async checkLoginname({ loginname }) {
        let strSql = `SELECT * FROM ${this.tableMap[this.currentTableName]} WHERE isDel = 0 `;
        let { strWhere, ps } = this.paramsInit().equal("loginname", loginname);
        strSql += strWhere;
        let result = await this.excutSql(strSql, [...ps]);
        return result.length == 0;
    }

};
module.exports = BaseService