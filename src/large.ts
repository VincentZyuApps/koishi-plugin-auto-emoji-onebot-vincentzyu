import { Context, h } from 'koishi'
import { Config } from './config'

export function applyLargeFaceTestCommands(ctx: Context, config: Config) {
  // 🎲🎯 1. test-dice 指令 🎪✨
  if (config.enableTestDice) {
    ctx.command('test-dice', '测试骰子混排与独立超级表情')
      .action(async ({ session }) => {
        // 第一条：混排并引用回复原消息
        await session.send(`${h.quote(session?.messageId)}testSmallDice ${h('face', { id: '358' })} TestOver 【看到我说明骰子后面没被截断】`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第二条：单独超大骰子（不带 quote）
        await session.send(`${h('face', { id: '358' })}`)
      })
  }

  // ✂️🖐️ 2. test-rps 指令 ✊🔥
  if (config.enableTestRPS) {
    ctx.command('test-rps', '测试猜拳（石头剪刀布）混排与独立超级表情')
      .action(async ({ session }) => {
        // 第一条：混排并引用回复原消息
        await session.send(`${h.quote(session?.messageId)}testSmallRPS ${h('face', { id: '359' })} TestOver 【看到我说明石头剪刀布后面没被截断】`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第二条：单独超大石头剪刀布（不带 quote）
        await session.send(`${h('face', { id: '359' })}`)
      })
  }

  // 🫣🍬 3. test-super-large 指令 🍭🚀
  if (config.enableTestSuperLarge) {
    ctx.command('test-super-large', '测试超级大表情（吃糖）混排与独立大表情')
      .action(async ({ session }) => {
        // 第一条：混排并引用回复原消息
        await session.send(`${h.quote(session?.messageId)}testSmallSuperLarge ${h('face', { id: '324' })} TestOver 【看到我说明吃糖后面没被截断】`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第二条：单独超大吃糖表情（不带 quote）
        await session.send(`${h('face', { id: '324' })}`)
      })
  }

  // 📦🌟 4. test-all-large-face-extra 指令 🌈🎉
  if (config.enableTestAllLargeFaceExtra) {
    ctx.command('test-all-large-face-extra', '测试全量超级表情混排与独立大表情')
      .action(async ({ session }) => {
        // 第一条：混排并引用回复原消息
        await session.send(`${h.quote(session?.messageId)}testAllLargeFace ${h('face', { id: '358' })}${h('face', { id: '359' })}${h('face', { id: '324' })}${h('face', { id: '317' })} TestOver 【看到我说明骰子后面没被截断】`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第二条：单独骰子
        await session.send(`${h('face', { id: '358' })}`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第三条：单独石头剪刀布
        await session.send(`${h('face', { id: '359' })}`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第四条：单独吃糖
        await session.send(`${h('face', { id: '324' })}`)
        await new Promise((resolve) => setTimeout(resolve, 111))
        // 第五条：单独菜汪
        await session.send(`${h('face', { id: '317' })}`)
      })
  }
}
