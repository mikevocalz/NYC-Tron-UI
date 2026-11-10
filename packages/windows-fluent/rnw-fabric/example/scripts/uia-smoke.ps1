# UI Automation smoke test for the compiled Windows consumer.
# Runs under Windows PowerShell 5.1 (UIAutomationClient ships with .NET Framework).
# Launches the deployed (packaged) Release app by its AppUserModelId, finds the native NavigationView items by
# their Narrator names, requests a route with the keyboard, rejects it, requests
# it again, accepts it, and checks that the native selection indicator follows
# only the committed route. Writes screenshots and a UIA tree dump to $OutDir.
# RNW apps run packaged: run-windows deploys them through the .Package
# project. The bare x64\Release executable exits with 0xC0000409 on
# windows-2025 because it has no package identity.
param(
  [Parameter(Mandatory = $true)][string]$AppUserModelId,
  [Parameter(Mandatory = $true)][string]$ProcessName,
  [Parameter(Mandatory = $true)][string]$OutDir
)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes, System.Windows.Forms, System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class NativeWindow {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", SetLastError=true)] public static extern bool SetWindowPos(IntPtr window, IntPtr after, int x, int y, int width, int height, uint flags);
  [DllImport("user32.dll", SetLastError=true)] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll", SetLastError=true)] static extern bool GetCursorPos(out POINT point);
  [DllImport("user32.dll")] static extern int GetSystemMetrics(int index);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);
  [DllImport("user32.dll", SetLastError=true)] static extern uint SendInput(uint count, INPUT[] inputs, int size);
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
  [StructLayout(LayoutKind.Sequential)] struct INPUT { public uint type; public MOUSEINPUT mouse; }
  [StructLayout(LayoutKind.Sequential)] struct MOUSEINPUT { public int dx, dy; public uint mouseData, flags, time; public UIntPtr extraInfo; }
  public static void Mouse(uint flags) {
    var input = new INPUT { type = 0, mouse = new MOUSEINPUT { flags = flags } };
    if (SendInput(1, new[] { input }, Marshal.SizeOf(typeof(INPUT))) != 1) throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
  }
  public static POINT CursorPosition() {
    POINT point;
    if (!GetCursorPos(out point)) throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
    return point;
  }
  public static void MoveMouse(int x, int y) {
    int left = GetSystemMetrics(76), top = GetSystemMetrics(77);
    int width = GetSystemMetrics(78), height = GetSystemMetrics(79);
    if (width < 2 || height < 2 || x < left || y < top || x >= left + width || y >= top + height)
      throw new ArgumentOutOfRangeException("Pointer destination lies outside the virtual desktop");
    var input = new INPUT { type = 0, mouse = new MOUSEINPUT {
      dx = (int)Math.Round((x - left) * 65535.0 / (width - 1)),
      dy = (int)Math.Round((y - top) * 65535.0 / (height - 1)),
      flags = 0xC001 // MOVE | ABSOLUTE | VIRTUALDESK
    } };
    if (SendInput(1, new[] { input }, Marshal.SizeOf(typeof(INPUT))) != 1) throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
  }
}
"@
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$AE = [System.Windows.Automation.AutomationElement]
$Tree = [System.Windows.Automation.TreeScope]

