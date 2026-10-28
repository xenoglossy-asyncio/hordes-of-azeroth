using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

namespace HordesOfAzeroth.Launcher
{
    public partial class MainWindow : Window
    {
        const string NewIssueUrl = "https://github.com/jonhaldors/hordes-of-azeroth/issues/new";
        const string DiscordUrl = "https://discord.gg/zpYfsqh6Dn";
        const string CoffeeUrl = "https://buymeacoffee.com/jonhaldors";
        static readonly TimeSpan UpdateInterval = TimeSpan.FromMinutes(15);
        static readonly TimeSpan MenuReopenGuard = TimeSpan.FromMilliseconds(300);
        const string FullRepairText = "The launcher checks every game file, puts back the ones that are missing or damaged and reloads the world. Your characters and unlocks are backed up first and stay as they are.";
        const string VulkanTurnedOffText = "The game crashed in its Vulkan graphics, which your graphics card or driver doesn't fully support. The launcher has switched Vulkan off for you, so the game now runs on DirectX 9.\n\nYou don't need to do anything else. Press Play again.\n\nYou can turn Vulkan back on under \"Vulkan graphics\" in the ••• menu next to Play, for example after updating your graphics driver.";
        const string QuickRepairText ="Some game files were missing or damaged, so the launcher puts them back. Your characters and unlocks stay as they are.";

        enum LauncherState { Missing, NotInstalled, Installing, Ready, UpdateAvailable, Starting, Playing, Stopping }

        readonly GameFolder m_folder = GameFolder.Find();
        readonly LocalServer m_server;
        readonly GameClient m_game;
        readonly UpdateCheck m_updates;
        readonly LauncherSettings m_settings;
        readonly Installer m_installer;
        readonly NavBuilder m_nav;
        CancellationTokenSource m_background;
        NavProgress m_backgroundProgress;
        readonly DispatcherTimer m_updateTimer = new DispatcherTimer();
        readonly System.Drawing.Icon m_icon;
        System.Windows.Forms.NotifyIcon m_tray;
        LauncherState m_state;
        Manifest m_latest;
        List<ReleaseNote> m_notes = new List<ReleaseNote>();
        int m_notePage;
        bool m_quitting;
        CancellationTokenSource m_installCancel;
        bool m_updating;
        bool m_repairing;

        public MainWindow()
        {
            InitializeComponent();
            m_server = new LocalServer(m_folder);
            m_game = new GameClient(m_folder);
            m_updates = new UpdateCheck(m_folder);
            m_settings = LauncherSettings.Load(m_folder);
            m_installer = new Installer(m_folder, m_server);
            m_nav = new NavBuilder(m_folder);
            m_icon = WindowNative.LoadOwnIcon(64);
            Icon = WindowNative.ToImageSource(m_icon);
            SourceInitialized += (s, e) => WindowNative.UseDarkTitleBar(this, Color.FromRgb(0x0C, 0x09, 0x09));
            Loaded += OnLoaded;
            Closing += OnClosing;
        }

        async void OnLoaded(object sender, RoutedEventArgs e)
        {
            Installer.RemoveOldLauncher();
            Strings.Language = m_settings.Language;
            ClientFonts.Load(m_folder);
            ApplyFonts();
            ApplyStrings();
            LoadArt();
            CreateTray();

            m_latest = m_updates.LoadCached();
            ShowNotes(m_latest?.Notes);
            RefreshState();

            m_updateTimer.Interval = UpdateInterval;
            m_updateTimer.Tick += async (s, a) => await CheckForUpdatesAsync(false);
            m_updateTimer.Start();
            await CheckForUpdatesAsync(false);

            if (m_game.IsRunning)
                await WatchRunningGameAsync();
            else
                StartBackgroundBuild();
        }

        void ApplyFonts()
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

        void WriteLanguageFiles()
        {
            Directory.CreateDirectory(Path.Combine(m_folder.Root, "Interface", "GlueXML"));
            Directory.CreateDirectory(Path.Combine(m_folder.Root, "Interface", "AddOns", "HordesOfAzeroth"));
            File.WriteAllText(Path.Combine(m_folder.Root, "Interface", "GlueXML", "BonkLanguage.lua"), $"BONK_LANGUAGE = \"{m_settings.Language}\"{Environment.NewLine}");
            File.WriteAllText(Path.Combine(m_folder.Root, "Interface", "AddOns", "HordesOfAzeroth", "BonkLanguage.lua"), $"BONK_LANGUAGE = \"{m_settings.Language}\"{Environment.NewLine}");
        }

        void LanguageItem_Click(object sender, RoutedEventArgs e)
        {
            m_settings.Language = Strings.IsZh ? "enUS" : "zhCN";
            m_settings.Save();
            Strings.Language = m_settings.Language;
            try
            {
                GameConfig.SetLanguage(m_folder, m_settings.Language);
                WriteLanguageFiles();
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }
            ApplyFonts();
            ApplyStrings();
        }

        void LoadArt()
        {
            foreach (string candidate in new[] { Path.Combine(m_folder.LauncherData, "launcher-art.jpg"), Path.Combine(m_folder.LauncherData, "launcher-art.png") })
            {
                if (!File.Exists(candidate))
                    continue;
                BitmapImage image = new BitmapImage();
                image.BeginInit();
                image.CacheOption = BitmapCacheOption.OnLoad;
                image.UriSource = new Uri(candidate);
                image.EndInit();
                Art.Source = image;
                return;
            }
            Art.Source = new BitmapImage(new Uri("pack://application:,,,/art/background.jpg"));
        }

        void CreateTray()
        {
            m_tray = new System.Windows.Forms.NotifyIcon { Icon = m_icon, Text = "Hordes of Azeroth", Visible = true };
            m_tray.MouseClick += (s, e) =>
            {
                if (e.Button == System.Windows.Forms.MouseButtons.Left)
                    ShowFromTray();
            };
            System.Windows.Forms.ContextMenuStrip menu = new System.Windows.Forms.ContextMenuStrip();
            menu.Items.Add(Strings.S("Open launcher"), null, (s, e) => ShowFromTray());
            menu.Items.Add(Strings.S("Quit"), null, (s, e) => Dispatcher.Invoke(QuitFromTray));
            m_tray.ContextMenuStrip = menu;
        }

