/*
 * @Author: 隗志勇 
 * @Date: 2023-03-09 15:23:58 
 * @Last Modified by: 隗志勇
 * @Last Modified time: 2023-04-10 15:37:55
 */
/**
 * 分页的结果集对象
 */

class PageResult {
    /**
     * @param {number} pageIndex  当前的页码
     * @param {number} totalCount  总记录数
     * @param {Array} pageSize 每页个数
     * @param {Array} listData 查询的列表
     */
    constructor(pageIndex, totalCount, listData, pageSize) {
        this.pageIndex = pageIndex;
        this.totalCount = totalCount;
        listData.forEach(item => { Reflect.deleteProperty(item, "isDel"); Reflect.deleteProperty(item, "pwd") })
        this.listData = listData;

        this.pageCount = Math.ceil(totalCount / pageSize);
        this.pageStart = this.pageIndex - 2 <= 0 ? 1 : this.pageIndex - 2;
        this.pageEnd = this.pageStart + 4 > this.pageCount ? this.pageCount : this.pageStart + 4;
    }
}

module.exports = PageResult;