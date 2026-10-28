const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const L = (__REPO + '/tools/launcher');

function patch(file, pairs) {
  const p = L + '/' + file;
  let src = fs.readFileSync(p, 'utf8');
  const crlf = src.includes('\r\n');
  const norm = s => crlf ? s.split('\n').join('\r\n') : s;
  let ok = 0;
  for (const [a, b] of pairs) {
    const na = norm(a), nb = norm(b);
    if (src.includes(na)) { src = src.split(na).join(nb); ok++; }
    else console.log('MISS in', file, ':', JSON.stringify(a.slice(0, 70)));
  }
  fs.writeFileSync(p, src, 'utf8');
  console.log(file, 'applied', ok, '/', pairs.length);
}

patch('MainWindow.xaml.cs', [
  [`            try
            {
                GameConfig.SetLanguage(m_folder, m_settings.Language);
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }
            ApplyFonts();
            ApplyStrings();`,
   `            try
            {
                GameConfig.SetLanguage(m_folder, m_settings.Language);
                WriteLanguageFiles();
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }
            ApplyFonts();
            ApplyStrings();`],
  [`        async Task PlayAsync()
        {
            SetState(LauncherState.Starting, Strings.S("Starting"), "");`,
   `        async Task PlayAsync()
        {
            SetState(LauncherState.Starting, Strings.S("Starting"), "");
            try
            {
                WriteLanguageFiles();
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }`],
  [`        void LanguageItem_Click(object sender, RoutedEventArgs e)`,
   `        void WriteLanguageFiles()
        {
            Directory.CreateDirectory(Path.Combine(m_folder.Root, "Interface", "GlueXML"));
            Directory.CreateDirectory(Path.Combine(m_folder.Root, "Interface", "AddOns", "HordesOfAzeroth"));
            File.WriteAllText(Path.Combine(m_folder.Root, "Interface", "GlueXML", "BonkLanguage.lua"), $"BONK_LANGUAGE = \\"{m_settings.Language}\\"{Environment.NewLine}");
            File.WriteAllText(Path.Combine(m_folder.Root, "Interface", "AddOns", "HordesOfAzeroth", "BonkLanguage.lua"), $"BONK_LANGUAGE = \\"{m_settings.Language}\\"{Environment.NewLine}");
        }

        void LanguageItem_Click(object sender, RoutedEventArgs e)`],
]);
