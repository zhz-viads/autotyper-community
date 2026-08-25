# AutoTyper Community

一个用于 Windows 的固定间隔文本输入工具。

AutoTyper Community 可以把预先准备好的文字输入到另一个 Windows 程序中。把内容粘贴进程序，设置字符间隔和倒计时，然后切换到目标文本框即可。

倒计时结束后，程序会锁定当前窗口并开始输入。焦点离开目标窗口时会暂停，回到目标窗口后继续。运行过程中可以随时按 `Esc` 停止。

支持中文、英文、emoji、换行、Tab 和混合语言文本。这个版本没有联网功能，输入内容只在本机处理。

## 下载

最新版本可以从 [Releases 页面](https://github.com/zhz-viads/autotyper-community/releases/latest) 下载。

提供两个 Windows x64 版本：

- **完整版**：通过安装程序安装到当前 Windows 用户，并创建桌面和开始菜单快捷方式。
- **便携版**：完整解压 ZIP 后直接运行，不会创建快捷方式，也不需要安装。

两个版本的输入功能相同。普通用户不需要安装 Node.js、npm、Python、Java 或浏览器插件。

## 使用方法

1. 打开 AutoTyper Community。
2. 输入或粘贴需要录入的文字。
3. 设置字符间隔和启动倒计时。
4. 点击 `Start typing`。
5. 在倒计时结束前，点击目标文本框。
6. 如需停止，按 `Esc`。

第一次使用时，建议先在 Windows 记事本中测试一小段文字。

## 功能

- 支持中文、英文、emoji、换行和 Tab
- 字符间隔可设置为 10 至 5000 毫秒
- 启动倒计时可设置为 3 至 30 秒
- 自动锁定倒计时结束时的前台窗口
- 焦点离开目标窗口时暂停，返回后继续
- 运行期间可使用全局 `Esc` 停止
- 显示当前状态、输入进度和预计时间

## 系统要求

- Windows 10 或 Windows 11
- 64 位 x64 系统
- 建议至少保留 350 MB 可用磁盘空间
- 普通使用不需要管理员权限

如果目标程序以管理员身份运行，而 AutoTyper Community 使用普通权限，Windows 可能会阻止输入。遇到这种情况时，请让两个程序使用相同的权限级别。

## 注意事项

AutoTyper Community 使用 Windows 的 `SendInput` 接口生成 Unicode 键盘输入。部分软件可能限制程序生成的输入，或者使用不同的 Unicode 处理方式。

请先使用非敏感文本测试，并且只在允许自动输入的场景中使用本程序。

本项目没有代码签名证书。Windows SmartScreen 在首次运行时可能显示提醒，请只从本仓库的 Releases 页面下载安装包。

## 从源码运行

从源码运行时需要 Node.js 20 或更高版本以及 npm。

```powershell
npm install
npm start
```

执行测试：

```powershell
npm test
```

## License

AutoTyper Community is released under the [MIT License](LICENSE).
