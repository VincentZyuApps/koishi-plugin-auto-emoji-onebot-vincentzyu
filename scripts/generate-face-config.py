#!/usr/bin/env python3
"""
生成 face_config.ts 文件
从 face_config.json 提取 emoji 和 sysface 数据并转换为 TypeScript 常量
保留所有原始字段用于 verbose 输出
"""
import json
import os

# 读取 face_config.json
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, '..', 'assets', 'face_config.json')
output_path = os.path.join(script_dir, '..', 'src', 'face-config.ts')

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

emoji_list = data.get('emoji', [])
sysface_list = data.get('sysface', [])

# 生成 TypeScript 文件内容
lines = []
lines.append('/**')
lines.append(' * QQ Emoji 和 SysFace 配置数据')
lines.append(' * 自动生成，请勿手动修改')
lines.append(' * 生成命令: python scripts/generate-face-config.py')
lines.append(' */')
lines.append('')
lines.append('/**')
lines.append(' * Emoji 完整配置（保留所有字段）')
lines.append(' */')
lines.append('export interface EmojiFullConfig {')
lines.append('  QSid: string')
lines.append('  QCid: string')
lines.append('  AQLid: string')
lines.append('  QDes: string')
lines.append('  EMCode: string')
lines.append('  QHide?: string')
lines.append('  [key: string]: any')
lines.append('}')
lines.append('')
lines.append('/**')
lines.append(' * SysFace 完整配置（保留所有字段）')
lines.append(' */')
lines.append('export interface SysFaceFullConfig {')
lines.append('  QSid: string')
lines.append('  QDes: string')
lines.append('  IQLid?: string')
lines.append('  AQLid?: string')
lines.append('  EMCode: string')
lines.append('  AniStickerType?: number')
lines.append('  AniStickerPackId?: string')
lines.append('  AniStickerId?: string')
lines.append('  [key: string]: any')
lines.append('}')
lines.append('')
lines.append('/**')
lines.append(' * Emoji 到 QCid 的映射')
lines.append(' * key: emoji 字符, value: QCid (用于 set_msg_emoji_like API)')
lines.append(' */')
lines.append('export const EMOJI_TO_QCID: Record<string, string> = {')

# 添加 emoji 到 QCid 的映射
for item in emoji_list:
    emoji = item.get('QSid', '')
    qcid = item.get('QCid', '')
    if emoji and qcid:
        lines.append(f"  '{emoji}': '{qcid}',")

lines.append('}')
lines.append('')
lines.append('/**')
lines.append(' * Unicode 码点到 QCid 的映射')
lines.append(' * key: Unicode 十进制码点, value: QCid')
lines.append(' */')
lines.append('export const UNICODE_TO_QCID: Record<string, string> = {')

# 添加 Unicode 到 QCid 的映射
for item in emoji_list:
    qcid = item.get('QCid', '')
    if qcid:
        lines.append(f"  '{qcid}': '{qcid}',")

lines.append('}')
lines.append('')
lines.append('/**')
lines.append(' * 完整的 Emoji 配置列表（包含所有字段）')
lines.append(' */')
lines.append('export const EMOJI_FULL_CONFIG: EmojiFullConfig[] = [')
for i, item in enumerate(emoji_list):
    item_json = json.dumps(item, ensure_ascii=False)
    if i < len(emoji_list) - 1:
        lines.append(f'  {item_json},')
    else:
        lines.append(f'  {item_json}')
lines.append(']')
lines.append('')
lines.append('/**')
lines.append(' * 完整的 SysFace 配置列表（包含所有字段）')
lines.append(' */')
lines.append('export const SYSFACE_FULL_CONFIG: SysFaceFullConfig[] = [')
for i, item in enumerate(sysface_list):
    item_json = json.dumps(item, ensure_ascii=False)
    if i < len(sysface_list) - 1:
        lines.append(f'  {item_json},')
    else:
        lines.append(f'  {item_json}')
lines.append(']')
lines.append('')
lines.append('/**')
lines.append(' * Emoji QCid 到完整配置的映射')
lines.append(' */')
lines.append('export const EMOJI_QCID_TO_CONFIG: Record<string, EmojiFullConfig> = {}')
lines.append('EMOJI_FULL_CONFIG.forEach(item => {')
lines.append('  EMOJI_QCID_TO_CONFIG[item.QCid] = item')
lines.append('})')
lines.append('')
lines.append('/**')
lines.append(' * SysFace QSid 到完整配置的映射')
lines.append(' */')
lines.append('export const SYSFACE_QSID_TO_CONFIG: Record<string, SysFaceFullConfig> = {}')
lines.append('SYSFACE_FULL_CONFIG.forEach(item => {')
lines.append('  SYSFACE_QSID_TO_CONFIG[item.QSid] = item')
lines.append('})')
lines.append('')
lines.append('/**')
lines.append(' * 将 emoji 字符或 Unicode 码点转换为 QCid')
lines.append(' * @param input - emoji 字符 (😊) 或 Unicode 码点 (128522)')
lines.append(' * @returns QCid 或 null')
lines.append(' */')
lines.append('export function convertToQCid(input: string | number): string | null {')
lines.append('  const inputStr = String(input)')
lines.append('')
lines.append('  // 直接查找 emoji 字符')
lines.append('  if (EMOJI_TO_QCID[inputStr]) {')
lines.append('    return EMOJI_TO_QCID[inputStr]')
lines.append('  }')
lines.append('')
lines.append('  // 查找 Unicode 码点')
lines.append('  if (UNICODE_TO_QCID[inputStr]) {')
lines.append('    return UNICODE_TO_QCID[inputStr]')
lines.append('  }')
lines.append('')
lines.append('  // 尝试将 emoji 字符转换为 Unicode 码点')
lines.append('  if (inputStr.length > 0) {')
lines.append('    const codePoint = inputStr.codePointAt(0)')
lines.append('    if (codePoint) {')
lines.append('      const codePointStr = String(codePoint)')
lines.append('      if (UNICODE_TO_QCID[codePointStr]) {')
lines.append('        return UNICODE_TO_QCID[codePointStr]')
lines.append('      }')
lines.append('    }')
lines.append('  }')
lines.append('')
lines.append('  return null')
lines.append('}')
lines.append('')

# 写入文件
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'✅ 成功生成 {output_path}')
print(f'📊 共处理 {len(emoji_list)} 个 emoji, {len(sysface_list)} 个 sysface')
