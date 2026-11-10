# Portable behavior checks for the actual drag driver with mocked OS/UIA input.
# This does not execute Win32, establish Windows PowerShell 5.1 integration, or
# replace the real Windows DragStarting/drop/cancel/navigation acceptance gates.
param([string]$OutputDirectory = (Join-Path ([System.IO.Path]::GetTempPath()) ("nyctron-drag-input-" + [Guid]::NewGuid().ToString("N"))))
$ErrorActionPreference = "Stop"
. "$PSScriptRoot/../scripts/uia-drag-input.ps1"
Add-Type @"
using System;
using System.Collections.Generic;
namespace System.Windows { public struct Point { public double X,Y; public Point(double x,double y) { X=x; Y=y; } } }
public static class DragAutomation { public static object FromPoint(System.Windows.Point point) { return null; } }
public static class NativeWindow {
  public struct POINT { public int X,Y; }
  public struct GUI { public uint flags; public IntPtr active,focus,capture; }
  public static int X,Y,HitRoot=100; public static bool Down,FailUp;
  public static List<uint> Inputs = new List<uint>();
  public static bool SetForegroundWindow(IntPtr window) { return true; }
  public static IntPtr GetForegroundWindow() { return new IntPtr(100); }
  public static POINT CursorPosition() { return new POINT { X=X,Y=Y }; }
  public static POINT DragMetrics() { return new POINT { X=4,Y=4 }; }
  public static IntPtr WindowFromPoint(POINT point) { return new IntPtr(101); }
  public static IntPtr GetAncestor(IntPtr window,uint flags) { return new IntPtr(HitRoot); }
  public static uint GetWindowThreadProcessId(IntPtr window,out uint process) { process=77; return 88; }
  public static short GetAsyncKeyState(int key) { return Down ? unchecked((short)0x8000) : (short)0; }
  public static GUI ThreadInputState(uint thread) { return new GUI { active=new IntPtr(100),focus=new IntPtr(101),capture=Down ? new IntPtr(101) : IntPtr.Zero }; }
  public static void Mouse(uint flags) {
    Inputs.Add(flags);
    if(flags==4 && FailUp) throw new InvalidOperationException("secondary button-up failure");
    Down=flags==2;
  }
}
"@
$AE = [DragAutomation]
$process = [pscustomobject]@{ Id = 77 }
$main = [pscustomobject]@{ Current = [pscustomobject]@{ NativeWindowHandle = 100 } }
$secondary = [pscustomobject]@{ Current = [pscustomobject]@{ NativeWindowHandle = 200 } }
$OutDir = $OutputDirectory
New-Item -ItemType Directory -Force $OutDir | Out-Null
function Assert($condition, [string]$message) { if (-not $condition) { throw $message } }
function ElementRecord($name, $handle, $x, $y, $width, $height, $identity) {
  return [ordered]@{ name=$name; processId=77; runtimeId=$identity; className="NYCTronDragRegion"; windowHandle=$handle
    enabled=$true; offscreen=$false; keyboardFocusable=$true; keyboardFocused=$false
    controlType="ControlType.Custom"; bounds=[ordered]@{ x=$x; y=$y; width=$width; height=$height } }
}
function Endpoints([int]$y = 311, [string]$identity = "42,101,4,85") {
  $sourceElement = [pscustomobject]@{}
  $sourceElement | Add-Member ScriptMethod GetSupportedPatterns { @([pscustomobject]@{ Id=10000; ProgrammaticName="InvokePatternIdentifiers.Pattern" }) }
  return @{ main=(ElementRecord "main" 100 0 0 552 720 "42,100"); secondary=(ElementRecord "document" 200 564 0 460 720 "42,200")
    source=(ElementRecord "Drag shared native draft" 0 72 $y 260 56 $identity); target=(ElementRecord "Drop shared native draft" 0 580 90 260 56 "42,201,4,90")
    sourceElement=$sourceElement; targetElement=$null; foregroundWindowHandle=100 }
}
$script:reads = 0; $script:samples = @(); $script:moves = [System.Collections.Generic.List[object]]::new()
$script:changeOnMove = $false; $script:failPhase = $false
$script:failThresholdObservation = $false; $script:phaseChecks = 0
function Read-DragEndpoints($main, $secondary) {
  if ($script:failThresholdObservation -and $script:moves.Count -ge 2 -and [NativeWindow]::Down) { throw "secondary endpoint observation failure" }
  $value = $script:samples[[Math]::Min($script:reads, $script:samples.Count-1)]
  $script:reads++; return $value
}
function Start-Sleep { param($Milliseconds) }
function Move-NativePointer([int]$x, [int]$y) {
  [NativeWindow]::X=$x; [NativeWindow]::Y=$y; $script:moves.Add(@{ x=$x; y=$y })
  if ($script:changeOnMove) { $script:samples = @((Endpoints 356)); $script:reads=0 }
  return [NativeWindow]::CursorPosition()
}
function Find-ByName($root, [string]$name, [int]$timeoutSec) {
  $script:phaseChecks++
  Assert ($name -eq "Native drag phase: dragging" -and $timeoutSec -eq 10) "Strict native drag-start gate changed"
  if ($script:failPhase) { throw "strict native drag phase timeout" }
}

