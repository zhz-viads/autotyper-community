# AutoTyper Community

> 把准备好的文字，按照你设定的速度，逐字输入到 Windows 中的目标窗口。

[下载最新版本](https://github.com/zhz-viads/autotyper-community/releases/latest) · [快速开始](#快速开始) · [从源码运行](#从源码运行)

![Latest release](https://img.shields.io/github/v/release/zhz-viads/autotyper-community?label=release)
![Windows 10/11](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4)
![License](https://img.shields.io/github/license/zhz-viads/autotyper-community)

AutoTyper Community 是一款免费、开源的 Windows Unicode 文本输入工具。写好一段文字，设置字符间隔与启动倒计时，再把光标放到目标输入框中，程序就会按顺序完成输入。

它支持中文、英文、emoji、换行、Tab 和混合语言文本。输入内容在本机处理，不需要登录账户，也不会上传到网络。

## 工作方式

`准备文本` → `设置速度与倒计时` → `点击开始` → `聚焦目标窗口` → `逐字输入`

倒计时结束时，程序会把当前前台窗口设为目标。焦点暂时离开目标窗口时，输入会自动暂停；回到目标窗口后继续。运行过程中随时按 `Esc`，即可停止当前任务。

## 下载

| 版本 | 适合谁 | 使用方式 |
| --- | --- | --- |
| [Portable 便携版](https://github.com/zhz-viads/autotyper-community/releases/download/v1.0.2/AutoTyper-Community-v1.0.2-Portable-Win10-Win11-x64.zip) | 希望解压即用、不安装程序的用户 | 完整解压 ZIP，运行 `AutoTyperCommunity.exe` |
| [Full 完整版](https://github.com/zhz-viads/autotyper-community/releases/download/v1.0.2/AutoTyper-Community-v1.0.2-Full-Setup-Win10-Win11-x64.exe) | 希望使用安装程序、桌面和开始菜单快捷方式的用户 | 运行安装程序，按提示完成安装 |

两个版本都已经包含运行所需的组件。普通用户**不需要安装 Node.js、npm、Python 或 Java**。

## 主要功能

- 按可调的固定毫秒间隔输入文本
- 支持中文、英文、emoji、换行、Tab 和混合语言内容
- 提供 3 至 30 秒的启动倒计时
- 自动锁定倒计时结束时的前台目标窗口
- 焦点离开目标窗口时暂停，返回后继续
- 运行期间可使用全局 `Esc` 快捷键停止
- 实时显示输入进度和当前状态
- 将 emoji 等代理对字符作为完整字符处理，避免拆分输入
- 附带环境检查工具和完整使用说明

## 快速开始

1. 打开 AutoTyper Community。
2. 输入或粘贴需要录入的文字。
3. 设置每个字符之间的固定间隔和启动倒计时。
4. 点击 **Start typing**。
5. 在倒计时结束前，点击并聚焦目标文本框。
6. 如需停止当前任务，随时按 `Esc`。

建议第一次先在 Windows 记事本中使用一段非敏感文本测试，确认目标软件能够正常接收 Unicode 输入。

## 运行环境

- Windows 10 或 Windows 11
- 64 位（x64）系统
- 普通使用不需要管理员权限
- 建议至少保留 350 MB 可用磁盘空间

如果目标程序以管理员身份运行，普通权限的 AutoTyper Community 可能无法向它输入文字。遇到这种情况时，请让目标程序和 AutoTyper Community 使用相同的权限级别。

## 从源码运行

只有从源码运行或参与开发时，才需要 Node.js 20 或更高版本以及 npm：

```powershell
npm install
npm start
```

执行测试：

```powershell
npm test
```

## 使用说明

AutoTyper Community 使用 Windows 标准 `SendInput` 接口生成 Unicode 键盘输入。不同软件对生成式输入和 Unicode 事件的处理方式可能不同，请先测试再用于正式内容。

请只在允许自动输入的场景中使用本程序，并遵守目标软件、网站或平台的使用规则。

## English summary

AutoTyper Community is a free and open-source Unicode text input tool for Windows. Prepare your text, choose a fixed interval and countdown, focus the destination field, and let the app enter the text in order. It supports Chinese, English, emoji, newlines, tabs, and mixed-language content; pauses when focus leaves the selected target; resumes when focus returns; and can be stopped globally with `Esc`.

Ready-to-run Portable and Full packages are available on the [latest release page](https://github.com/zhz-viads/autotyper-community/releases/latest). Packaged users do not need Node.js or npm. Node.js 20 or newer is required only when running from source.

## License

AutoTyper Community is released under the [MIT License](LICENSE).
