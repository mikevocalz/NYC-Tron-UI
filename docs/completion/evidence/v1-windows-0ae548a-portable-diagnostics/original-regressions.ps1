# Executes production diagnostic functions with mocked Windows providers under
# PowerShell 7 on Linux. This does not establish Windows PowerShell 5.1 or UIA/WER
# integration. It checks file replacement, process handles, filtering and errors.
$ErrorActionPreference = "Stop"
$source = "/workspace/scratch/4137c61be495/nyc-tron-windows-native-ci/packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1"
$tokens = $null; $parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($source, [ref]$tokens, [ref]$parseErrors)
if ($parseErrors.Count) { throw ($parseErrors | Out-String) }
foreach ($name in @("Save-Tree", "Save-FailureStatus", "Write-Diagnostics")) {
  $definition = $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq $name }, $true)[0]
  Invoke-Expression $definition.Extent.Text
}
Add-Type @"
using System;
namespace System.Windows.Automation {
  public enum TreeScope { Descendants = 4 }
  public static class Condition { public static object TrueCondition = new object(); }
}
public static class NativeWindow {
  public static IntPtr GetForegroundWindow() { return new IntPtr(777); }
  public static bool IsWindow(IntPtr handle) { return false; }
  public static uint GetWindowThreadProcessId(IntPtr handle, out uint processId) { processId = 0; return 0; }
}
"@
$Tree = [System.Windows.Automation.TreeScope]
$OutDir = "/workspace/scratch/4137c61be495/windows-diagnostics-regression-output"
New-Item -ItemType Directory -Force $OutDir | Out-Null
function Assert($condition, $message) { if (-not $condition) { throw $message } }

$child = [pscustomobject]@{ Current = [pscustomobject]@{ ControlType = @{ ProgrammaticName = "ControlType.Button" }; Name = "old-child"; AutomationId = ""; ClassName = "Button"; ProcessId = 4321; BoundingRectangle = "1,2,3,4"; IsOffscreen = $false } }
$child | Add-Member ScriptMethod GetRuntimeId { @(42,98765) }
$root = [pscustomobject]@{ Current = [pscustomobject]@{ NativeWindowHandle = 1234; ProcessId = 4321 } }
$root | Add-Member ScriptMethod GetRuntimeId { @(42,1234) }
$root | Add-Member ScriptMethod FindAll { param($scope,$condition) $script:children }
$script:children = @($child)
Save-Tree $root "replace-tree"
$text = Get-Content -Raw (Join-Path $OutDir "replace-tree.txt")
Assert ($text.Contains("Root: HWND=1234; process=4321; runtimeId=42,1234")) "Descendant identity overwrote root identity"
Assert ($text.Contains("Descendants: 1") -and $text.Contains("old-child")) "Populated tree was not recorded"
$script:children = @()
Save-Tree $root "replace-tree"
$text = Get-Content -Raw (Join-Path $OutDir "replace-tree.txt")
Assert ($text.Contains("Descendants: 0") -and -not $text.Contains("old-child")) "Empty tree retained stale content"
Assert ($text.Contains("Captured UTC:") -and $text.Contains("process=4321")) "Empty tree lost provenance"
$root | Add-Member -Force ScriptMethod FindAll { throw "Provider unavailable" }
Save-Tree $root "throwing-tree"
$text = Get-Content -Raw (Join-Path $OutDir "throwing-tree.txt")
Assert ($text.Contains("Descendants: unavailable") -and $text.Contains("Provider unavailable")) "Failed enumeration looked like one real descendant"
Write-Output "PASS: populated, empty and unavailable trees preserve identity and overwrite correctly"

$primary = try { throw "strict original drag header failure" } catch { $_ }
$childProcess = [System.Diagnostics.Process]::new()
$childProcess.StartInfo.FileName = "/bin/sh"
$childProcess.StartInfo.Arguments = '-c "sleep 0.25; exit 7"'
$childProcess.StartInfo.UseShellExecute = $false
$childProcess.Start() | Out-Null
$null = $childProcess.Handle
$originalStart = $childProcess.StartTime.ToUniversalTime().ToString("o")
$childProcess.WaitForExit()
Save-FailureStatus $primary $childProcess ([IntPtr]1234) $originalStart
$status = Get-Content -Raw (Join-Path $OutDir "failure-status.json") | ConvertFrom-Json
Assert ($status.hasExited -eq $true -and $status.exitCode -eq 7 -and $status.exitCodeHex -eq "00000007") "Open handle did not preserve child exit status"
Assert ($status.processId -eq $childProcess.Id -and ([DateTime]$status.processStartedAt).ToUniversalTime().ToString("o") -eq $originalStart) "Original process identity changed"
Assert ($status.primaryFailure.message -eq $primary.Exception.Message -and $status.originalWindowHandle -eq 1234) "Original failure/window identity was lost"
$childProcess.Dispose()
Write-Output "PASS: actual terminated child retains PID, start time, exit code and primary error"