        public void ShowFromTray()
        {
            Dispatcher.Invoke(() =>
            {
                Show();
                if (WindowState == WindowState.Minimized)
                    WindowState = WindowState.Normal;
                Activate();
            });
        }

        void QuitFromTray()
        {
            if (m_state == LauncherState.Playing || m_state == LauncherState.Starting)
            {
                ShowFromTray();
                MessageBox.Show(this, Strings.S("Close the game first. The launcher keeps the game's server running until then."), Strings.S("Hordes of Azeroth"));
                return;
            }
            m_quitting = true;
            Close();
        }

        void OnClosing(object sender, CancelEventArgs e)
        {
            if (m_quitting)
            {
                Shutdown();
                return;
            }
            if (m_state == LauncherState.Installing)
            {
                if (MessageBox.Show(this, Strings.S("Stop installing? The launcher carries on where it stopped next time."), Strings.S("Hordes of Azeroth"), MessageBoxButton.YesNo) != MessageBoxResult.Yes)
                {
                    e.Cancel = true;
                    return;
                }
                m_installCancel?.Cancel();
            }
            if (m_state == LauncherState.Starting || m_state == LauncherState.Playing || m_state == LauncherState.Stopping)
            {
                e.Cancel = true;
                Hide();
                m_tray.ShowBalloonTip(4000, Strings.S("Hordes of Azeroth"), Strings.S("The launcher keeps running in the tray while you play."), System.Windows.Forms.ToolTipIcon.None);
                return;
            }
            Shutdown();
        }

        void Shutdown()
        {
            m_updateTimer.Stop();
            m_background?.Cancel();
            if (m_tray != null)
            {
                m_tray.Visible = false;
                m_tray.Dispose();
                m_tray = null;
            }
            Application.Current.Shutdown();
        }

        void RefreshState()
        {
            GameVersion installed = m_folder.InstalledVersion;
            InstalledText.Text = installed != null ? installed.PatchName + Strings.S(" installed") : Strings.S("Not installed");

            if (m_state == LauncherState.Starting || m_state == LauncherState.Playing || m_state == LauncherState.Stopping || m_state == LauncherState.Installing)
                return;

            if (!m_folder.HasClient)
            {
                SetState(LauncherState.Missing, Strings.S("Can't find World of Warcraft"), Strings.S("Put the launcher in your World of Warcraft 1.12.1 folder, next to WoW.exe."));
                return;
            }
            if (!IsInstalled())
            {
                if (!Installer.IsStockClient(m_folder))
                    SetState(LauncherState.Missing, Strings.S("This client can't be used"), Strings.S("Hordes of Azeroth needs the English World of Warcraft 1.12.1 (build 5875) WoW.exe."));
                else if (m_installer.IsComplete)
                    SetState(LauncherState.NotInstalled, Strings.S("Some game files are missing"), Strings.S("press Repair to put them back"));
                else if (m_installer.CompletedSteps.Count > 0)
                    SetState(LauncherState.NotInstalled, Strings.S("The install isn't finished"), Strings.S("press Continue to carry on where it stopped"));
                else
                    SetState(LauncherState.NotInstalled, Strings.S("Ready to install"), Strings.S("the first install takes a few minutes"));
                return;
            }
            if (m_latest?.Version != null && (m_latest.Version.IsNewerThan(installed) || m_installer.ChangedPackages(m_latest).Count > 0))
            {
                string size = m_latest.DownloadSize > 0 ? $"{m_latest.DownloadSize / 1048576.0:0.0} MB · " : "";
                SetState(LauncherState.UpdateAvailable, m_latest.Version.PatchName + Strings.S(" is ready"), size + Strings.S("your characters and unlocks stay"));
                return;
            }
            SetState(LauncherState.Ready, Strings.S("Ready to play"), "");
            ShowBackgroundProgress();
        }

        bool IsInstalled()
        {
            if (m_folder.InstalledVersion == null || !File.Exists(m_folder.GameExe) || !File.Exists(Path.Combine(m_folder.ServerRun, "mangosd.exe")))
                return false;
            bool installedByLauncher = File.Exists(Path.Combine(m_folder.LauncherData, "install-steps.txt"));
            if (installedByLauncher && !m_installer.IsComplete)
                return false;
            NavGroup first = m_latest?.NavGroups.FirstOrDefault();
            return first == null || m_nav.IsGroupBuilt(first);
        }

        void SetState(LauncherState state, string status, string detail)
        {
            m_state = state;
            StatusText.Text = status;
            StatusText.Foreground = (Brush)FindResource(state == LauncherState.Missing ? "Problem" : "Text");
            StatusDetail.Text = string.IsNullOrEmpty(detail) ? "" : "   " + detail;
            StatusDot.Visibility = state == LauncherState.Ready || state == LauncherState.Playing ? Visibility.Visible : Visibility.Collapsed;
            bool busy = state == LauncherState.Starting || state == LauncherState.Stopping || state == LauncherState.Installing;
            Progress.IsIndeterminate = busy;
            Progress.Value = 0;
            Progress.Visibility = busy ? Visibility.Visible : Visibility.Hidden;
            switch (state)
            {
                case LauncherState.Missing:
                    PrimaryButton.Content = "Install";
                    PrimaryButton.IsEnabled = false;
                    break;
                case LauncherState.NotInstalled:
                    PrimaryButton.Content = m_installer.IsComplete ? Strings.S("Repair") : m_installer.CompletedSteps.Count > 0 ? Strings.S("Continue") : Strings.S("Install");
                    PrimaryButton.IsEnabled = true;
                    break;
                case LauncherState.Installing:
                    PrimaryButton.Content = m_repairing ? Strings.S("Repairing…") : m_updating ? Strings.S("Updating…") : Strings.S("Installing…");
                    PrimaryButton.IsEnabled = false;
                    break;
                case LauncherState.UpdateAvailable:
                    PrimaryButton.Content = Strings.S("Update");
                    PrimaryButton.IsEnabled = true;
                    break;
                case LauncherState.Starting:
                    PrimaryButton.Content = Strings.S("Starting…");
                    PrimaryButton.IsEnabled = false;
                    break;
                case LauncherState.Playing:
                    PrimaryButton.Content = Strings.S("Playing");
                    PrimaryButton.IsEnabled = false;
                    break;
                case LauncherState.Stopping:
                    PrimaryButton.Content = Strings.S("Closing…");
                    PrimaryButton.IsEnabled = false;
                    break;
                default:
                    PrimaryButton.Content = Strings.S("Play");
                    PrimaryButton.IsEnabled = true;
                    break;
            }
        }

