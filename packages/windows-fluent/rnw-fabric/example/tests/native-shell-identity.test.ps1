# Required Windows PowerShell 5.1 checks of the actual query-only token path.
# This process is the observed compatibility subject, not the later UIA app.
param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSEdition -ne "Desktop" -or $PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1 -or -not [Environment]::Is64BitProcess) {
  throw "Native shell identity checks require Windows PowerShell 5.1 x64"
}
. "$PSScriptRoot/../scripts/uia-drag-environment.ps1"
Initialize-DragEnvironmentReader
New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
$receipt=[ordered]@{ schemaVersion=1; sourceRevision=$env:GITHUB_SHA; scope="compatibility-process"; status="running"
  capturedAt=[DateTime]::UtcNow.ToString("o"); comparison=$null; mismatchGuard=$null; missingWindow=$null
  checks=[System.Collections.Generic.List[string]]::new() }
$process=[System.Diagnostics.Process]::GetCurrentProcess()
$buffer=[IntPtr]::Zero
$primaryFailure=$null
function Assert-Native($condition,[string]$message) { if (-not $condition) { throw $message } }
try {
  $handle=$process.Handle
  $owner=[uint32]$process.Id
  $comparison=[NativeDragEnvironment]::CompareProcessIdentity($handle,$owner,$handle,$owner,$true)
  $receipt.comparison=$comparison
  Assert-Native ($comparison.status -eq "queried" -and $comparison.identityStable -and $comparison.errors.Count -eq 0) "Actual self-process user/session query failed"
  Assert-Native ($comparison.sameUser.status -eq "observed" -and $comparison.sameUser.value -eq $true -and $comparison.sameSession -eq $true) "Actual independently queried self tokens did not compare equal"
  Assert-Native ($comparison.leftSession.status -eq "observed" -and $comparison.rightSession.status -eq "observed" -and $null -ne $comparison.leftSession.value -and $null -ne $comparison.rightSession.value) "Actual TokenSessionId values are unavailable"
  $receipt.checks.Add("actual-self-token-user-and-session-equality")
  Write-Host "PASS: actual owned Windows token user equality and session observations without retained SID data"

  $wrong=[NativeDragEnvironment]::CompareProcessIdentity($handle,($owner+1),$handle,$owner,$true)
  $receipt.mismatchGuard=@{ status=$wrong.status; leftStatus=$wrong.leftBefore.status; sameUserStatus=$wrong.sameUser.status
    sessionWasRead=$null -ne $wrong.leftSession -or $null -ne $wrong.rightSession }
  Assert-Native ($wrong.status -eq "process-identity-unverified" -and $wrong.leftBefore.status -eq "process-handle-mismatch" -and $null -eq $wrong.leftSession -and $null -eq $wrong.rightSession -and $wrong.sameUser.status -eq "unavailable") "Mismatched expected PID reached a token read"
  $stillUsable=[NativeDragEnvironment]::Security($handle,$owner)
  Assert-Native ($stillUsable.status -eq "queried" -and $null -eq $stillUsable.tokenCloseError) "Token comparison closed the borrowed process handle"
  $withoutWindow=Get-DragExistingShellRecord $process $owner ($process.StartTime.ToUniversalTime().ToString("o")) ([IntPtr]::Zero)
  $receipt.missingWindow=@{ status=$withoutWindow.status; eligibleForActivationReview=$withoutWindow.review.eligibleForActivationReview
    shellWindowHandle=$withoutWindow.observation.shellWindowHandle }
  Assert-Native ($withoutWindow.status -eq "app-window-unverified" -and -not $withoutWindow.review.eligibleForActivationReview -and $withoutWindow.observation.shellWindowHandle -eq 0) "An unverified app window reached shell observation or became eligible"
  $receipt.checks.Add("actual-borrowed-handle-and-missing-window-guards")
  Write-Host "PASS: actual borrowed-handle ownership and missing app-window guards"

  # Exercise the production bounds check with deliberately malformed buffers.
  # Only fixed synthetic bytes are used; none are emitted or retained.
  $method=[NativeDragEnvironment].GetMethod("BoundedUserSid", ([System.Reflection.BindingFlags]::NonPublic -bor [System.Reflection.BindingFlags]::Static))
  Assert-Native ($null -ne $method) "Production user-buffer validator is unavailable"
  $buffer=[System.Runtime.InteropServices.Marshal]::AllocHGlobal(64)
  $zeros=[byte[]]::new(64)
  [System.Runtime.InteropServices.Marshal]::Copy($zeros,0,$buffer,64)
  $header=[IntPtr]::Size * 2
  $sid=[IntPtr]::Add($buffer,$header)
  function Invoke-BoundedSid([uint32]$actual) {
    $arguments=[object[]]@($buffer,$actual,[IntPtr]::Zero)
    $accepted=[bool]$method.Invoke($null,$arguments)
    return @{ accepted=$accepted; returnedPointer=$arguments[2] -ne [IntPtr]::Zero }
  }
  Assert-Native (-not (Invoke-BoundedSid 28).accepted) "Null SID pointer was accepted"
  [System.Runtime.InteropServices.Marshal]::WriteIntPtr($buffer,$sid)
  $valid=[byte[]]@(1,1,0,0,0,0,0,5,18,0,0,0)
  [System.Runtime.InteropServices.Marshal]::Copy($valid,0,$sid,$valid.Length)
  $bounded=Invoke-BoundedSid ([uint32]($header+12))
  Assert-Native ($bounded.accepted -and $bounded.returnedPointer) "A bounded valid SID fixture was rejected"
  Assert-Native (-not (Invoke-BoundedSid ([uint32]($header+7))).accepted) "Truncated SID header was accepted"
  Assert-Native (-not (Invoke-BoundedSid 4097).accepted) "An over-cap token buffer was accepted"
  [System.Runtime.InteropServices.Marshal]::WriteByte($sid,1,15)
  Assert-Native (-not (Invoke-BoundedSid ([uint32]($header+12))).accepted) "Truncated subauthority data reached SID validation"
  [System.Runtime.InteropServices.Marshal]::WriteByte($sid,1,0)
  Assert-Native ((Invoke-BoundedSid ([uint32]($header+8))).accepted) "Generic SID validation incorrectly required a nonzero subauthority count"
  [System.Runtime.InteropServices.Marshal]::WriteIntPtr($buffer,$buffer)
  Assert-Native (-not (Invoke-BoundedSid 28).accepted) "A SID pointer overlapping TOKEN_USER was accepted"
  [System.Runtime.InteropServices.Marshal]::WriteIntPtr($buffer,[IntPtr]::Add($buffer,63))
  Assert-Native (-not (Invoke-BoundedSid 28).accepted) "An out-of-range SID pointer was accepted"
  [System.Runtime.InteropServices.Marshal]::WriteIntPtr($buffer,$sid)
  [System.Runtime.InteropServices.Marshal]::WriteByte($sid,0,0)
  Assert-Native (-not (Invoke-BoundedSid ([uint32]($header+8))).accepted) "Invalid SID revision was accepted"
  $receipt.checks.Add("bounded-user-buffer-validation")
  Write-Host "PASS: actual production SID bounds reject null, overlapping, truncated, oversized and invalid buffers"
  $receipt.status="passed"
} catch {
  $primaryFailure=$_
  $receipt.status="failed"; $receipt.errorType=$_.Exception.GetType().FullName
  throw
} finally {
  try {
    if ($buffer -ne [IntPtr]::Zero) { [System.Runtime.InteropServices.Marshal]::FreeHGlobal($buffer) }
    $process.Dispose()
  } catch {
    $receipt.closeErrorType=$_.Exception.GetType().FullName
    if ($null -eq $primaryFailure) { $primaryFailure=$_; throw }
  } finally {
    try { $receipt | ConvertTo-Json -Depth 12 | Set-Content -Encoding UTF8 (Join-Path $OutputDirectory "native-shell-identity.json") }
    catch {
      if ($null -eq $primaryFailure) { throw }
      Write-Host "Could not retain native shell compatibility receipt; primary failure remains unchanged."
    }
  }
}
