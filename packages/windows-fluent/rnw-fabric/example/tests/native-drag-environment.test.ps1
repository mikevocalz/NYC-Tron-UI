# Portable checks for bounded ancestry and first-observation retention only.
# Win32 parent, process-token and registry queries run in the native Windows job.
param([string]$OutputDirectory = (Join-Path ([System.IO.Path]::GetTempPath()) ("nyctron-drag-environment-" + [Guid]::NewGuid().ToString("N"))))
$ErrorActionPreference = "Stop"
. "$PSScriptRoot/../scripts/uia-drag-environment.ps1"
Add-Type @"
using System;
using System.Collections.Generic;
public sealed class FakeControlType { public string ProgrammaticName="ControlType.Pane"; }
public sealed class FakeCurrent {
  public int ProcessId=77, NativeWindowHandle;
  public string ClassName="InputSiteWindowClass";
  public FakeControlType ControlType=new FakeControlType();
}
public sealed class FakeElement {
  public FakeCurrent Current=new FakeCurrent(); public FakeElement Parent; public int RuntimeHandle;
  public int[] GetRuntimeId() { return new int[] { 42,RuntimeHandle!=0 ? RuntimeHandle : Current.NativeWindowHandle }; }
}
namespace System.Windows.Automation {
  public sealed class TreeWalker {
    public static TreeWalker RawViewWalker=new TreeWalker();
    public FakeElement GetParent(FakeElement element) { return element.Parent; }
  }
}
public static class NativeDragEnvironment {
  public sealed class WindowRecord {
    public long windowHandle,parentHandle,ancestorParentHandle;
    public bool owned=true; public string status="observed";
    public Dictionary<string,int> errors=new Dictionary<string,int>();
  }
  public static Dictionary<long,WindowRecord> Records=new Dictionary<long,WindowRecord>();
  public static List<long> Queries=new List<long>();
  public static object ShellFixture;
  public static int ShellQueries;
  public static object ExistingShell(IntPtr process,uint processId,long created,IntPtr window) { ShellQueries++; return ShellFixture; }
  public static WindowRecord Window(IntPtr handle,uint expectedProcess) {
    long id=handle.ToInt64(); Queries.Add(id);
    if (Records.ContainsKey(id)) return Records[id];
    return new WindowRecord { windowHandle=id,parentHandle=id+1,ancestorParentHandle=id+1 };
  }
}
"@
New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
function Assert($condition, [string]$message) { if (-not $condition) { throw $message } }
# Capture diagnostic host output so fixture process/module records cannot be
# mistaken for observations from the later real UIA application step.
$script:diagnosticLog = [System.Collections.Generic.List[string]]::new()
$script:failDiagnosticLog = $false
function Write-Host {
  param($Object)
  if ($script:failDiagnosticLog) { throw "simulated diagnostic reporting failure" }
  $script:diagnosticLog.Add([string]$Object)
}
function Node([int]$handle) { $node=[FakeElement]::new(); $node.Current.NativeWindowHandle=$handle; return $node }
function Native([long]$handle,[long]$parent,[long]$ancestor,[bool]$owned=$true) {
  $value=[NativeDragEnvironment+WindowRecord]::new()
  $value.windowHandle=$handle; $value.parentHandle=$parent; $value.ancestorParentHandle=$ancestor; $value.owned=$owned
  if (-not $owned) { $value.status="outside-owned-process" }
  [NativeDragEnvironment]::Records[$handle]=$value
  return $value
}