function Save-DragEnvironmentRecord { throw "secondary environment diagnostic failure" }

# The first two observations still precede resize. Geometry and then native
# identity change, so neither earlier pair may satisfy the stable endpoint gate.
$script:samples = @((Endpoints 266), (Endpoints 266), (Endpoints), (Endpoints 311 "42,102,4,86"), (Endpoints 311 "42,102,4,86"), (Endpoints 311 "42,102,4,86"))
$stable = Wait-DragEndpoints $main $secondary
Assert ($stable.stabilityObservations -eq 6 -and $stable.source.bounds.y -eq 311 -and $stable.source.runtimeId -eq "42,102,4,86") "Resize/remount was accepted as an earlier stable endpoint"
foreach ($kind in @("foreground", "owner", "hidden", "disabled", "unfocusable")) {
  $invalid = Endpoints
  switch($kind) {
    "foreground" { $invalid.foregroundWindowHandle=999 }
    "owner" { $invalid.source.processId=999 }
    "hidden" { $invalid.source.offscreen=$true }
    "disabled" { $invalid.source.enabled=$false }
    "unfocusable" { $invalid.source.keyboardFocusable=$false }
  }
  Assert (-not (Test-DragEndpoints $invalid)) "Invalid $kind endpoint accepted"
}
Write-Output "PASS: resize/remount stability and endpoint ownership/visibility/enabled checks"

# A coordinate change between observation and pointer arrival must fail before
# down; it must not send a gesture to a point calculated from old layout.
$script:reads=0; $script:samples=@((Endpoints)); $script:changeOnMove=$true
$caught=$null
try { Invoke-NativeDrag $main $secondary } catch { $caught=$_ }
Assert ($null -ne $caught -and $caught.Exception.Message -like "*changed before button-down*") "Late geometry change did not reject stale pointer coordinates"
Assert ([NativeWindow]::Inputs.Count -eq 0) "Mouse button was pressed after endpoint geometry changed"
Write-Output "PASS: layout change before down refuses stale pointer coordinates"

$script:changeOnMove=$false; $script:reads=0; $script:samples=@((Endpoints)); [NativeWindow]::HitRoot=200
$caught=$null
try { Invoke-NativeDrag $main $secondary } catch { $caught=$_ }
Assert ($null -ne $caught -and $caught.Exception.Message -like "*owned foreground window*") "Same-process wrong-root pointer was accepted"
Assert ([NativeWindow]::Inputs.Count -eq 0) "Mouse button was pressed over another owned top-level window"
[NativeWindow]::HitRoot=100
Write-Output "PASS: another owned window covering the source refuses input before down"

