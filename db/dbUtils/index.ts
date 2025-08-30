/*
 * @Author: xiaojun
 * @Date: 2025-08-30 15:59:05
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 16:01:34
 * @Description: 对应操作
 */
import { getDb } from "../db";
import { Request } from "./request";

export const request = new Request(getDb());

