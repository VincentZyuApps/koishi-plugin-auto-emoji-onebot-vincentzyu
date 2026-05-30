const pkg = require('../package.json')

export const usage = `
<h1>Koishi 插件：auto-emoji-onebot-vincentzyu</h1>
<h2>🎯 插件版本：v${pkg.version}</h2>

<p>
  <a href="https://www.npmjs.com/package/koishi-plugin-auto-emoji-onebot-vincentzyu" target="_blank">
    <img src="https://img.shields.io/npm/v/koishi-plugin-auto-emoji-onebot-vincentzyu?style=flat-square" alt="npm version">
  </a>
  <a href="https://github.com/VincentZyuApps/koishi-plugin-auto-emoji-onebot-vincentzyu" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://gitee.com/vincent-zyu/koishi-plugin-auto-emoji-onebot-vincentzyu" target="_blank">
    <img src="https://img.shields.io/badge/Gitee-C71D23?style=for-the-badge&logo=gitee&logoColor=white" alt="Gitee">
  </a>
  <a href="https://qm.qq.com/q/ZN7fxZ3qCq" target="_blank">
    <img src="https://img.shields.io/badge/QQ群-1085190201-1AAD19?style=flat-square" alt="QQ群">
  </a>
  <a href="https://forum.koishi.xyz/t/topic/12566" target="_blank">
    <img src="https://img.shields.io/badge/Koishi Forum-12566-5546A3?style=for-the-badge&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff3%2FKoishi.js_Logo.png&logoColor=white" alt="Forum">
  </a>
</p>

<h2 style="color: #ff4444; font-weight: 900; font-size: 24px; margin: 20px 0;">⚠️ 重要提示：需要前置插件 <b>koishi-plugin-adapter-onebot</b> 才能正常使用捏！</h2>

<p>💬 插件使用问题 / 🐛 Bug反馈 / 👨‍💻 插件开发交流，欢迎加入QQ群：<b>1085190201</b> 🎉</p>
<p>💡 在群里直接艾特我，回复的更快哦~ ✨</p>

<p><b>💡 提示：</b>
  <a href="https://gitee.com/vincent-zyu/koishi-plugin-auto-emoji-onebot-vincentzyu" target="_blank">
    前往 Gitee README 获得更佳观感 →
    <i>https://gitee.com/vincent-zyu/koishi-plugin-auto-emoji-onebot-vincentzyu</i>
  </a>
</p>

<hr>

<details>
<summary><h2>📖 插件详细说明（点击展开）</h2></summary>

<h3>🤖 功能一览</h3>
<ul>
  <li>📋 <b>取表情指令</b> — 引用消息后提取其中的所有 QQ 表情和 emoji，去重并排序输出。先用这个拿到表情 ID，再去配自动回应 🎯</li>
  <li>🎯 <b>自动表情回应</b> — 对配置的 QQ 号列表中的用户，自动给他们的消息加上指定表情（支持 emoji 字符、Unicode 码点、QQ 表情 ID）</li>
  <li>😊 <b>回复相同表情</b> — 别人发 QQ 表情或 emoji 时，bot 自动回复相同的表情</li>
</ul>

<h3>📋 取表情指令</h3>
<p>引用一条包含 QQ 表情或 emoji 的消息，发送以下指令，先拿到表情 ID：</p>
<ul>
  <li><code>取表情</code></li>
  <li><code>取表情 -v</code> - 显示详细信息（所有字段）</li>
  <li><code>取qq表情</code> (alias)</li>
  <li><code>pick-face</code> (alias)</li>
  <li><code>pick-face -v</code> - verbose mode</li>
</ul>
<p><b>💡 普通模式：</b>显示 emoji 字符、出现次数、QCid（Unicode 码点）</p>
<p><b>🔍 详细模式（-v）：</b>显示所有字段（QSid, QCid, AQLid, QDes, EMCode 等），适合调试和深入了解表情数据</p>
<p>💡 拿到表情 ID 后，再到「自动表情回应」的配置表格里填入对应的 QQ 号和表情 ID 即可 🎯</p>
<p>🔍 在线查找 QQ 表情 ID：</p>
<ul>
  <li>📖 <a href="https://koishi.js.org/QFace/#/qqnt" target="_blank">QFace 在线查阅</a></li>
  <li>📦 <a href="https://github.com/koishijs/QFace/blob/master/public/assets/qq_emoji/face_config.json" target="_blank">QFace face_config.json</a></li>
  <li>🗃️ <a href="https://github.com/NapNeko/NapCatQQ/blob/main/packages/napcat-core/external/face_config.json" target="_blank">NapCatQQ face_config.json</a></li>
</ul>

<h3>✨ 表情 ID 输入格式（新功能）</h3>
<p>现在支持三种表情 ID 输入格式：</p>
<ul>
  <li>1️⃣ <b>Emoji 字符</b>：直接输入 emoji 字符，如 <code>😊</code>、<code>👍</code>、<code>❤️</code></li>
  <li>2️⃣ <b>Unicode 码点</b>：输入 emoji 的 Unicode 十进制码点，如 <code>128522</code>（对应 😊）</li>
  <li>3️⃣ <b>QQ 表情 ID</b>：传统的 QQ 表情 ID，如 <code>324</code></li>
</ul>
<p>💡 <b>示例配置：</b></p>
<ul>
  <li>QQ号: <code>1830540513</code>，表情ID: <code>😊</code> ✅</li>
  <li>QQ号: <code>1830540513</code>，表情ID: <code>128522</code> ✅</li>
  <li>QQ号: <code>1830540513</code>，表情ID: <code>324</code> ✅</li>
</ul>

<h3>⚙️ 配置说明</h3>
<table style="border-collapse: collapse; width: 100%;">
  <tr>
    <th style="border: 1px solid #ddd; padding: 8px;">配置</th>
    <th style="border: 1px solid #ddd; padding: 8px;">说明</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">onebotImplName</td>
    <td style="border: 1px solid #ddd; padding: 8px;">选择你的 OneBot 实现平台（Lagrange / NapCat / LLOneBot）</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">reactTargets</td>
    <td style="border: 1px solid #ddd; padding: 8px;">目标用户表格：设置 QQ 号、表情 ID（支持 emoji 字符/Unicode 码点/QQ ID）、是否启用</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">reactSameEmoji</td>
    <td style="border: 1px solid #ddd; padding: 8px;">是否对消息中的 QQ 表情回复相同表情</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">verboseConsoleOutput</td>
    <td style="border: 1px solid #ddd; padding: 8px;">是否在控制台打印调试日志</td>
  </tr>
</table>

<h3>⚠️ 注意事项</h3>
<ul>
  <li>✅ 需要安装并启用 <code>koishi-plugin-adapter-onebot</code></li>
  <li>🎯 Lagrange 使用 <code>set_group_reaction</code> API，NapCat/LLOneBot 使用 <code>set_msg_emoji_like</code> API</li>
  <li>⚙️ 请在插件配置的「OneBot 实现平台」中选择与你实际部署一致的选项</li>
  <li>📋 取表情指令需要引用一条消息后才能使用</li>
  <li>🐛 开启 <code>verboseConsoleOutput</code> 可查看更多调试信息</li>
</ul>

</details>

<hr>

<h3>🙏 致谢</h3>
<p>本插件的 emoji 支持功能得益于以下开源项目：</p>
<ul>
  <li>🎯 <a href="https://github.com/koishijs/QFace" target="_blank"><b>koishijs/QFace</b></a> - QQ 表情数据维护项目，提供了完整的 QQ 表情映射</li>
  <li>🐱 <a href="https://github.com/NapNeko/NapCatQQ" target="_blank"><b>NapCatQQ</b></a> - 本插件使用的 <code>assets/face_config.json</code> 来自 NapCatQQ 项目的 <code>packages/napcat-core/external/face_config.json</code></li>
</ul>
<p>感谢这些项目的贡献者们！🎉</p>

<hr>

<h3>📜 插件许可声明</h3>
<p>🆓 本插件为开源免费项目，基于 MIT 协议开放。欢迎修改、分发、二创。🎉</p>
<p>⭐ 如果你觉得插件好用，欢迎在 GitHub 上 Star 或通过其他方式给予支持！💖</p>
`
