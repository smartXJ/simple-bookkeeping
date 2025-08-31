/*
 * @Author: xiaojun
 * @Date: 2025-08-29 15:47:41
 * @LastEditors: xiaojun
 * @LastEditTime: 2025-08-31 10:36:20
 * @Description: 对应操作
 */

type SqlType = "create-table" | "add-column" | "add-trigger" | "insert-row";
type DBSchema = {
  // type: SqlType;
  note: string;
  sql: string;
};
const defaultFields = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER DEFAULT (datetime('now','localtime')),
  update_at INTEGER DEFAULT (datetime('now','localtime')),
`;

type ISchema = {
  explanation: string;
  list: DBSchema[];
};

/**
 * 格式化数据库结构变更说明
 */
const formatSchemaNote = (type: SqlType, note: string) => {
  const typeMap: Record<SqlType, string> = {
    "create-table": "📦 创建表：",
    "add-column": "➕ 新增列：",
    "add-trigger": "🔔 新增触发器：",
    "insert-row": "➕ 新增数据行：",
  };
  return typeMap[type] ? typeMap[type] + note : "";
};
// 更新时间的触发器
const updateTimeTriggers = (table: string) => {
  return `
    CREATE TRIGGER IF NOT EXISTS ${table}_update_trigger
    AFTER UPDATE ON ${table}
    FOR EACH ROW
    BEGIN
      UPDATE ${table} SET updated_at = datetime('now','localtime') WHERE id = NEW.id;
    END;
  `;
};
const schema: ISchema[] = [
  {
    explanation: "🎉初始化数据",
    list: [
      {
        note: formatSchemaNote("create-table", "ledgers"),
        sql: `
          -- 创建主表
          CREATE TABLE IF NOT EXISTS ledgers (
            ${defaultFields}
            name TEXT NOT NULL,
            balance REAL DEFAULT 0,
            currency TEXT DEFAULT 'CNY',
            description TEXT,
            default_flag INTEGER DEFAULT 0
          );
          -- 创建更新触发器
          ${updateTimeTriggers("ledgers")}
        `,
      },
      {
        note: formatSchemaNote("insert-row", "1条默认账本"),
        sql: `
        INSERT INTO ledgers (name, balance, currency, description, default_flag)
        VALUES ('日常账本', 0, 'CNY', '', 1);
      `,
      },
      {
        note: formatSchemaNote("create-table", "categories"),
        sql: `
      CREATE TABLE IF NOT EXISTS categories (
        ${defaultFields}
        name TEXT NOT NULL,
        icon TEXT,
        parent_id INTEGER DEFAULT 0,
        type TEXT NOT NULL
      );
      ${updateTimeTriggers("categories")}
    `,
      },
      {
        note: formatSchemaNote("insert-row", "4条默认分类"),
        sql: `
      INSERT INTO categories (name, icon, parent_id, type)
      VALUES
        ('食物', '🍔', 0, 'income'),
        ('交通', '🚗', 0, 'expense'),
        ('工资', '💰', 0, 'income'),
        ('投资', '📈', 0, 'income');
    `,
      },
      {
        note: formatSchemaNote("create-table", "transactions"),
        sql: `
      CREATE TABLE IF NOT EXISTS transactions (
        ${defaultFields}
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        ledger_id INTEGER NOT NULL
      );
      ${updateTimeTriggers("transactions")}
    `,
      },
    ],
  },
];

export default schema;
