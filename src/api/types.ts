/**
 * 单个语法例句的类型定义
 */
export interface GrammarExample {
  /** 日语例句（含语法点的实际用例） */
  japanese: string
  /** 中文翻译 */
  chinese: string
}

/**
 * 语法知识点的完整类型定义
 */
export interface GrammarPoint {
  /** 语法标题（如 "～ので"） */
  title: string

  /** 接续规则说明 */
  connectionRules: string

  /** 语法含义说明 */
  meaning: string

  /** 例句列表 */
  examples: GrammarExample[]
}