        void ShowProblem(string status, string detail)
        {
            LauncherLog.Write(m_folder, $"{status}: {detail}");
            StatusText.Text = status;
            StatusText.Foreground = (Brush)FindResource("Problem");
            StatusDetail.Text = "   " + detail;
            StatusDot.Visibility = Visibility.Collapsed;
            Progress.IsIndeterminate = false;
            Progress.Value = 0;
            Progress.Visibility = Visibility.Hidden;
        }

        async Task CheckForUpdatesAsync(bool userAsked)
        {
            try
            {
                m_latest = await m_updates.FetchAsync();
                if (await RefreshLauncherFirstAsync(m_latest))
                    return;
                m_updates.PublishLatestVersion(m_latest);
                ShowNotes(m_latest.Notes);
                RefreshState();
                if (userAsked && m_state == LauncherState.Ready)
                    StatusDetail.Text = Strings.S("   up to date");
            }
            catch (Exception e) when (e is System.Net.WebException || e is IOException || e is InvalidOperationException || e is ArgumentException || e is KeyNotFoundException || e is InvalidCastException)
            {
                if (m_latest == null)
                    ShowNotes(null);
                if (userAsked)
                    ShowProblem(Strings.S("Couldn't check for updates"), UpdateProblem(e));
            }
        }

        async Task<bool> RefreshLauncherFirstAsync(Manifest manifest)
        {
            if (!IsInstalled() || (m_state != LauncherState.Ready && m_state != LauncherState.UpdateAvailable) || !m_installer.LauncherOutdated(manifest))
                return false;
            StatusText.Text = Strings.S("Updating the launcher");
            StatusDetail.Text = "";
            await m_installer.RefreshLauncherAsync(manifest, CancellationToken.None);
            RestartLauncher();
            return true;
        }

        static string UpdateProblem(Exception e)
        {
            if (e is System.Net.WebException web && web.Response is System.Net.HttpWebResponse response)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return "No release is published yet.";
                return $"GitHub answered with an error ({(int)response.StatusCode}). Try again in a moment.";
            }
            if (e is System.Net.WebException)
                return "Couldn't reach GitHub. Check your connection and try again.";
            return "The release information couldn't be read. Try again in a moment.";
        }

        void ShowNotes(List<ReleaseNote> notes)
        {
            if (notes == null || notes.Count == 0)
                notes = m_updates.LocalNotes();
            m_notes = notes.OrderByDescending(n => n.Version).ToList();
            m_notePage = 0;
            ShowNotePage();
        }

        void ShowNotePage()
        {
            NotesPanel.Children.Clear();
            NotesScroll.ScrollToTop();
            NotesPanel.Children.Add(new TextBlock
            {
                Text = Strings.S("PATCH NOTES"),
                FontSize = 11,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Accent"),
            });
            if (m_notes.Count == 0)
            {
                NotesPager.Visibility = Visibility.Collapsed;
                NotesPanel.Children.Add(Paragraph(Strings.S("Patch notes appear here once the launcher can reach GitHub."), (Brush)FindResource("Muted")));
                return;
            }
            ReleaseNote note = m_notes[m_notePage];
            NotesPanel.Children.Add(new TextBlock
            {
                Text = note.Version.PatchName,
                FontSize = 20,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Text"),
                Margin = new Thickness(0, 4, 0, 8),
            });
            foreach (string line in note.Text.Split('\n').Select(l => l.TrimEnd('\r')).Where(l => l.Trim().Length > 0))
                NotesPanel.Children.Add(NoteLine(line));
            ShowNotePager();
        }

        void ShowNotePager()
        {
            NotesPager.Visibility = m_notes.Count > 1 ? Visibility.Visible : Visibility.Collapsed;
            OlderNotes.IsEnabled = m_notePage < m_notes.Count - 1;
            NewerNotes.IsEnabled = m_notePage > 0;
            NotePageText.Text = Strings.S("{0} of {1}", m_notePage + 1, m_notes.Count);
        }

        void OlderNotes_Click(object sender, RoutedEventArgs e)
        {
            if (m_notePage >= m_notes.Count - 1)
                return;
            m_notePage++;
            ShowNotePage();
        }

        void NewerNotes_Click(object sender, RoutedEventArgs e)
        {
            if (m_notePage <= 0)
                return;
            m_notePage--;
            ShowNotePage();
        }

