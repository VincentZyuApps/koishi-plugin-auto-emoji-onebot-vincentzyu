import { Context, h } from 'koishi'
import { convertToQCid, EMOJI_TO_QCID } from './face-config'

export function applyPickFaceCommand(ctx: Context, enabled: boolean) {
  if (!enabled) return

  ctx.command('取表情', '提取消息中的所有QQ表情和emoji（去重排序）')
    .alias('取qq表情', 'pick-face')
    .action(async ({ session }) => {
      if (!session.quote) {
        return `${h.quote(session?.messageId)}❌ 请引用一条包含 QQ 表情或 emoji 的消息 📋`
      }

      // 提取 QQ 表情 (face 标签)
      const faces = h.select(h.parse(session.quote.content), 'face');
      const faceMap = new Map<string, { count: number; type: 'qq' }>();

      for (const f of faces) {
        const id = f.attrs.id
        if (!faceMap.has(id)) {
          faceMap.set(id, { count: 0, type: 'qq' })
        }
        faceMap.get(id).count++
      }

      // 提取文本中的 emoji
      const textContent = session.quote.content.replace(/<[^>]+>/g, '') // 移除标签
      const emojiMap = new Map<string, { count: number; qcid: string; type: 'emoji' }>();

      for (const emoji of Object.keys(EMOJI_TO_QCID)) {
        let count = 0
        let index = 0
        while ((index = textContent.indexOf(emoji, index)) !== -1) {
          count++
          index += emoji.length
        }
        if (count > 0) {
          emojiMap.set(emoji, {
            count,
            qcid: EMOJI_TO_QCID[emoji],
            type: 'emoji'
          })
        }
      }

      const totalCount = faces.length + Array.from(emojiMap.values()).reduce((sum, e) => sum + e.count, 0)
      const uniqueCount = faceMap.size + emojiMap.size
      const qqFaceCount = faces.length
      const emojiCount = Array.from(emojiMap.values()).reduce((sum, e) => sum + e.count, 0)

      const lines: string[] = []

      // 输出 QQ 表情
      lines.push(`📱 QQ 表情: ${qqFaceCount} 个`)
      if (faceMap.size > 0) {
        const sortedFaces = [...faceMap.entries()].sort((a, b) => Number(a[0]) - Number(b[0]))
        for (const [id, data] of sortedFaces) {
          lines.push(`\t 【${h('face', { id })} x${data.count}  (QSid: ${id}) 】`)
        }
      }

      // 输出 emoji
      lines.push(`😊 Emoji: ${emojiCount} 个`)
      if (emojiMap.size > 0) {
        const sortedEmojis = [...emojiMap.entries()].sort((a, b) => Number(a[1].qcid) - Number(b[1].qcid))
        for (const [emoji, data] of sortedEmojis) {
          lines.push(`\t 【${emoji} x${data.count}  (QCid: ${data.qcid}) 】`)
        }
      }

      return `${h.quote(session?.messageId)}📊 共 ${totalCount} 个表情，去重后 ${uniqueCount} 个 🎯:\n${lines.join('\n')}`
    })
}
