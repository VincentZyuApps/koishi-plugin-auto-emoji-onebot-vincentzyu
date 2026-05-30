/**
 * 类型定义文件
 * 集中管理插件的所有类型定义
 */

/**
 * OneBot 实现平台常量
 */
export const ONEBOT_IMPL = {
  LAGRANGE: 'lagrange',
  NAPCAT_LLBOT: 'napcat_llbot',
} as const

/**
 * OneBot 实现平台类型
 */
export type OneBotImpl = typeof ONEBOT_IMPL[keyof typeof ONEBOT_IMPL]

/**
 * 表情类型
 */
export const FACE_TYPE = {
  EMOJI: 'emoji',           // Unicode emoji (😊, 👍)
  QQ_SYSFACE: 'qq_sysface', // QQ 系统表情 (/微笑, /撇嘴)
} as const

/**
 * 表情类型
 */
export type FaceType = typeof FACE_TYPE[keyof typeof FACE_TYPE]
