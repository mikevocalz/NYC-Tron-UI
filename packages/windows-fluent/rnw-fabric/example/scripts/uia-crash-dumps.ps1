# App-scoped Windows Error Reporting diagnostics. One mini dump, no debugger or
# runner dependency, with the original registry values restored after the test.
function Enable-OwnedCrashDump([string]$appName, [string]$directory) {
  $state = @{ appName = $appName; directory = $directory; enabled = $false; restore = $false; restored = $false; values = @{} }
  $key = $null
  try {
    if ($appName -notmatch '^[A-Za-z0-9_.-]+\.exe$') { throw "Crash capture requires one executable basename" }
    $state.path = "SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps\$appName"
    $key = [Microsoft.Win32.Registry]::LocalMachine.OpenSubKey($state.path)
    $state.existed = $null -ne $key
    foreach ($name in @("DumpFolder", "DumpType", "DumpCount")) {
      $exists = $null -ne $key -and $key.GetValueNames() -contains $name
      $state.values[$name] = @{ exists = $exists }
      if ($exists) {
        $state.values[$name].value = $key.GetValue($name, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
        $state.values[$name].kind = $key.GetValueKind($name)
      }
    }
    if ($null -ne $key) { $key.Dispose(); $key = $null }
    [System.IO.Directory]::CreateDirectory($directory) | Out-Null
    $key = [Microsoft.Win32.Registry]::LocalMachine.CreateSubKey($state.path)
    $state.restore = $true
    $key.SetValue("DumpFolder", [System.IO.Path]::GetFullPath($directory), [Microsoft.Win32.RegistryValueKind]::ExpandString)
    $key.SetValue("DumpType", 1, [Microsoft.Win32.RegistryValueKind]::DWord)
    $key.SetValue("DumpCount", 1, [Microsoft.Win32.RegistryValueKind]::DWord)
    $state.enabled = $true
  } catch { $state.error = $_.Exception.Message }
  finally { if ($null -ne $key) { $key.Dispose() } }
  Write-Host "App-scoped WER mini dump enabled=$($state.enabled) for $appName; $($state.error)"
  return $state
}

function Restore-OwnedCrashDump($state) {
  if ($null -eq $state -or -not $state.restore) { return }
  $key = $null
  try {
    $key = [Microsoft.Win32.Registry]::LocalMachine.OpenSubKey($state.path, $true)
    if ($null -eq $key) { throw "The diagnostic registry key disappeared before restoration" }
    foreach ($name in @("DumpFolder", "DumpType", "DumpCount")) {
      $before = $state.values[$name]
      if ($before.exists) { $key.SetValue($name, $before.value, $before.kind) }
      else { $key.DeleteValue($name, $false) }
    }
    $removeCreatedKey = -not $state.existed -and $key.ValueCount -eq 0 -and $key.SubKeyCount -eq 0
    $key.Dispose(); $key = $null
    if ($removeCreatedKey) { [Microsoft.Win32.Registry]::LocalMachine.DeleteSubKey($state.path, $false) }
    $state.restored = $true
  } catch { $state.restoreError = $_.Exception.Message }
  finally { if ($null -ne $key) { $key.Dispose() } }
  Write-Host "App-scoped WER settings restored=$($state.restored); $($state.restoreError)"
}

function Save-CrashDumpReceipt($state, [string]$outDir, [int]$ownedProcessId) {
  if ($null -eq $state) { return }
  $dumps = @()
  if ($ownedProcessId -gt 0 -and (Test-Path -LiteralPath $state.directory)) {
    # WER names local dumps <executable>.<PID>.dmp. Keep the observed process
    # identity separate from the executable-wide registry setting.
    $dumps = @(Get-ChildItem -LiteralPath $state.directory -Filter "$($state.appName).$ownedProcessId.dmp" -File |
      Select-Object -First 1 | ForEach-Object { @{ filename = $_.Name; bytes = $_.Length; sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() } })
  }
  @{ appName = $state.appName; processId = $ownedProcessId; dumpType = 1; dumpCount = 1; enabled = $state.enabled; setupError = $state.error; restored = $state.restored; restoreError = $state.restoreError; dumps = $dumps } |
    ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $outDir "crash-capture.json")
}
