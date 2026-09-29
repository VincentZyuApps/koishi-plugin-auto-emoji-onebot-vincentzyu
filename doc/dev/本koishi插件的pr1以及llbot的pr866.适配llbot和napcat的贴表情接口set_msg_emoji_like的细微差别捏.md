# 适配 LLOneBot 与 NapCat 混排超级表情与贴表情差异规划文档

## 📌 问题背景与根因
- **现象**：在群聊触发「取表情」时，NapCat (`dev-bot`) 发送完整消息，而 LLOneBot (`awa-bot` / `dev2-bot`) 均截断在 `QSid: 324`（/吃糖 🫣）处。
- **根因**：
  1. QQ 协议中超级表情（带 `AniStickerType`）单发为全屏大表情（`serviceType: 37`），图文混排时在 QQ 客户端呈现为小黄脸。
  2. LLOneBot 发送端不管混排与否强制打包为大表情（导致 QQ 客户端渲染截断），且在接收端 `messageParsing.ts` 的 `svcType === 37` 分支内错误调用了 `break`（导致解析循环提前跳出）。

---

## 🚀 三阶段实施规划

### 阶段 1：51 机器 `llbot-dev2` Docker 容器热补丁验证（已完成 ✅）
- **动作**：
  1. 登录 51 机器，定位运行产物 `llbot.js`。
  2. 同时修复发送端混排降级（`serviceType: 33`）与接收端移除 `break`。
  3. 热重启 `dev2` 验证，实测已能像 NapCat 一样输出完整消息（含 324、后续文字及 Emoji）。

### 阶段 2：上游 TS 源码深度修复与三步闭环推进（已完成 ✅）

#### 阶段 2A：基础混排修复与初版 PR（已完成 ✅）
- **目标**：解决图文混排时超级表情（如 324 🫣）强制大表情导致的渲染截断问题。
- **动作**：
  1. 在 `D:\temp\gemini\LuckyLilliaBot` 提交 PR #866，完成本地构建与群内实测验证通过。

#### 阶段 2B：Sourcery-ai 审查点验证与专业反驳（已完成 ✅）
- **结论**：**不采纳 Sourcery 建议，维持阶段 2A 降级为 `serviceType: 33` 方案。**
- **实测铁证**：
  1. 真实网络环境实测：若混排时保留 `serviceType: 37`，腾讯 QQ 服务端直接判定为非法数据包并拒收，当场抛出 `retcode: 1200` 导致整条消息发送失败。
  2. 官方客户端规范：官方手机 QQ 客户端在图文混排时，骰子/超级表情本身就是以行内小表情形式显示（如 `测试骰子点数：🎲`）。
  3. 已在 PR #866 对应的 Code Review 线程中回贴真实测试数据与 `retcode 1200` 报错现场完成打脸与专业闭环：[查看回复](https://github.com/LLOneBot/LuckyLilliaBot/pull/866#discussion_r4136629312)。

#### 阶段 2C：维护者予云叶（yeye2025）审查点 —— 接收端精准剔除 fallback 降级文字（已完成 ✅）
- **结论**：**采用 `skipIndex` 精准跳过紧随其后的 fallback 降级文本，替代原有的 `break` 语句。**
- **验证成果**：
  1. 复现成功：移除了 break 的初版代码在接收单发大表情时，会解析出多余的 `[吃糖]` 尾巴。
  2. 修复部署：在 `messageParsing.ts` 中通过探测 `nextElem` 结合 `skipIndex = index + 1` 针对性跳过 fallback 文本（支持 `[表情名]`、`[动画表情]`、`[骰子]`、`[包剪锤]` 等），且不打断后续解析。
  3. Commit 落地：已提交 Commit [`6296b9ee`](https://github.com/LLOneBot/LuckyLilliaBot/pull/866/commits/6296b9eee3e886d1958d1cad642d8e2c1485791c) 到 PR #866。
  4. 架构复盘：已在 PR #866 中发布 NapCat 与 LLOneBot 的全量文件/行号/Hash/架构差异对比评论：[查看评论](https://github.com/LLOneBot/LuckyLilliaBot/pull/866#issuecomment-5896358564)。
  5. 细节润色与提交积累：持续完善协议注释与文档索引，累计贡献 7 个高质量 Commit。

### 阶段 3：Koishi 插件无感兼容与 PR 合并（守护生产 awa-bot，已完成 ✅）
- **目标**：即使上游老版本 LLOneBot 未更新，Koishi 插件发出的消息也具备免疫截断能力。
- **动作**：
  1. 在 `auto-emoji-onebot-vincentzyu` 插件创建分支 `fix/llbot-super-face-compat`。
  2. `config.ts` 拆分实现枚举，采用与 `onebot-info-image` 一致的双 Emoji 风格：
     - `✨🤖 自动检测（推荐，智能识别 NapCat / LLBot / Lagrange）`
     - `🐈💙 NapCat（调用 set_msg_emoji_like）`
     - `🤖🩷 LLBot (Lucky Lillia Bot，调用 set_msg_emoji_like)`
     - `🧐💜 Lagrange V1（调用 set_group_reaction）`
  3. 新增 `llbotSuperFaceCompat` 配置开关：
     - **属性配置**：默认关闭（`false`），明确标注 `.experimental()`。
     - **妥协机制说明**：该配置在 description 和文档中明确标注**并非根治方案，仅为插件层的临时妥协方案**；彻底根治需要上游修复 LLOneBot 自身协议缺陷（作者已提交 PR：[LLOneBot/LuckyLilliaBot#866](https://github.com/LLOneBot/LuckyLilliaBot/pull/866)，截至 2026年9月30日 尚未合并）。
     - **渲染行为**：在 `pick.ts` 提取表情时，若开启此实验性保护且当前为 LLOneBot 实例，对具有全屏动画属性的超级表情（如 324 吃糖、317 菜汪 等）智能降级输出 Unicode Emoji（如 `🫣`、`🐶`）或安全文本形态，彻底杜绝老版本客户端在图文混排时的截断崩溃。
  4. 新增 4 个小写短横线协议测试指令：`test-dice`、`test-rps`、`test-super-large`、`test-all-large-face-extra`（带 111ms 间隔）。
  5. 使用 `gh` CLI 提交 PR [#1](https://github.com/VincentZyuApps/koishi-plugin-auto-emoji-onebot-vincentzyu/pull/1) 并合并到 `main` 分支，正式 bump 版本号至 `0.3.1-beta.5+20260930`。
  6. 本地 Windows LLOneBot 调试进程已退出，51 Macbook 上的 `llbot-dev2` 容器已恢复运行并配置 DNS/代理支持。
