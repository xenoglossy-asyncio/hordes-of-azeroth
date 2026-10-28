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
    else console.log('MISS in', file, ':', JSON.stringify(a.slice(0, 60)));
  }
  fs.writeFileSync(p, src, 'utf8');
  console.log(file, 'applied', ok, '/', pairs.length);
}

patch('BuildSpeedWindow.xaml.cs', [
  ['            DescribeChoices(InstallAll, InstallHalf, "Done sooner, but the PC may feel slow until then.");\n            DescribeChoices(BackgroundAll, BackgroundHalf, "Finishes sooner while the launcher is open.");',
   '            DescribeChoices(InstallAll, InstallHalf, Strings.S("Done sooner, but the PC may feel slow until then."));\n            DescribeChoices(BackgroundAll, BackgroundHalf, Strings.S("Finishes sooner while the launcher is open."));\n            ApplyStrings();'],
  ['            all.Content = Choice($"All {Environment.ProcessorCount} cores", "Fastest. " + allDetail);\n            half.Content = Choice($"Half: {LauncherSettings.HalfOfCores} cores", "Slower, and the PC stays easy to use.");',
   '            all.Content = Choice(Strings.S("All {0} cores", Environment.ProcessorCount), Strings.S("Fastest. ") + allDetail);\n            half.Content = Choice(Strings.S("Half ({0} cores)", LauncherSettings.HalfOfCores), Strings.S("Slower, and the PC stays easy to use."));'],
  ['        static CoreShare Chosen(RadioButton all) => all.IsChecked == true ? CoreShare.All : CoreShare.Half;',
   '        void ApplyStrings()\n        {\n            Title = Strings.S("Monster paths");\n            KickerText.Text = Strings.S("BEFORE THE BUILD STARTS");\n            QuestionText.Text = Strings.S("How hard should your PC work?");\n            IntroText.Text = Strings.S("The launcher now works out where monsters can walk in every zone. It builds these maps from your own game files, one area at a time, and it only has to do this once.");\n            HeavyText.Text = Strings.S("This is heavy work. Your processor can sit at 100% and your fans may spin up until it finishes. That\'s expected and nothing is wrong. With half the cores it takes longer, but your PC stays easy to use in the meantime.");\n            FirstZonesText.Text = Strings.S("First zones, before you can play");\n            LaterZonesText.Text = Strings.S("Harder zones, in the background afterwards");\n            NoteText.Text = Strings.S("You can change these settings any time from the \u2022\u2022\u2022 menu next to Play, even while it\'s building. The new setting applies from the next chunk of the build onwards.");\n            ContinueButton.Content = Strings.S("Continue");\n        }\n\n        static CoreShare Chosen(RadioButton all) => all.IsChecked == true ? CoreShare.All : CoreShare.Half;'],
]);

patch('BuildSpeedWindow.xaml', [
  ['Title="Monster paths"', 'Title="Monster paths"'],
  ['<TextBlock Text="BEFORE THE BUILD STARTS"', '<TextBlock x:Name="KickerText" Text="BEFORE THE BUILD STARTS"'],
  ['<TextBlock Text="How hard should your PC work?"', '<TextBlock x:Name="QuestionText" Text="How hard should your PC work?"'],
  ['Text="The launcher now works out where monsters can walk in every zone. It builds these maps from your own game files, one area at a time, and it only has to do this once."', 'x:Name="IntroText" Text="The launcher now works out where monsters can walk in every zone. It builds these maps from your own game files, one area at a time, and it only has to do this once."'],
  ['Text="This is heavy work. Your processor can sit at 100% and your fans may spin up until it finishes. That\'s expected and nothing is wrong. With half the cores it takes longer, but your PC stays easy to use in the meantime."', 'x:Name="HeavyText" Text="This is heavy work. Your processor can sit at 100% and your fans may spin up until it finishes. That\'s expected and nothing is wrong. With half the cores it takes longer, but your PC stays easy to use in the meantime."'],
  ['<TextBlock Text="First zones, before you can play"', '<TextBlock x:Name="FirstZonesText" Text="First zones, before you can play"'],
  ['<TextBlock Text="Harder zones, in the background afterwards"', '<TextBlock x:Name="LaterZonesText" Text="Harder zones, in the background afterwards"'],
  ['Text="You can change these settings any time from the ••• menu next to Play, even while it\'s building. The new setting applies from the next chunk of the build onwards."', 'x:Name="NoteText" Text="You can change these settings any time from the ••• menu next to Play, even while it\'s building. The new setting applies from the next chunk of the build onwards."'],
  ['Content="Continue"', 'x:Name="ContinueButton" Content="Continue"'],
]);
