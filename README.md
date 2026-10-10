# Inkora 🖋️

<p align="center">
  <img src="public/icons/icon-c.png" alt="Inkora Logo" width="128" height="128" style="border-radius: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
</p>

<p align="center">
  <strong>精简 · 优雅 · 极致流畅的 Markdown 桌面编辑器</strong>
  <br />
  深度对标 <b>Typora</b> 原生单栏所见即所得体验 ｜ <b>Windows 原生经典操作体系</b> ｜ <b>Tauri 2 (Rust) + React 19</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri&logoColor=white" alt="Tauri 2" />
  <img src="https://img.shields.io/badge/Rust-2021-orange?logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📖 简介 (Introduction)

**Inkora**（源自 *Ink* 墨水与 *Aura* 灵气）是一款为追求纯粹排版与专注写作的用户打造的现代跨平台 Markdown 桌面编辑器。

传统 Markdown 编辑器往往采用割裂的“左边写代码、右边看渲染”的双栏分屏方案。Inkora 深度对标 **Typora** 的经典精髓，采用**单栏原地所见即所得 (WYSIWYG)** 架构，结合 **Tauri 2 (Rust)** 极低资源开销与 **Windows 原生级无边框窗口体验**，带来毫秒级响应、沉浸无打扰的创作空间。

---

## 🎨 视觉美学与应用图标自由切换

致敬 Typora 经典设计哲学与传统书籍印刷工艺，Inkora 预置了 3 套由 Nano Banana 精工设计的专属应用图标，并支持**在应用内自由切换**：

| 图标外观 | 风格命名 | 设计语言与质感 |
| :---: | :--- | :--- |
| <img src="public/icons/icon-c.png" width="48" height="48" style="border-radius: 10px;" /> | **象牙纸水墨 (默认)** | 细腻手工羊皮纸与水彩纸纤维微肌理，嵌入下凹压印深邃纯黑墨水大写字母「I」，呈现出书籍出版与传统印刷的典雅温润质感。 |
| <img src="public/icons/icon-a.png" width="48" height="48" style="border-radius: 10px;" /> | **经典红陶 (Typora款)** | 原汁原味的 Typora 标志性赤陶红磨砂底色，搭配精工凹印的象牙白粗衬线体「I」，唤醒经典肌肉记忆。 |
| <img src="public/icons/icon-b.png" width="48" height="48" style="border-radius: 10px;" /> | **黑曜石暗夜** | 深邃极简的哑光碳黑圆角矩形，搭配带有立体微金属银质光泽的衬线体「I」，现代极客质感。 |

> 💡 **快速切换方式**：
> 1. 点击窗口左上角标题栏的 **Inkora 图标**，即可在三种外观之间一键循环切换；
> 2. 或在顶部菜单栏 **「主题(T)」** 下拉菜单底部勾选切换。选择会自动持久化并实时同步桌面 Favicon。

---

## 🌟 核心特性 (Key Features)

### 1. 极致书写与编辑体验
- 🎯 **原地所见即所得 (WYSIWYG)**：打字即排版，光标聚焦时自然展开 Markdown 控制符，移开时光速渲染，彻底告别双栏分屏的割裂感；
- ⚡ **毫秒级源码模式无缝互切 (`Ctrl+/`)**：随时在所见即所得与底层原生 Markdown 纯文本源码之间 100% 无损互转；
- 📝 **Typora 标志性双沉浸书写模式**：
  - **打字机模式 (`F9`)**：视口焦点智能跟随光标保持在垂直居中视线；
  - **专注模式 (`F8`)**：当前编辑段落高亮聚焦，非活动段落优雅淡化（30% 透明度），屏蔽一切外界杂音；
- 💡 **划选文本浮动格式气泡栏 (Bubble Menu)**：划词即刻浮出粗体、斜体、下划线、删除线、行内代码、马克笔高亮与超链接工具；
- 🔍 **浮动查找与替换面板 (`Ctrl+F` / `Ctrl+H`)**：带实时匹配计数、上下高亮导航、大小写敏感匹配与一键全量替换；
- 📈 **Typora 风格字数统计卡片**：点击状态栏字数浮出中英文字数、不计空格字符数、段落数与朗读/默读时间预估；
- ↩️ **标题栏快速撤销 / 重做按钮组 (`Ctrl+Z` / `Ctrl+Y`)**：动态感知历史堆栈，未修改时自动灰显禁用。

