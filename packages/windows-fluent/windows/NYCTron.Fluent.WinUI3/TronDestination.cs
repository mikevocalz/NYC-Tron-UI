namespace NYCTron.Fluent.WinUI3;

/// <summary>
/// Stable route destination metadata. The consumer app owns routing; this
/// native shell only raises an invocation callback.
/// </summary>
public sealed record TronDestination(
    string Id, string Label, string? Glyph = null, bool Disabled = false);

public enum TronPaneMode { Auto, Expanded, Compact, Minimal }

public sealed class TronDestinationInvokedEventArgs : EventArgs
{
    public TronDestinationInvokedEventArgs(string id) => Id = id;
    public string Id { get; }
}

public sealed class TronPaneOpenChangedEventArgs : EventArgs
{
    public TronPaneOpenChangedEventArgs(bool isOpen) => IsOpen = isOpen;
    public bool IsOpen { get; }
}
