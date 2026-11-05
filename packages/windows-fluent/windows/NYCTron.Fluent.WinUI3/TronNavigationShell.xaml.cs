using System;
using System.Collections.Generic;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;

namespace NYCTron.Fluent.WinUI3;

/// <summary>
/// Host-owned genuine WinUI 3 navigation rail. It can wrap any XAML UIElement.
/// React Native Windows Fabric 0.85 renders through Composition, NOT a XAML
/// UIElement. Attaching its root requires a separately verified host bridge.
/// </summary>
public sealed partial class TronNavigationShell : UserControl
{
    private readonly Dictionary<string, NavigationViewItem> _destinations = new(StringComparer.Ordinal);
    private bool _settingFromHost;
    private bool _restorePending;
    private string? _committedId;

    public TronNavigationShell()
    {
        InitializeComponent();
        Navigation.SelectionChanged += OnSelectionChanged;
    }

    public event EventHandler<TronDestinationInvokedEventArgs>? DestinationInvoked;
    public event EventHandler<TronPaneOpenChangedEventArgs>? PaneOpenChanged;
    public event EventHandler? SettingsInvoked;

    public string? SelectedId =>
        (Navigation.SelectedItem as NavigationViewItem)?.Tag as string;

    public void SetDestinations(
        IEnumerable<TronDestination> items,
        IEnumerable<TronDestination>? footerItems = null)
    {
        ArgumentNullException.ThrowIfNull(items);
        _settingFromHost = true;
        try
        {
            Navigation.MenuItems.Clear();
            Navigation.FooterMenuItems.Clear();
            _destinations.Clear();
            foreach (var item in items)
                Navigation.MenuItems.Add(CreateItem(item));
            if (footerItems is not null)
            {
                foreach (var item in footerItems)
                    Navigation.FooterMenuItems.Add(CreateItem(item));
            }
            if (_committedId is not null && !_destinations.ContainsKey(_committedId))
                _committedId = null;
            SetSelectedIdCore(_committedId);
        }
        finally
        {
            _settingFromHost = false;
        }
    }

    private NavigationViewItem CreateItem(TronDestination destination)
    {
        if (string.IsNullOrWhiteSpace(destination.Id) ||
            string.IsNullOrWhiteSpace(destination.Label) ||
            _destinations.ContainsKey(destination.Id))
        {
            throw new ArgumentException("Duplicate or empty destination");
        }

        var item = new NavigationViewItem
        {
            Content = destination.Label,
            Tag = destination.Id,
            IsEnabled = !destination.Disabled
        };
        AutomationProperties.SetName(item, destination.Label);
        if (!string.IsNullOrEmpty(destination.Glyph))
        {
            item.Icon = new FontIcon
            {
                Glyph = destination.Glyph,
                FontFamily = new FontFamily("Segoe Fluent Icons")
            };
        }
        _destinations.Add(destination.Id, item);
        return item;
    }

    private void SetSelectedIdCore(string? id)
    {
        if (id is null)
        {
            Navigation.SelectedItem = null;
            return;
        }
        Navigation.SelectedItem = _destinations.TryGetValue(id, out var item)
            ? item : null;
    }

    public void SetSelectedId(string? id)
    {
        if (id is not null && !_destinations.ContainsKey(id))
            throw new ArgumentOutOfRangeException(nameof(id), "Unknown destination");
        _committedId = id;
        _settingFromHost = true;
        try { SetSelectedIdCore(id); }
        finally { _settingFromHost = false; }
    }

    // The host commits routes. NavigationView moves its selection as soon as
    // an item is invoked, so a user selection is put back to the committed
    // route; the indicator moves when the host calls SetSelectedId. Items keep
    // the default SelectsOnInvoked because NavigationView undoes any programmatic
    // SelectedItem that points at an item which does not select on invoke. The restore
    // is queued so it does not re-enter NavigationView's selection change.
    private void OnSelectionChanged(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
    {
        if (_settingFromHost || _restorePending) return;
        // Compare items, not ids: the Settings item has no id, so an id
        // comparison would accept Settings when no route is committed.
        NavigationViewItem? committed = null;
        if (_committedId is not null) _destinations.TryGetValue(_committedId, out committed);
        if (ReferenceEquals(Navigation.SelectedItem, committed)) return;
        _restorePending = true;
        DispatcherQueue.TryEnqueue(() =>
        {
            _restorePending = false;
            _settingFromHost = true;
            try { SetSelectedIdCore(_committedId); }
            finally { _settingFromHost = false; }
        });
    }

    public void SetPaneMode(TronPaneMode mode)
    {
        Navigation.PaneDisplayMode = mode switch
        {
            TronPaneMode.Auto => NavigationViewPaneDisplayMode.Auto,
            TronPaneMode.Expanded => NavigationViewPaneDisplayMode.Left,
            TronPaneMode.Compact => NavigationViewPaneDisplayMode.LeftCompact,
            TronPaneMode.Minimal => NavigationViewPaneDisplayMode.LeftMinimal,
            _ => throw new ArgumentOutOfRangeException(nameof(mode))
        };
    }

    public void SetPaneOpen(bool isOpen)
    {
        _settingFromHost = true;
        try { Navigation.IsPaneOpen = isOpen; }
        finally { _settingFromHost = false; }
    }

    public void SetPaneTitle(string title)
    {
        Navigation.PaneTitle = title ?? "";
        // Narrator names the navigation landmark after the pane title.
        AutomationProperties.SetName(Navigation, Navigation.PaneTitle);
    }

    public void SetSettingsVisible(bool visible) => Navigation.IsSettingsVisible = visible;

    /// <summary>
    /// Host-only XAML content slot. RNW Fabric's Composition root does not
    /// automatically implement UIElement; do not insert it here as a fake
    /// native bridge or place this control inside a Fabric ComponentView.
    /// </summary>
    public void SetHostedContent(UIElement? content)
    {
        HostedContentSlot.Children.Clear();
        if (content is not null) HostedContentSlot.Children.Add(content);
    }

    private void OnItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
    {
        if (_settingFromHost) return;
        if (args.IsSettingsInvoked)
        {
            SettingsInvoked?.Invoke(this, EventArgs.Empty);
            return;
        }
        if (args.InvokedItemContainer is NavigationViewItem { Tag: string id } item &&
            item.IsEnabled)
        {
            DestinationInvoked?.Invoke(this, new TronDestinationInvokedEventArgs(id));
        }
    }

    private void OnPaneOpened(NavigationView sender, object args)
    {
        if (!_settingFromHost) PaneOpenChanged?.Invoke(this, new TronPaneOpenChangedEventArgs(true));
    }
    private void OnPaneClosed(NavigationView sender, object args)
    {
        if (!_settingFromHost) PaneOpenChanged?.Invoke(this, new TronPaneOpenChangedEventArgs(false));
    }
}