### 2. Windows 原生经典操作体系
- 🪟 **沉浸式菜单栏与标题栏一体化**：左侧提供完整「文件(F) / 编辑(E) / 段落(P) / 格式(O) / 视图(V) / 主题(T)」经典菜单体系，完美符合 Windows 桌面操作习惯；
- 🪟 **原生无边框窗体控制**：右上角标准最小化、最大化/向下还原、经典红色高亮关闭按钮；支持双击标题栏最大化、拖拽移动与窗口吸附；
- 🔤 **Windows 优先排版字体栈**：优先调用 `Segoe UI`、`微软雅黑` 与 `Consolas` 等宽字体栈，文字边缘平滑锐利。

### 3. Typora 经典 4 大主题实时切换
- ⚪ **GitHub 浅色 (默认)**：经典的纯净白纸黑字与精炼灰色边界；
- 🌙 **Night 暗黑夜间**：深邃护眼的黑曜石暗色主题；
- 📰 **Newsprint 经典报刊**：温暖复古的牛皮纸与优雅衬线体排版；
- 🏛️ **Gothic 哥特优雅**：典雅文艺象牙白纸张质感。

### 4. 丰富扩展与科研图表支持
- 📊 **可视化表格**：支持一键增删行、列，表格对齐与可视化悬浮快捷条；表格最后一格按 `Tab` 自动新增下一行；
- 📐 **KaTeX 数学公式**：毫秒级渲染行内公式 `$E=mc^2$` 与独立公式块 `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`；
- 💻 **代码块语法高亮**：内置 37+ 种主流语言着色、行号显示与一键复制；
- 📊 **Mermaid 交互图表原生渲染**：原生支持流程图、时序图、类图、甘特图等，支持原地源码一键切换；
- ☑️ **交互任务清单 (Task Lists)**：点击勾选框即时切换完成状态；
- 🖼️ **截图即贴与拖拽插入**：剪贴板截图直接原地粘贴为图片，支持文件直接拖拽插入。

### 5. 工作区管理与导出分享
- 📂 **三态可折叠侧边栏 (`Ctrl+Shift+L`)**：工作区文档树管理与文档创建/重命名/删除；
- 📑 **实时文档大纲 (TOC)**：自动解析 H1~H6 标题层级，点击平滑滚动精确定位锚点；
- 🔎 **Spotlight 快速检索 (`Ctrl+P`)**：全局模糊查找工作区文档与当前章节大纲；
- 📤 **导出与分享**：支持一键导出为独立排版 HTML 文件与高保真 PDF 打印导出。

---

## ⌨️ 快捷键速查表 (Keyboard Shortcuts)

| 快捷键 | 功能描述 | 对应菜单 |
| :--- | :--- | :--- |
| **`Ctrl + Z`** | 撤销上一步操作 (Undo) | 编辑(E) |
| **`Ctrl + Y`** | 恢复 / 重做上一步操作 (Redo) | 编辑(E) |
| **`Ctrl + F`** | 展开浮动查找面板 (Find) | 编辑(E) |
| **`Ctrl + H`** | 展开浮动替换面板 (Replace) | 编辑(E) |
| **`Ctrl + N`** | 新建 Markdown 文档 | 文件(F) |
| **`Ctrl + S`** | 保存当前文档 | 文件(F) |
| **`Ctrl + P`** | Spotlight 快速检索 / 打印导出 PDF | 文件(F) |
| **`Ctrl + /`** | 切换所见即所得 / 底层 Markdown 源码模式 | 视图(V) |
| **`F8`** | 开启 / 关闭专注模式 (Focus Mode) | 视图(V) |
| **`F9`** | 开启 / 关闭打字机模式 (Typewriter Mode) | 视图(V) |
| **`Ctrl + Shift + L`** | 展开 / 折叠侧边栏 | 视图(V) |
| **`Ctrl + 1 ~ 6`** | 快速设置 1 ~ 6 级标题 (Heading 1 ~ 6) | 段落(P) |
| **`Ctrl + T`** | 快速插入 3x3 GFM 可视化表格 | 段落(P) |
| **`Tab` (表格末格)** | 在表格底部自动追加新行并定位第一格 | - |
| **`Ctrl + Shift + M`** | 插入 LaTeX / KaTeX 数学公式块 | 段落(P) |
| **`Ctrl + Shift + K`** | 插入代码高亮块 | 段落(P) |
| **`Ctrl + B`** | 粗体 (Bold) | 格式(O) |
| **`Ctrl + I`** | 斜体 (Italic) | 格式(O) |
| **`Ctrl + U`** | 下划线 (Underline) | 格式(O) |

