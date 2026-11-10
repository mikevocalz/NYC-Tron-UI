# Copy only this packaged app's PID-named native diagnostic file. The app writes
# no document, nonce or token values. Its native writer is disabled by default
# and the acceptance fixture enables it for the connected desktop session.
function Resolve-NativeDragTracePath([string]$AppUserModelId, [int]$OwnedProcessId) {
  $parts = $AppUserModelId.Split('!')
  if ($parts.Count -ne 2 -or $parts[0] -notmatch '^[A-Za-z0-9_.-]+$' -or [string]::IsNullOrEmpty($parts[1]) -or $OwnedProcessId -le 0) {
    throw "Invalid owned application identity for native drag trace"
  }
  $family = $parts[0]
  $packages = @(Get-AppxPackage | Where-Object { $_.PackageFamilyName -eq $family })
  if ($packages.Count -ne 1) { throw "Owned application package could not be resolved" }
  return Join-Path $env:LOCALAPPDATA "Packages\$family\LocalState\nyctron-native-drag-$OwnedProcessId.jsonl"
}

function Save-NativeDragTrace([string]$AppUserModelId, [int]$OwnedProcessId, [string]$OutDir, [bool]$ProcessStopped) {
  $receipt = [ordered]@{
    schemaVersion = 1
    capturedAt = [DateTime]::UtcNow.ToString("o")
    sourceRevision = $env:GITHUB_SHA
    processId = $OwnedProcessId
    processStopped = $ProcessStopped
    status = "unavailable"
    recordLimit = 512
    byteLimit = 262144
    originalRemoved = $false
    headerVerified = $false
  }
  try {
    $source = Resolve-NativeDragTracePath $AppUserModelId $OwnedProcessId
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
      $receipt.reason = "native-file-absent"
      return
    }
    $original = Get-Item -LiteralPath $source
    $receipt.bytes = $original.Length
    if ($original.Length -gt $receipt.byteLimit) {
      $receipt.reason = "native-byte-budget-exceeded"
      return
    }
    $before = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
    $destination = Join-Path $OutDir "native-drag-trace.jsonl"
    Copy-Item -LiteralPath $source -Destination $destination -Force
    $copied = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
    $after = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
    $receipt.filename = "native-drag-trace.jsonl"
    $receipt.originalSha256Before = $before
    $receipt.originalSha256After = $after
    $receipt.sha256 = $copied
    if ($before -ne $copied -or $after -ne $copied) {
      $receipt.status = "copy-unverified"
      $receipt.reason = "native-file-changed-during-copy"
      return
    }
    $receipt.status = "copied-unverified"
    $lines = [System.IO.File]::ReadAllLines($destination, [System.Text.Encoding]::UTF8)
    $receipt.records = $lines.Count
    if ($lines.Count -eq 0 -or $lines.Count -gt $receipt.recordLimit) {
      $receipt.reason = "invalid-native-record-count"
      return
    }
    $records = @($lines | ForEach-Object { $_ | ConvertFrom-Json })
    $header = $records[0]
    if ($header.stage -ne "trace-enabled" -or $header.schemaVersion -ne 1 -or $header.processId -ne $OwnedProcessId -or
        $header.recordLimit -ne $receipt.recordLimit -or $header.byteLimit -ne $receipt.byteLimit) {
      $receipt.reason = "native-header-does-not-match-owned-process"
      return
    }
    $receipt.headerVerified = $true
    $receipt.status = "copied"
    $receipt.truncated = @($records | Where-Object { $_.stage -eq "trace-limit" }).Count -gt 0
    $receipt.recordError = @($records | Where-Object { $_.stage -eq "trace-error" }).Count -gt 0
    $receipt.stages = @($records | Group-Object -Property stage | ForEach-Object { [ordered]@{ stage = $_.Name; count = $_.Count } })
    # Bind the original JSONL bytes through this JSON receipt, which is also
    # included in the passed-package evidence hash manifest.
    if ($ProcessStopped) {
      Remove-Item -LiteralPath $source
      $receipt.originalRemoved = $true
    }
  } catch {
    # Keep any copied original bytes and the primary UIA ErrorRecord. A parser,
    # copy or cleanup failure is diagnostic evidence, never a replacement gate.
    $receipt.reason = "native-trace-retention-error"
    $receipt.errorType = $_.Exception.GetType().FullName
  } finally {
    $receipt | ConvertTo-Json -Depth 6 | Set-Content -Path (Join-Path $OutDir "native-drag-trace-receipt.json") -Encoding UTF8
  }
}
