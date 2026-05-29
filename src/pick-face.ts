import { Context, h } from 'koishi'

export function applyPickFaceCommand(ctx: Context, enabled: boolean) {
  if (!enabled) return

  ctx.command('取表情', '提取消息中的所有QQ表情（去重排序）')
    .alias('取qq表情', 'pick-face')
    .action(async ({ session }) => {
      if (!session.quote) {
        return `${h.quote(session?.messageId)}❌ 请引用一条包含 QQ 表情的消息 📋`
      }

      const faces = h.select(h.parse(session.quote.content), 'face');

      const countMap = new Map<string, number>();
      for (const f of faces) {
        const id = f.attrs.id
        countMap.set(id, (countMap.get(id) || 0) + 1)
      };

      const sorted = [...countMap.entries()].sort(
        (a, b) => Number(a[0]) - Number(b[0]),
      );

      const lines = sorted.map(
        ([id, count]) => `\t【${h('face', { id })} x${count}  (ID: ${id}) 】 `,
      );

      return `${h.quote(session?.messageId)}📊 共 ${faces.length} 个表情，去重后 ${sorted.length} 个 🎯: \n ${lines.join('\n')}`;
    })
}