function Save-Screenshot([string]$name, $target) {
  $rect = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  if ($null -ne $target) {
    $handle = [IntPtr]$target.Current.NativeWindowHandle
    if ($handle -eq [IntPtr]::Zero) { throw "Screenshot target has no native top-level window" }
    [NativeWindow]::SetForegroundWindow($handle) | Out-Null
    $deadline = (Get-Date).AddSeconds(5)
    $ready = $false
    while ((Get-Date) -lt $deadline) {
      $before = $target.Current.BoundingRectangle
      Start-Sleep -Milliseconds 150
      $rect = $target.Current.BoundingRectangle
      if ([NativeWindow]::GetForegroundWindow() -eq $handle -and $rect.Width -gt 0 -and $rect.Height -gt 0 -and
          $before.X -eq $rect.X -and $before.Y -eq $rect.Y -and $before.Width -eq $rect.Width -and $before.Height -eq $rect.Height) {
        $ready = $true; break
      }
    }
    if (-not $ready) { throw "Screenshot target never became the stable foreground window: $name" }
  }
  $bitmap = New-Object System.Drawing.Bitmap ([int]$rect.Width), ([int]$rect.Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.CopyFromScreen([int]$rect.X, [int]$rect.Y, 0, 0, $bitmap.Size)
  $path = Join-Path $OutDir "$name.png"
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose()
  Write-Host "Saved screenshot $path"
}

function Save-Tree($root, [string]$name = "uia-tree") {
  # Provider teardown can race a diagnostic walk. Retain that error while the
  # separate exact-name/visibility assertions continue to determine acceptance.
  $lines = try {
    foreach ($element in $root.FindAll($Tree::Descendants, [System.Windows.Automation.Condition]::TrueCondition)) {
      try {
        $c = $element.Current
        $identity = try { $element.GetRuntimeId() -join "," } catch { "unavailable: $($_.Exception.Message)" }
        "{0} | name='{1}' | id='{2}' | class='{3}' | runtimeId='{4}' | process={5} | bounds='{6}' | offscreen={7}" -f $c.ControlType.ProgrammaticName, $c.Name, $c.AutomationId, $c.ClassName, $identity, $c.ProcessId, $c.BoundingRectangle, $c.IsOffscreen
      } catch { "Provider unavailable during snapshot: $($_.Exception.Message)" }
    }
  } catch {
    "UIA tree enumeration failed: $($_.Exception.Message)"
  }
  $path = Join-Path $OutDir "$name.txt"
  $lines | Set-Content -Path $path -Encoding UTF8
  Write-Host "Saved UIA tree ($($lines.Count) elements) to $path"
}

function Refresh-OwnedWindow($root) {
  $handle = [IntPtr]$root.Current.NativeWindowHandle
  $owner = $root.Current.ProcessId
  if ($handle -eq [IntPtr]::Zero -or $owner -ne $process.Id) { throw "Cannot reacquire an unowned top-level window" }
  $fresh = $AE::FromHandle($handle)
  if ($null -eq $fresh -or $fresh.Current.ProcessId -ne $owner -or [IntPtr]$fresh.Current.NativeWindowHandle -ne $handle) {
    throw "The native top-level window changed while reacquiring its automation provider"
  }
  Write-Host "Reacquired owned window HWND=$handle, process=$owner, runtimeId=$($fresh.GetRuntimeId() -join ',')"
  return $fresh
}

function Find-ByName($root, [string]$name, [int]$timeoutSec = 30) {
  $condition = New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, $name)
  $deadline = (Get-Date).AddSeconds($timeoutSec)
  while ((Get-Date) -lt $deadline) {
    $found = $root.FindFirst($Tree::Descendants, $condition)
    if ($null -ne $found) { return $found }
    Start-Sleep -Milliseconds 250
  }
  throw "UIA element named '$name' did not appear within $timeoutSec s"
}

function Test-Selected($element) {
  $pattern = $null
  if (-not $element.TryGetCurrentPattern([System.Windows.Automation.SelectionItemPattern]::Pattern, [ref]$pattern)) {
    throw "'$($element.Current.Name)' exposes no SelectionItemPattern"
  }
  return $pattern.Current.IsSelected
}

function Assert-Selection($homeItem, $workspace, [string]$expected, [string]$stage) {
  $homeSelected = Test-Selected $homeItem
  $workspaceSelected = Test-Selected $workspace
  Write-Host "[$stage] Home selected=$homeSelected, Workspace selected=$workspaceSelected"
  if (($expected -eq "home") -ne $homeSelected -or ($expected -eq "workspace") -ne $workspaceSelected) {
    throw "[$stage] native selection does not match committed route '$expected'"
  }
}

function Invoke-Button($root, [string]$name) {
  # Match the Button itself: RN draws the title as a child Text with the same name.
  $condition = [System.Windows.Automation.AndCondition]::new([System.Windows.Automation.Condition[]]@(
    (New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, $name)),
    (New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty, [System.Windows.Automation.ControlType]::Button)),
    (New-Object System.Windows.Automation.PropertyCondition($AE::IsOffscreenProperty, $false))))
  $button = $root.FindFirst($Tree::Descendants, $condition)
  if ($null -eq $button) { throw "No Button named '$name' (Narrator would announce it unnamed)" }
  $invoke = $null
  if ($button.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$invoke)) {
    $invoke.Invoke()
    Write-Host "Invoked '$name' through InvokePattern"
  } else {
    [NativeWindow]::SetForegroundWindow([IntPtr]$root.Current.NativeWindowHandle) | Out-Null
    $button.SetFocus()
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait(" ")
    Write-Host "Pressed '$name' with the keyboard (no InvokePattern)"
  }
}

