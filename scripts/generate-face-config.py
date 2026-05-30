#!/usr/bin/env python3
"""
生成 face_config.ts 文件
从 face_config.json 提取 emoji 数据并转换为 TypeScript 常量
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

# 生成 TypeScript 文件
ts_content = '''/**
 * QQ Emoji 配置数据
 * 自动生成，请勿手动修改
 * 生成命令: python scripts/generate-face-config.py
 */

export interface EmojiConfig {
  emoji: string      // emoji 字符 (😊)
  qcid: string       // Unicode 码点 (128522)
  aqid: string       // Android QQ ID
  desc: string       // 描述 (/嘿嘿)
  code: string       // Emoji 代码
}

/**
 * Emoji 到 QCid 的映射
 * key: emoji 字符, value: QCid (用于 set_msg_emoji_like API)
 */
export const EMOJI_TO_QCID: Record<string, string> = {
'''

# 添加 emoji 到 QCid 的映射
for item in emoji_list:
    emoji = item.get('QSid', '')
    qcid = item.get('QCid', '')
    if emoji and qcid:
        ts_content += f"  '{emoji}': '{qcid}',\n"

ts_content += '''}

/**
 * Unicode 码点到 QCid 的映射
 * key: Unicode 十进制码点, value: QCid
 */
export const UNICODE_TO_QCID: Record<string, string> = {
'''

# 添加 Unicode 到 QCid 的映射
for item in emoji_list:
    qcid = item.get('QCid', '')
    if qcid:
        ts_content += f"  '{qcid}': '{qcid}',\n"

ts_content += '''}

/**
 * 完整的 Emoji 配置列表
 */
export const EMOJI_CONFIG_LIST: EmojiConfig[] = [
'''

# 添加完整配置
for item in emoji_list:
    emoji = item.get('QSid', '')
    qcid = item.get('QCid', '')
    aqid = item.get('AQLid', '')
    desc = item.get('QDes', '')
    code = item.get('EMCode', '')

    ts_content += f'''  {{
    emoji: '{emoji}',
    qcid: '{qcid}',
    aqid: '{aqid}',
    desc: '{desc}',
    code: '{code}',
  }},
'''

ts_content += ''']

/**
 * 将 emoji 字符或 Unicode 码点转换为 QCid
 * @param input - emoji 字符 (😊) 或 Unicode 码点 (128522)
 * @returns QCid 或 null
 */
export function convertToQCid(input: string | number): string | null {
  const inputStr = String(input)

  // 直接查找 emoji 字符
  if (EMOJI_TO_QCID[inputStr]) {
    return EMOJI_TO_QCID[inputStr]
  }

  // 查找 Unicode 码点
  if (UNICODE_TO_QCID[inputStr]) {
    return UNICODE_TO_QCID[inputStr]
  }

  // 尝试将 emoji 字符转换为 Unicode 码点
  if (inputStr.length > 0) {
    const codePoint = inputStr.codePointAt(0)
    if (codePoint) {
      const codePointStr = String(codePoint)
      if (UNICODE_TO_QCID[codePointStr]) {
        return UNICODE_TO_QCID[codePointStr]
      }
    }
  }

  return null
}
'''

# 写入文件
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f'✅ 成功生成 {output_path}')
print(f'📊 共处理 {len(emoji_list)} 个 emoji')