$leaf=Node 0; $leaf.Current.ClassName="NYCTronDragRegion"; $leaf.Parent=Node 101
Native 101 888 102 | Out-Null
Native 102 100 100 | Out-Null
Native 100 0 999 | Out-Null
Native 999 0 0 $false | Out-Null
$record=Get-DragInputSiteRecord $leaf 77
Assert ($record.inputSiteWindowHandle -eq 101 -and ($record.nativeAncestors.windowHandle -join ',') -eq '101,102,100,999') "Ancestry did not follow the observed GA_PARENT chain"
Assert ($record.nativeAncestors[0].parentHandle -eq 888 -and $record.status -eq 'outside-owned-process') "GetParent owner or foreign-process boundary was lost"
Assert (([NativeDragEnvironment]::Queries -join ',') -eq '101,102,100,999') "Queried beyond the foreign-process boundary"
Write-Output 'PASS: actual parent-only observations remain distinct from GetParent owner and stop outside the owned process'

[NativeDragEnvironment]::Records.Clear(); [NativeDragEnvironment]::Queries.Clear()
$record=Get-DragInputSiteRecord (Node 1) 77
Assert ($record.status -eq 'native-ancestor-limit' -and $record.nativeAncestors.Count -eq 16 -and [NativeDragEnvironment]::Queries.Count -eq 16) "Native ancestry exceeded the fixed visit cap"
[NativeDragEnvironment]::Queries.Clear()
$chain=Node 0; $chain.Current.ClassName='Panel'; $tail=$chain
for ($i=0; $i -lt 30; $i++) { $tail.Parent=Node 0; $tail.Parent.Current.ClassName='Panel'; $tail=$tail.Parent }
$record=Get-DragInputSiteRecord $chain 77
Assert ($record.status -eq 'uia-ancestor-limit' -and $record.uiaVisited -eq 24 -and [NativeDragEnvironment]::Queries.Count -eq 0) "UIA ancestry exceeded its cap or guessed an InputSite handle"
$runtimeOnly=Node 0; $runtimeOnly.RuntimeHandle=12345
$record=Get-DragInputSiteRecord $runtimeOnly 77
Assert ($record.status -eq 'input-site-not-found' -and [NativeDragEnvironment]::Queries.Count -eq 0) "A native handle was guessed from a UIA runtime ID"
Write-Output 'PASS: native and UIA ancestry caps terminate independently without guessing a native handle'

Native 101 102 102 | Out-Null; Native 102 101 101 | Out-Null
$record=Get-DragInputSiteRecord (Node 101) 77
Assert ($record.status -eq 'native-parent-cycle' -and $record.nativeAncestors.Count -eq 2) "Parent cycle was not retained and bounded"
$bad=Native 101 0 0; $bad.errors.Add('GetAncestorParent',5)
$record=Get-DragInputSiteRecord (Node 101) 77
Assert ($record.status -eq 'native-parent-query-failed' -and $record.nativeAncestors[0].errors['GetAncestorParent'] -eq 5) "Parent query failure became an empty successful chain"
Write-Output 'PASS: cycles and query failures stay explicit'

# Hash only the two selected files from the owned process's module collection.
# Known ASCII fixtures make the expected file-byte hashes independent of the
# diagnostic's hashing call; the unselected file does not exist.
$fixtures=Join-Path $OutputDirectory 'module-fixtures'
New-Item -ItemType Directory -Force $fixtures | Out-Null
$xamlFile=Join-Path $fixtures 'xaml-file.fixture'
$inputFile=Join-Path $fixtures 'input-file.fixture'
[System.IO.File]::WriteAllBytes($xamlFile, [System.Text.Encoding]::ASCII.GetBytes('abc'))
[System.IO.File]::WriteAllBytes($inputFile, [System.Text.Encoding]::ASCII.GetBytes('hello'))
$started=[DateTime]::Parse('2026-11-10T00:00:00Z').ToUniversalTime()
$expectedStarted=$started.ToString('o')
function Module([string]$basename,[string]$path) {
  return [pscustomobject]@{ ModuleName=$basename; FileName=$path; FileVersionInfo=[pscustomobject]@{ FileVersion='3.1.8.0'; ProductVersion='1.8.fixture' } }
}
$moduleProcess=[pscustomobject]@{ Id=77; HasExited=$false; StartTime=$started; RefreshCount=0; ExitAtRefresh=0; ModuleReads=0
  ModuleFixtures=@((Module 'Microsoft.UI.Xaml.dll' $xamlFile), (Module 'Microsoft.UI.Input.dll' $inputFile), (Module 'Unrelated.Private.dll' 'must-not-be-opened')) }
