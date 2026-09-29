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
  llbotSuperFaceCompat: boolean
  reactTargets: ReactionTarget[]
  reactSameEmoji: boolean
  enablePickFace: boolean
  enableTestAllLargeFaceExtra?: boolean
  enableTestDice?: boolean
  enableTestRPS?: boolean
  enableTestSuperLarge?: boolean
  verboseConsoleOutput: boolean
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    onebotImplName: Schema.union([
      Schema.const(ONEBOT_IMPL.AUTO).description('✨🤖 自动检测（推荐，智能识别 NapCat / LLBot / Lagrange）'),
      Schema.const(ONEBOT_IMPL.NAPCAT).description('🐈💙 NapCat（调用 set_msg_emoji_like）'),
      Schema.const(ONEBOT_IMPL.LLBOT).description('🤖🩷 LLBot (Lucky Lillia Bot，调用 set_msg_emoji_like)'),
      Schema.const(ONEBOT_IMPL.LAGRANGE).description('🧐💜 Lagrange V1（调用 set_group_reaction）'),
    ])
      .role('radio')
      .default(ONEBOT_IMPL.AUTO)
      .description('🤖 OneBot 实现平台<br>⚠️ 自动模式将智能识别；Lagrange 使用 set_group_reaction，NapCat/LLBot 使用 set_msg_emoji_like'),

    llbotSuperFaceCompat: Schema.boolean()
      .default(false)
      .experimental()
      .description('⚠️ 实验性：LLOneBot 超级表情混排截断妥协保护<br>🛡️ 当检测到或配置为 LLOneBot 时，图文混排中的超级大表情自动降级为 Unicode Emoji 或文字形态，避免老版本 LLBot 实例（如未打补丁的生产环境）在群聊中发生截断。<br>📌 说明：<b>此修改并非根治方案，仅为插件层的临时妥协</b>；彻底根治需上游修复 LLOneBot 自身协议缺陷（作者已发起 PR: <a href="https://github.com/LLOneBot/LuckyLilliaBot/pull/866" target="_blank">LLOneBot#866</a>，截至 2026年9月30日 尚未合并）。'),

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
    enableTestAllLargeFaceExtra: Schema.boolean()
      .default(false)
      .description('🧪 是否启用 testAllLargeFaceExtra 指令（测试全量超级表情混排与独立大表情）'),

    enableTestDice: Schema.boolean()
      .default(false)
      .description('🎲 是否启用 testDice 指令（测试骰子混排与独立大表情）'),

    enableTestRPS: Schema.boolean()
      .default(false)
      .description('✂️ 是否启用 testRPS 指令（测试石头剪刀布混排与独立大表情）'),

    enableTestSuperLarge: Schema.boolean()
      .default(false)
      .description('🫣 是否启用 testSuperLarge 指令（测试吃糖混排与独立大表情）'),
  }).description('🧪 协议测试指令（默认均不注册，需手动开启）'),

  Schema.object({
    verboseConsoleOutput: Schema.boolean()
      .default(true)
      .description('🐛 调试输出<br>📋 是否在控制台打印更多运行日志'),
  }).description('🐛 调试设置'),
])
