const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const p = (__REPO + '/tools/launcher/MainWindow.xaml.cs');
let src = fs.readFileSync(p, 'utf8');
const crlf = src.includes('\r\n');
const norm = s => crlf ? s.split('\n').join('\r\n') : s;
const pairs = [
  [`        async void OnLoaded(object sender, RoutedEventArgs e)
        {
            Installer.RemoveOldLauncher();
            ClientFonts.Load(m_folder);
            TitleText.FontFamily = ClientFonts.Title;
            Tagline.FontFamily = ClientFonts.Body;`,
   `        async void OnLoaded(object sender, RoutedEventArgs e)
        {
            Installer.RemoveOldLauncher();
            Strings.Language = m_settings.Language;
            ClientFonts.Load(m_folder);
            ApplyFonts();
            ApplyStrings();`],
  [`        void LoadArt()`,
   `        void ApplyFonts()
        {
            if (Strings.IsZh)
            {
                TitleText.FontFamily = new FontFamily("Microsoft YaHei");
                Tagline.FontFamily = new FontFamily("Microsoft YaHei");
            }
            else
            {
                TitleText.FontFamily = ClientFonts.Title;
                Tagline.FontFamily = ClientFonts.Body;
            }
        }

        void ApplyStrings()
        {
            Tagline.Text = Strings.S("Survive the horde. As long as you can.");
            CoffeeButton.ToolTip = Strings.S("Support Hordes of Azeroth on Buy Me a Coffee");
            CoffeeText.Text = Strings.S("Buy me a coffee");
            OlderNotes.Content = Strings.S("‹  Older");
            OlderNotes.ToolTip = Strings.S("Earlier patch notes");
            NewerNotes.Content = Strings.S("Newer  ›");
            NewerNotes.ToolTip = Strings.S("Later patch notes");
            UpdateLinkText.Text = Strings.S("Check for updates");
            FolderLinkText.Text = Strings.S("Open game folder");
            BugLinkText.Text = Strings.S("Report a bug");
            BugLink.ToolTip = Strings.S("Saves a zip of your logs on the desktop and opens the bug report form. Attach the zip to your report.");
            DiscordButton.ToolTip = Strings.S("Join the Hordes of Azeroth Discord");
            GameWindowItem.Header = Strings.S("GAME WINDOW");
            BorderlessItem.Header = Strings.S("Borderless window");
            WindowedItem.Header = Strings.S("Window");
            FullscreenItem.Header = Strings.S("Fullscreen");
            VulkanItem.Header = Strings.S("Vulkan graphics");
            BuildItem.Header = Strings.S("Build monster paths while I play");
            BuildSpeedItem.Header = Strings.S("Monster path build speed…");
            TrayItem.Header = Strings.S("Keep running in the tray");
            RepairItem.Header = Strings.S("Repair the game…");
            OpenLogsItem.Header = Strings.S("Open logs folder");
            SaveLogsItem.Header = Strings.S("Save logs to the desktop");
            RepairItem.ToolTip = Strings.S("Checks every game file, puts back the ones that are missing or damaged and reloads the world. Your characters and unlocks stay.");
            RefreshState();
        }

        void LanguageItem_Click(object sender, RoutedEventArgs e)
        {
            m_settings.Language = Strings.IsZh ? "enUS" : "zhCN";
            m_settings.Save();
            Strings.Language = m_settings.Language;
            try
            {
                GameConfig.SetLanguage(m_folder, m_settings.Language);
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }
            ApplyFonts();
            ApplyStrings();
        }

        void LoadArt()`],
  [`            WidescreenItem.ToolTip = Strings`,
   `            LanguageItem.Header = Strings.IsZh ? Strings.S("Language: English") : Strings.S("Language: 中文");
            WidescreenItem.ToolTip = Strings`],
];
let ok = 0;
for (const [a, b] of pairs) {
  const na = norm(a), nb = norm(b);
  if (src.includes(na)) { src = src.split(na).join(nb); ok++; }
  else console.log('MISS:', JSON.stringify(a.slice(0, 70)));
}
fs.writeFileSync(p, src, 'utf8');
console.log('applied', ok, '/', pairs.length);
