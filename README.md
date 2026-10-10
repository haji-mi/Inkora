# Inkora 🖋️

> 精简、高颜值、极致流畅的 Markdown 桌面编辑器 —— 深度对标 **Typora**，采用 **Windows 原生经典操作体验** 与 **Tauri 2 (Rust) + React 19** 架构。

---

## 🌟 核心特性

- 🎯 **原地所见即所得 (WYSIWYG)**：打字即排版，光标聚焦时自然编辑，告别传统双栏分屏的割裂感；
- ⚡ **毫秒级源码模式无缝互切 (`Ctrl+/`)**：随时在所见即所得与底层 Markdown 纯文本源码之间 100% 无损互转；
- 🪟 **Windows 原生经典操作体系**：
  - **经典菜单栏与标题栏一体化**：左侧提供完整「文件(F) / 段落(P) / 视图(V) / 主题(T)」下拉菜单，完美符合 Windows 桌面操作习惯；
  - **Windows 原生窗体控制**：右上角标准最小化、最大化/向下还原、经典红色高亮关闭按钮；
  - **Windows 优先字体体系**：采用 `Segoe UI`、`微软雅黑` 与 `Consolas` 等宽字体栈，排版清晰锐利；
- 🎨 **Typora 经典 4 大主题实时切换**：
  - **GitHub 浅色 (默认)**：经典的纯净白纸黑字与精炼边界；
  - **Night 暗黑夜间**：深邃护眼的黑曜石暗色主题；
  - **Newsprint 经典报刊**：温暖复古的牛皮纸与衬线体排版；
  - **Gothic 哥特优雅**：典雅文艺象牙白纸张质感；
- 📝 **Typora 标志性沉浸书写模式**：
  - **打字机模式 (`F9`)**：视口焦点智能随光标保持在垂直居中视线；
  - **专注模式 (`F8`)**：当前编辑段落高亮聚焦，非活动段落优雅淡化（30% 透明度）；
- 💡 **极致人性化交互细节**：
  - **标题栏快速撤销 / 重做按钮组**：动态感知历史堆栈，未修改时自动灰显禁用；
  - **划选文本浮动格式气泡栏 (Bubble Menu)**：划词即刻浮出粗体、斜体、下划线、删除线、行内代码、马克笔高亮与超链接工具；
  - **浮动查找与替换面板 (`Ctrl+F` / `Ctrl+H`)**：实时匹配计数、上下导航与一键全量替换；
  - **Typora 风格字数统计卡片**：点击状态栏字数浮出中英文字数、不计空格字符数、段落数与朗读/默读时间预估；
  - **Mermaid 交互图表原生渲染**：支持流程图、时序图、甘特图等，带原地源码编辑开关。
- 📊 **丰富扩展与全套 GFM 支持**：
  - **可视化表格**：支持一键增删行、列，表格对齐与可视化悬浮快捷条；
  - **KaTeX 数学公式**：毫秒级渲染行内公式 `$E=mc^2$` 与独立公式块 `$$...$$`；
  - **代码块语法高亮**：内置 37+ 种主流语言着色与一键复制；
  - **任务清单 (Task Lists)**：点击勾选框交互式同步状态；
  - **剪贴板截图粘贴与文件拖拽**：自动识别剪贴板图片并原地插入。
- 📂 **工作区管理与快速检索**：
  - **可折叠三态侧边栏 (`Ctrl+Shift+L`)**：工作区文档树与实时文档大纲 TOC（点击平滑滚动锚点）；
  - **Spotlight 快速检索 (`Ctrl+P`)**：全局模糊查找文档与章节大纲；
  - **极简状态栏**：实时词数统计、字符数、阅读时长预估、行列指示；
- 📤 **导出与分享**：支持导出为独立排版 HTML 文件与高保真 PDF 打印。

---

## ⌨️ 快捷键速查表 (Muscular Memory)

