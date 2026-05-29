import { Context, h } from 'koishi'
import { Config, OneBotImpl, ONEBOT_IMPL } from './config'

export async function addEmojiReaction(
  ctx: Context,
  session: any,
  emojiCode: string | number,
  impl: OneBotImpl,
) {
  if (impl === ONEBOT_IMPL.LAGRANGE) {
    await session.onebot._request('set_group_reaction', {
      group_id: session.channelId,
      message_id: session.event.message.id,
      code: String(emojiCode),
      is_add: true,
    })
      .catch((err: Error) => {
        ctx.logger.error(`❌ Lagrange 添加表情失败: ${err.message}`);
      })
  } else {
    await session.onebot._request('set_msg_emoji_like', {
      message_id: session.event.message.id,
      emoji_id: Number(emojiCode),
    })
      .catch((err: Error) => {
        ctx.logger.error(`❌ NapCat/LLOneBot 添加表情失败: ${err.message}`);
      })
  }
}

export function applyAutoReactToTarget(ctx: Context, config: Config) {
  ctx.on('message', async (session) => {
    const target = config.reactTargets.find(
      t => t.userId === session.userId && t.enabled,
    )

    if (!target) {
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

    if (config.verboseConsoleOutput) {
      ctx.logger.info(
        `🤖 尝试对用户 ${session.userId} 的消息添加表情。` +
        `📝 消息内容: ${session.event.message.content.slice(0, 10)}`,
      );
    }

    await addEmojiReaction(ctx, session, target.emojiCode, config.onebotImplName);
  })
}

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
