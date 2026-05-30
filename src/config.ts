import { Schema } from 'koishi'

export const ONEBOT_IMPL = {
  LAGRANGE: 'lagrange',
  NAPCAT_LLBOT: 'napcat_llbot',
} as const

export type OneBotImpl = typeof ONEBOT_IMPL[keyof typeof ONEBOT_IMPL]

export interface ReactionTarget {
  userId: string
  emojiCode: string
  enabled: boolean
}

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
      .default([{ userId: '1830540513', emojiCode: '324', enabled: true }, { userId: '1830540513', emojiCode: '128166', enabled: true }])
      .description('🎯 目标用户配置表格<br>👤 QQ号 | 😊 表情ID | ✅ 启用'),

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