function Request-Workspace($window, $homeItem) {
  # Keyboard path: focus the committed item, move down one item, press Enter.
  [NativeWindow]::SetForegroundWindow([IntPtr]$window.Current.NativeWindowHandle) | Out-Null
  $homeItem.SetFocus()
  Start-Sleep -Milliseconds 300
  [System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
  Start-Sleep -Milliseconds 300
  [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
  Find-ByName $window "Awaiting app approval: Workspace" 15 | Out-Null
  Write-Host "Keyboard Down+Enter produced a pending Workspace request"
}

function Process-ElementCondition([string]$name, $controlType = $null) {
  $conditions = New-Object 'System.Collections.Generic.List[System.Windows.Automation.Condition]'
  $conditions.Add($processCondition)
  $conditions.Add((New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, $name)))
  $conditions.Add((New-Object System.Windows.Automation.PropertyCondition($AE::IsOffscreenProperty, $false)))
  if ($null -ne $controlType) { $conditions.Add((New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty, $controlType))) }
  $condition = New-Object System.Windows.Automation.AndCondition -ArgumentList (, $conditions.ToArray())
  return $condition
}
function Find-ProcessElement([string]$name, $controlType = $null, [int]$timeoutSec = 15) {
  $condition = Process-ElementCondition $name $controlType
  $deadline = (Get-Date).AddSeconds($timeoutSec)
  do {
    $element = $AE::RootElement.FindFirst($Tree::Descendants, $condition)
    if ($null -ne $element) { return $element }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Visible native element '$name' did not appear"
}
function Wait-ProcessElementHidden([string]$name, $controlType) {
  $condition = Process-ElementCondition $name $controlType
  $deadline = (Get-Date).AddSeconds(15)
  do {
    if ($null -eq $AE::RootElement.FindFirst($Tree::Descendants, $condition)) { return }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native element '$name' remained visible after the committed dismissal"
}
function Invoke-NativeElement($element) {
  $invoke = $null
  if ($element.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$invoke)) { $invoke.Invoke() }
  else { $element.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("{ENTER}") }
}
function Assert-NativeValue($field, [string]$expected) {
  $deadline = (Get-Date).AddSeconds(10)
  do {
    $actual = $field.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern).Current.Value
    if ($actual -eq $expected) { return }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native field value '$actual' differs from '$expected'"
}
function Save-PopupScreenshot([string]$name, $popup) {
  if ($popup.Current.IsOffscreen) { throw "Native popup is offscreen: $name" }
  [uint32]$foregroundProcess = 0
  [NativeWindow]::GetWindowThreadProcessId([NativeWindow]::GetForegroundWindow(), [ref]$foregroundProcess) | Out-Null
  if ($foregroundProcess -ne $process.Id) { throw "Another process occludes the native popup: $name" }
  # Focusing the root would dismiss a native popup. Capture the current desktop
  # after proving the popup is visible in the application's foreground process.
  Save-Screenshot $name $null
}
function Move-NativePointer([int]$x, [int]$y) {
  [NativeWindow]::MoveMouse($x, $y)
  $deadline = (Get-Date).AddSeconds(5)
  do {
    $point = [NativeWindow]::CursorPosition()
    if ([Math]::Abs($point.X - $x) -le 1 -and [Math]::Abs($point.Y - $y) -le 1) {
      Write-Host "OS pointer reached ($($point.X), $($point.Y)) for requested ($x, $y)"
      return $point
    }
    Start-Sleep -Milliseconds 20
  } while ((Get-Date) -lt $deadline)
  throw "OS pointer stayed at ($($point.X), $($point.Y)) instead of ($x, $y)"
}
function Assert-PointerPlacement($point, $target) {
  $bounds = $target.Current.BoundingRectangle
  if ($target.Current.IsOffscreen -or $point.X -lt $bounds.Left -or $point.X -ge $bounds.Right -or
      $point.Y -lt $bounds.Top -or $point.Y -ge $bounds.Bottom) {
    throw "OS pointer lies outside visible native '$($target.Current.Name)': ($($point.X), $($point.Y)); bounds=$bounds"
  }
  [uint32]$foregroundProcess = 0
  [NativeWindow]::GetWindowThreadProcessId([NativeWindow]::GetForegroundWindow(), [ref]$foregroundProcess) | Out-Null
  if ($foregroundProcess -ne $process.Id) { throw "Another process owns the foreground during native hover" }
  $hit = $AE::FromPoint([System.Windows.Point]::new($point.X, $point.Y))
  $identity = $target.GetRuntimeId() -join ","
  $providers = @()
  $nativeIdentityMatched = $false
  # RNW 0.85 RootComponentView::UiaProviderFromPoint can return its island
  # container when hosted XAML returns no leaf. Record that provider boundary;
  # the genuine ToolTip appearing and dismissing remains the interaction gate.
  for ($ancestor = $hit; $null -ne $ancestor; $ancestor = [System.Windows.Automation.TreeWalker]::RawViewWalker.GetParent($ancestor)) {
    $current = $ancestor.Current
    $providerIdentity = $ancestor.GetRuntimeId() -join ","
    $providers += @{ name = $current.Name; className = $current.ClassName; controlType = $current.ControlType.ProgrammaticName;
      processId = $current.ProcessId; runtimeId = $providerIdentity; bounds = $current.BoundingRectangle.ToString() }
    if ($providerIdentity -eq $identity) { $nativeIdentityMatched = $true }
  }
  $evidence = @{ cursor = @{ x = $point.X; y = $point.Y }; foregroundProcessId = $foregroundProcess;
    target = @{ name = $target.Current.Name; runtimeId = $identity; bounds = $bounds.ToString() };
    nativeIdentityMatched = $nativeIdentityMatched; hitProviders = $providers }
  $evidence | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $OutDir "tooltip-pointer.json")
  Write-Host "Pointer inside native '$($target.Current.Name)' ($identity); bounds=$bounds; foregroundProcess=$foregroundProcess; nativeHitIdentityMatched=$nativeIdentityMatched"
  $providers | ConvertTo-Json -Depth 3 -Compress | Write-Host
}
function Arrange-DragWindows($main, $secondary) {
  $work = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
  $main.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Normal)
  $secondary.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Normal)
  $leftWidth = [int][Math]::Floor($work.Width * 0.54)
  $rightWidth = $work.Width - $leftWidth - 12
  foreach ($placement in @(@($main, $work.X, $leftWidth), @($secondary, ($work.X + $leftWidth + 12), $rightWidth))) {
    if (-not [NativeWindow]::SetWindowPos([IntPtr]$placement[0].Current.NativeWindowHandle, [IntPtr]::Zero, [int]$placement[1], $work.Y, [int]$placement[2], $work.Height, 0x0014)) {
      throw "Could not arrange both owned windows for actual OS input"
    }
  }
  $deadline = (Get-Date).AddSeconds(10)
  do {
    $a = $main.Current.BoundingRectangle; $b = $secondary.Current.BoundingRectangle
    if ($a.Right -le $b.Left -and $a.Width -gt 350 -and $b.Width -gt 300) { return }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Owned native windows overlap or cannot fit the desktop for OS drag input"
}
function Invoke-NativeDrag($main, $secondary, [bool]$cancel = $false) {
  [NativeWindow]::SetForegroundWindow([IntPtr]$main.Current.NativeWindowHandle) | Out-Null
  $source = Find-ProcessElement "Drag shared native draft" ([System.Windows.Automation.ControlType]::Button)
  $target = Find-ProcessElement "Drop shared native draft" ([System.Windows.Automation.ControlType]::Button)
  $s = $source.Current.BoundingRectangle; $t = $target.Current.BoundingRectangle
  $sx = [int]($s.X + $s.Width / 2); $sy = [int]($s.Y + $s.Height / 2)
  $tx = [int]($t.X + $t.Width / 2); $ty = [int]($t.Y + $t.Height / 2)
  if ($s.Width -lt 30 -or $t.Width -lt 30) { throw "Native drag surface has no usable pointer bounds" }
  [NativeWindow]::SetCursorPos($sx, $sy) | Out-Null
  [NativeWindow]::Mouse(0x0002)
  try {
    [NativeWindow]::SetCursorPos(($sx + 24), $sy) | Out-Null
    Find-ByName $main "Native drag phase: dragging" 10 | Out-Null
    for ($step = 1; $step -le 24; $step++) {
      [NativeWindow]::SetCursorPos([int]($sx + ($tx - $sx) * $step / 24), [int]($sy + ($ty - $sy) * $step / 24)) | Out-Null
      Start-Sleep -Milliseconds 20
    }
    if ($cancel) { [System.Windows.Forms.SendKeys]::SendWait("{ESC}") }
  } finally { [NativeWindow]::Mouse(0x0004) }
}

