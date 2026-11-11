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
  [DllImport("kernel32.dll")] private static extern IntPtr LocalFree(IntPtr memory);
  [DllImport("user32.dll", SetLastError=true)]
  public static extern bool SetWindowPos(IntPtr window, IntPtr after, int x, int y, int width, int height, uint flags);
  public static Contrast ReadContrast() {
    HC value = new HC { size = (uint)Marshal.SizeOf(typeof(HC)) };
    if (!SystemParametersInfoW(0x42, value.size, ref value, 0)) throw new Win32Exception(Marshal.GetLastWin32Error());
    try { return new Contrast { Flags=value.flags, Scheme=Marshal.PtrToStringUni(value.scheme) }; }
    finally { if (value.scheme != IntPtr.Zero) LocalFree(value.scheme); }
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

# Flushed per call so a crash of this process still leaves the last completed step on disk.
$crumbPath = Join-Path $OutDir "navigation-breadcrumbs.log"
function Crumb([string]$message) {
  try { [System.IO.File]::AppendAllText($crumbPath, ("{0} {1}`r`n" -f (Get-Date).ToUniversalTime().ToString("o"), $message)) } catch {}
}
$ae = [System.Windows.Automation.AutomationElement]
$tree = [System.Windows.Automation.TreeScope]
$checks = New-Object System.Collections.Generic.List[object]
$stage = "start"
$result = "failed"
$failure = $null
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
    Crumb "contrast: ReadContrast call"
    $observed = [NavigationAccessibilityNative]::ReadContrast()
    Crumb "contrast: ReadContrast returned flags=$($observed.Flags) scheme=$($observed.Scheme)"
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
    if ($r.Width*$r.Height -gt $area) { $area = $r.Width*$r.Height; $largest = $item }
  }
  if ($null -eq $largest) { throw "The native navigation landmark is absent" }
  return $largest
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
  Crumb "resize: begin"
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
  Crumb "rtl: begin"
  $pane = Native-Pane
  Crumb "rtl: pane found"
  $ltr = (Find-Id "TogglePaneButton").Current.BoundingRectangle
  Crumb "rtl: ltr toggle rect x=$($ltr.X)"
  Invoke-Button $Window "Use RTL navigation"
  Crumb "rtl: button pressed"
  Find-ByName $Window "Navigation direction: rtl" | Out-Null
  Crumb "rtl: direction text found"
  $deadline = (Get-Date).AddSeconds(10)
  do {
    Start-Sleep -Milliseconds 100
    $rtl = (Find-Id "TogglePaneButton").Current.BoundingRectangle
  } while ($rtl.X -le $ltr.X+20 -and (Get-Date) -lt $deadline)
  Crumb "rtl: toggle poll finished x=$($rtl.X)"
  # The toggle rebuilds the provider tree. The pane, Home and Workspace elements
  # held from before it refer to destroyed providers, so reacquire them before
  # reading any property. The checks below are unchanged.
  $pane = Native-Pane
  Crumb "rtl: pane reacquired"
  $homeItem = Find-ByName $Window "Home"
  $workspace = Find-ByName $Window "Workspace"
  Crumb "rtl: selection items reacquired"
  $paneRect = $pane.Current.BoundingRectangle; $hostRect = $Window.Current.BoundingRectangle
  Crumb "rtl: pane rect left=$($paneRect.Left) right=$($paneRect.Right)"
  if ($rtl.X -le $ltr.X+20) { throw "The actual native pane toggle did not mirror for RTL" }
  if ($paneRect.Right -gt $hostRect.Left+$hostRect.Width/2) { throw "RTL moved the Windows drawer away from the physical left" }
  Assert-Selection $homeItem $workspace "workspace" $stage
  Save-Screenshot "navigation-rtl" $Window
  $checks.Add(@{ name=$stage; ltrToggleX=$ltr.X; rtlToggleX=$rtl.X; paneLeft=$paneRect.Left; paneRight=$paneRect.Right; hostLeft=$hostRect.Left })
  Crumb "rtl: checks passed"
  Invoke-Button $Window "Use LTR navigation"
  Find-ByName $Window "Navigation direction: ltr" | Out-Null
  Crumb "ltr: restored"
  $homeItem = Find-ByName $Window "Home"
  $workspace = Find-ByName $Window "Workspace"

  $stage = "native-pane-collapse-and-restore"
  Crumb "pane: begin"
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
  Crumb "contrast: begin"
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
  Crumb "contrast: enabled requested"
  $enabled = Wait-Contrast $true
  Crumb "contrast: enabled observed flags=$($enabled.Flags)"
  Assert-Selection $homeItem $workspace "workspace" $stage
  $workspace.SetFocus(); Wait-Focus $workspace
  Save-Screenshot "navigation-high-contrast" $Window
  $fraction = [NavigationAccessibilityNative]::ChangedPixels((Join-Path $OutDir "navigation-contrast-before.png"), (Join-Path $OutDir "navigation-high-contrast.png"), $x,$y,$w,$h)
  if ($fraction -lt 0.02) { throw "Windows enabled high contrast, but the native navigation capture did not repaint" }
  $checks.Add(@{ name=$stage; observedFlags=$enabled.Flags; nativeChangedPixelFraction=$fraction; region=@{x=$x;y=$y;width=$w;height=$h}; limit="Mode, repaint and input evidence; no blanket contrast-ratio or Narrator-speech claim" })
  $result = "passed"
} catch {
  $failure = $_.Exception.Message
  Crumb "catch: $failure"
  throw
} finally {
  Crumb "finally: begin"
  try {
    [NavigationAccessibilityNative]::SetContrast($contrast, (($contrast.Flags -band 1) -ne 0))
    Crumb "finally: SetContrast returned"
    Wait-Contrast (($contrast.Flags -band 1) -ne 0) | Out-Null
    Crumb "finally: Wait-Contrast returned"
  } catch { $result="failed"; $failure="Could not restore original contrast mode: "+$_.Exception.Message }
  try {
    Crumb "finally: restoring window bounds"
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
    Crumb "finally: window bounds restored"
  } catch { $result="failed"; $failure="Could not restore original window bounds: "+$_.Exception.Message }
  Crumb "finally: writing result"
  @{ status=$result; platform="windows"; sourceRevision=$env:GITHUB_SHA; processId=$Window.Current.ProcessId; stage=$stage; error=$failure; checks=$checks.ToArray(); completedAt=(Get-Date).ToUniversalTime().ToString("o") } |
    ConvertTo-Json -Depth 8 | Set-Content (Join-Path $OutDir "navigation-accessibility-result.json") -Encoding UTF8
  if ($result -ne "passed" -and $null -ne $failure) { throw $failure }
}
