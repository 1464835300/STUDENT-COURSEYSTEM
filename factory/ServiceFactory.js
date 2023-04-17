// 抽象工厂模式
// const path = require("path");
// const fs = require("fs");
// const ServiceFactory = (() => {
//     let obj = {}
//     let arr = fs.readdirSync(path.join(__dirname, "../services"));
//     for (let item of arr) {
//         //构建属性名
//         let propertyName = item.replace(".js", "").replace(/^[A-Z]/, p => p.toLowerCase());
//         //导入文件，反射对象
//         //判断导入进来的文件否是一个构造函数
//         let temp = require(path.join(__dirname, "../services", item));
//         if (typeof temp === "function") {
//             obj[propertyName] = Reflect.construct(temp, []);
//         }
//     }
//     return obj;
// })();

class ServiceFactory {
    static createAdminInfoService() {
        const AdminInfoService = require("../services/AdminInfoService");
        return new AdminInfoService();
    }

    static createCourseInfoService() {
        const CourseInfoService = require("../services/CourseInfoService");
        return new CourseInfoService();
    }

    static createStudentInfoService() {
        const StudentInfoService = require("../services/StudentInfoService");
        return new StudentInfoService();
    }

    static createTeacherInfoService() {
        const TeacherInfoService = require("../services/TeacherInfoService");
        return new TeacherInfoService();
    }

    // static createDataViewService() {
    //     const DataViewService = require("../service/DataViewService");
    //     return new DataViewService();
    // }
}

module.exports = ServiceFactory;