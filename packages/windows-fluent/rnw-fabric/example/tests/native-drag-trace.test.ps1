# Portable filesystem checks of the actual trace-retention helper. AppX lookup
# is mocked; this does not execute Win32, native tracing or PowerShell 5.1.
param([string]$OutputDirectory = (Join-Path ([System.IO.Path]::GetTempPath()) ("nyctron-drag-trace-" + [Guid]::NewGuid().ToString("N"))))
$ErrorActionPreference = "Stop"
. "$PSScriptRoot/../scripts/uia-native-drag-trace.ps1"
New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
$script:traceSource = Join-Path $OutputDirectory "original.jsonl"
function Resolve-NativeDragTracePath([string]$AppUserModelId, [int]$OwnedProcessId) { return $script:traceSource }
function Assert($condition, [string]$message) { if (-not $condition) { throw $message } }
function Write-Trace([int]$ObservedProcessId = 77) {
  $header = @{ schemaVersion=1; stage="trace-enabled"; processId=$ObservedProcessId; recordLimit=512; byteLimit=262144; sequence=0 }
  [string[]]$lines = @((ConvertTo-Json -InputObject $header -Compress), '{"stage":"target-over","formatPresent":true,"noncePropertyPresent":false,"sequence":1}')
  [System.IO.File]::WriteAllLines($script:traceSource, $lines, [System.Text.UTF8Encoding]::new($false))
}
function Receipt { Get-Content -LiteralPath (Join-Path $OutputDirectory "native-drag-trace-receipt.json") -Raw | ConvertFrom-Json }

Write-Trace
$originalHash = (Get-FileHash -LiteralPath $script:traceSource -Algorithm SHA256).Hash.ToLowerInvariant()
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $true
$receipt = Receipt
Assert ($receipt.status -eq "copied" -and $receipt.headerVerified -and $receipt.originalRemoved) "Verified owned trace was not retained and cleaned"
Assert ($receipt.sha256 -eq $originalHash -and $receipt.originalSha256Before -eq $originalHash -and $receipt.originalSha256After -eq $originalHash) "Original trace bytes were not hash-bound"
Assert (-not (Test-Path -LiteralPath $script:traceSource)) "Verified stopped-process trace was not cleaned"
Assert ($receipt.records -eq 2 -and @($receipt.stages | Where-Object { $_.stage -eq "trace-enabled" -and $_.count -eq 1 }).Count -eq 1) "Original trace records were not observed"
Write-Output "PASS: original JSONL bytes retained, hashes bound, stopped owned source cleaned"

Write-Trace
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $false
$receipt = Receipt
Assert ($receipt.status -eq "copied" -and $receipt.headerVerified -and -not $receipt.originalRemoved -and (Test-Path -LiteralPath $script:traceSource)) "Live process trace was removed"
Write-Output "PASS: still-live process retains its original trace state"

Write-Trace 88
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $true
$receipt = Receipt
Assert ($receipt.status -eq "copied-unverified" -and $receipt.reason -eq "native-header-does-not-match-owned-process" -and -not $receipt.originalRemoved) "Mismatched PID trace was treated as owned"
Assert (Test-Path -LiteralPath $script:traceSource) "Mismatched PID source was removed"
Write-Output "PASS: mismatched process header remains unverified and untouched"

[System.IO.File]::WriteAllText($script:traceSource, ('x' * 262145))
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $true
$receipt = Receipt
Assert ($receipt.status -eq "unavailable" -and $receipt.reason -eq "native-byte-budget-exceeded" -and -not $receipt.originalRemoved) "Oversized trace bypassed retention budget"
Assert (Test-Path -LiteralPath $script:traceSource) "Oversized source was removed"
Write-Output "PASS: unexpected oversized trace is refused without removal"

[System.IO.File]::WriteAllText($script:traceSource, '{not-json')
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $true
$receipt = Receipt
Assert ($receipt.status -eq "copied-unverified" -and $receipt.reason -eq "native-trace-retention-error" -and -not $receipt.originalRemoved) "Malformed original was lost or interpreted as verified"
Assert (Test-Path -LiteralPath $script:traceSource) "Malformed source was removed"
Write-Output "PASS: malformed original bytes survive diagnostic parsing failure"

Remove-Item -LiteralPath $script:traceSource
Save-NativeDragTrace "OwnedPackage!App" 77 $OutputDirectory $true
$receipt = Receipt
Assert ($receipt.status -eq "unavailable" -and $receipt.reason -eq "native-file-absent") "Absent trace was not distinguished from an empty event stream"
Write-Output "PASS: absent trace is recorded without inventing a no-event result"
