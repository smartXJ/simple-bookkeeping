/*
 * @Author: xiaojun
 * @Date: 2025-08-27 17:18:06
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-27 17:19:58
 * @Description: 对应操作
 */
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm'); // 添加wasm扩展名支持
config.resolver.sourceExts.push('cjs'); // 部分wasm依赖可能需要

module.exports = config;