$moduleProcess | Add-Member ScriptProperty Modules { $this.ModuleReads++; return $this.ModuleFixtures }
$moduleProcess | Add-Member ScriptMethod Refresh { $this.RefreshCount++; if ($this.ExitAtRefresh -gt 0 -and $this.RefreshCount -ge $this.ExitAtRefresh) { $this.HasExited=$true } }
$modules=Get-DragModuleIdentityRecord $moduleProcess 77 $expectedStarted
Assert ($modules.status -eq 'queried' -and $modules.processStable -and $modules.modules.Count -eq 2) "Loaded module observation did not bind the original process"
Assert ($modules.modules[0].sha256 -eq 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' -and $modules.modules[1].sha256 -eq '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824') "Loaded module receipt did not hash exact selected file bytes"
$moduleJson=$modules | ConvertTo-Json -Depth 8
Assert (-not $moduleJson.Contains($fixtures) -and -not $moduleJson.Contains('Unrelated.Private.dll') -and $modules.identityKind -eq 'loaded-module-path-file') "Module identity retained personal paths/unrelated modules or misrepresented memory hashing"
$limited=Get-DragModuleFileDigest $inputFile 4
Assert ($limited.status -eq 'byte-limit' -and $limited.bytesRead -eq 5 -and -not $limited.ContainsKey('sha256')) "Module hashing exceeded its read cap or accepted a partial digest"
Write-Output 'PASS: only two selected loaded-module files are hashed with exact bytes, bounded reads and no retained paths'

$moduleProcess.ModuleReads=0
$modules=Get-DragModuleIdentityRecord $moduleProcess 78 $expectedStarted
Assert ($modules.status -eq 'owned-process-identity-unverified' -and $moduleProcess.ModuleReads -eq 0) "A mismatched PID exposed module paths"
$modules=Get-DragModuleIdentityRecord $moduleProcess 77 'wrong-start'
Assert ($modules.status -eq 'owned-process-identity-unverified' -and $moduleProcess.ModuleReads -eq 0) "A mismatched start time exposed module paths"
$moduleProcess.RefreshCount=0; $moduleProcess.ExitAtRefresh=2
$modules=Get-DragModuleIdentityRecord $moduleProcess 77 $expectedStarted
Assert ($modules.status -eq 'owned-process-changed' -and -not $modules.processStable -and $modules.modules.Count -eq 2) "Process exit during hashing was accepted as stable"
$moduleProcess.HasExited=$false; $moduleProcess.ExitAtRefresh=0
$moduleProcess.ModuleFixtures=@((Module 'Microsoft.UI.Xaml.dll' 'missing-owned-module-file'))
$modules=Get-DragModuleIdentityRecord $moduleProcess 77 $expectedStarted
Assert ($modules.modules[0].status -eq 'query-failed' -and $modules.modules[0].errorType -and $modules.modules[1].status -eq 'not-loaded') "Missing file/query failure was conflated with an unloaded module"
Write-Output 'PASS: PID/start/exit guards and per-module query errors remain explicit'


function ShellFixture {
  $observation = @{
    status='queried'; identityStable=$true; errors=@{}
    shellWindowHandle=100; shellWindowHandleAfter=100; shellProcessId=88; shellProcessIdAfter=88; shellThreadId=900; shellThreadIdAfter=900
    shellSecurity=@{ status='queried'; tokenCloseError=$null; fields=@{
      elevation=@{ status='observed'; value=0 }; integrityRid=@{ status='observed'; value=8192 }; uiAccess=@{ status='observed'; value=0 } } }
  }
  foreach ($name in @('shellToDriver','shellToApp')) {
    $observation[$name]=@{ status='queried'; identityStable=$true; errors=@{}; sameSession=$true
      leftSession=@{ status='observed'; value=3 }; rightSession=@{ status='observed'; value=3 }; sameUser=@{ status='observed'; value=$true } }
  }
  foreach ($name in @('appDesktop','driverDesktop','shellDesktop')) { $observation[$name]=@{ status='observed'; receivesInput=$true; threadId=900 } }
  return $observation
}
$eligible=Get-DragShellReviewEligibility (ShellFixture)
Assert ($eligible.eligibleForActivationReview -and $eligible.status -eq 'eligible-for-review' -and $eligible.purpose -eq 'eligibility-for-activation-review' -and $eligible.snapshotOnly -and $eligible.predicates.Count -eq 12) "A complete supported fixture lost its review-only scope"
foreach ($case in @('elevated','integrity','uiaccess','different-user','different-session','non-input-desktop','changed-identity','close-failure','missing-query','token-open-no-fields','no-shell','denied','unknown-session')) {
  $fixture=ShellFixture
  switch ($case) {
    'elevated' { $fixture.shellSecurity.fields.elevation.value=1; $fixture.shellToDriver.sameUser=@{ status='not-requested-unsupported-shell' }; $fixture.shellToApp.sameUser=@{ status='not-requested-unsupported-shell' } }
    'integrity' { $fixture.shellSecurity.fields.integrityRid.value=12288 }
    'uiaccess' { $fixture.shellSecurity.fields.uiAccess.value=1 }
    'different-user' { $fixture.shellToDriver.sameUser.value=$false }
    'different-session' { $fixture.shellToApp.sameSession=$false }
    'non-input-desktop' { $fixture.shellDesktop.receivesInput=$false }
    'changed-identity' { $fixture.identityStable=$false }
    'close-failure' { $fixture.errors=@{ shellProcessClose=6 } }
    'missing-query' { $fixture.shellSecurity.fields.elevation=@{ status='query-failed'; win32Error=5 } }
    'token-open-no-fields' { $fixture.shellSecurity=@{ status='token-open-failed'; fields=@{}; win32Error=5 } }
    'no-shell' { $fixture=@{ status='shell-absent'; identityStable=$false; errors=@{} } }
    'denied' { $fixture=@{ status='shell-process-open-failed'; identityStable=$false; errors=@{ shellProcessOpen=5 } } }
    'unknown-session' { $fixture.shellToDriver.sameSession=$null }
  }
  $review=Get-DragShellReviewEligibility $fixture
  Assert (-not $review.eligibleForActivationReview -and $review.status -ne 'eligible-for-review') "Unsupported or unknown shell fixture became eligible: $case"
  if ($case -in @('no-shell','denied','missing-query','token-open-no-fields','unknown-session')) {
    Assert (@($review.predicates | Where-Object { -not $_.observed }).Count -gt 0) "Unavailable observation was reported as a fully known predicate: $case"
  }
}
$review=Get-DragShellReviewEligibility $null
Assert (-not $review.eligibleForActivationReview -and $review.status -eq 'observation-incomplete') "An absent observation became an eligible shell"
Write-Output 'PASS: shell review eligibility requires every observed identity, scalar, user/session and input-desktop predicate'

$ownedShellProcess=[pscustomobject]@{ Id=77; HasExited=$false; StartTime=$started; Handle=[IntPtr]1234; RefreshCount=0 }
$ownedShellProcess | Add-Member ScriptMethod Refresh { $this.RefreshCount++ }
[NativeDragEnvironment]::ShellFixture=ShellFixture
[NativeDragEnvironment]::ShellQueries=0
$shellRecord=Get-DragExistingShellRecord $ownedShellProcess 78 $expectedStarted ([IntPtr]500)
Assert ($shellRecord.status -eq 'owned-process-identity-unverified' -and [NativeDragEnvironment]::ShellQueries -eq 0) "Shell observation bypassed the app PID guard"
$shellRecord=Get-DragExistingShellRecord $ownedShellProcess 77 'different-start' ([IntPtr]500)
Assert ($shellRecord.status -eq 'owned-process-identity-unverified' -and [NativeDragEnvironment]::ShellQueries -eq 0) "Shell observation bypassed the app creation guard"
$ownedShellProcess.HasExited=$true
$shellRecord=Get-DragExistingShellRecord $ownedShellProcess 77 $expectedStarted ([IntPtr]500)
Assert ($shellRecord.status -eq 'owned-process-identity-unverified' -and [NativeDragEnvironment]::ShellQueries -eq 0) "Shell observation queried after app exit"
$ownedShellProcess.HasExited=$false
$shellRecord=Get-DragExistingShellRecord $ownedShellProcess 77 $expectedStarted ([IntPtr]500)
Assert ($shellRecord.review.eligibleForActivationReview -and [NativeDragEnvironment]::ShellQueries -eq 1 -and $shellRecord.userDataRetained -eq 'equality-only') "Verified app fixture did not reach the bounded native observation"
$shellRecord.observation.privateFixture='DO-NOT-LOG-SHELL'
$shellRecord.observation.shellSecurity.fields.elevation.privateFixture='DO-NOT-LOG-TOKEN'
$shellRecord.observation.shellToDriver.sameUser.privateFixture='DO-NOT-LOG-SID'
$shellRecord.observation.shellToDriver.privateFixture='DO-NOT-LOG-COMPARISON'
$shellRecord.observation.shellDesktop.privateFixture='DO-NOT-LOG-DESKTOP'
$script:shellSummaryFixture=$shellRecord
$selectedShell=Select-DragLogShell (($shellRecord | ConvertTo-Json -Depth 12) | ConvertFrom-Json)
$selectedJson=$selectedShell | ConvertTo-Json -Depth 12 -Compress
Assert (-not $selectedJson.Contains('DO-NOT-LOG') -and $selectedShell.observation.shellToDriver.sameUser.value -and $selectedShell.observation.shellToDriver.leftSession.value -eq 3 -and $selectedShell.observation.shellDesktop.receivesInput -and $selectedShell.review.predicates.Count -eq 12) "Shell summary lost necessary equality/session/input fields or leaked unlisted data"
Write-Output 'PASS: shell observation binds the existing app identity and emits only selected equality/session/native fields'

function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) {
  return [ordered]@{ schemaVersion=1; diagnosticOnly=$true; status='queried'; processId=77
    security=@{ status='token-open-failed'; win32Error=5 }; enableLua=@{ status='value-absent' } }
}
Save-DragEnvironmentRecord 1 $null $null $OutputDirectory
$path=Join-Path $OutputDirectory 'drag-environment-01.json'
$original=(Get-FileHash $path -Algorithm SHA256).Hash
$saved=Get-Content -Raw $path | ConvertFrom-Json
Assert ($saved.security.win32Error -eq 5 -and $saved.enableLua.status -eq 'value-absent' -and $saved.attempt -eq 1) "Original unavailable/query-error evidence was lost"
function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) { throw 'diagnostic query failed' }
$markersBefore = @($script:diagnosticLog | Where-Object { $_ -eq "NYCTRON_DRAG_ENVIRONMENT_BEGIN" }).Count
Save-DragEnvironmentRecord 1 $null $null $OutputDirectory
Assert ((Get-FileHash $path -Algorithm SHA256).Hash -eq $original) "A duplicate observation overwrote original bytes"
Assert (@($script:diagnosticLog | Where-Object { $_ -eq "NYCTRON_DRAG_ENVIRONMENT_BEGIN" }).Count -eq $markersBefore) "A failed CreateNew logged a fresh replacement as the original"
Save-DragEnvironmentRecord 2 $null $null $OutputDirectory
$saved=Get-Content -Raw (Join-Path $OutputDirectory 'drag-environment-02.json') | ConvertFrom-Json
Assert ($saved.status -eq 'query-failed' -and $saved.errorType -and $saved.diagnosticOnly) "Unexpected query error prevented a diagnostic receipt"
Write-Output 'PASS: first receipt bytes survive duplicate calls and query failures remain evidence'

