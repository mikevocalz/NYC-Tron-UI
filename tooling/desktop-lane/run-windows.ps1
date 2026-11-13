# Launches the deployed RNW 0.85 coverage harness app and reads its results
# through UI Automation (gate T4). Windows PowerShell 5.1 x64.
# The harness publishes a status element and result chunks as accessible views:
# testID becomes the UIA AutomationId and accessibilityLabel becomes Name.
param(
  [Parameter(Mandatory = $true)][string]$AppUserModelId,
  [Parameter(Mandatory = $true)][string]$ProcessName,
  [Parameter(Mandatory = $true)][string]$OutDir
)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes
$AE = [System.Windows.Automation.AutomationElement]
$Tree = [System.Windows.Automation.TreeScope]
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$run = [ordered]@{ schema = 1; lane = "windows"; startedAt = [DateTime]::UtcNow.ToString("o"); status = "running"; lastProgress = $null }
function Save-Run { $run | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $OutDir "run.json") }
function Find-Id($root, [string]$id) {
  $condition = New-Object System.Windows.Automation.PropertyCondition($AE::AutomationIdProperty, $id)
  return $root.FindFirst($Tree::Descendants, $condition)
}
$process = $null
try {
  Start-Process "shell:AppsFolder\$AppUserModelId"
  $deadline = (Get-Date).AddSeconds(60)
  while ((Get-Date) -lt $deadline -and $null -eq $process) {
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($null -eq $process) { Start-Sleep -Milliseconds 250 }
  }
  if ($null -eq $process) { throw "Process '$ProcessName' did not start within 60 s" }
  $null = $process.Handle
  $processCondition = New-Object System.Windows.Automation.PropertyCondition($AE::ProcessIdProperty, $process.Id)
  $window = $null
  $deadline = (Get-Date).AddSeconds(120)
  while ((Get-Date) -lt $deadline -and $null -eq $window) {
    if ($process.HasExited) { throw "App exited before showing a window (exit $($process.ExitCode))" }
    foreach ($candidate in $AE::RootElement.FindAll($Tree::Children, $processCondition)) {
      $pattern = $null
      if ($candidate.TryGetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern, [ref]$pattern)) { $window = $candidate; break }
    }
    if ($null -eq $window) { Start-Sleep -Milliseconds 500 }
  }
  if ($null -eq $window) { throw "No app window within 120 s" }
  $status = $null
  $deadline = (Get-Date).AddMinutes(20)
  while ($true) {
    if ($process.HasExited) { throw "App exited during the run (exit $($process.ExitCode)); last progress $($run.lastProgress)" }
    $element = Find-Id $window "tron-ui-coverage-status"
    if ($null -ne $element) {
      $status = $element.Current.Name
      if ($status.StartsWith("done:")) { break }
      if ($status -ne $run.lastProgress) { $run.lastProgress = $status; $run.lastProgressAt = [DateTime]::UtcNow.ToString("o"); Save-Run }
    }
    if ((Get-Date) -gt $deadline) { throw "Harness did not finish within 20 minutes; last progress $($run.lastProgress)" }
    Start-Sleep -Seconds 1
  }
  $chunks = [int]($status.Split(":")[-1])
  if ($chunks -lt 1) { throw "Malformed final status $status" }
  $builder = New-Object System.Text.StringBuilder
  for ($i = 0; $i -lt $chunks; $i++) {
    $chunk = Find-Id $window "tron-ui-coverage-chunk-$i"
    if ($null -eq $chunk) { throw "Missing result chunk $i of $chunks" }
    [void]$builder.Append($chunk.Current.Name)
  }
  $payload = $builder.ToString()
  $null = $payload | ConvertFrom-Json
  [System.IO.File]::WriteAllText((Join-Path $OutDir "results.json"), $payload, (New-Object System.Text.UTF8Encoding($false)))
  $run.status = "completed"; $run.finalStatus = $status
} catch {
  $run.status = "harness-failed"; $run.error = $_.Exception.Message
  Save-Run
  throw
} finally {
  $run.finishedAt = [DateTime]::UtcNow.ToString("o")
  if ($null -ne $process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
  Save-Run
}
Write-Host "Windows coverage run $($run.status)"
