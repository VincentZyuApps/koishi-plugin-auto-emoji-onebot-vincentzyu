import { Context, h } from 'koishi'
import { Config, OneBotImpl, ONEBOT_IMPL } from './config'
import { convertToQCid } from './face-config'

/**
 * 添加表情回应
 * 根据 OneBot 实现平台调用对应的 API 添加表情回应
 * @param ctx - Koishi 上下文
 * @param session - 会话对象
 * @param emojiCode - 表情 ID（支持 emoji 字符、Unicode 码点、QQ ID）
 * @param impl - OneBot 实现平台（Lagrange / NapCat/LLOneBot）
 */
export async function addEmojiReaction(
  ctx: Context,
  session: any,
  emojiCode: string | number,
  impl: OneBotImpl,
) {
  // 尝试将 emoji/unicode 转换为 QCid
  const qcid = convertToQCid(emojiCode)
  const finalCode = qcid || String(emojiCode)

  if (impl === ONEBOT_IMPL.LAGRANGE) {
    await session.onebot._request('set_group_reaction', {
      group_id: session.channelId,
      message_id: session.event.message.id,
      code: finalCode,
      is_add: true,
    })
      .catch((err: Error) => {
        ctx.logger.error(`❌ Lagrange 添加表情失败: ${err.message}`);
      })
  } else {
    await session.onebot._request('set_msg_emoji_like', {
      message_id: session.event.message.id,
      emoji_id: Number(finalCode),
    })
      .catch((err: Error) => {
        ctx.logger.error(`❌ NapCat/LLOneBot 添加表情失败: ${err.message}`);
      })
  }
}

/**
 * 自动表情回应
 * 监听群消息，对配置的目标用户自动添加指定表情回应
 * @param ctx - Koishi 上下文
 * @param config - 插件配置
 */
export function applyAutoReactToTarget(ctx: Context, config: Config) {
  ctx.on('message', async (session) => {
    const targets = config.reactTargets.filter(
      t => t.userId === session.userId && t.enabled,
    )

    if (targets.length === 0) {
      if (config.verboseConsoleOutput) {
        ctx.logger.info(`⏭️ QQ号 ${session.userId} 不在目标列表中或已禁用，跳过。`);
      }
      return
    }

    if (!session.onebot) {
      if (config.verboseConsoleOutput) {
        ctx.logger.error("⚠️ 当前会话不支持 onebot 协议。");
      }
      return
    }

    for (const target of targets) {
      if (config.verboseConsoleOutput) {
        ctx.logger.info(
          `🤖 尝试对用户 ${session.userId} 的消息添加表情 ${target.emojiCode}。` +
          `📝 消息内容: ${session.event.message.content.slice(0, 10)}`,
        );
      }

      await addEmojiReaction(ctx, session, target.emojiCode, config.onebotImplName);
    }
  })
}

/**
 * 回复相同表情
 * 监听群消息，检测消息中的 QQ 表情并自动回复相同表情
 * @param ctx - Koishi 上下文
 * @param config - 插件配置
 */
export function applyReactSameEmoji(ctx: Context, config: Config) {
  ctx.on('message', async (session) => {
    if (!config.reactSameEmoji) return

    for (const element of h.select(h.parse(session.content), 'face')) {
      if (element.attrs?.id) {
        if (config.verboseConsoleOutput) {
          ctx.logger.info(`😊 发现表情，回复相同表情，id=${element.attrs.id}`);
        }

        await addEmojiReaction(ctx, session, element.attrs.id, config.onebotImplName);
      }
    }
  })
}
