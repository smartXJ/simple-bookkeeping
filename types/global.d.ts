/*
 * @Author: xiaojun
 * @Date: 2024-09-23 11:10:47
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 16:05:42
 * @Description: 对应操作
 */
export { };
declare global {

  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  interface PageParam {
    pageSize?: number
    pageNo?: number
  }
  type PageParams = { pageNum: number; pageSize: number };
  type PageResult<T> = { list: T[]; total: number, pageNum: number; pageSize: number };
}