        UIElement NoteLine(string line)
        {
            Brush colour = (Brush)FindResource("Text");
            string trimmed = line.TrimStart();
            if (trimmed.StartsWith("#### "))
                return NoteSubheading(trimmed.Substring(5).Trim());
            if (trimmed.StartsWith("### "))
                return NoteHeading(trimmed.Substring(4).Trim());
            if (!trimmed.StartsWith("- "))
                return NoteText(trimmed, colour);
            Grid row = new Grid { Margin = new Thickness(0, 0, 0, 6) };
            row.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(16) });
            row.ColumnDefinitions.Add(new ColumnDefinition());
            row.Children.Add(new TextBlock { Text = "•", Foreground = colour, FontSize = 13 });
            TextBlock text = NoteText(trimmed.Substring(2), colour);
            text.Margin = new Thickness(0);
            Grid.SetColumn(text, 1);
            row.Children.Add(text);
            return row;
        }

        TextBlock NoteText(string text, Brush colour)
        {
            TextBlock block = Paragraph("", colour);
            bool afterOldValue = false;
            int at = 0;
            while (at < text.Length)
            {
                int strike = text.IndexOf("~~", at, StringComparison.Ordinal);
                int bold = text.IndexOf("**", at, StringComparison.Ordinal);
                int next = strike < 0 ? bold : bold < 0 ? strike : Math.Min(strike, bold);
                int close = next < 0 ? -1 : text.IndexOf(text.Substring(next, 2), next + 2, StringComparison.Ordinal);
                if (close < 0)
                {
                    block.Inlines.Add(new Run(text.Substring(at)));
                    break;
                }
                string between = text.Substring(at, next - at);
                if (between.Length > 0)
                    block.Inlines.Add(new Run(between));
                string inner = text.Substring(next + 2, close - next - 2);
                if (next == strike)
                {
                    block.Inlines.Add(new Run(inner) { Foreground = (Brush)FindResource("NoteOldValue") });
                    afterOldValue = true;
                }
                else
                {
                    bool isNewValue = afterOldValue && between.Trim().Length <= 2;
                    block.Inlines.Add(new Run(inner) { FontWeight = FontWeights.SemiBold, Foreground = isNewValue ? (Brush)FindResource("NoteNewValue") : colour });
                    afterOldValue = false;
                }
                at = close + 2;
            }
            return block;
        }

        TextBlock NoteHeading(string text)
        {
            return new TextBlock
            {
                Text = text.ToUpperInvariant(),
                FontSize = 14,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Accent"),
                Margin = new Thickness(0, 12, 0, 6),
            };
        }

        TextBlock NoteSubheading(string text)
        {
            return new TextBlock
            {
                Text = text.ToUpperInvariant(),
                FontSize = 11,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Text"),
                Margin = new Thickness(0, 6, 0, 4),
            };
        }

        static TextBlock Paragraph(string text, Brush colour)
        {
            return new TextBlock { Text = text, Foreground = colour, FontSize = 13, LineHeight = 19, TextWrapping = TextWrapping.Wrap, Margin = new Thickness(0, 0, 0, 8) };
        }

        async void PrimaryButton_Click(object sender, RoutedEventArgs e)
        {
            if (m_state == LauncherState.UpdateAvailable)
            {
                await UpdateAsync();
                return;
            }
            if (m_state == LauncherState.Ready)
                await PlayAsync();
            else if (m_state == LauncherState.NotInstalled && m_installer.IsComplete)
                await RepairAsync(false);
            else if (m_state == LauncherState.NotInstalled)
                await InstallAsync();
        }

        async Task InstallAsync()
        {
            m_background?.Cancel();
            m_installCancel = new CancellationTokenSource();
            SetState(LauncherState.Installing, Strings.S("Getting ready"), "");
            ShowInstallCard(0);
            IProgress<InstallProgress> progress = new Progress<InstallProgress>(p =>
            {
                if (m_state != LauncherState.Installing)
                    return;
                ShowInstallCard(Array.IndexOf(Installer.Steps, p.Step));
                ShowStepProgress(p);
            });
            try
            {
                m_latest = await m_updates.FetchAsync();
                if (await m_installer.RefreshLauncherBeforeResumingAsync(m_latest, m_installCancel.Token))
                {
                    RestartLauncher();
                    return;
                }
                await m_installer.InstallAsync(m_latest, progress, m_installCancel.Token);
                if (m_latest.NavGroups.Count > 0)
                {
                    ShowInstallCard(Installer.Steps.Length);
                    await GetInstallPathsAsync(m_latest, m_installCancel.Token);
                }
                m_updates.PublishLatestVersion(m_latest);
                m_state = LauncherState.Ready;
                ShowNotes(m_latest.Notes);
                RefreshState();
                StartBackgroundBuild();
            }
            catch (OperationCanceledException)
            {
                await m_server.StopAsync();
            }
            catch (Exception e) when (!(e is OutOfMemoryException))
            {
                await m_server.StopAsync();
                m_state = LauncherState.NotInstalled;
                RefreshState();
                ShowProblem(Strings.S("The install stopped"), e.Message);
            }
        }

        async Task UpdateAsync()
        {
            if (m_game.IsRunning)
            {
                ShowProblem(Strings.S("Close the game first"), Strings.S("the update replaces files the game has open"));
                return;
            }
            Manifest manifest = m_latest;
            m_background?.Cancel();
            m_installCancel = new CancellationTokenSource();
            m_updating = true;
            string title = Strings.S("Updating to {0}", manifest.Version.PatchName);
            SetState(LauncherState.Installing, Strings.S("Getting ready"), "");
            ShowStepsCard(Strings.S("UPDATE"), title, Strings.S("Your characters and unlocks are backed up first and stay as they are. You can close the launcher and come back; it carries on where it stopped."), Installer.UpdateSteps, 0);
            IProgress<InstallProgress> progress = new Progress<InstallProgress>(p =>
            {
                if (m_state != LauncherState.Installing)
                    return;
                ShowStepsCard(Strings.S("UPDATE"), title, Strings.S("Your characters and unlocks are backed up first and stay as they are. You can close the launcher and come back; it carries on where it stopped."), Installer.UpdateSteps, Array.IndexOf(Installer.UpdateSteps, p.Step));
                ShowStepProgress(p);
            });
            try
            {
                bool launcherChanged = await m_installer.UpdateAsync(manifest, progress, m_installCancel.Token);
                await GetInstallPathsAsync(manifest, m_installCancel.Token);
                m_updates.PublishLatestVersion(manifest);
                if (launcherChanged)
                {
                    RestartLauncher();
                    return;
                }
                m_updating = false;
                m_state = LauncherState.Ready;
                ShowNotes(manifest.Notes);
                RefreshState();
                StatusDetail.Text = Strings.S("   updated to {0}", manifest.Version.PatchName);
                StartBackgroundBuild();
            }
            catch (OperationCanceledException)
            {
                m_updating = false;
            }
            catch (Exception e) when (!(e is OutOfMemoryException))
            {
                m_updating = false;
                m_state = LauncherState.Ready;
                RefreshState();
                ShowProblem(Strings.S("The update stopped"), e.Message);
            }
        }

        async Task RepairAsync(bool thorough)
        {
            if (m_game.IsRunning)
            {
                ShowProblem(Strings.S("Close the game first"), Strings.S("the repair replaces files the game has open"));
                return;
            }
            m_background?.Cancel();
            m_installCancel = new CancellationTokenSource();
            m_repairing = true;
            string explanation = Strings.S(thorough ? FullRepairText : QuickRepairText);
            SetState(LauncherState.Installing, Strings.S("Getting ready"), "");
            ShowRepairCard(0, explanation);
            IProgress<InstallProgress> progress = new Progress<InstallProgress>(p =>
            {
                if (m_state != LauncherState.Installing)
                    return;
                ShowRepairCard(Array.IndexOf(Installer.RepairSteps, p.Step), explanation);
                ShowStepProgress(p);
            });
            try
            {
                await m_server.StopAsync();
                Manifest manifest = await LatestManifestAsync();
                await m_installer.RepairAsync(manifest, thorough, progress, m_installCancel.Token);
                await m_server.StopAsync();
                await GetInstallPathsAsync(manifest, m_installCancel.Token);
                m_updates.PublishLatestVersion(manifest);
                m_repairing = false;
                m_state = LauncherState.Ready;
                ShowNotes(manifest.Notes);
                RefreshState();
                if (m_state == LauncherState.Ready)
                    StatusDetail.Text = Strings.S("   the game is repaired");
                StartBackgroundBuild();
            }
            catch (OperationCanceledException)
            {
                m_repairing = false;
                await m_server.StopAsync();
            }
            catch (Exception e) when (!(e is OutOfMemoryException))
            {
                m_repairing = false;
                await m_server.StopAsync();
                m_state = LauncherState.Ready;
                RefreshState();
                ShowProblem(Strings.S("The repair stopped"), e.Message);
            }
        }

        async Task<Manifest> LatestManifestAsync()
        {
            try
            {
                return m_latest = await m_updates.FetchAsync();
            }
            catch (Exception e) when (m_latest != null && (e is System.Net.WebException || e is IOException))
            {
                return m_latest;
            }
        }

        void ShowRepairCard(int current, string explanation) =>
            ShowStepsCard(Strings.S("REPAIR"), Strings.S("Repairing Hordes of Azeroth"), explanation, Installer.RepairSteps, current);

        void ShowStepProgress(InstallProgress p)
        {
            StatusText.Text = Strings.S(Installer.InProgress(p.Step));
            StatusDetail.Text = string.IsNullOrEmpty(p.Detail) ? "" : "   " + p.Detail;
            Progress.IsIndeterminate = p.Fraction < 0;
            if (p.Fraction >= 0)
                Progress.Value = p.Fraction;
        }

        void RestartLauncher()
        {
            string exe = Process.GetCurrentProcess().MainModule.FileName;
            string current = Path.Combine(Path.GetDirectoryName(exe), Installer.LauncherFileName);
            if (File.Exists(current))
                exe = current;
            string arguments = UpdateCheck.LocalSource != null ? "--source \"" + UpdateCheck.LocalSource + "\"" : "";
            m_quitting = true;
            m_tray.Visible = false;
            Process.Start(new ProcessStartInfo(exe, arguments) { UseShellExecute = false, WorkingDirectory = Path.GetDirectoryName(exe) });
            Application.Current.Shutdown();
        }

        void ShowInstallCard(int current)
        {
            NotesPanel.Children.Clear();
            NotesPager.Visibility = Visibility.Collapsed;
            NotesPanel.Children.Add(new TextBlock { Text = Strings.S("FIRST INSTALL"), FontSize = 11, FontWeight = FontWeights.Bold, Foreground = (Brush)FindResource("Accent") });
            bool paths = current >= Installer.Steps.Length;
            NotesPanel.Children.Add(new TextBlock
            {
                Text = paths ? Strings.S("Teaching monsters to find their way") : Strings.S("Setting up Hordes of Azeroth"),
                FontSize = 18,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Text"),
                TextWrapping = TextWrapping.Wrap,
                Margin = new Thickness(0, 4, 0, 8),
            });
            Brush text = (Brush)FindResource("Text");
            if (paths)
            {
                NotesPanel.Children.Add(Paragraph(Strings.S("Every zone gets a map of where creatures can walk, climb and fit. Monsters use it to chase you around trees, up ramps and through doorways instead of running into walls, and the horde uses it to spawn only where it can reach you, never inside a rock or on a rooftop."), text));
                if (m_latest != null && m_latest.NavGroups.All(g => g.Download != null))
                {
                    NotesPanel.Children.Add(Paragraph(Strings.S("They come ready-made, a {0} MB download for every zone.", m_latest.NavGroups.Sum(g => g.Download.Size) / 1048576), text));
                }
                else
                {
                    NotesPanel.Children.Add(Paragraph(Strings.S("It's worked out from your own game files, one 533-yard square at a time. Westfall, The Barrens and Duskwood come first; the harder zones finish in the background while you play."), text));
                    NotesPanel.Children.Add(Paragraph(Strings.S("This is heavy work and only happens once. Your processor can sit at 100% and your fans may spin up until it's done. To use fewer cores, open the ••• menu next to Play and choose Monster path build speed."), text));
                }
            }
            else
            {
                NotesPanel.Children.Add(Paragraph(Strings.S("The launcher builds everything from your own World of Warcraft files. You can close it and come back; it carries on where it stopped."), text));
            }
            string[] checklist = Installer.Steps.Concat(new[] { "Monster paths" }).ToArray();
            for (int i = 0; i < checklist.Length; i++)
            {
                bool done = i < current;
                bool now = i == current;
                NotesPanel.Children.Add(new TextBlock
                {
                    Text = (done ? "✓  " : now ? "▸  " : "·  ") + Strings.S(checklist[i]),
                    FontSize = 12.5,
                    FontWeight = now ? FontWeights.SemiBold : FontWeights.Normal,
                    Foreground = (Brush)FindResource(now ? "Text" : "Muted"),
                    Opacity = done || now ? 1 : 0.6,
                    Margin = new Thickness(0, i == 0 ? 6 : 2, 0, 2),
                });
            }
        }

        void ShowStepsCard(string kicker, string title, string explanation, string[] steps, int current)
        {
            NotesPanel.Children.Clear();
            NotesPager.Visibility = Visibility.Collapsed;
            NotesPanel.Children.Add(new TextBlock { Text = kicker, FontSize = 11, FontWeight = FontWeights.Bold, Foreground = (Brush)FindResource("Accent") });
            NotesPanel.Children.Add(new TextBlock
            {
                Text = title,
                FontSize = 18,
                FontWeight = FontWeights.Bold,
                Foreground = (Brush)FindResource("Text"),
                TextWrapping = TextWrapping.Wrap,
                Margin = new Thickness(0, 4, 0, 8),
            });
            NotesPanel.Children.Add(Paragraph(explanation, (Brush)FindResource("Text")));
            for (int i = 0; i < steps.Length; i++)
            {
                bool done = i < current;
                bool now = i == current;
                NotesPanel.Children.Add(new TextBlock
                {
                    Text = (done ? "✓  " : now ? "▸  " : "·  ") + Strings.S(steps[i]),
                    FontSize = 12.5,
                    FontWeight = now ? FontWeights.SemiBold : FontWeights.Normal,
                    Foreground = (Brush)FindResource(now ? "Text" : "Muted"),
                    Opacity = done || now ? 1 : 0.6,
                    Margin = new Thickness(0, i == 0 ? 6 : 2, 0, 2),
                });
            }
        }

        void AskBuildSpeedOnce()
        {
            if (!m_settings.BuildSpeedChosen)
                BuildSpeedWindow.Ask(this, m_settings);
        }

        async Task GetInstallPathsAsync(Manifest manifest, CancellationToken cancel)
        {
            List<NavGroup> downloads = manifest.NavGroups.Where(g => g.Download != null && !m_nav.IsGroupBuilt(g)).ToList();
            long total = downloads.Sum(g => g.Download.Size);
            long finished = 0;
            foreach (NavGroup group in downloads)
            {
                StatusText.Text = Strings.S("Downloading monster paths");
                long before = finished;
                try
                {
                    await DownloadPathsAsync(group, new Progress<long>(bytes =>
                    {
                        if (m_state == LauncherState.Installing)
                            ShowPathDownloadProgress(before + bytes, total);
                    }), cancel);
                }
                catch (Exception e) when (IsDownloadProblem(e))
                {
                }
                finished += group.Download.Size;
            }
            NavGroup first = manifest.NavGroups.FirstOrDefault();
            if (first == null || m_nav.IsGroupBuilt(first))
                return;
            AskBuildSpeedOnce();
            StatusText.Text = first.Download != null
                ? Strings.S("The download didn't work, so the launcher builds the monster paths for {0}", first.Name)
                : Strings.S("Building monster paths: {0}", first.Name);
            UseInstallBuildSpeed();
            await m_nav.BuildGroupAsync(first, new Progress<NavProgress>(n =>
            {
                if (m_state == LauncherState.Installing)
                    ShowInstallBuildProgress(n);
            }), cancel);
        }

        async Task DownloadPathsAsync(NavGroup group, IProgress<long> progress, CancellationToken cancel)
        {
            string zip = await m_installer.FetchAsync(group.Download.Url, group.Download.Sha256, progress.Report, cancel);
            await Task.Run(() => m_nav.InstallDownloaded(group, zip), cancel);
            File.Delete(zip);
        }

        static bool IsDownloadProblem(Exception e) => e is InvalidOperationException || e is InvalidDataException || e is IOException || e is UnauthorizedAccessException;

        void ShowPathDownloadProgress(long bytes, long total)
        {
            Progress.IsIndeterminate = false;
            Progress.Value = total > 0 ? (double)bytes / total : 0;
            StatusDetail.Text = Strings.S("   {0:0.0} of {1:0.0} MB", bytes / 1048576.0, total / 1048576.0);
        }

        void UseInstallBuildSpeed()
        {
            m_nav.Priority = ProcessPriorityClass.BelowNormal;
            m_nav.Workers = () => LauncherSettings.Workers(m_settings.InstallCores);
            m_nav.Paused = () => false;
        }

        void ShowInstallBuildProgress(NavProgress n)
        {
            Progress.IsIndeterminate = false;
            Progress.Value = n.Total > 0 ? (double)n.Done / n.Total : 0;
            StatusDetail.Text = Strings.S("   {0} of {1} areas on {2}. High CPU use is expected and only happens once.", n.Done, n.Total, CoresText(m_settings.InstallCores));
        }

        static string CoresText(CoreShare share)
        {
            int cores = LauncherSettings.Workers(share);
            return cores == 1 ? Strings.S("1 core") : cores + Strings.S(" cores");
        }

        void StartBackgroundBuild()
        {
            if (m_latest == null || !IsInstalled() || (m_background != null && !m_background.IsCancellationRequested))
                return;
            List<NavGroup> pending = m_latest.NavGroups.Skip(1).Where(g => !m_nav.IsGroupBuilt(g)).ToList();
            if (pending.Count == 0)
                return;
            if (IsVisible && pending.Any(g => g.Download == null))
                AskBuildSpeedOnce();
            m_background = new CancellationTokenSource();
            CancellationToken cancel = m_background.Token;
            m_nav.Priority = ProcessPriorityClass.BelowNormal;
            m_nav.Workers = () => LauncherSettings.Workers(m_settings.BackgroundCores);
            m_nav.Paused = () => !m_settings.BuildWhilePlaying && m_game.IsRunning;
            IProgress<NavProgress> progress = new Progress<NavProgress>(n =>
            {
                m_backgroundProgress = n;
                ShowBackgroundProgress();
            });
            Task.Run(async () =>
            {
                try
                {
                    foreach (NavGroup group in pending)
                        await GetBackgroundPathsAsync(group, progress, cancel);
                }
                catch (OperationCanceledException)
                {
                }
                catch (InvalidOperationException)
                {
                }
                Dispatcher.Invoke(() =>
                {
                    m_backgroundProgress = null;
                    ShowBackgroundProgress();
                });
            });
        }

        async Task GetBackgroundPathsAsync(NavGroup group, IProgress<NavProgress> progress, CancellationToken cancel)
        {
            if (group.Download != null)
            {
                int total = (int)Math.Max(1, group.Download.Size / 1048576);
                try
                {
                    await DownloadPathsAsync(group, new Progress<long>(bytes => progress.Report(new NavProgress
                    {
                        Group = group.Name,
                        Done = (int)Math.Min(total - 1, bytes / 1048576),
                        Total = total,
                        Downloading = true,
                    })), cancel);
                    return;
                }
                catch (Exception e) when (IsDownloadProblem(e))
                {
                }
            }
            await m_nav.BuildGroupAsync(group, progress, cancel);
        }

        void ShowBackgroundProgress()
        {
            if (m_state != LauncherState.Ready && m_state != LauncherState.Playing)
                return;
            NavProgress n = m_backgroundProgress;
            if (n == null || n.Done >= n.Total)
            {
                if (m_state == LauncherState.Ready)
                {
                    StatusDetail.Text = "";
                    Progress.Value = 0;
                    Progress.Visibility = Visibility.Hidden;
                }
                return;
            }
            StatusDetail.Text = n.Downloading
                ? Strings.S("   {0}: downloading monster paths in the background, {1} of {2} MB", n.Group, n.Done, n.Total)
                : Strings.S("   {0}: building monster paths in the background, {1} of {2} areas on {3}", n.Group, n.Done, n.Total, CoresText(m_settings.BackgroundCores));
            Progress.IsIndeterminate = false;
            Progress.Value = (double)n.Done / n.Total;
            Progress.Visibility = Visibility.Visible;
        }

        async Task PlayAsync()
        {
            SetState(LauncherState.Starting, Strings.S("Starting"), "");
            try
            {
                WriteLanguageFiles();
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
            }
            Progress<string> progress = new Progress<string>(step => StatusDetail.Text = "   " + step);
            try
            {
                await RepairBeforePlayAsync();
                m_game.Prepare(m_settings.Widescreen);
                await StartServerAsync(progress);
                await m_server.RemovePlayerGameMasterAsync();
                StatusDetail.Text = Strings.S("   Starting the game");
                await m_game.StartAsync(CancellationToken.None);
            }
            catch (Exception e) when (!(e is OutOfMemoryException))
            {
                await m_server.StopAsync();
                m_state = LauncherState.Ready;
                RefreshState();
                ShowProblem(Strings.S("The game couldn't start"), e.Message);
                return;
            }
            await WatchRunningGameAsync();
        }

        async Task RepairBeforePlayAsync()
        {
            if (m_latest == null)
                return;
            bool checking = true;
            bool repairing = false;
            IProgress<InstallProgress> progress = new Progress<InstallProgress>(p =>
            {
                if (!checking || m_state != LauncherState.Starting)
                    return;
                repairing |= p.Fixing;
                if (!repairing)
                {
                    StatusDetail.Text = "   " + Strings.S(Installer.InProgress(p.Step));
                    return;
                }
                ShowRepairCard(Array.IndexOf(Installer.RepairSteps, p.Step), QuickRepairText);
                ShowStepProgress(p);
            });
            bool repaired = await m_installer.RepairAsync(m_latest, false, progress, CancellationToken.None);
            checking = false;
            if (!repaired)
                return;
            ShowNotes(m_latest.Notes);
            SetState(LauncherState.Starting, Strings.S("Starting"), "");
        }

        async Task StartServerAsync(IProgress<string> progress)
        {
            try
            {
                await m_server.StartAsync(progress, CancellationToken.None);
            }
            catch (WorldDatabaseException) when (!m_folder.IsDevelopmentTree)
            {
                StatusText.Text = Strings.S("Reloading the world");
                StatusDetail.Text = Strings.S("   the world database didn't match the server (about a minute)");
                ShowRepairCard(Installer.RepairSteps.Length - 1, QuickRepairText);
                await m_installer.ReloadWorldAsync(new Progress<InstallProgress>(_ => { }), CancellationToken.None);
                ShowNotes(m_latest?.Notes);
                SetState(LauncherState.Starting, Strings.S("Starting"), "");
                await m_server.StartAsync(progress, CancellationToken.None);
            }
        }

        async Task WatchRunningGameAsync()
        {
            SetState(LauncherState.Playing, Strings.S("Playing"), Strings.S("the game's server stops when you close the game"));
            if (m_settings.KeepInTray)
                Hide();
            await m_game.WaitForAllToCloseAsync(CancellationToken.None);
            ShowFromTray();
            SetState(LauncherState.Stopping, Strings.S("Closing"), Strings.S("saving and stopping the game's server"));
            try
            {
                await m_server.StopAsync();
            }
            finally
            {
                m_state = LauncherState.Ready;
                RefreshState();
            }
            if (SmartAppControl.BlockedClientFix(m_folder, m_game.LaunchedAt))
                MessageBox.Show(this, SmartAppControl.BlockedText, "Hordes of Azeroth");
            else if (DxvkMod.TurnOffAfterCrash(m_folder))
                MessageBox.Show(this, VulkanTurnedOffText, "Hordes of Azeroth");
            else if (DamagedGameFile.CrashTextSince(m_folder, m_game.LaunchedAt) is string damaged)
                MessageBox.Show(this, damaged, "Hordes of Azeroth");
        }

        async void CheckForUpdates_Click(object sender, RoutedEventArgs e)
        {
            if (m_state == LauncherState.Ready || m_state == LauncherState.UpdateAvailable || m_state == LauncherState.Missing)
                StatusDetail.Text = Strings.S("   checking…");
            await CheckForUpdatesAsync(true);
        }

        void OpenGameFolder_Click(object sender, RoutedEventArgs e) => OpenPath(m_folder.Root);

        void OpenLogs_Click(object sender, RoutedEventArgs e)
        {
            Directory.CreateDirectory(m_folder.ServerLogs);
            OpenPath(m_folder.ServerLogs);
        }

        void ReportBug_Click(object sender, RoutedEventArgs e)
        {
            if (SaveLogs())
                OpenUrl(NewIssueUrl);
        }

        void SaveLogs_Click(object sender, RoutedEventArgs e) => SaveLogs();

        bool SaveLogs()
        {
            try
            {
                string zip = LogBundle.Save(m_folder);
                Process.Start(new ProcessStartInfo("explorer.exe", "/select,\"" + zip + "\"") { UseShellExecute = true });
                return true;
            }
            catch (Exception e) when (e is IOException || e is UnauthorizedAccessException)
            {
                ShowProblem(Strings.S("The logs couldn't be saved"), e.Message);
                return false;
            }
        }

        void Discord_Click(object sender, RoutedEventArgs e) => OpenUrl(DiscordUrl);

        void Coffee_Click(object sender, RoutedEventArgs e) => OpenUrl(CoffeeUrl);

        void MoreButton_Click(object sender, RoutedEventArgs e)
        {
            OptionsMenu.PlacementTarget = MoreButton;
            OptionsMenu.IsOpen = true;
        }

        async void OptionsMenu_Closed(object sender, RoutedEventArgs e)
        {
            await Task.Delay(MenuReopenGuard);
            MoreButton.IsHitTestVisible = true;
        }

        void OptionsMenu_Opened(object sender, RoutedEventArgs e)
        {
            MoreButton.IsHitTestVisible = false;
            ShowWindowMode();
            TrayItem.IsChecked = m_settings.KeepInTray;
            BuildItem.IsChecked = m_settings.BuildWhilePlaying;
            WidescreenItem.IsChecked = m_settings.Widescreen;
            WidescreenItem.Header = Strings.S("Widescreen and ultrawide view");
            LanguageItem.Header = Strings.IsZh ? Strings.S("Language: English") : Strings.S("Language: 中文");
            WidescreenItem.ToolTip = Strings.S("Widens the view to fit your screen's shape, from 16:9 to 21:9 and 32:9 ultrawide, so the world doesn't look zoomed in. Turn it off for the original 1.12 view.");
            ShowVulkanItem();
            RepairItem.Visibility = m_folder.IsDevelopmentTree ? Visibility.Collapsed : Visibility.Visible;
            RepairItem.IsEnabled = m_state == LauncherState.Ready || m_state == LauncherState.UpdateAvailable || (m_state == LauncherState.NotInstalled && m_installer.IsComplete);
        }

        async void RepairItem_Click(object sender, RoutedEventArgs e)
        {
            string question = Strings.S("Repair checks every game file, downloads the ones that are missing or damaged and reloads the world. It takes a minute or two. Your characters and unlocks are backed up first and stay as they are.\n\nRepair the game now?");
            if (MessageBox.Show(this, question, "Hordes of Azeroth", MessageBoxButton.YesNo) == MessageBoxResult.Yes)
                await RepairAsync(true);
        }

        void ShowWindowMode()
        {
            bool windowed = GameConfig.IsWindowed(m_folder);
            bool borderless = GameConfig.IsBorderless(m_folder);
            string resolution = GameConfig.Resolution(m_folder).Replace("x", "×");
            BorderlessItem.IsChecked = windowed && borderless;
            BorderlessItem.InputGestureText = resolution;
            BorderlessItem.ToolTip = Strings.S("The game fills your screen without a title bar, like fullscreen, and Alt+Tab switches instantly.");
            WindowedItem.IsChecked = windowed && !borderless;
            WindowedItem.InputGestureText = resolution;
            FullscreenItem.IsChecked = !windowed;
        }

        void ChooseWindowMode(bool windowed, bool borderless)
        {
            GameConfig.SetWindowed(m_folder, windowed, borderless);
            ShowWindowMode();
        }

        void BorderlessItem_Click(object sender, RoutedEventArgs e) => ChooseWindowMode(true, true);

        void WindowedItem_Click(object sender, RoutedEventArgs e) => ChooseWindowMode(true, false);

        void FullscreenItem_Click(object sender, RoutedEventArgs e) => ChooseWindowMode(false, GameConfig.IsBorderless(m_folder));

        void WidescreenItem_Click(object sender, RoutedEventArgs e)
        {
            m_settings.Widescreen = WidescreenItem.IsChecked;
            m_settings.Save();
        }

        void ShowVulkanItem()
        {
            bool loader = DxvkMod.HasVulkanLoader;
            VulkanItem.IsChecked = loader && DxvkMod.IsEnabled(m_folder);
            VulkanItem.IsEnabled = loader && m_state != LauncherState.Playing && m_state != LauncherState.Starting && m_state != LauncherState.Stopping;
            ToolTipService.SetShowOnDisabled(VulkanItem, true);
            VulkanItem.ToolTip = loader
                ? Strings.S("Draws the game through Vulkan, which is faster with a crowd on screen. Turn it off if the game crashes when it starts; it then runs on DirectX 9.")
                : Strings.S("Your PC has no Vulkan support for 32-bit games, so the game runs on DirectX 9.");
        }

        void VulkanItem_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                DxvkMod.SetEnabled(m_folder, VulkanItem.IsChecked);
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException)
            {
                ShowProblem(Strings.S("Vulkan graphics couldn't be changed"), ex.Message);
            }
        }

        void BuildItem_Click(object sender, RoutedEventArgs e)
        {
            m_settings.BuildWhilePlaying = BuildItem.IsChecked;
            m_settings.Save();
        }

        void BuildSpeedItem_Click(object sender, RoutedEventArgs e) => BuildSpeedWindow.Ask(this, m_settings);

        void TrayItem_Click(object sender, RoutedEventArgs e)
        {
            m_settings.KeepInTray = TrayItem.IsChecked;
            m_settings.Save();
        }

        static void OpenPath(string path) => Process.Start(new ProcessStartInfo("explorer.exe", "\"" + path + "\"") { UseShellExecute = true });

        static void OpenUrl(string url) => Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }
}