function Event($app, $nativePid, $id, $number) {
  $pidXml = if ($null -eq $nativePid) { "" } else { "<Data Name='ProcessId'>$nativePid</Data>" }
  $value = [pscustomobject]@{ TimeCreated = Get-Date; ProviderName = "Application Error"; Id = $id; RecordId = $number; Message = "$app crashed"; RawXml = "<Event><EventData><Data Name='AppName'>$app</Data>$pidXml</EventData></Event>" }
  $value | Add-Member ScriptMethod ToXml { $this.RawXml }
  return $value
}
$ProcessName = "NYCTronWindowsExample"
$script:records = @((Event "$ProcessName.exe" "0x4d2" 1000 1), (Event "$ProcessName.exe" "9999" 1000 2), (Event "unrelated.exe" "0x4d2" 1000 3), (Event "$ProcessName.exe" $null 1001 4))
function Get-AppxPackage { param($Name,$ErrorAction) }
function Get-WinEvent {
  [CmdletBinding()]param($FilterHashtable,$MaxEvents)
  $script:requestedLimit = $MaxEvents; $script:requestedFilter = $FilterHashtable
  if ($script:eventQueryFailure) { Write-Error -Message $script:eventQueryFailure -ErrorId $script:eventQueryFailure -Category PermissionDenied }
  $script:records
}
$since = (Get-Date).AddMinutes(-1)
Write-Diagnostics $since 1234
$events = @(Get-Content -Raw (Join-Path $OutDir "application-error-events.json") | ConvertFrom-Json)
Assert ($events.Count -eq 2 -and $events[0].processId -eq 1234 -and $events[1].recordId -eq 4) "Crash event filter included a foreign process/app"
Assert ($events[1].match -eq "app-name-and-time" -and $null -eq $events[1].processId) "WER service PID was confused with app PID"
Assert ($script:requestedLimit -eq 50 -and $script:requestedFilter.StartTime -eq $since) "Crash query lost its bounds"
$script:records = @()
$script:eventQueryFailure = "AccessDenied"
Write-Diagnostics $since 1234
$query = Get-Content -Raw (Join-Path $OutDir "application-error-query.json") | ConvertFrom-Json
Assert ($query.status -eq "failed" -and $query.errors.Count -ge 1 -and $query.retainedCount -eq 0) "Unavailable event log was reported as an empty successful query"
$script:eventQueryFailure = "NoMatchingEventsFound"
Write-Diagnostics $since 1234
$query = Get-Content -Raw (Join-Path $OutDir "application-error-query.json") | ConvertFrom-Json
Assert ($query.status -eq "completed" -and $query.errors.Count -eq 0 -and $query.scannedCount -eq 0) "An empty event log was reported as query failure"
Write-Output "PASS: bounded app/PID/time filtering retains PID-less WER with an explicit limitation"

$mainTry = @($ast.EndBlock.Statements | Where-Object { $_ -is [System.Management.Automation.Language.TryStatementAst] })[-1]
$catchText = $mainTry.CatchClauses[0].Body.Extent.Text
$catchBody = [scriptblock]::Create($catchText.Substring(1,$catchText.Length-2))
$finallyText = $mainTry.Finally.Extent.Text
$finallyBody = [scriptblock]::Create($finallyText.Substring(1,$finallyText.Length-2))
$script:order = [System.Collections.Generic.List[string]]::new()
function Save-FailureStatus { $script:order.Add("status"); throw "secondary status failure" }
function Write-Diagnostics { $script:order.Add("events"); throw "secondary events failure" }
function Save-Tree { $script:order.Add("tree"); throw "secondary tree failure" }
function Save-Screenshot { param($name,$target) $script:order.Add($name); throw "secondary capture failure" }
function Restore-OwnedCrashDump { $script:order.Add("restore"); throw "secondary restoration failure" }
function Save-CrashDumpReceipt { $script:order.Add("receipt"); throw "secondary receipt failure" }
$process = [pscustomobject]@{ HasExited = $true }
$window = [pscustomobject]@{}
$ownedWindowHandle = [IntPtr]1234
$ownedProcessId = 1234
$ownedProcessStartTime = $originalStart
$started = $since
$crashCapture = @{}
$caught = $null
try {
  try { throw "strict original drag header failure" }
  catch { & $catchBody }
  finally { & $finallyBody }
} catch { $caught = $_ }
Assert ($caught.Exception.Message -eq "strict original drag header failure") "Secondary diagnostic replaced the original ErrorRecord"
Assert (($script:order -join ",") -eq "status,events,tree,failure,failure-desktop,restore,receipt") "Failure observation/capture/cleanup order changed"
Write-Output "PASS: all secondary diagnostics may fail without replacing the strict primary failure"
Write-Output "All four portable diagnostic regressions passed; Windows integration remains untested here."
