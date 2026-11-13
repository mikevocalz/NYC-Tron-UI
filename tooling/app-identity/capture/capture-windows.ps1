# Windows launcher captures for the packaged RNW example. CI only; best effort.
# Adds a short-named and a long-named Start menu entry beside the example,
# opens Start and All apps, searches, then turns taskbar labels on and
# launches the example. Each step writes a full-screen PNG and the UIA name and
# rectangle of every element whose name starts with "Tron".
# Runs under Windows PowerShell 5.1.
param(
  [Parameter(Mandatory = $true)][string]$AppUserModelId,
  [Parameter(Mandatory = $true)][string]$OutDir,
  [Parameter(Mandatory = $true)][string]$IconPath
)
$ErrorActionPreference = "Continue"
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes, System.Windows.Forms, System.Drawing
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$log = Join-Path $OutDir "status.txt"
function Note([string]$m) { Write-Host $m; Add-Content -Path $log -Value $m }

function Shot([string]$name) {
  $b = [System.Windows.Forms.SystemInformation]::VirtualScreen
  $bitmap = New-Object System.Drawing.Bitmap $b.Width, $b.Height
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.CopyFromScreen($b.X, $b.Y, 0, 0, $bitmap.Size)
  $bitmap.Save((Join-Path $OutDir "$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bitmap.Dispose()
}

function Dump([string]$name) {
  $root = [System.Windows.Automation.AutomationElement]::RootElement
  $all = $root.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)
  $rows = @()
  foreach ($e in $all) {
    try {
      $n = $e.Current.Name
      if ($n -and ($n -like "Tron*" -or $n -eq "All" -or $n -eq "All apps" -or $n -like "*Start*")) {
        $r = $e.Current.BoundingRectangle
        $rows += [pscustomobject]@{ name = $n; type = $e.Current.ControlType.ProgrammaticName; className = $e.Current.ClassName;
          x = $r.X; y = $r.Y; width = $r.Width; height = $r.Height }
      }
    } catch { }
  }
  $rows | ConvertTo-Json -Depth 3 | Set-Content -Path (Join-Path $OutDir "$name.json") -Encoding utf8
  return $rows
}

$dpi = [System.Drawing.Graphics]::FromHwnd([IntPtr]::Zero).DpiX
Note ("OS: " + (Get-CimInstance Win32_OperatingSystem).Caption + " " + [Environment]::OSVersion.Version + "; DPI " + $dpi)
$pkg = Get-AppxPackage | Where-Object { $AppUserModelId.StartsWith($_.PackageFamilyName) } | Select-Object -First 1
if ($pkg) {
  $manifest = [xml](Get-Content (Join-Path $pkg.InstallLocation "AppxManifest.xml"))
  Note ("Package DisplayName: " + $manifest.Package.Properties.DisplayName)
  $ns = New-Object System.Xml.XmlNamespaceManager($manifest.NameTable)
  $ns.AddNamespace("uap", "http://schemas.microsoft.com/appx/manifest/uap/windows10")
  $ns.AddNamespace("m", "http://schemas.microsoft.com/appx/manifest/foundation/windows10")
  $visual = $manifest.SelectSingleNode("//uap:VisualElements", $ns)
  if ($visual) { Note ("VisualElements DisplayName (Start and taskbar label): " + $visual.DisplayName) }
}

# Short and long neighbours: Start menu shortcuts with the example's icon.
$programs = Join-Path $env:ProgramData "Microsoft\Windows\Start Menu\Programs"
$shell = New-Object -ComObject WScript.Shell
foreach ($label in @("Tron", "Tron WinUI Instruments Demo")) {
  $lnk = $shell.CreateShortcut((Join-Path $programs "$label.lnk"))
  $lnk.TargetPath = "$env:WINDIR\System32\notepad.exe"
  $lnk.IconLocation = "$IconPath,0"
  $lnk.Save()
}
Start-Sleep -Seconds 10

Add-Type @"
using System; using System.Runtime.InteropServices;
public static class TronMouse {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, UIntPtr e);
  public static void Click(int x, int y) { SetCursorPos(x, y); System.Threading.Thread.Sleep(200); mouse_event(2, 0, 0, 0, UIntPtr.Zero); mouse_event(4, 0, 0, 0, UIntPtr.Zero); }
}
"@

