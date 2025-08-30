/*
 * @Author: xiaojun
 * @Date: 2025-08-29 15:47:41
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-30 18:24:46
 * @Description: 对应操作
 */

// 更新时间的触发器
const updateTimeTriggers = (table: string) => {
  return `
    CREATE TRIGGER IF NOT EXISTS ${table}_update_trigger
    AFTER UPDATE ON ${table}
    FOR EACH ROW
    BEGIN
      UPDATE ${table} SET updated_at = datetime('now','localtime') WHERE id = NEW.id;
    END;
  `
}
// const commonAddColumn = (table: string, column: string, typeAndDefault: string) => {
//   return `ALTER TABLE ${table} ADD COLUMN ${column} ${typeAndDefault};`
// }

/**
 * 数据库表结构配置
 * - 每个表定义：表名 + 初始创建 SQL + 列定义
 */
const schema = {
  // 账本表
  ledgers: {
    createSQL: `
      CREATE TABLE IF NOT EXISTS ledgers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        balance REAL DEFAULT 0,
        currency TEXT DEFAULT 'CNY',
        description TEXT,
        default_flag INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (datetime('now','localtime')),
        update_at INTEGER DEFAULT (datetime('now','localtime'))
      );
    `,
    // 新增的列
    columns: {
      // updated_at: "ALTER TABLE ledgers ADD COLUMN updated_at INTEGER", // 示例
    },
    // 触发器
    triggers: {
      updateUpdatedAt: updateTimeTriggers('ledgers')
    }
  },
  // 分类表
  categories: {
    createSQL: `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        parent_id INTEGER DEFAULT 0,
        type TEXT NOT NULL,
        created_at INTEGER DEFAULT (datetime('now','localtime')),
        update_at INTEGER DEFAULT (datetime('now','localtime'))
      );
    `,
    columns: {},
    // 触发器
    triggers: {
      updateUpdatedAt: updateTimeTriggers('categories')
    }
  },
  // 交易表
  transactions: {
    createSQL: `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        ledger_id INTEGER NOT NULL,
        created_at INTEGER DEFAULT (datetime('now','localtime')),
        update_at INTEGER DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (ledger_id) REFERENCES ledgers(id)
      );
    `,
    columns: {},
    // 触发器
    triggers: {
      updateUpdatedAt: updateTimeTriggers('transactions')
    }
  },
};

export default schema;