# A large omitted section must not hide the essential, bounded summary. These
# are synthetic fixture records; the overridden Write-Host keeps them off CI's
# native observation stream while the assertions examine the exact output.
$script:topologyFixture = @(1..20 | ForEach-Object {
  @{ windowHandle=(600 + $_); parentHandle=700; ancestorParentHandle=500; rootHandle=500; processId=77; exists=$true; owned=$true; status='observed'
    className=$(if ($_ -eq 20) { 'InputSiteWindowClass' } else { 'FixtureChild' }); errors=@{ GetWindowRect=5 }; privateFixture='DO-NOT-LOG-CHILD' }
})
$script:topologyRoot = @{ windowHandle=500; parentHandle=999; ancestorParentHandle=0; rootHandle=500; processId=77; exists=$true; owned=$true; status='observed'; className='FixtureRoot'; errors=@{} }
function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) {
  return [ordered]@{ schemaVersion=1; diagnosticOnly=$true; status='queried'; processId=77
    privateFixture='DO-NOT-LOG-ROOT'; existingShell=$script:shellSummaryFixture
    security=@{ status='queried'; fields=@{ elevation=@{ status='observed'; value=1; privateFixture='DO-NOT-LOG-FIELD' } } }
    source=@{ status='input-site-not-found'; uiaVisited=2 }; target=@{ status='input-site-not-found'; uiaVisited=2 }
    mainChildren=@{ status='completed'; limit=128; visited=20; limitReached=$false; root=$script:topologyRoot; rootAfter=$script:topologyRoot; children=$script:topologyFixture; omittedFixture=('x' * 40000) }
    documentChildren=@{ status='completed'; limit=128; visited=1; limitReached=$false; root=$script:topologyRoot; rootAfter=$script:topologyRoot; children=@($script:topologyFixture[19]) } }
}
$script:diagnosticLog.Clear()
Save-DragEnvironmentRecord 3 $null $null $OutputDirectory
$summaryPath=Join-Path $OutputDirectory 'drag-environment-03.json'
$lines=$script:diagnosticLog.ToArray()
Assert ($lines.Count -eq 3 -and $lines[0] -eq 'NYCTRON_DRAG_ENVIRONMENT_BEGIN' -and $lines[2] -eq 'NYCTRON_DRAG_ENVIRONMENT_END') "Readback did not produce one complete delimited JSON summary"
$summary=$lines[1] | ConvertFrom-Json
$logBytes=[System.Text.Encoding]::UTF8.GetByteCount(($lines -join '')) + 6
Assert ($summary.status -eq 'summary' -and $logBytes -le 32768 -and $summary.originalBytes -gt 32768) "Full original size incorrectly suppressed or overflowed the essential summary"
Assert ($summary.originalSha256 -eq (Get-FileHash $summaryPath -Algorithm SHA256).Hash.ToLowerInvariant()) "Readback hash did not bind the closed original file bytes"
Assert ($summary.summary.security.fields.elevation.value -eq 1 -and $summary.omittedOriginalSections -contains 'source.uiaAncestors' -and $summary.compactedOriginalSections -contains 'mainChildren' -and -not $lines[1].Contains('DO-NOT-LOG')) "Summary lost required fields, omission labels or its field allowlist"
Assert ($summary.summary.existingShell.review.eligibleForActivationReview -and $summary.summary.existingShell.observation.shellToDriver.sameUser.value -and $summary.summary.existingShell.observation.shellDesktop.receivesInput) "The bounded original-file summary lost shell review observations"
$topology=$summary.summary.mainChildren
Assert ($summary.summary.source.status -eq 'input-site-not-found' -and $topology.summaryLimit -eq 16 -and $topology.originalChildCount -eq 20 -and $topology.selectedChildCount -eq 16 -and $topology.omittedChildCount -eq 4 -and $topology.omittedChildren) "A zero UIA handle lost the bounded native topology or its omission counts"
Assert ($topology.selection -eq 'owned-children-first-then-enumeration' -and $topology.children[0].windowHandle -eq 601 -and $topology.children[0].className -eq 'FixtureChild' -and $topology.children[0].parentHandle -eq 700 -and $topology.children[0].ancestorParentHandle -eq 500 -and $topology.children[0].rootHandle -eq 500 -and $topology.children[0].owned -and $topology.children[0].errors.GetWindowRect -eq 5) "Compacted topology lost observed native relationships, query errors or native enumeration order"
Assert ($topology.root.parentHandle -eq 999 -and $topology.root.ancestorParentHandle -eq 0 -and $summary.summary.documentChildren.selectedChildCount -eq 1 -and -not $summary.summary.documentChildren.omittedChildren) "Owned-root identity or independent document child topology was lost"