# Startup-crash evidence: installed Windows App Runtime packages and the
# Application event log entries written since launch.
function Write-Diagnostics($since) {
  Write-Host "Installed Windows App Runtime packages:"
  Get-AppxPackage -Name "*WindowsAppRuntime*" -ErrorAction SilentlyContinue |
    ForEach-Object { Write-Host "  $($_.PackageFullName)" }
  Get-WinEvent -FilterHashtable @{ LogName = "Application"; StartTime = $since } -ErrorAction SilentlyContinue |
    Select-Object -First 20 | Format-List TimeCreated, ProviderName, Id, Message | Out-String | Write-Host
}

$started = Get-Date
Write-Host "Launching shell:AppsFolder\$AppUserModelId"
Start-Process "shell:AppsFolder\$AppUserModelId"
$process = $null
$window = $null
try {
  $deadline = (Get-Date).AddSeconds(30)
  while ((Get-Date) -lt $deadline -and $null -eq $process) {
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($null -eq $process) { Start-Sleep -Milliseconds 250 }
  }
  if ($null -eq $process) {
    Write-Diagnostics $started
    throw "Process '$ProcessName' did not start within 30 s"
  }
  $processCondition = New-Object System.Windows.Automation.PropertyCondition($AE::ProcessIdProperty, $process.Id)
  $deadline = (Get-Date).AddSeconds(90)
  while ((Get-Date) -lt $deadline -and $null -eq $window) {
    if ($process.HasExited) {
      Write-Host "Process exited before showing a window."
      Write-Diagnostics $started
      throw "Consumer process exited before creating a window"
    }
    $window = $AE::RootElement.FindFirst($Tree::Children, $processCondition)
    if ($null -eq $window) { Start-Sleep -Milliseconds 500 }
  }
  if ($null -eq $window) { throw "No top-level window for process $($process.Id) within 90 s" }
  Write-Host "Window '$($window.Current.Name)' class '$($window.Current.ClassName)'"
  # Keep the complete acceptance controls inside the runner's work area.
  $window.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Maximized)

  $homeItem = Find-ByName $window "Home" 60
  $workspace = Find-ByName $window "Workspace"
  Find-ByName $window "NYC-Tron" | Out-Null
  Write-Host "Native NavigationView items found by Narrator name"
  Save-Screenshot "01-launched" $window
  Assert-Selection $homeItem $workspace "home" "initial"

  Request-Workspace $window $homeItem
  Assert-Selection $homeItem $workspace "home" "pending"
  Invoke-Button $window "Reject navigation"
  Find-ByName $window "Navigation rejected; current route retained" | Out-Null
  Assert-Selection $homeItem $workspace "home" "rejected"
  Save-Screenshot "02-rejected" $window

  Request-Workspace $window $homeItem
  Invoke-Button $window "Accept navigation"
  Find-ByName $window "Committed route: workspace" | Out-Null
  Assert-Selection $homeItem $workspace "workspace" "accepted"
  Save-Screenshot "03-accepted" $window
  Write-Host "UIA smoke passed: native selection followed only the committed route"

  Find-ByName $window "Native desktop connected" | Out-Null
  Invoke-Button $window "Open document window"
  $documentCondition = New-Object System.Windows.Automation.AndCondition(
    $processCondition,
    (New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, "NYC-Tron Document")))
  function Find-DocumentWindow {
    $deadline = (Get-Date).AddSeconds(30)
    do {
      $native = $AE::RootElement.FindFirst($Tree::Children, $documentCondition)
      if ($null -ne $native) { return $native }
      Start-Sleep -Milliseconds 200
    } while ((Get-Date) -lt $deadline)
    throw "The secondary native document window did not appear"
  }
  $document = Find-DocumentWindow
  Find-ByName $window "Native windows: 2" | Out-Null
  Find-ByName $document "Window identity: document" | Out-Null
  Find-ByName $document "Shared draft: A shared draft" | Out-Null
  Invoke-Button $window "Change shared draft"
  Find-ByName $document "Shared draft: Edited once, shared everywhere" | Out-Null
  Find-ByName $window "Shared draft: Edited once, shared everywhere" | Out-Null
  Save-Screenshot "04-native-document" $document

  $nativeWindow = $document.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern)
  $nativeWindow.SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Minimized)
  Find-ByName $window "Minimized windows: 1" | Out-Null
  Invoke-Button $window "Restore document"
  Find-ByName $window "Minimized windows: 0" | Out-Null
  Find-ByName $document "Shared draft: Edited once, shared everywhere" | Out-Null

  # WindowPattern.Close calls the real OS close path. The app veto must keep
  # both the native surface and its shared draft alive.
  $nativeWindow.Close()
  Find-ByName $window "Native close vetoed: unsaved draft retained" | Out-Null
  Find-ByName $window "Native windows: 2" | Out-Null
  $document = Find-DocumentWindow
  Find-ByName $document "Shared draft: Edited once, shared everywhere" | Out-Null
  Save-Screenshot "05-close-veto" $document
  Invoke-Button $window "Save shared draft"
  # Button invocation and JS dispatch are asynchronous; close only after the
  # document owner has visibly committed the save policy.
  Find-ByName $window "Shared draft saved in this session" | Out-Null
  $document.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).Close()
  Find-ByName $window "Native close accepted" | Out-Null
  Find-ByName $window "Native windows: 1" | Out-Null
  if ($null -ne $AE::RootElement.FindFirst($Tree::Children, $documentCondition)) { throw "Accepted close left the native surface alive" }
  Invoke-Button $window "Open document window"
  $document = Find-DocumentWindow
  Find-ByName $document "Shared draft: Edited once, shared everywhere" | Out-Null
  Find-ByName $window "Native windows: 2" | Out-Null
  Save-Screenshot "06-native-reopened" $document
  Save-Tree $document
  # The menu/flyout controls below are real WinUI popup trees. Native UIA
  # patterns and OS keyboard input exercise their application-owned callbacks.
  $document.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Minimized)
  [NativeWindow]::SetForegroundWindow([IntPtr]$window.Current.NativeWindowHandle) | Out-Null
  Invoke-Button $window "Show native overlay checks"
  Find-ByName $window "Native overlay acceptance" | Out-Null
  Invoke-Button $window "Native command menu"
  $disabledCommand = Find-ProcessElement "Unavailable native command" ([System.Windows.Automation.ControlType]::MenuItem)
  if ($disabledCommand.Current.IsEnabled) { throw "Disabled native command is enabled" }
  $command = Find-ProcessElement "Approve native command" ([System.Windows.Automation.ControlType]::MenuItem)
  Save-PopupScreenshot "07-native-menu" $command
  Invoke-NativeElement $command
  Find-ByName $window "Native menu action: approve" | Out-Null
  Wait-ProcessElementHidden "Approve native command" ([System.Windows.Automation.ControlType]::MenuItem)

  $context = Find-ProcessElement "Native context anchor" ([System.Windows.Automation.ControlType]::Button)
  $context.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("+{F10}")
  $contextCommand = Find-ProcessElement "Inspect native selection" ([System.Windows.Automation.ControlType]::MenuItem)
  Invoke-NativeElement $contextCommand
  Find-ByName $window "Native context action: inspect" | Out-Null
  Wait-ProcessElementHidden "Inspect native selection" ([System.Windows.Automation.ControlType]::MenuItem)

  $tooltipAnchor = Find-ProcessElement "Native tooltip anchor" ([System.Windows.Automation.ControlType]::Button)
  # The app callback can commit before the context popup finishes closing.
  # Enter from outside the anchor only after its native popup has disappeared,
  # and prove actual OS pointer delivery instead of trusting one SetCursorPos.
  $work = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
  Move-NativePointer ($work.X + 8) ($work.Y + 8) | Out-Null
  Start-Sleep -Milliseconds 150
  $tipBounds = $tooltipAnchor.Current.BoundingRectangle
  $tipPoint = Move-NativePointer ([int]($tipBounds.X + $tipBounds.Width / 2)) ([int]($tipBounds.Y + $tipBounds.Height / 2))
  Assert-PointerPlacement $tipPoint $tooltipAnchor
  $tooltip = Find-ProcessElement "Native tooltip details" ([System.Windows.Automation.ControlType]::ToolTip)
  Save-PopupScreenshot "08-native-tooltip" $tooltip
  Move-NativePointer ($work.X + 8) ($work.Y + 8) | Out-Null
  Wait-ProcessElementHidden "Native tooltip details" ([System.Windows.Automation.ControlType]::ToolTip)

  Invoke-Button $window "Native inspector anchor"
  $field = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  $fieldIdentity = $field.GetRuntimeId() -join ","
  $field.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("^a"); [System.Windows.Forms.SendKeys]::SendWait("NativeRapid123abc")
  Find-ByName $window "Committed native note: NativeRapid123abc" | Out-Null
  Assert-NativeValue $field "NativeRapid123abc"
  $field = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  if (($field.GetRuntimeId() -join ",") -ne $fieldIdentity) { throw "Typing replaced the native inspector field" }
  $field.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern).SetValue("Rejected!")
  Find-ByName $window "Native edit rejected; committed note retained" | Out-Null
  Assert-NativeValue $field "NativeRapid123abc"
  Save-PopupScreenshot "09-native-inspector" $field
  Invoke-NativeElement (Find-ProcessElement "Close native inspector" ([System.Windows.Automation.ControlType]::Button))
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Invoke-Button $window "Native inspector anchor"
  $field = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Assert-NativeValue $field "NativeRapid123abc"
  Invoke-NativeElement (Find-ProcessElement "Disable native inspector" ([System.Windows.Automation.ControlType]::Button))
  Find-ByName $window "Native inspector disabled" | Out-Null
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  $anchor = Find-ProcessElement "Native inspector anchor" ([System.Windows.Automation.ControlType]::Button)
  if ($anchor.Current.IsEnabled) { throw "Disabled inspector anchor remained enabled" }
  Invoke-Button $window "Enable native inspector"
  Invoke-Button $window "Native inspector anchor"
  Invoke-NativeElement (Find-ProcessElement "Replace inspector scope" ([System.Windows.Automation.ControlType]::Button))
  Find-ByName $window "Native inspector scope: draft-2" | Out-Null
  Find-ByName $window "Native edit acknowledgment: 0" | Out-Null
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Invoke-Button $window "Native inspector anchor"
  $replacement = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Assert-NativeValue $replacement "Replacement native note"
  $replacement.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("{ESC}")
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Find-ByName $window "Committed native note: Replacement native note" | Out-Null
  Invoke-Button $window "Veto next inspector dismissal"
  Find-ByName $window "Native inspector dismissal veto armed" | Out-Null
  Invoke-Button $window "Native inspector anchor"
  $vetoedField = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  $vetoedIdentity = $vetoedField.GetRuntimeId() -join ","
  $vetoedField.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("{ESC}")
  Start-Sleep -Milliseconds 500
  $vetoedField = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  if (($vetoedField.GetRuntimeId() -join ",") -ne $vetoedIdentity) { throw "Dismissal veto replaced the native field" }
  Assert-NativeValue $vetoedField "Replacement native note"
  $vetoedField.SetFocus(); [System.Windows.Forms.SendKeys]::SendWait("{ESC}")
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Save-Tree $window "09-before-overlay-unmount"
  Invoke-Button $window "Show lifecycle checks"
  Save-Tree $window "09-after-overlay-unmount-retained"
  $window = Refresh-OwnedWindow $window
  Save-Tree $window "09-after-overlay-unmount-fresh"
  Find-ByName $window "Windows navigation acceptance" | Out-Null
  Wait-ProcessElementHidden "Native inspector anchor" ([System.Windows.Automation.ControlType]::Button)
  Invoke-Button $window "Show native overlay checks"
  Find-ByName $window "Native edit acknowledgment: 0" | Out-Null
  Find-ByName $window "Committed native note: Replacement native note" | Out-Null
  Invoke-Button $window "Native inspector anchor"
  $remountedField = Find-ProcessElement "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)
  Assert-NativeValue $remountedField "Replacement native note"
  $remountedField.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern).SetValue("Remounted native note")
  Find-ByName $window "Committed native note: Remounted native note" | Out-Null
  Find-ByName $window "Native edit acknowledgment: 1" | Out-Null
  Assert-NativeValue $remountedField "Remounted native note"
  Invoke-NativeElement (Find-ProcessElement "Close native inspector" ([System.Windows.Automation.ControlType]::Button))
  Wait-ProcessElementHidden "Native inspector note" ([System.Windows.Automation.ControlType]::Edit)

  Invoke-Button $window "Show native drag checks"
  Find-ByName $window "Native cross-window drag acceptance" | Out-Null
  Arrange-DragWindows $window $document
  Invoke-NativeDrag $window $document
  Find-ByName $window "Completed native drags: 1" | Out-Null
  Find-ByName $window "Native drag result: none/rejected" | Out-Null
  Find-ByName $window "Document owner: main" | Out-Null
  Find-ByName $window "Authorized transfers: 0" | Out-Null
  Save-Screenshot "10-native-drag-rejected" $window

  Invoke-Button $window "Accept native drops"
  Find-ByName $window "Native drop policy: accept" | Out-Null
  Invoke-NativeDrag $window $document $true
  Find-ByName $window "Completed native drags: 2" | Out-Null
  Find-ByName $window "Native drag result: none/cancelled" | Out-Null
  Find-ByName $window "Document owner: main" | Out-Null
  Find-ByName $window "Authorized transfers: 0" | Out-Null

  Invoke-Button $window "Delay native drop approval"
  Find-ByName $window "Native drop policy: delay" | Out-Null
  Invoke-NativeDrag $window $document
  Find-ByName $window "Native drop awaiting app approval" | Out-Null
  $document.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).Close()
  Find-ByName $window "Native windows: 1" | Out-Null
  Find-ByName $window "Completed native drags: 3" | Out-Null
  Invoke-Button $window "Resolve delayed native approval"
  Find-ByName $window "Document owner: main" | Out-Null
  Find-ByName $window "Authorized transfers: 0" | Out-Null
  Invoke-Button $window "Open document window"
  $document = Find-DocumentWindow
  Find-ByName $window "Native windows: 2" | Out-Null
  Arrange-DragWindows $window $document
  Invoke-Button $window "Accept native drops"
  Find-ByName $window "Native drop policy: accept" | Out-Null
  Invoke-NativeDrag $window $document
  Find-ByName $window "Completed native drags: 4" | Out-Null
  Find-ByName $window "Native drag result: move/accepted" | Out-Null
  Find-ByName $window "Document owner: document" | Out-Null
  Find-ByName $document "Document owner: document" | Out-Null
  Find-ByName $window "Authorized transfers: 1" | Out-Null
  Save-Screenshot "11-native-drag-accepted" $document
  $document.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern).SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Minimized)
  [NativeWindow]::SetForegroundWindow([IntPtr]$window.Current.NativeWindowHandle) | Out-Null
  Invoke-Button $window "Show native navigation checks"
  Find-ByName $window "Native navigation accessibility" | Out-Null
  & "$PSScriptRoot\uia-navigation-accessibility.ps1" -Window $window -OutDir $OutDir
  $navigationResult = Get-Content -Raw (Join-Path $OutDir "navigation-accessibility-result.json") | ConvertFrom-Json
  if ($navigationResult.status -ne "passed") { throw "Native navigation accessibility did not pass" }
  Save-Tree $window
  $result = @{
    schemaVersion = 1
    status = "passed"
    platform = "windows"
    sourceRevision = $env:GITHUB_SHA
    processId = $process.Id
    executableSha256 = (Get-FileHash -Algorithm SHA256 $process.Path).Hash.ToLowerInvariant()
    checks = @("controlled-native-navigation", "shared-runtime-two-windows", "shared-document-state", "native-minimize-restore", "native-close-veto", "native-close-accept", "native-window-reopen", "native-menu-disabled-command", "native-context-menu-keyboard", "native-tooltip", "native-inspector-rapid-controlled-edit", "native-inspector-rejection-and-scope", "native-inspector-dismissal-veto-retry", "native-inspector-remount-edit", "native-cross-window-drag-rejected", "native-cross-window-drag-escape", "native-cross-window-drag-close-cancellation", "native-cross-window-drag-accepted", "native-navigation-accessibility")
  }
  $result | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $OutDir "result.json") -Encoding UTF8
  Write-Host "Native desktop acceptance passed: shared runtime, window lifecycle, native overlays and actual cross-window drag"
} catch {
  Write-Host "UIA smoke failed: $($_.Exception.Message)"
  if ($null -ne $window) {
    Save-Tree $window
    Save-Screenshot "failure" $window
  } else {
    Save-Screenshot "failure-desktop" $null
  }
  throw
} finally {
  if ($null -ne $process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force }
}
