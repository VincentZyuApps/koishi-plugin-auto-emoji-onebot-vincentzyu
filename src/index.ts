import { Context } from 'koishi'
import {} from 'koishi-plugin-adapter-onebot'

import { Config } from './config'
import { applyAutoReactToTarget, applyReactSameEmoji } from './emoji-react'
import { applyPickFaceCommand } from './pick-face'

export const name = 'auto-emoji-onebot-vincentzyu'
export { Config } from './config'
export { usage } from './usage'

export function apply(ctx: Context, config: Config) {
  applyAutoReactToTarget(ctx, config);
  applyReactSameEmoji(ctx, config);
  applyPickFaceCommand(ctx, config.enablePickFace);
}