# Start's content lives in the CoreWindow named "Start"; search inside it.
function StartWindow {
  $cond = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty, "Start")
  $hits = [System.Windows.Automation.AutomationElement]::RootElement.FindAll([System.Windows.Automation.TreeScope]::Children, $cond)
  foreach ($h in $hits) { if ($h.Current.ControlType -ne [System.Windows.Automation.ControlType]::Button) { return $h } }
  return $null
}
function DumpWithin($element, [string]$name) {
  $rows = @()
  if ($element) {
    foreach ($e in $element.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)) {
      try {
        $r = $e.Current.BoundingRectangle
        if ($e.Current.Name) { $rows += [pscustomobject]@{ name = $e.Current.Name; type = $e.Current.ControlType.ProgrammaticName;
          className = $e.Current.ClassName; x = $r.X; y = $r.Y; width = $r.Width; height = $r.Height } }
      } catch { }
    }
  }
  ConvertTo-Json -InputObject @($rows) -Depth 3 | Set-Content -Path (Join-Path $OutDir "$name.json") -Encoding utf8
  return $rows
}

[System.Windows.Forms.SendKeys]::SendWait("^{ESC}")
Start-Sleep -Seconds 4
Shot "start"
$startWindow = StartWindow
Note ("Start window found by UIA: " + [bool]$startWindow)
$rows = DumpWithin $startWindow "start-uia"
$allButton = $rows | Where-Object { $_.name -match '^All( apps)?$' -and $_.type -eq "ControlType.Button" } | Select-Object -First 1
if ($allButton) {
  [TronMouse]::Click([int]($allButton.x + $allButton.width / 2), [int]($allButton.y + $allButton.height / 2))
  Note "Clicked All from its UIA rectangle"
} else {
  # Start is centred above the taskbar; on this runner's 1024x768 screen the
  # All button sits 231 px right of centre and 613 px above the bottom edge.
  $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  [TronMouse]::Click([int]($b.Width / 2 + 231), [int]($b.Height - 613))
  Note "No All button in UIA; clicked its position from the Start capture"
}
Start-Sleep -Seconds 3
Shot "start-all-apps"
DumpWithin (StartWindow) "start-all-apps-uia" | Out-Null
# All apps is alphabetical and the T entries sit near the end: wheel down
# over the list and capture each step.
$b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
[TronMouse]::SetCursorPos([int]($b.Width / 2), [int]($b.Height / 2))
for ($step = 1; $step -le 6; $step++) {
  for ($n = 0; $n -lt 5; $n++) { [TronMouse]::mouse_event(0x0800, 0, 0, [uint32]4294967176, [UIntPtr]::Zero); Start-Sleep -Milliseconds 150 }
  Start-Sleep -Seconds 1
  Shot "start-all-apps-scroll$step"
}
[System.Windows.Forms.SendKeys]::SendWait("Tron")
Start-Sleep -Seconds 4
Shot "start-search"
Dump "start-search-uia" | Out-Null
[System.Windows.Forms.SendKeys]::SendWait("{ESC}")
Start-Sleep -Seconds 1
[System.Windows.Forms.SendKeys]::SendWait("{ESC}")

# Taskbar: show labels ("Combine taskbar buttons: Never"), then launch the example.
$adv = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
Set-ItemProperty -Path $adv -Name TaskbarGlomLevel -Value 2 -Type DWord
Stop-Process -Name explorer -Force
Start-Sleep -Seconds 8
if (-not (Get-Process explorer -ErrorAction SilentlyContinue)) { Start-Process explorer; Start-Sleep -Seconds 8 }
Start-Process "explorer.exe" "shell:AppsFolder\$AppUserModelId"
Start-Process "$env:WINDIR\System32\notepad.exe"
Start-Sleep -Seconds 12
Shot "taskbar"
Dump "taskbar-uia" | Out-Null
Get-Process -Name NYCTronWindowsExample -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name notepad -ErrorAction SilentlyContinue | Stop-Process -Force
exit 0
