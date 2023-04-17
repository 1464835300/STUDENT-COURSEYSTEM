/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 15:23:51 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-03-24 16:15:41
 */
class ResultJson {
    /**
     * @param {boolean} status 
     * @param {*} msg 
     * @param {*} data 
     */
    constructor(flag, msg, data = []) {
        if (!!data.isDel) {
            Reflect.deleteProperty(data, "isDel")
        }
        this.status = flag ? "success" : "fail";
        this.msg = msg;
        this.data = data;
    }
}
module.exports = ResultJson;