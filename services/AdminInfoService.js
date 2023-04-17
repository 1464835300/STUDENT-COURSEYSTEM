/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 11:46:33 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 15:37:29
 */
const BaseService = require("./BaseService");
const PageResult = require("../model/PageResult");
class AdminInfoService extends BaseService {
    constructor() {
        super("adminInfo");
    }
    /**
     * 根据条件来进行分页查询
     * @param {{ loginname, email, pageIndex = 1 }} param0 参数 
     * @returns 
     */
    async getListByPage({ loginname, email, pageIndex = 1, pageSize }) {
        let strSql = ` select * from ${this.tableMap[this.currentTableName]}  where isDel = 0  `;
        let { strWhere, ps } = this.paramsInit()
            .like("loginname", loginname)
            .like("email", email);
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
     * 激活冻结
     * @param {loginname, type} param0 
     * @returns {Promise<Boolean>}  true成功，false失败
     */
    async onFreeze({ loginname, type }) {
        let strSql = `update course_sysdb.t_admin set isFreeze = ? where loginname = ?;`;
        let result = await this.excutSql(strSql, [type, loginname]);
        return result.affectedRows > 0;
    }
    /**
     * 注册
     * @param {loginname, email, pwd,phone,gender,birth,remark,name} param0 
     * @returns {Promise<Boolean>}  true成功，false失败
    */
    async register({ loginname, email, pwd, phone, gender, birth, remark, name }) {
        pwd = md5(pwd + AppConfig);
        let strSql = `INSERT INTO course_sysdb.t_admin(loginname, email, pwd , phone , gender , birth , remark , name) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? );`
        let result = await this.excutSql(strSql, [loginname, email, pwd, phone, gender, birth, remark, name]);
        return result.affectedRows > 0;
    }
}
module.exports = AdminInfoService; 