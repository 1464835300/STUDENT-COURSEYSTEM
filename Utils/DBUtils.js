/*
 * @Author: 隗志勇 
 * @Date: 2023-03-06 16:57:50 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-06 17:12:24
 */
const mysql = require("mysql2");
const { localDBConfig, remoteDBConfig } = require("../config/DBConfig");
class DBUtils {
    /**
     * 获取数据库连接
     * @returns {mysql.Connection} 获取数据库连接
     */
    getConn() {
        let conn = mysql.createConnection(localDBConfig);
        conn.connect();
        return conn
    }
    /**
     * 
     * @param {string} strSql 要执行的SQL语句
     * @param {Array} params SQL语句里面的参数
     * @returns {Promise<Array|mysql.ResultSetHeader>} 返回承诺携带的结果
     */
    excutSql(strSql, params = []) {
        return new Promise((resolve, reject) => {
            let conn = this.getConn();
            conn.query(strSql, params, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
                // 关闭连接
                conn.end();
            })
        })
    }

    paramsInit() {
        let obj = {
            strWhere: "",
            ps: [],
            /**
             * 精确查询
             * @param {string} key  
             * @param {string|number|boolean} value 
             * @returns {ThisType}
             */
            equal(key, value) {
                if (value) {
                    this.strWhere += `and ${key} = ?`;
                    this.ps.push(value)
                }
                return this
            },

            like(key, value) {
                if (value) {
                    this.strWhere += `and ${key} like ?`
                    this.ps.push(`%${value}%`)
                }
                return this
            }
        };
        return obj
    }
}
module.exports = DBUtils;