const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const p = (__REPO + '/tools/launcher/MainWindow.xaml.cs');
let src = fs.readFileSync(p, 'utf8');
const crlf = src.includes('\r\n');
const norm = s => crlf ? s.split('\n').join('\r\n') : s;
const pairs = [
  [`            menu.Items.Add("Open launcher", null, (s, e) => ShowFromTray());
            menu.Items.Add("Quit", null, (s, e) => Dispatcher.Invoke(QuitFromTray));`,
   `            menu.Items.Add(Strings.S("Open launcher"), null, (s, e) => ShowFromTray());
            menu.Items.Add(Strings.S("Quit"), null, (s, e) => Dispatcher.Invoke(QuitFromTray));`],
  [`            StatusText.Text = first.Download != null
                ? "The download didn't work, so the launcher builds the monster paths for " + first.Name
                : "Building monster paths: " + first.Name;`,
   `            StatusText.Text = first.Download != null
                ? Strings.S("The download didn't work, so the launcher builds the monster paths for {0}", first.Name)
                : Strings.S("Building monster paths: {0}", first.Name);`],
  [`            StatusDetail.Text = n.Downloading
                ? $"   {n.Group}: downloading monster paths in the background, {n.Done} of {n.Total} MB"
                : $"   {n.Group}: building monster paths in the background, {n.Done} of {n.Total} areas on {CoresText(m_settings.BackgroundCores)}";`,
   `            StatusDetail.Text = n.Downloading
                ? Strings.S("   {0}: downloading monster paths in the background, {1} of {2} MB", n.Group, n.Done, n.Total)
                : Strings.S("   {0}: building monster paths in the background, {1} of {2} areas on {3}", n.Group, n.Done, n.Total, CoresText(m_settings.BackgroundCores));`],
  [`                StatusText.Text = "Reloading the world";
                StatusDetail.Text = "   the world database didn't match the server (about a minute)";`,
   `                StatusText.Text = Strings.S("Reloading the world");
                StatusDetail.Text = Strings.S("   the world database didn't match the server (about a minute)");`],
  [`                ? "Draws the game through Vulkan, which is faster with a crowd on screen. Turn it off if the game crashes when it starts; it then runs on DirectX 9."
                : "Your PC has no Vulkan support for 32-bit games, so the game runs on DirectX 9.";`,
   `                ? Strings.S("Draws the game through Vulkan, which is faster with a crowd on screen. Turn it off if the game crashes when it starts; it then runs on DirectX 9.")
                : Strings.S("Your PC has no Vulkan support for 32-bit games, so the game runs on DirectX 9.");`],
];
let ok = 0;
for (const [a, b] of pairs) {
  const na = norm(a);
  const nb = norm(b);
  if (src.includes(na)) { src = src.split(na).join(nb); ok++; }
  else console.log('MISS:', JSON.stringify(a.slice(0, 70)));
}
fs.writeFileSync(p, src, 'utf8');
console.log('applied', ok, '/', pairs.length, '(crlf:', crlf, ')');
