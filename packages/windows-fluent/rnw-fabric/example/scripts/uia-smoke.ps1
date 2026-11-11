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
}
"@
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$AE = [System.Windows.Automation.AutomationElement]
$Tree = [System.Windows.Automation.TreeScope]

# UIA SetFocus throws "Target element cannot receive focus" while the window is
# still being maximized or has not yet been activated by the shell. Bring the
# owning window to the foreground and retry for a bounded time; if focus is
# never accepted the last UIA error is thrown, so the assertion stays strict.
function Set-ElementFocus($element, $window, [int]$timeoutSec = 10) {
  $handle = if ($null -ne $window) { [IntPtr]$window.Current.NativeWindowHandle } else { [IntPtr]$element.Current.NativeWindowHandle }
  $deadline = (Get-Date).AddSeconds($timeoutSec)
  $lastError = $null
  do {
    if ($handle -ne [IntPtr]::Zero) { [NativeWindow]::SetForegroundWindow($handle) | Out-Null }
    try { $element.SetFocus(); return } catch { $lastError = $_.Exception.Message }
    Start-Sleep -Milliseconds 250
  } while ((Get-Date) -lt $deadline)
  throw "Element '$($element.Current.Name)' could not receive focus within $timeoutSec s: $lastError"
}

function Save-Screenshot([string]$name, $target) {
  $rect = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  if ($null -ne $target) {
    $handle = [IntPtr]$target.Current.NativeWindowHandle
    if ($handle -eq [IntPtr]::Zero) { throw "Screenshot target has no native top-level window" }
    [NativeWindow]::SetForegroundWindow($handle) | Out-Null
    Set-ElementFocus $target $target
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

function Save-Tree($root) {
  $lines = foreach ($element in $root.FindAll($Tree::Descendants, [System.Windows.Automation.Condition]::TrueCondition)) {
    $c = $element.Current
    "{0} | name='{1}' | id='{2}' | class='{3}'" -f $c.ControlType.ProgrammaticName, $c.Name, $c.AutomationId, $c.ClassName
  }
  $path = Join-Path $OutDir "uia-tree.txt"
  $lines | Set-Content -Path $path -Encoding UTF8
  Write-Host "Saved UIA tree ($($lines.Count) elements) to $path"
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
  $condition = New-Object System.Windows.Automation.AndCondition(
    (New-Object System.Windows.Automation.PropertyCondition($AE::NameProperty, $name)),
    (New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty, [System.Windows.Automation.ControlType]::Button)))
  $button = $root.FindFirst($Tree::Descendants, $condition)
  if ($null -eq $button) { throw "No Button named '$name' (Narrator would announce it unnamed)" }
  $invoke = $null
  if ($button.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$invoke)) {
    $invoke.Invoke()
    Write-Host "Invoked '$name' through InvokePattern"
  } else {
    [NativeWindow]::SetForegroundWindow([IntPtr]$root.Current.NativeWindowHandle) | Out-Null
    Set-ElementFocus $button $root
    Start-Sleep -Milliseconds 300
    [System.Windows.Forms.SendKeys]::SendWait(" ")
    Write-Host "Pressed '$name' with the keyboard (no InvokePattern)"
  }
}

function Request-Workspace($window, $homeItem) {
  # Keyboard path: focus the committed item, move down one item, press Enter.
  [NativeWindow]::SetForegroundWindow([IntPtr]$window.Current.NativeWindowHandle) | Out-Null
  Set-ElementFocus $homeItem $window
  Start-Sleep -Milliseconds 300
  [System.Windows.Forms.SendKeys]::SendWait("{DOWN}")
  Start-Sleep -Milliseconds 300
  [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
  Find-ByName $window "Awaiting app approval: Workspace" 15 | Out-Null
  Write-Host "Keyboard Down+Enter produced a pending Workspace request"
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
  $result = @{
    schemaVersion = 1
    status = "passed"
    platform = "windows"
    sourceRevision = $env:GITHUB_SHA
    processId = $process.Id
    executableSha256 = (Get-FileHash -Algorithm SHA256 $process.Path).Hash.ToLowerInvariant()
    checks = @("controlled-native-navigation", "shared-runtime-two-windows", "shared-document-state", "native-minimize-restore", "native-close-veto", "native-close-accept", "native-window-reopen")
  }
  $result | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $OutDir "result.json") -Encoding UTF8
  Write-Host "Native desktop acceptance passed: shared runtime, close policy and minimize/restore"
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
