# Invoked by uia-smoke.ps1 in its existing, deployed native app session.
# The parent supplies Find-ByName, Invoke-Button, Save-Screenshot and selection checks.
param([Parameter(Mandatory = $true)]$Window, [Parameter(Mandatory = $true)][string]$OutDir)
$ErrorActionPreference = "Stop"
Add-Type @"
using System;
using System.ComponentModel;
using System.Drawing;
using System.Runtime.InteropServices;
public static class NavigationAccessibilityNative {
  [StructLayout(LayoutKind.Sequential)] private struct HC { public uint size, flags; public IntPtr scheme; }
  public sealed class Contrast { public uint Flags; public string Scheme; }
  [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
  private static extern bool SystemParametersInfoW(uint action, uint size, ref HC data, uint flags);
  [DllImport("user32.dll", SetLastError=true)]
  public static extern bool SetWindowPos(IntPtr window, IntPtr after, int x, int y, int width, int height, uint flags);
  public static Contrast ReadContrast() {
    HC value = new HC { size = (uint)Marshal.SizeOf(typeof(HC)) };
    if (!SystemParametersInfoW(0x42, value.size, ref value, 0)) throw new Win32Exception(Marshal.GetLastWin32Error());
    // SPI_GETHIGHCONTRAST returns a borrowed scheme pointer; copy without freeing it.
    // Ownership follows dotnet/dotnet 461c220ba5d192fea95ca9249b22b96d3c9e9903, PInvokeCore.SystemParametersInfo.
    return new Contrast { Flags=value.flags, Scheme=Marshal.PtrToStringUni(value.scheme) };
  }
  public static void SetContrast(Contrast original, bool enabled) {
    // Apply to this disposable runner session and notify native controls; do not persist a profile change.
    HC value = new HC { size=(uint)Marshal.SizeOf(typeof(HC)),
      flags=(original.Flags & ~0x1001u) | (enabled ? 1u : 0u),
      scheme=original.Scheme == null ? IntPtr.Zero : Marshal.StringToHGlobalUni(original.Scheme) };
    try { if (!SystemParametersInfoW(0x43, value.size, ref value, 2)) throw new Win32Exception(Marshal.GetLastWin32Error()); }
    finally { if (value.scheme != IntPtr.Zero) Marshal.FreeHGlobal(value.scheme); }
  }
  public static double ChangedPixels(string before, string after, int x, int y, int width, int height) {
    using (Bitmap a=new Bitmap(before)) using (Bitmap b=new Bitmap(after)) {
      if (a.Size != b.Size) throw new InvalidOperationException("Contrast captures have different window sizes");
      int left=Math.Max(0,x), top=Math.Max(0,y), right=Math.Min(a.Width,x+width), bottom=Math.Min(a.Height,y+height);
      if (right<=left || bottom<=top) throw new InvalidOperationException("Native navigation capture region is empty");
      long changed=0, total=0;
      for (int row=top; row<bottom; row+=2) for (int col=left; col<right; col+=2) {
        Color ca=a.GetPixel(col,row), cb=b.GetPixel(col,row); total++;
        if (Math.Abs(ca.R-cb.R)+Math.Abs(ca.G-cb.G)+Math.Abs(ca.B-cb.B)>24) changed++;
      }
      return (double)changed/total;
    }
  }
}
"@ -ReferencedAssemblies System, System.Drawing

# Fixed call sites outside loops keep this diagnostic bounded. Reporting errors
# stay secondary; labels do not read providers or identify a corrupting call.
function Write-NavigationCheckpoint([string]$label) {
  try {
    if ($label -notin @(
      "rtl-status-before",
      "rtl-status-returned",
      "rtl-toggle-poll-before",
      "rtl-toggle-poll-returned",
      "rtl-pane-bounds-before",
      "rtl-pane-bounds-returned",
      "rtl-host-bounds-before",
      "rtl-host-bounds-returned",
      "rtl-selection-before",
      "rtl-selection-returned",
      "rtl-screenshot-before",
      "rtl-screenshot-returned",
      "navigation-catch-entered",
      "navigation-finally-entered",
      "restore-contrast-before",
      "restore-contrast-returned",
      "restore-window-before",
      "restore-window-returned",
      "navigation-result-before",
      "navigation-result-returned"
    )) { return }
    Write-Host ("NYCTRON_NAVIGATION_CHECKPOINT " + $label)
  } catch {}
}

$ae = [System.Windows.Automation.AutomationElement]
$tree = [System.Windows.Automation.TreeScope]
$checks = New-Object System.Collections.Generic.List[object]
$stage = "start"
$result = "failed"
$failure = $null
$rtlWitness = @{
  schemaVersion=1; method="uia-raw-icon-physical-screen"; status="not-started"; failure=$null
  limits=@{ nodes=512; depth=24; runtimeIdIntegers=32; pollSeconds=10; pollSleepMilliseconds=100 }
  deadlineScope="retry-window; synchronous UIA calls are not cancellable by it"
  binding=$null; discovery=@{ initial=$null; final=$null }; pollAttempts=0; ltr=$null; latest=$null
}
$contrast = [NavigationAccessibilityNative]::ReadContrast()
$windowPattern = $Window.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern)
$originalState = $windowPattern.Current.WindowVisualState
$originalRect = $Window.Current.BoundingRectangle
$handle = [IntPtr]$Window.Current.NativeWindowHandle
function Runtime-Id($element) { return [string]::Join(",", $element.GetRuntimeId()) }
function Find-Id([string]$id) {
  $condition = New-Object System.Windows.Automation.PropertyCondition($ae::AutomationIdProperty, $id)
  $deadline = (Get-Date).AddSeconds(15)
  do {
    $element = $Window.FindFirst($tree::Descendants, $condition)
    if ($null -ne $element) { return $element }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native element '$id' did not appear"
}
function Wait-Focus($element) {
  $deadline = (Get-Date).AddSeconds(15)
  do {
    if ($element.Current.HasKeyboardFocus) { return }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native keyboard focus did not return to '$($element.Current.Name)'"
}
function Wait-Contrast([bool]$enabled) {
  $deadline = (Get-Date).AddSeconds(15)
  do {
    $observed = [NavigationAccessibilityNative]::ReadContrast()
    if ((($observed.Flags -band 1) -ne 0) -eq $enabled) { Start-Sleep -Milliseconds 500; return $observed }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Windows did not apply the requested contrast mode"
}
function Native-Pane {
  $condition = New-Object System.Windows.Automation.PropertyCondition($ae::NameProperty, "NYC-Tron")
  $items = $Window.FindAll($tree::Descendants, $condition)
  $largest = $null; $area = 0
  foreach ($item in $items) {
    $r = $item.Current.BoundingRectangle
    # Rect.Empty dimensions multiply to positive infinity; they are not pane bounds.
    if ($r.IsEmpty -or $item.Current.IsOffscreen -or $r.Width -le 0 -or $r.Height -le 0) { continue }
    $paneBoundsFinite = $true
    foreach ($paneCoordinate in @($r.X, $r.Y, $r.Width, $r.Height, $r.Right, $r.Bottom, ($r.Width*$r.Height))) {
      if ([double]::IsNaN($paneCoordinate) -or [double]::IsInfinity($paneCoordinate)) { $paneBoundsFinite = $false; break }
    }
    if (-not $paneBoundsFinite) { continue }
    if ($r.Width*$r.Height -gt $area) { $area = $r.Width*$r.Height; $largest = $item }
  }
  if ($null -eq $largest) { throw "The native navigation landmark is absent" }
  return $largest
}
function Write-RawRtlWitnessSummary {
  # This projection reads only the captured hashtables. It performs no UIA
  # calls, and reporting failures cannot replace the original test outcome.
  try {
    function Rtl-SummaryEnum($value, [string[]]$allowed) {
      if ($value -is [string] -and $allowed -ccontains $value) { return $value }
      return $null
    }
    function Rtl-SummaryNumber($value) {
      if (($value -is [int] -or $value -is [long] -or $value -is [double] -or $value -is [uint32]) -and
          -not [double]::IsNaN([double]$value) -and -not [double]::IsInfinity([double]$value)) { return $value }
      return $null
    }
    function Rtl-SummaryCount($value, [int]$maximum) {
      $number = Rtl-SummaryNumber $value
      if ($null -ne $number -and $number -ge 0 -and $number -le $maximum -and [Math]::Floor($number) -eq $number) { return $number }
      return $null
    }
    function Rtl-SummaryRuntimeId($value) {
      if ($value -isnot [int[]] -or $value.Count -eq 0 -or $value.Count -gt 32) { return $null }
      return ,$value
    }
    function Rtl-SummaryRect($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{}
      foreach ($key in @("x","y","left","top","width","height","right","bottom")) { $copy[$key] = Rtl-SummaryNumber $value[$key] }
      return $copy
    }
    function Rtl-SummarySnapshot($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{ phase=(Rtl-SummaryEnum $value.phase @("ltr","rtl","rtl-final")); stable=$(if ($value.stable -is [bool]) { $value.stable } else { $null }) }
      foreach ($role in @("owner","navigation","toggle","icon")) { $copy[$role] = Rtl-SummaryRect $value[$role] }
      return $copy
    }
    function Rtl-SummaryCounts($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{ complete=$(if ($value.complete -is [bool]) { $value.complete } else { $null }) }
      foreach ($key in @("nodesDiscovered","nodesRead","toggles","icons","namedAncestors")) { $copy[$key] = Rtl-SummaryCount $value[$key] 512 }
      $copy.maxDepth = Rtl-SummaryCount $value.maxDepth 24
      return $copy
    }
    $binding = $null
    if ($rtlWitness.binding -is [hashtable]) {
      $binding = @{ processId=(Rtl-SummaryCount $rtlWitness.binding.processId 2147483647); hwnd=(Rtl-SummaryNumber $rtlWitness.binding.hwnd) }
      foreach ($key in @("ownerRuntimeId","navigationRuntimeId","toggleRuntimeId","iconRuntimeId")) { $binding[$key] = Rtl-SummaryRuntimeId $rtlWitness.binding[$key] }
    }
    $failureSummary = $null
    if ($rtlWitness.failure -is [hashtable]) {
      $failureSummary = @{
        code=(Rtl-SummaryEnum $rtlWitness.failure.code @("runtime-id-unavailable-or-over-limit","runtime-id-malformed","empty-offscreen-or-nonpositive-bounds","nonfinite-bounds","owner-hwnd-or-process-mismatch","owner-identity-changed","ancestry-missing","duplicate-runtime-id","foreign-process-in-ancestry","ancestry-depth-limit","retained-role-identity-changed","retained-role-label-changed","foreign-process-in-tree","tree-identity-changed","tree-depth-limit","tree-node-limit","toggle-peer-missing","toggle-peer-ambiguous","named-navigation-ancestor-missing","named-navigation-ancestor-ambiguous","icon-peer-unavailable","icon-peer-ambiguous","bounds-outside-owned-container","provider-read-failed","ltr-icon-not-stably-left","rtl-icon-not-stably-right"))
        role=(Rtl-SummaryEnum $rtlWitness.failure.role @("tree","owner","navigation","toggle","icon","geometry"))
      }
    }
    $revision = if ($env:GITHUB_SHA -is [string] -and $env:GITHUB_SHA -cmatch '\A[a-f0-9]{40}\z') { $env:GITHUB_SHA } else { $null }
    $summary = @{
      schemaVersion=1; summaryStatus="captured-state"; sourceRevision=$revision; method="uia-raw-icon-physical-screen"
      status=(Rtl-SummaryEnum $rtlWitness.status @("not-started","binding-ltr","waiting-for-right","geometry-observed","failed"))
      failure=$failureSummary; binding=$binding; pollAttempts=(Rtl-SummaryCount $rtlWitness.pollAttempts 2147483647)
      limits=@{ nodes=512; depth=24; runtimeIdIntegers=32; outputUtf8Bytes=8192; pollSeconds=10; pollSleepMilliseconds=100 }
      deadlineScope="retry-window; synchronous UIA calls are not cancellable by it"
      byteScope="UTF-8 envelope including its trailing newline; excludes runner timestamps"
      discovery=@{ initial=(Rtl-SummaryCounts $rtlWitness.discovery.initial); final=(Rtl-SummaryCounts $rtlWitness.discovery.final) }
      ltr=(Rtl-SummarySnapshot $rtlWitness.ltr); latest=(Rtl-SummarySnapshot $rtlWitness.latest)
    }
    $json = $summary | ConvertTo-Json -Depth 8 -Compress
    $envelope = "NYCTRON_RTL_WITNESS_BEGIN" + [Environment]::NewLine + $json + [Environment]::NewLine + "NYCTRON_RTL_WITNESS_END"
    if ([Text.Encoding]::UTF8.GetByteCount($envelope + [Environment]::NewLine) -gt 8192) {
      $json = @{ schemaVersion=1; summaryStatus="output-limit"; sourceRevision=$revision; outputByteLimit=8192 } | ConvertTo-Json -Compress
      $envelope = "NYCTRON_RTL_WITNESS_BEGIN" + [Environment]::NewLine + $json + [Environment]::NewLine + "NYCTRON_RTL_WITNESS_END"
    }
    if ([Text.Encoding]::UTF8.GetByteCount($envelope + [Environment]::NewLine) -le 8192) { Write-Host $envelope }
  } catch {}
}

# Read only the retained owner's Raw UIA subtree. Counts/depth bound the walk;
# synchronous provider calls cannot be cancelled by the existing poll deadline.
# AutomationId is optional: an absent Icon peer is a failure, never inferred.
function Fail-RawRtlWitness([string]$code, [string]$role = "tree") {
  $rtlWitness.status = "failed"
  $rtlWitness.failure = @{ code=$code; role=$role }
  throw "Native RTL witness: $code ($role)"
}
function Raw-RuntimeId($element, [string]$role) {
  $values = @($element.GetRuntimeId())
  if ($values.Count -eq 0 -or $values.Count -gt 32) { Fail-RawRtlWitness "runtime-id-unavailable-or-over-limit" $role }
  foreach ($value in $values) {
    if ($value -isnot [int]) { Fail-RawRtlWitness "runtime-id-malformed" $role }
  }
  return ,([int[]]$values)
}
function Raw-IdentityKey($element, [string]$role) {
  return [string]::Join(",", (Raw-RuntimeId $element $role))
}
function Raw-Rect($element, [string]$role) {
  $current = $element.Current
  $rect = $current.BoundingRectangle
  if ($rect.IsEmpty -or $current.IsOffscreen -or $rect.Width -le 0 -or $rect.Height -le 0) {
    Fail-RawRtlWitness "empty-offscreen-or-nonpositive-bounds" $role
  }
  foreach ($coordinate in @($rect.X,$rect.Y,$rect.Width,$rect.Height,$rect.Right,$rect.Bottom)) {
    if ([double]::IsNaN($coordinate) -or [double]::IsInfinity($coordinate)) {
      Fail-RawRtlWitness "nonfinite-bounds" $role
    }
  }
  return @{ x=[double]$rect.X; y=[double]$rect.Y; left=[double]$rect.Left; top=[double]$rect.Top; width=[double]$rect.Width; height=[double]$rect.Height; right=[double]$rect.Right; bottom=[double]$rect.Bottom }
}
function Same-RawRect($a, $b) {
  return $a.x -eq $b.x -and $a.y -eq $b.y -and $a.width -eq $b.width -and $a.height -eq $b.height -and $a.right -eq $b.right -and $a.bottom -eq $b.bottom
}
function Contains-RawRect($outer, $inner) {
  return $inner.x -ge $outer.x -and $inner.y -ge $outer.y -and $inner.right -le $outer.right -and $inner.bottom -le $outer.bottom
}
function Assert-RawOwner($expected) {
  $current = $Window.Current
  $observedHandle = [IntPtr]$current.NativeWindowHandle
  [uint32]$observedProcessId = 0
  $ownerThread = [NativeWindow]::GetWindowThreadProcessId($handle, [ref]$observedProcessId)
  if ($handle -eq [IntPtr]::Zero -or $observedHandle -ne $handle -or -not [NativeWindow]::IsWindow($handle) -or
      $ownerThread -eq 0 -or $observedProcessId -eq 0 -or $current.ProcessId -ne $observedProcessId) {
    Fail-RawRtlWitness "owner-hwnd-or-process-mismatch" "owner"
  }
  $identity = Raw-RuntimeId $Window "owner"
  $key = [string]::Join(",", $identity)
  if ($null -ne $expected -and ($expected.processId -ne $observedProcessId -or $expected.hwnd -ne $handle.ToInt64() -or $expected.key -cne $key)) {
    Fail-RawRtlWitness "owner-identity-changed" "owner"
  }
  return @{ processId=[int]$observedProcessId; hwnd=$handle.ToInt64(); runtimeId=$identity; key=$key }
}
function Assert-RawAncestry($element, [string]$ancestorKey, [int]$ownerProcessId, [string]$role) {
  $seen = New-Object 'System.Collections.Generic.HashSet[string]'
  $node = $element
  for ($depth = 0; $depth -le 24; $depth++) {
    if ($null -eq $node) { Fail-RawRtlWitness "ancestry-missing" $role }
    $key = Raw-IdentityKey $node $role
    if (-not $seen.Add($key)) { Fail-RawRtlWitness "duplicate-runtime-id" $role }
    if ($node.Current.ProcessId -ne $ownerProcessId) { Fail-RawRtlWitness "foreign-process-in-ancestry" $role }
    if ($key -ceq $ancestorKey) { return }
    if ($depth -eq 24) { Fail-RawRtlWitness "ancestry-depth-limit" $role }
    $node = [System.Windows.Automation.TreeWalker]::RawViewWalker.GetParent($node)
  }
}
function Assert-RawRole($entry, [int]$ownerProcessId, [string]$role) {
  $current = $entry.element.Current
  if ((Raw-IdentityKey $entry.element $role) -cne $entry.key -or $current.ProcessId -ne $ownerProcessId) {
    Fail-RawRtlWitness "retained-role-identity-changed" $role
  }
  if (($role -ceq "navigation" -and $current.Name -cne "NYC-Tron") -or
      ($role -ceq "toggle" -and $current.AutomationId -cne "TogglePaneButton") -or
      ($role -ceq "icon" -and $current.AutomationId -cne "Icon")) {
    Fail-RawRtlWitness "retained-role-label-changed" $role
  }
}
function Bind-RawRtlWitness($expected, [string]$phase) {
  $counts = @{ nodesDiscovered=0; nodesRead=0; maxDepth=0; toggles=0; icons=0; namedAncestors=0; complete=$false }
  $rtlWitness.discovery[$phase] = $counts
  try {
    $owner = Assert-RawOwner $(if ($null -eq $expected) { $null } else { $expected.owner })
    $walker = [System.Windows.Automation.TreeWalker]::RawViewWalker
    $seen = New-Object 'System.Collections.Generic.HashSet[string]'
    $nodes = New-Object 'System.Collections.Generic.List[object]'
    [void]$seen.Add($owner.key)
    $nodes.Add(@{ element=$Window; parent=-1; depth=0; key=$owner.key; runtimeId=$owner.runtimeId; navigation=$false; toggle=$false; icon=$false })
    $counts.nodesDiscovered = 1
    for ($index = 0; $index -lt $nodes.Count; $index++) {
      $entry = $nodes[$index]; $current = $entry.element.Current
      if ($current.ProcessId -ne $owner.processId) { Fail-RawRtlWitness "foreign-process-in-tree" "tree" }
      if ((Raw-IdentityKey $entry.element "tree") -cne $entry.key) { Fail-RawRtlWitness "tree-identity-changed" "tree" }
      $entry.navigation = $current.Name -ceq "NYC-Tron"
      $automationId = $current.AutomationId
      $entry.toggle = $automationId -ceq "TogglePaneButton"
      $entry.icon = $automationId -ceq "Icon"
      $counts.nodesRead++
      $counts.maxDepth = [Math]::Max($counts.maxDepth, $entry.depth)
      $child = $walker.GetFirstChild($entry.element)
      if ($null -ne $child -and $entry.depth -ge 24) { Fail-RawRtlWitness "tree-depth-limit" "tree" }
      while ($null -ne $child) {
        if ($nodes.Count -ge 512) { Fail-RawRtlWitness "tree-node-limit" "tree" }
        $childIdentity = Raw-RuntimeId $child "tree"
        $key = [string]::Join(",", $childIdentity)
        if (-not $seen.Add($key)) { Fail-RawRtlWitness "duplicate-runtime-id" "tree" }
        $nodes.Add(@{ element=$child; parent=$index; depth=$entry.depth+1; key=$key; runtimeId=$childIdentity; navigation=$false; toggle=$false; icon=$false })
        $counts.nodesDiscovered = $nodes.Count
        $child = $walker.GetNextSibling($child)
      }
    }
    $counts.complete = $true
    $toggleIndices = @()
    for ($index = 1; $index -lt $nodes.Count; $index++) { if ($nodes[$index].toggle) { $toggleIndices += $index } }
    $counts.toggles = $toggleIndices.Count
    if ($toggleIndices.Count -eq 0) { Fail-RawRtlWitness "toggle-peer-missing" "toggle" }
    if ($toggleIndices.Count -ne 1) { Fail-RawRtlWitness "toggle-peer-ambiguous" "toggle" }
    $toggleIndex = $toggleIndices[0]
    $navigationIndices = @()
    for ($parent = $nodes[$toggleIndex].parent; $parent -gt 0; $parent = $nodes[$parent].parent) {
      if ($nodes[$parent].navigation) { $navigationIndices += $parent }
    }
    $counts.namedAncestors = $navigationIndices.Count
    if ($navigationIndices.Count -eq 0) { Fail-RawRtlWitness "named-navigation-ancestor-missing" "navigation" }
    if ($navigationIndices.Count -ne 1) { Fail-RawRtlWitness "named-navigation-ancestor-ambiguous" "navigation" }
    $iconIndices = @()
    for ($index = 1; $index -lt $nodes.Count; $index++) {
      if (-not $nodes[$index].icon) { continue }
      for ($parent = $nodes[$index].parent; $parent -gt 0; $parent = $nodes[$parent].parent) {
        if ($parent -eq $toggleIndex) { $iconIndices += $index; break }
      }
    }
    $counts.icons = $iconIndices.Count
    if ($iconIndices.Count -eq 0) { Fail-RawRtlWitness "icon-peer-unavailable" "icon" }
    if ($iconIndices.Count -ne 1) { Fail-RawRtlWitness "icon-peer-ambiguous" "icon" }
    $roles = @{ owner=$nodes[0]; navigation=$nodes[$navigationIndices[0]]; toggle=$nodes[$toggleIndex]; icon=$nodes[$iconIndices[0]] }
    foreach ($role in @("owner","navigation","toggle","icon")) {
      if ($null -ne $expected -and $roles[$role].key -cne $expected.roles[$role].key) { Fail-RawRtlWitness "retained-role-identity-changed" $role }
      if ((Raw-IdentityKey $roles[$role].element $role) -cne $roles[$role].key) { Fail-RawRtlWitness "tree-identity-changed" $role }
    }
    Assert-RawOwner $owner | Out-Null
    return @{ owner=$owner; roles=$roles }
  } catch {
    if ($null -eq $rtlWitness.failure) { $rtlWitness.status="failed"; $rtlWitness.failure=@{ code="provider-read-failed"; role="tree" } }
    throw
  }
}
function Read-RawRtlSnapshot($binding, [string]$phase) {
  $snapshot = @{ phase=$phase; stable=$false; owner=$null; navigation=$null; toggle=$null; icon=$null }
  $rtlWitness.latest = $snapshot
  try {
    Assert-RawOwner $binding.owner | Out-Null
    foreach ($role in @("owner","navigation","toggle","icon")) {
      $entry = $binding.roles[$role]
      Assert-RawRole $entry $binding.owner.processId $role
      $snapshot[$role] = Raw-Rect $entry.element $role
    }
    Assert-RawAncestry $binding.roles.icon.element $binding.roles.toggle.key $binding.owner.processId "icon"
    Assert-RawAncestry $binding.roles.toggle.element $binding.roles.navigation.key $binding.owner.processId "toggle"
    Assert-RawAncestry $binding.roles.navigation.element $binding.owner.key $binding.owner.processId "navigation"
    $stable = $true
    foreach ($role in @("owner","navigation","toggle","icon")) {
      $entry = $binding.roles[$role]
      Assert-RawRole $entry $binding.owner.processId $role
      if (-not (Same-RawRect $snapshot[$role] (Raw-Rect $entry.element $role))) { $stable = $false }
    }
    Assert-RawOwner $binding.owner | Out-Null
    if (-not (Contains-RawRect $snapshot.owner $snapshot.navigation) -or -not (Contains-RawRect $snapshot.navigation $snapshot.toggle) -or -not (Contains-RawRect $snapshot.toggle $snapshot.icon)) {
      Fail-RawRtlWitness "bounds-outside-owned-container" "geometry"
    }
    $snapshot.stable = $stable
    return $snapshot
  } catch {
    if ($null -eq $rtlWitness.failure) { $rtlWitness.status="failed"; $rtlWitness.failure=@{ code="provider-read-failed"; role="geometry" } }
    throw
  }
}
function Test-RawRtlMirrored($ltrSnapshot, $rtlSnapshot) {
  if (-not $ltrSnapshot.stable -or -not $rtlSnapshot.stable) { return $false }
  foreach ($role in @("owner","navigation","toggle")) {
    if (-not (Same-RawRect $ltrSnapshot[$role] $rtlSnapshot[$role])) { return $false }
  }
  if ($ltrSnapshot.icon.width -ne $rtlSnapshot.icon.width -or $ltrSnapshot.icon.height -ne $rtlSnapshot.icon.height -or $ltrSnapshot.icon.y -ne $rtlSnapshot.icon.y) { return $false }
  return $ltrSnapshot.icon.right -le $ltrSnapshot.toggle.x+$ltrSnapshot.toggle.width/2 -and
    $rtlSnapshot.icon.x -ge $rtlSnapshot.toggle.x+$rtlSnapshot.toggle.width/2
}
try {
  $windowPattern.SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Maximized)
  [NativeWindow]::SetForegroundWindow($handle) | Out-Null
  $homeItem = Find-ByName $Window "Home"
  $workspace = Find-ByName $Window "Workspace"
  Assert-Selection $homeItem $workspace "workspace" "accessibility-start"

  $stage = "settings-focus-return"
  $settings = Find-Id "SettingsItem"
  $settings.SetFocus()
  [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
  Find-ByName $Window "Settings opened without changing the committed route." | Out-Null
  Invoke-Button $Window "Close settings"
  Wait-Focus $settings
  Assert-Selection $homeItem $workspace "workspace" $stage
  $checks.Add(@{ name=$stage; focusedName=$settings.Current.Name; nativeRuntimeId=(Runtime-Id $settings) })

  $stage = "resize-retains-selection-and-focus"
  $windowPattern.SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Normal)
  $work = [System.Windows.Forms.Screen]::FromHandle($handle).WorkingArea
  $wide = [Math]::Min(1080, $work.Width-32)
  $narrow = [Math]::Max(640, $wide-220)
  if ($wide-$narrow -lt 100) { throw "The runner work area cannot exercise two distinct desktop sizes" }
  $height = [Math]::Min(760, $work.Height-32)
  $identity = Runtime-Id $workspace
  $rects = @()
  foreach ($width in @($wide, $narrow, $wide)) {
    $workspace.SetFocus()
    if (-not [NavigationAccessibilityNative]::SetWindowPos($handle, [IntPtr]::Zero, $work.X+16, $work.Y+16, $width, $height, 0x14)) { throw "Native window resize failed" }
    $deadline = (Get-Date).AddSeconds(10)
    do {
      Start-Sleep -Milliseconds 100
      $r = $Window.Current.BoundingRectangle
      if ([Math]::Abs($r.Width-$width) -lt 12 -and [Math]::Abs($r.Height-$height) -lt 12) { break }
    } while ((Get-Date) -lt $deadline)
    if ([Math]::Abs($r.Width-$width) -ge 12 -or [Math]::Abs($r.Height-$height) -ge 12) { throw "The actual window did not reach the requested size" }
    $workspace = Find-ByName $Window "Workspace"
    $homeItem = Find-ByName $Window "Home"
    Wait-Focus $workspace
    if ((Runtime-Id $workspace) -ne $identity) { throw "Resize replaced the native selected item" }
    Assert-Selection $homeItem $workspace "workspace" "resize-$width"
    $rects += @{ x=$r.X; y=$r.Y; width=$r.Width; height=$r.Height }
  }
  Save-Screenshot "navigation-resize" $Window
  $checks.Add(@{ name=$stage; observedBounds=$rects; nativeRuntimeId=$identity })

  $stage = "native-rtl-and-physical-left-pane"
  $rtlWitness.status = "binding-ltr"
  $rawBinding = Bind-RawRtlWitness $null "initial"
  $rtlWitness.binding = @{
    processId=$rawBinding.owner.processId; hwnd=$rawBinding.owner.hwnd
    ownerRuntimeId=$rawBinding.roles.owner.runtimeId
    navigationRuntimeId=$rawBinding.roles.navigation.runtimeId
    toggleRuntimeId=$rawBinding.roles.toggle.runtimeId
    iconRuntimeId=$rawBinding.roles.icon.runtimeId
  }
  $ltrSnapshot = Read-RawRtlSnapshot $rawBinding "ltr"
  $rtlWitness.ltr = $ltrSnapshot
  if (-not $ltrSnapshot.stable -or $ltrSnapshot.icon.right -gt $ltrSnapshot.toggle.x+$ltrSnapshot.toggle.width/2) {
    Fail-RawRtlWitness "ltr-icon-not-stably-left" "geometry"
  }
  $ltr = $ltrSnapshot.toggle
  Invoke-Button $Window "Use RTL navigation"
  Write-NavigationCheckpoint "rtl-status-before"
  Find-ByName $Window "Navigation direction: rtl" | Out-Null
  Write-NavigationCheckpoint "rtl-status-returned"
  Write-NavigationCheckpoint "rtl-toggle-poll-before"
  $deadline = (Get-Date).AddSeconds(10)
  $rtlWitness.status = "waiting-for-right"
  do {
    Start-Sleep -Milliseconds 100
    $rtlWitness.pollAttempts++
    $rtlSnapshot = Read-RawRtlSnapshot $rawBinding "rtl"
    $rtlMirrored = Test-RawRtlMirrored $ltrSnapshot $rtlSnapshot
  } while (-not $rtlMirrored -and (Get-Date) -lt $deadline)
  # Recheck uniqueness after a matching observation, without replacing any
  # retained provider reference or obscuring an already exhausted poll.
  if ($rtlMirrored) {
    Bind-RawRtlWitness $rawBinding "final" | Out-Null
    $rtlSnapshot = Read-RawRtlSnapshot $rawBinding "rtl-final"
    $rtlMirrored = Test-RawRtlMirrored $ltrSnapshot $rtlSnapshot
  }
  $rtl = $rtlSnapshot.toggle
  Write-NavigationCheckpoint "rtl-toggle-poll-returned"
  Write-NavigationCheckpoint "rtl-pane-bounds-before"
  $paneRect = $rtlSnapshot.navigation
  Write-NavigationCheckpoint "rtl-pane-bounds-returned"
  Write-NavigationCheckpoint "rtl-host-bounds-before"
  $hostRect = $rtlSnapshot.owner
  Write-NavigationCheckpoint "rtl-host-bounds-returned"
  if (-not $rtlMirrored) {
    $rtlWitness.status="failed"; $rtlWitness.failure=@{ code="rtl-icon-not-stably-right"; role="geometry" }
    throw "The actual native pane toggle did not mirror for RTL"
  }
  $rtlWitness.status = "geometry-observed"
  if ($paneRect.Right -gt $hostRect.Left+$hostRect.Width/2) { throw "RTL moved the Windows drawer away from the physical left" }
  Write-NavigationCheckpoint "rtl-selection-before"
  Assert-Selection $homeItem $workspace "workspace" $stage
  Write-NavigationCheckpoint "rtl-selection-returned"
  Write-NavigationCheckpoint "rtl-screenshot-before"
  Save-Screenshot "navigation-rtl" $Window
  Write-NavigationCheckpoint "rtl-screenshot-returned"
  $checks.Add(@{ name=$stage; ltrToggleX=$ltr.X; rtlToggleX=$rtl.X; paneLeft=$paneRect.Left; paneRight=$paneRect.Right; hostLeft=$hostRect.Left })
  Invoke-Button $Window "Use LTR navigation"
  Find-ByName $Window "Navigation direction: ltr" | Out-Null

  $stage = "native-pane-collapse-and-restore"
  Invoke-Button $Window "Close pane"
  Find-ByName $Window "Open pane" | Out-Null
  Start-Sleep -Milliseconds 500
  $closedWidth = (Native-Pane).Current.BoundingRectangle.Width
  Invoke-Button $Window "Open pane"
  Find-ByName $Window "Close pane" | Out-Null
  Start-Sleep -Milliseconds 500
  $openWidth = (Native-Pane).Current.BoundingRectangle.Width
  if ($closedWidth -ge $openWidth-100) { throw "The actual native drawer did not collapse and expand" }
  Assert-Selection $homeItem $workspace "workspace" $stage
  $checks.Add(@{ name=$stage; closedWidth=$closedWidth; openWidth=$openWidth })

  $stage = "high-contrast-native-repaint-and-input"
  if (($contrast.Flags -band 2) -eq 0) { throw "High contrast is unavailable in this Windows desktop session" }
  [NavigationAccessibilityNative]::SetContrast($contrast, $false)
  Wait-Contrast $false | Out-Null
  $workspace.SetFocus()
  Save-Screenshot "navigation-contrast-before" $Window
  $a = $homeItem.Current.BoundingRectangle; $b = $workspace.Current.BoundingRectangle
  $hostRect = $Window.Current.BoundingRectangle
  $x = [int]([Math]::Min($a.Left,$b.Left)-$hostRect.Left)
  $y = [int]([Math]::Min($a.Top,$b.Top)-$hostRect.Top)
  $w = [int]([Math]::Max($a.Right,$b.Right)-[Math]::Min($a.Left,$b.Left))
  $h = [int]([Math]::Max($a.Bottom,$b.Bottom)-[Math]::Min($a.Top,$b.Top))
  [NavigationAccessibilityNative]::SetContrast($contrast, $true)
  $enabled = Wait-Contrast $true
  Assert-Selection $homeItem $workspace "workspace" $stage
  $workspace.SetFocus(); Wait-Focus $workspace
  Save-Screenshot "navigation-high-contrast" $Window
  $fraction = [NavigationAccessibilityNative]::ChangedPixels((Join-Path $OutDir "navigation-contrast-before.png"), (Join-Path $OutDir "navigation-high-contrast.png"), $x,$y,$w,$h)
  if ($fraction -lt 0.02) { throw "Windows enabled high contrast, but the native navigation capture did not repaint" }
  $checks.Add(@{ name=$stage; observedFlags=$enabled.Flags; nativeChangedPixelFraction=$fraction; region=@{x=$x;y=$y;width=$w;height=$h}; limit="Mode, repaint and input evidence; no blanket contrast-ratio or Narrator-speech claim" })
  $result = "passed"
} catch {
  $failure = $_.Exception.Message
  Write-NavigationCheckpoint "navigation-catch-entered"
  throw
} finally {
  Write-NavigationCheckpoint "navigation-finally-entered"
  Write-RawRtlWitnessSummary
  try {
    Write-NavigationCheckpoint "restore-contrast-before"
    [NavigationAccessibilityNative]::SetContrast($contrast, (($contrast.Flags -band 1) -ne 0))
    Wait-Contrast (($contrast.Flags -band 1) -ne 0) | Out-Null
    Write-NavigationCheckpoint "restore-contrast-returned"
  } catch { $result="failed"; $failure="Could not restore original contrast mode: "+$_.Exception.Message }
  try {
    Write-NavigationCheckpoint "restore-window-before"
    if (-not [NavigationAccessibilityNative]::SetWindowPos($handle, [IntPtr]::Zero, [int]$originalRect.X, [int]$originalRect.Y, [int]$originalRect.Width, [int]$originalRect.Height, 0x14)) { throw "Native restoration of window bounds failed" }
    $windowPattern.SetWindowVisualState($originalState)
    $deadline = (Get-Date).AddSeconds(10)
    do {
      Start-Sleep -Milliseconds 100
      $r = $Window.Current.BoundingRectangle
      $restored = $windowPattern.Current.WindowVisualState -eq $originalState -and
        [Math]::Abs($r.X-$originalRect.X) -lt 12 -and [Math]::Abs($r.Y-$originalRect.Y) -lt 12 -and
        [Math]::Abs($r.Width-$originalRect.Width) -lt 12 -and [Math]::Abs($r.Height-$originalRect.Height) -lt 12
    } while (-not $restored -and (Get-Date) -lt $deadline)
    if (-not $restored) { throw "Actual window bounds/state did not return to their original values" }
    Write-NavigationCheckpoint "restore-window-returned"
  } catch { $result="failed"; $failure="Could not restore original window bounds: "+$_.Exception.Message }
  Write-NavigationCheckpoint "navigation-result-before"
  @{ status=$result; platform="windows"; sourceRevision=$env:GITHUB_SHA; processId=$Window.Current.ProcessId; stage=$stage; error=$failure; checks=$checks.ToArray(); rtlWitness=$rtlWitness; completedAt=(Get-Date).ToUniversalTime().ToString("o") } |
    ConvertTo-Json -Depth 8 | Set-Content (Join-Path $OutDir "navigation-accessibility-result.json") -Encoding UTF8
  Write-NavigationCheckpoint "navigation-result-returned"
  if ($result -ne "passed" -and $null -ne $failure) { throw $failure }
}