| 快捷键 | 功能描述 |
| :--- | :--- |
| **`Ctrl + Z`** | 撤销上一步操作 (Undo) |
| **`Ctrl + Y`** | 恢复/重做上一步操作 (Redo) |
| **`Ctrl + F`** | 展开浮动查找面板 (Find) |
| **`Ctrl + H`** | 展开浮动替换面板 (Replace) |
| **`Ctrl + N`** | 新建 Markdown 文档 |
| **`Ctrl + S`** | 保存当前工作区文档 |
| **`Ctrl + 1 ~ 6`** | 快速设置 1 ~ 6 级标题 (Heading 1 ~ 6) |
| **`Ctrl + /`** | 切换所见即所得 / 底层 Markdown 源码模式 |
| **`Ctrl + P`** | 打开快速检索窗口 (跳转文档或大纲) / 打印导出 |
| **`Ctrl + Shift + L`** | 展开 / 折叠侧边栏 |
| **`F8`** | 开启 / 关闭专注模式 (Focus Mode) |
| **`F9`** | 开启 / 关闭打字机模式 (Typewriter Mode) |
| **`Ctrl + T`** | 快速插入 3x3 GFM 可视化表格 |
| **`Tab` (在表格末格)** | 自动在表格底部追加新行并定位第一格 |
| **`Ctrl + Shift + M`** | 插入 LaTeX / KaTeX 数学公式块 |
| **`Ctrl + Shift + K`** | 插入代码高亮块 |
| **`Ctrl + B` / `Ctrl + I`** | 粗体 / 斜体 |
| **`Ctrl + U`** | 下划线 |

---

## 🛠️ 技术架构

- **桌面运行时**：Tauri 2.0 (Rust) —— 内存占用 <50MB，体积 <15MB，启动神速。
- **前端视图层**：React 19 + TypeScript + Vite 6
- **样式与设计体系**：Tailwind CSS + Windows Fluent / Typora Themes
- **富文本排版核心**：TipTap v2 (ProseMirror) + Marked + Turndown 双向转换器
- **公式引擎**：KaTeX 0.16
- **代码高亮**：lowlight (Highlight.js)

---

## 🚀 本地开发与构建

### 1. 网页版极速预览与开发
```powershell
npm run dev
# 浏览器访问 http://localhost:1420
```

### 2. 构建生产静态前端
```powershell
npm run build
```

### 3. Tauri 桌面原生窗口运行
```powershell
npm run tauri dev
```

### 4. 打包发布桌面安装包 (Windows 本地)
```powershell
npm run tauri build
```

---

## 🌐 跨平台一并构建指南 (macOS / Linux / Windows)

Tauri 2 依赖宿主操作系统的原生 GUI 渲染引擎（macOS 的 WebKit/Cocoa、Linux 的 WebKitGTK、Windows 的 WebView2）。

### 方案 A：通过 GitHub Actions 云端一并构建 (推荐、最简便)
本项目已预置两种 GitHub Actions 工作流，无需在本地配置繁杂的跨平台环境：

1. **日常构建并生成下载制品（CI Build）**：
   - 配置文件：[`.github/workflows/build.yml`](.github/workflows/build.yml)
   - 触发方式：推送到 `main` 分支，或在 GitHub Actions 界面点击 **Run workflow**。
   - 产出结果：自动在 `macos-latest`、`ubuntu-22.04`、`windows-latest` 并行构建，并在 Actions 页面提供 `Inkora-macOS-bundle`（.dmg / .app）、`Inkora-Linux-bundle`（.deb / .AppImage）、`Inkora-Windows-bundle`（.msi / .exe）一键下载。

2. **打 Tag 自动发布全平台版本（Release）**：
   - 配置文件：[`.github/workflows/release.yml`](.github/workflows/release.yml)
   - 触发方式：打 `v*` 标签并推送（如 `git tag v0.1.0 && git push origin v0.1.0`）。
   - 产出结果：自动创建 GitHub Release 并附带所有平台的安装包文件。

---

### 方案 B：在对应操作系统本地构建

#### 🍎 macOS 本地构建
在 macOS 设备克隆代码后直接执行：
```bash
# 1. 安装依赖
npm install

# 2. 构建 Apple Silicon + Intel 通用二进制
npm run tauri build -- --target universal-apple-darwin

# 产物位置：src-tauri/target/universal-apple-darwin/release/bundle/dmg/
```

#### 🐧 Linux (Ubuntu / Debian) 本地构建
在 Linux 环境下，需先安装系统依赖库：
```bash
# 1. 安装基础系统开发库
sudo apt-get update && sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libxdo-dev \
  libssl-dev \
  build-essential \
  curl wget file

# 2. 构建安装包 (.deb 与 .AppImage)
npm install
npm run tauri build

# 产物位置：src-tauri/target/release/bundle/deb/ 与 bundle/appimage/
```

