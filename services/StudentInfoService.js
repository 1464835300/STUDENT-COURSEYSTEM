/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 11:48:07 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-11 09:29:39
 */
const BaseService = require("./BaseService")
const PageResult = require("../model/PageResult");
class StudentInfoService extends BaseService {
    constructor() {
        super("studentInfo");
    }
    /**
     * 根据条件来进行分页查询
     * @param {sno, classno, name, pageIndex, pageSize} param0 参数 
     * @returns 
    */
    //    SELECT a.*,b.cname FROM t_student a INNER JOIN t_class b ON a.classno = b.classno AND a.isDel = 0 AND b.isDel = 0;
    async getListByPage({ sno, classno, name, pageIndex, pageSize }) {
        let strSql = `SELECT a.*,b.cname FROM t_student a INNER JOIN t_class b ON a.classno = b.classno AND a.isDel = 0 AND b.isDel = 0  `;
        let { strWhere, ps } = this.paramsInit()
            .like("a.sno", sno)
            .like("a.classno", classno)
            .like("a.name", name);
        //第一条sql语句
        strSql += strWhere + ` limit ${(pageIndex - 1) * pageSize},${pageSize} ;`;
        //第二条sql语句sno, classno, name, pageIndex, pageSize
        let countSql = ` select count(*) 'totalCount' from t_student a INNER JOIN t_class b ON  a.classno = b.classno AND B.isDel = 0 AND a.isDel = 0  `;
        countSql += strWhere;
        console.log(strSql);
        //现在执行的是2条sql语句，所以result里面就会有2个结果
        let [listData, [{ totalCount }]] = await this.excutSql(strSql + countSql, [...ps, ...ps]);
        let pageResult = new PageResult(pageIndex, totalCount, listData, pageSize);
        return pageResult;
    }

    /**
     * 获取所有教室信息
     * @returns 
     */
    async getClassList() {
        let strSql = `SELECT classno,cname FROM course_sysdb.t_class; `
        let result = await this.excutSql(strSql);
        return result
    }
}
module.exports = StudentInfoService; 