$script:changeOnMove=$false; $script:reads=0; $script:samples=@((Endpoints)); $script:failPhase=$true
[NativeWindow]::FailUp=$true; $script:moves.Clear()
$caught=$null
try { Invoke-NativeDrag $main $secondary } catch { $caught=$_ }
Assert ($null -ne $caught -and $caught.Exception.Message -eq "strict native drag phase timeout") "Button-up failure replaced the strict primary drag error"
Assert (([NativeWindow]::Inputs -join ",") -eq "2,4") "Failed drag did not attempt button-up exactly once"
$receipt = Get-Content -Raw (Join-Path $OutDir "drag-input-03.json") | ConvertFrom-Json
Assert ($receipt.primaryFailure.message -eq "strict native drag phase timeout" -and $receipt.buttonUp -eq "failed") "Receipt lost primary or cleanup failure"
Assert ($receipt.environmentCaptureErrorType -eq "System.Management.Automation.RuntimeException") "Environment diagnostic failure was not isolated from the primary drag assertion"
Assert (($receipt.observations.stage -join ",") -eq "before-down,after-down,threshold,failure-before-release") "Missing pre-release pointer observation"
$before=$receipt.observations[0]; $threshold=$receipt.observations[2]
Assert ($before.actualCursor.x -eq 202 -and $before.actualCursor.y -eq 339 -and $threshold.actualCursor.x -eq 226 -and $threshold.leftButtonDown) "Requested/actual threshold observation changed"
Assert ($before.dragPattern.status -eq "unavailable" -and $before.dragPattern.nativeCanDrag -eq "not-observed") "Absent DragPattern was confused with CanDrag=false"
Write-Output "PASS: strict timeout survives cleanup failure with original cursor/ownership/pattern receipt"

# A query/capture error after down cannot replace the strict assertion, and the
# checked up event is still attempted. The real snapshot function is restored.
$pointerFunction = ${function:Get-DragPointerRecord}
function Get-DragPointerRecord($stage,$requested,$endpoints) {
  if ($stage -eq "before-down") { return & $pointerFunction $stage $requested $endpoints }
  throw "secondary pointer observation failure"
}
$script:reads=0; $script:samples=@((Endpoints)); [NativeWindow]::Inputs.Clear(); [NativeWindow]::Down=$false; [NativeWindow]::FailUp=$false
$caught=$null
try { Invoke-NativeDrag $main $secondary } catch { $caught=$_ }
Assert ($caught.Exception.Message -eq "strict native drag phase timeout" -and ([NativeWindow]::Inputs -join ",") -eq "2,4") "Snapshot failure changed the primary error or release path"
$receipt = Get-Content -Raw (Join-Path $OutDir "drag-input-04.json") | ConvertFrom-Json
Assert ($receipt.observations[-1].captureError -eq "secondary pointer observation failure" -and $receipt.buttonUp -eq "inserted") "Secondary capture failure was not retained"
${function:Get-DragPointerRecord} = $pointerFunction
Write-Output "PASS: secondary pointer capture failure preserves the strict error and releases input"

$script:failThresholdObservation=$true; $script:reads=0; $script:samples=@((Endpoints)); $script:moves.Clear(); [NativeWindow]::Inputs.Clear()
$phaseChecksBefore=$script:phaseChecks
$caught=$null
try { Invoke-NativeDrag $main $secondary } catch { $caught=$_ }
Assert ($caught.Exception.Message -eq "strict native drag phase timeout" -and $script:phaseChecks -eq $phaseChecksBefore + 1) "Diagnostic endpoint refresh preempted the actual drag-start assertion"
$receipt = Get-Content -Raw (Join-Path $OutDir "drag-input-05.json") | ConvertFrom-Json
Assert ($receipt.observations[2].captureError -eq "secondary endpoint observation failure" -and $receipt.buttonUp -eq "inserted") "Endpoint diagnostic error or release result was lost"
$script:failThresholdObservation=$false
Write-Output "PASS: live endpoint diagnostic failure leaves the strict native-start gate in control"

$script:reads=0; $script:samples=@((Endpoints)); $script:failPhase=$false; [NativeWindow]::Inputs.Clear(); $script:moves.Clear()
Invoke-NativeDrag $main $secondary
Assert (([NativeWindow]::Inputs -join ",") -eq "2,4" -and $script:moves.Count -eq 26) "Ordered down/threshold/24-step path/up changed"
Assert ($script:moves[-1].x -eq 710 -and $script:moves[-1].y -eq 118) "Gesture did not end at observed target center"
Write-Output "PASS: checked pointer path retains threshold, native-start gate and target endpoint"
Write-Output "All seven portable drag-driver regressions passed; Win32/UIA integration remains for the Windows run. Receipts: $OutDir"
