import { Context } from 'koishi'
import {} from 'koishi-plugin-adapter-onebot'

import { type Config, Config as ConfigSchema } from './config'
import { applyAutoReactToTarget, applyReactSameEmoji, clearEmojiImplCache } from './react'
import { applyPickFaceCommand } from './pick'

export const name = 'auto-emoji-onebot-vincentzyu'
export { Config } from './config'
export { usage } from './usage'

export function apply(ctx: Context, config: Config) {
  // 监听 bot 状态变更，自动清除表情回应的实现检测缓存
  ctx.on('bot-status-updated', (bot) => {
    if (bot.platform === 'onebot') {
      clearEmojiImplCache(bot.selfId);
    }
  });

  applyAutoReactToTarget(ctx, config);
  applyReactSameEmoji(ctx, config);
  applyPickFaceCommand(ctx, config.enablePickFace);
}
