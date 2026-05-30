import { Schema } from 'koishi'
import { ONEBOT_IMPL, type OneBotImpl } from './type'

export { ONEBOT_IMPL, type OneBotImpl } from './type'

/**
 * 反应目标配置
 */
export interface ReactionTarget {
  userId: string
  emojiCode: string
  enabled: boolean
}

/**
 * 插件配置接口
 */
export interface Config {
  onebotImplName: OneBotImpl
  reactTargets: ReactionTarget[]
  reactSameEmoji: boolean
  enablePickFace: boolean
  verboseConsoleOutput: boolean
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    onebotImplName: Schema.union([
      Schema.const(ONEBOT_IMPL.LAGRANGE).description('Lagrange'),
      Schema.const(ONEBOT_IMPL.NAPCAT_LLBOT).description('NapCat / LLOneBot'),
    ])
      .role('radio')
      .default(ONEBOT_IMPL.NAPCAT_LLBOT)
      .description('🤖 OneBot 实现平台<br>⚠️ Lagrange 使用 set_group_reaction，NapCat/LLOneBot 使用 set_msg_emoji_like'),

    reactTargets: Schema.array(Schema.object({
      userId: Schema.string().required().description('👤 QQ号'),
      emojiCode: Schema.string().default('324').description('😊 表情 ID'),
      enabled: Schema.boolean().default(true).description('✅ 是否启用'),
    }))
      .role('table')
      .default([
        { userId: '1830540513', emojiCode: '324', enabled: true },
        { userId: '1830540513', emojiCode: '333', enabled: false },
        { userId: '1830540513', emojiCode: '✨', enabled: false },
        { userId: '1830540513', emojiCode: '128166', enabled: false },
      ])
      .description('🎯 目标用户配置表格<br>👤 QQ号 | 😊 表情ID | ✅ 启用<br>🔢 表情ID 支持三种格式：1️⃣ Emoji 字符 (😊) 2️⃣ Unicode 码点 (128522) 3️⃣ QQ 表情 ID (324)'),

    reactSameEmoji: Schema.boolean()
      .default(true)
      .description('😊 是否回应相同表情<br>🔄 开启后别人发什么表情 bot 就回什么表情'),

    enablePickFace: Schema.boolean()
      .default(true)
      .description('📋 是否启用「取表情」指令<br>关闭后 取表情 / 取qq表情 / pick-face 将不可用'),
  }).description('🎯 基础功能设置'),

  Schema.object({
    verboseConsoleOutput: Schema.boolean()
      .default(true)
      .description('🐛 调试输出<br>📋 是否在控制台打印更多运行日志'),
  }).description('🐛 调试设置'),
])
