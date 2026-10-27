using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace HordesOfAzeroth.Launcher
{
    public partial class BuildSpeedWindow : Window
    {
        readonly LauncherSettings m_settings;

        BuildSpeedWindow(LauncherSettings settings)
        {
            InitializeComponent();
            m_settings = settings;
            SourceInitialized += (s, e) => WindowNative.UseDarkTitleBar(this, Color.FromRgb(0x0C, 0x09, 0x09));
            DescribeChoices(InstallAll, InstallHalf, Strings.S("Done sooner, but the PC may feel slow until then."));
            DescribeChoices(BackgroundAll, BackgroundHalf, Strings.S("Finishes sooner while the launcher is open."));
            ApplyStrings();
            Select(InstallAll, InstallHalf, settings.InstallCores);
            Select(BackgroundAll, BackgroundHalf, settings.BackgroundCores);
        }

        internal static void Ask(Window owner, LauncherSettings settings)
        {
            BuildSpeedWindow window = new BuildSpeedWindow(settings);
            if (owner != null && owner.IsVisible)
                window.Owner = owner;
            else
                window.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            window.ShowDialog();
        }

        static void DescribeChoices(RadioButton all, RadioButton half, string allDetail)
        {
            all.Content = Choice(Strings.S("All {0} cores", Environment.ProcessorCount), Strings.S("Fastest. ") + allDetail);
            half.Content = Choice(Strings.S("Half ({0} cores)", LauncherSettings.HalfOfCores), Strings.S("Slower, and the PC stays easy to use."));
        }

        static StackPanel Choice(string title, string detail)
        {
            StackPanel panel = new StackPanel();
            panel.Children.Add(new TextBlock { Text = title, FontSize = 13.5, FontWeight = FontWeights.SemiBold });
            panel.Children.Add(new TextBlock { Text = detail, FontSize = 12, TextWrapping = TextWrapping.Wrap, Opacity = 0.75, Margin = new Thickness(0, 3, 0, 0) });
            return panel;
        }

        static void Select(RadioButton all, RadioButton half, CoreShare share)
        {
            all.IsChecked = share == CoreShare.All;
            half.IsChecked = share == CoreShare.Half;
        }

        void ApplyStrings()
        {
            Title = Strings.S("Monster paths");
            KickerText.Text = Strings.S("BEFORE THE BUILD STARTS");
            QuestionText.Text = Strings.S("How hard should your PC work?");
            IntroText.Text = Strings.S("The launcher now works out where monsters can walk in every zone. It builds these maps from your own game files, one area at a time, and it only has to do this once.");
            HeavyText.Text = Strings.S("This is heavy work. Your processor can sit at 100% and your fans may spin up until it finishes. That's expected and nothing is wrong. With half the cores it takes longer, but your PC stays easy to use in the meantime.");
            FirstZonesText.Text = Strings.S("First zones, before you can play");
            LaterZonesText.Text = Strings.S("Harder zones, in the background afterwards");
            NoteText.Text = Strings.S("You can change these settings any time from the ••• menu next to Play, even while it's building. The new setting applies from the next chunk of the build onwards.");
            ContinueButton.Content = Strings.S("Continue");
        }

        static CoreShare Chosen(RadioButton all) => all.IsChecked == true ? CoreShare.All : CoreShare.Half;

        void Continue_Click(object sender, RoutedEventArgs e)
        {
            m_settings.InstallCores = Chosen(InstallAll);
            m_settings.BackgroundCores = Chosen(BackgroundAll);
            m_settings.BuildSpeedChosen = true;
            m_settings.Save();
            Close();
        }
    }
}