function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) {
  return [ordered]@{ schemaVersion=1; diagnosticOnly=$true; status='queried'; processId=77
    source=@{ status='observed'; inputSiteWindowHandle=101; nativeAncestors=@(@{ windowHandle=101; className=('z' * 40000) }) } }
}
$script:diagnosticLog.Clear()
Save-DragEnvironmentRecord 4 $null $null $OutputDirectory
$summary=$script:diagnosticLog[1] | ConvertFrom-Json
Assert ($script:diagnosticLog.Count -eq 3 -and $summary.status -eq 'omitted-over-log-limit' -and $null -eq $summary.summary -and $summary.originalSha256) "Oversized summary became malformed JSON or an implied complete record"
Assert (([System.Text.Encoding]::UTF8.GetByteCount(($script:diagnosticLog.ToArray() -join '')) + 6) -le 32768) "Over-limit summary exceeded its own emission budget"

function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) { return [ordered]@{ schemaVersion=1; status='queried'; diagnosticOnly=$true } }
$script:diagnosticLog.Clear(); $script:failDiagnosticLog=$true
try { Save-DragEnvironmentRecord 5 $null $null $OutputDirectory }
finally { $script:failDiagnosticLog=$false }
$saved=Get-Content -Raw (Join-Path $OutputDirectory 'drag-environment-05.json') | ConvertFrom-Json
Assert ($saved.status -eq 'queried' -and $script:diagnosticLog.Count -eq 0) "Reporting failure escaped or changed the original receipt"
Write-Output 'PASS: bounded valid summary/hash/omission output and reporting failures preserve original receipts'

function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) { return [ordered]@{ oversized=('x' * 262145) } }
Save-DragEnvironmentRecord 6 $null $null $OutputDirectory
Save-DragEnvironmentRecord 9 $null $null $OutputDirectory
Assert (-not (Test-Path (Join-Path $OutputDirectory 'drag-environment-06.json')) -and -not (Test-Path (Join-Path $OutputDirectory 'drag-environment-09.json'))) "Diagnostic byte or attempt budget was exceeded"
function Get-DragEnvironmentRecord($endpoints,$nativeProcess,$expectedStartedAt) { return [ordered]@{ schemaVersion=1; status='queried'; diagnosticOnly=$true } }
Save-DragEnvironmentRecord 7 $null $null $path
Assert ((Get-FileHash $path -Algorithm SHA256).Hash -eq $original) "Failed destination affected the original receipt"
Write-Output 'PASS: byte/attempt limits and write failures preserve original evidence without throwing'
Write-Output "All ten portable environment regressions passed. Actual Windows queries remain unexecuted by these mocks. Receipts: $OutputDirectory"
