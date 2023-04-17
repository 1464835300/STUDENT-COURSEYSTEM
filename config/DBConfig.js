/*
 * @Author: 隗志勇 
 * @Date: 2023-03-06 16:53:08 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-06 16:55:57
 */

/**
 * @desc 数据库连接的配置信息
 */
/**
 * 本地数据库
 */
const localDBConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "course_sysdb",
    multipleStatements: true
}

/**
 * 云数据库
 */
const remoteDBConfig = {
    host: "81.71.7.2",
    port: 3306,
    user: "root",
    password: "wzy2451543695@.",
    database: "course_sysdb",
    multipleStatements: true
}

module.exports = {
    localDBConfig,
    remoteDBConfig,
}
