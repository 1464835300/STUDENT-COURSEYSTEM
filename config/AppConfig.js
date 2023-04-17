/**
 * 整个程序的配置文件，所有需要配置的东西
 * @author 隗志勇
 * @data 2023-3-06
 */
const path = require("path")

const AppConfig = {
    excelDir:path.join(__dirname,"../excelDir"),
    salt:"klafjskjfl$%a",
    secret:"12hsfa8$#%nf",
    noRequireAuth:[
        /\/adminInfo\/checkLogin/
    ]

}

module.exports = AppConfig;