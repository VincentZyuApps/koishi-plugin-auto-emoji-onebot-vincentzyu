![koishi-plugin-auto-emoji-onebot](https://socialify.git.ci/VincentZyuApps/koishi-plugin-auto-emoji-onebot/image?description=1&font=Bitter&forks=1&issues=1&language=1&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto)

# 🤖 koishi-plugin-auto-emoji-onebot

[![npm](https://img.shields.io/npm/v/koishi-plugin-auto-emoji-onebot?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-auto-emoji-onebot)
[![npm-download](https://img.shields.io/npm/dm/koishi-plugin-auto-emoji-onebot?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-auto-emoji-onebot)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VincentZyuApps/koishi-plugin-auto-emoji-onebot)
[![Gitee](https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white)](https://gitee.com/vincent-zyu/koishi-plugin-auto-emoji-onebot)

<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

# 🤖 让 bot 自动给你的群友消息添加表情回应！✨

## ⚠️ 重要提示

**🔴 本插件需要前置插件 `koishi-plugin-adapter-onebot` 才能正常使用！**

请确保在 Koishi 控制台中已经安装并启用了以下插件：
- 📦 `koishi-plugin-adapter-onebot` - OneBot 适配器

如果没有安装该插件，本插件将无法工作！

---

## 🚀 功能介绍

Koishi 插件，自动对指定群友的消息添加表情回应，也支持对消息中的 QQ 表情回复相同表情。包含以下功能：

| 功能 | 说明 |
|---|---|
| 🤖 **自动表情回应** | 对配置的 QQ 号列表中的用户，自动给他们的消息加上指定表情 |
| 😊 **回复相同表情** | 别人发 QQ 表情时，bot 自动回复相同的表情 |
| 📋 **取表情指令** | 引用消息后提取其中的所有 QQ 表情，去重并排序输出 |

## 📖 使用方法

### 1. ⚙️ 配置项

在 Koishi 控制台插件配置中设置：

| 配置 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| onebotImplName | radio | NapCat / LLOneBot | 选择你的 OneBot 实现平台（Lagrange / NapCat / LLOneBot） |
| reactTargets | table | QQ号=1830540513, 表情ID=324, 启用=是 | 目标用户表格：设置QQ号、表情ID、是否启用 |
| reactSameEmoji | boolean | true | 是否对消息中的 QQ 表情回复相同表情 |
| verboseConsoleOutput | boolean | true | 是否在控制台打印调试日志 |

### 2. 🤖 自动表情回应

配置好 `reactTargets` 表格后，当列表中的用户发消息时，bot 会自动对其消息添加配置的表情。

> 默认配置：QQ号 `1830540513`，表情 `324`（吃糖）

### 3. 😊 回复相同表情

开启 `reactSameEmoji` 后，当有人在群里发 QQ 表情时，bot 会自动回复相同的表情。

### 4. 📋 取表情指令

引用一条包含 QQ 表情的消息，发送指令提取所有 QQ 表情（去重排序）：

```
取表情
取qq表情    # alias
pick-face   # alias
```

**输出示例：**
```
共 8 个表情，去重后 3 个：
14  20  324
```

## 🗂️ 文件结构

```
src/
  config.ts       类型定义 & Schema 配置
  emoji-react.ts  表情回应核心逻辑（addEmojiReaction + 两个 handler）
  pick-face.ts    取表情指令实现
  index.ts        插件入口
```

## 📝 更新日志

> 0.0.1: 初始版本，支持自动表情回应、回复相同表情、取表情指令

## ⚠️ 注意事项

- ✅ 需要安装并启用 `koishi-plugin-adapter-onebot`
- 🎯 Lagrange 使用 `set_group_reaction` API，NapCat/LLOneBot 使用 `set_msg_emoji_like` API
- 📋 取表情指令需要引用一条消息后才能使用
- 🐛 开启 `verboseConsoleOutput` 可查看更多调试信息