---

## 💾 安装与下载 (Downloads & Installation)

### Windows 用户 (推荐)
1. 从 Releases 页面下载最新安装包：
   - **`Inkora_x.x.x_x64-setup.exe`**：标准 NSIS Windows 安装向导程序，支持自定义安装路径、创建开始菜单与桌面快捷方式；
   - **`Inkora_x.x.x_x64_en-US.msi`**：Windows Installer 格式安装包，适合静默部署。
2. 双击安装程序，按提示完成安装即可启动。
> *注：Windows 10 / 11 已经默认内置系统 WebView2 运行时，无需额外安装运行环境。*

---

## 🛠️ 技术架构 (Architecture)

```mermaid
graph TD
    subgraph Rust Backend ["Rust 桌面底层 (Tauri 2)"]
        A[原生无边框窗口控制器]
        B[本地文件系统与对话框插件]
        C[系统日志与原生菜单管道]
    end

    subgraph Frontend View ["React 19 + TypeScript 前端体系"]
        D[TitleBar & 经典菜单栏]
        E[TipTap v2 富文本核心]
        F[双向 Markdown 序列化引擎]
        G[KaTeX 数学 / Mermaid 渲染引擎]
        H[工作区文档管理与大纲 TOC]
    end

    A <--> D
    B <--> H
    E <--> F
```

- **桌面运行时**：Tauri 2.0 (Rust) —— 启动耗时 < 300ms，常驻内存占用 < 40MB，安装包体积仅十余兆；
- **前端视图层**：React 19 + TypeScript + Vite 6；
- **排版富文本引擎**：TipTap v2 (ProseMirror) + Marked + Turndown 双向转换器；
- **公式与图表**：KaTeX 0.16 + Mermaid 12；
- **代码高亮**：lowlight (Highlight.js 37+ 常用语言)。

---

## 🚀 本地开发与构建指南 (Developer Guide)

### 前置环境需求
- [Node.js](https://nodejs.org/) >= 20
- [Rust 工具链](https://rustup.rs/) (stable 模式，Windows 下需 MSVC Build Tools)

### 1. 克隆代码与安装依赖
```powershell
git clone https://github.com/your-username/Inkora.git
cd Inkora
npm install
```

### 2. 启动网页版快速调试
```powershell
npm run dev
# 浏览器打开 http://localhost:1420
```

### 3. 启动桌面端原生调试窗口
```powershell
npm run tauri dev
```

### 4. 本地打包发布 Setup 安装包 (Windows)
```powershell
npm run tauri build
```
打包产物位于：
- `src-tauri/target/release/bundle/nsis/Inkora_0.1.0_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/Inkora_0.1.0_x64_en-US.msi`

---

## 🌐 跨平台自动化构建 (CI / CD)

本项目在 `.github/workflows/` 中预置了完善的 GitHub Actions 工作流：

- **日常 CI 构建 (`build.yml`)**：代码推送到 `main` 分支时自动触发，在 `macos-latest`、`ubuntu-22.04`、`windows-latest` 矩阵上并行编译，并生成各平台二进制构件（Artifacts）；
- **正式版本发布 (`release.yml`)**：推送 `v*` 语义化标签时自动触发，自动编译并发布 GitHub Release：
  ```bash
  git tag v0.1.0
  git push origin v0.1.0
  ```
  即可一键全自动打包发布全平台安装包（Windows Setup .exe / MSI、macOS .dmg / .app、Linux .deb / .AppImage）。

---

## 📄 开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源。欢迎提交 Issue 与 Pull Request！
