# Native drag driver. Dot-sourced after the UIA and checked SendInput helpers.
# Endpoint/pointer observations establish where input was sent. Only the existing
# native DragStarting, completion and app-owned transfer assertions accept a drag.

function Get-DragElementRecord($element) {
  $current = $element.Current
  $bounds = $current.BoundingRectangle
  return [ordered]@{ name = $current.Name; processId = $current.ProcessId; runtimeId = ($element.GetRuntimeId() -join ",")
    className = $current.ClassName; windowHandle = $current.NativeWindowHandle; enabled = $current.IsEnabled; offscreen = $current.IsOffscreen
    controlType = $current.ControlType.ProgrammaticName; keyboardFocusable = $current.IsKeyboardFocusable; keyboardFocused = $current.HasKeyboardFocus
    bounds = [ordered]@{ x = $bounds.X; y = $bounds.Y; width = $bounds.Width; height = $bounds.Height } }
}

function Read-DragEndpoints($main, $secondary) {
  $nativeClass = New-Object System.Windows.Automation.PropertyCondition($AE::ClassNameProperty, "NYCTronDragRegion")
  $sourceCondition = [System.Windows.Automation.AndCondition]::new((Process-ElementCondition "Drag shared native draft" ([System.Windows.Automation.ControlType]::Custom)), $nativeClass)
  $targetCondition = [System.Windows.Automation.AndCondition]::new((Process-ElementCondition "Drop shared native draft" ([System.Windows.Automation.ControlType]::Custom)), $nativeClass)
  $source = $main.FindFirst($Tree::Descendants, $sourceCondition)
  $target = $secondary.FindFirst($Tree::Descendants, $targetCondition)
  if ($null -eq $source -or $null -eq $target) { return $null }
  return @{ main = (Get-DragElementRecord $main); secondary = (Get-DragElementRecord $secondary)
    source = (Get-DragElementRecord $source); target = (Get-DragElementRecord $target)
    sourceElement = $source; targetElement = $target; foregroundWindowHandle = [NativeWindow]::GetForegroundWindow().ToInt64() }
}

function Test-DragEndpoints($value) {
  if ($null -eq $value -or $value.foregroundWindowHandle -ne $value.main.windowHandle -or
      $value.main.windowHandle -eq 0 -or $value.secondary.windowHandle -eq 0 -or $value.main.windowHandle -eq $value.secondary.windowHandle) { return $false }
  foreach ($entry in @($value.main, $value.secondary, $value.source, $value.target)) {
    $b = $entry.bounds
    if ($entry.processId -ne $process.Id -or $entry.offscreen -or -not $entry.enabled -or $b.width -lt 30 -or $b.height -lt 30 -or
        [double]::IsInfinity($b.x) -or [double]::IsInfinity($b.y) -or [double]::IsNaN($b.x) -or [double]::IsNaN($b.y)) { return $false }
  }
  foreach ($pair in @(@($value.main, $value.source), @($value.secondary, $value.target))) {
    $outer = $pair[0].bounds; $inner = $pair[1].bounds
    if (-not $pair[1].keyboardFocusable -or $inner.x -lt $outer.x -or $inner.y -lt $outer.y -or $inner.x + $inner.width -gt $outer.x + $outer.width -or
        $inner.y + $inner.height -gt $outer.y + $outer.height) { return $false }
  }
  return $value.main.bounds.x + $value.main.bounds.width -le $value.secondary.bounds.x
}

function Get-DragEndpointKey($value) {
  # Include both native identities and their live geometry. A remounted element
  # at the same coordinates must establish its own stable observations.
  return (@($value.main, $value.secondary, $value.source, $value.target) | ConvertTo-Json -Depth 4 -Compress)
}

function Wait-DragEndpoints($main, $secondary) {
  $deadline = (Get-Date).AddSeconds(10)
  $previous = $null; $consecutive = 0; $observations = 0
  do {
    $value = Read-DragEndpoints $main $secondary
    $observations++
    if (Test-DragEndpoints $value) {
      $key = Get-DragEndpointKey $value
      $consecutive = if ($key -eq $previous) { $consecutive + 1 } else { 1 }
      $previous = $key
      if ($consecutive -ge 3) { $value.stabilityObservations = $observations; return $value }
    } else { $previous = $null; $consecutive = 0 }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Owned native drag endpoints did not become visible, enabled and stable in the main foreground window"
}

function Get-DragPointerRecord([string]$stage, $requested, $endpoints) {
  $point = [NativeWindow]::CursorPosition()
  $foreground = [NativeWindow]::GetForegroundWindow()
  $hitWindow = [NativeWindow]::WindowFromPoint($point)
  [uint32]$foregroundProcess = 0; [uint32]$hitProcess = 0; [uint32]$mainProcess = 0
  [NativeWindow]::GetWindowThreadProcessId($foreground, [ref]$foregroundProcess) | Out-Null
  [NativeWindow]::GetWindowThreadProcessId($hitWindow, [ref]$hitProcess) | Out-Null
  $thread = [NativeWindow]::GetWindowThreadProcessId([IntPtr]$endpoints.main.windowHandle, [ref]$mainProcess)
  $record = [ordered]@{ stage = $stage; capturedAt = [DateTime]::UtcNow.ToString("o"); requestedCursor = $requested
    actualCursor = @{ x = $point.X; y = $point.Y }; leftButtonDown = (([NativeWindow]::GetAsyncKeyState(1) -band 0x8000) -ne 0)
    foregroundWindowHandle = $foreground.ToInt64(); foregroundProcessId = $foregroundProcess
    hitWindowHandle = $hitWindow.ToInt64(); hitRootHandle = [NativeWindow]::GetAncestor($hitWindow, 2).ToInt64(); hitProcessId = $hitProcess
    endpoints = @($endpoints.main, $endpoints.secondary, $endpoints.source, $endpoints.target) }
  try {
    $state = [NativeWindow]::ThreadInputState($thread)
    $record.guiThread = @{ threadId = $thread; processId = $mainProcess; flags = $state.flags
      active = $state.active.ToInt64(); focus = $state.focus.ToInt64(); capture = $state.capture.ToInt64() }
  } catch { $record.guiThreadError = $_.Exception.Message }
  try {
    $hit = $AE::FromPoint([System.Windows.Point]::new($point.X, $point.Y))
    if ($null -ne $hit -and $hit.Current.ProcessId -eq $process.Id) { $record.hitProvider = Get-DragElementRecord $hit }
    elseif ($null -ne $hit) { $record.hitProvider = @{ processId = $hit.Current.ProcessId; className = $hit.Current.ClassName; windowHandle = $hit.Current.NativeWindowHandle } }
    else { $record.hitProvider = $null }
  } catch { $record.hitProviderError = $_.Exception.Message }
  try {
    $patterns = @($endpoints.sourceElement.GetSupportedPatterns() | ForEach-Object { @{ id = $_.Id; name = $_.ProgrammaticName } })
    $record.sourcePatterns = $patterns
    # The native FrameworkElementAutomationPeer does not map CanDrag to
    # DragPattern. This reported list cannot establish the native CanDrag value.
    $record.dragPattern = @{ status = $(if (@($patterns | Where-Object { $_.id -eq 10030 }).Count) { "reported" } else { "unavailable" }); nativeCanDrag = "not-observed" }
  } catch { $record.sourcePatternsError = $_.Exception.Message; $record.dragPattern = @{ status = "query-failed"; nativeCanDrag = "not-observed" } }
  return $record
}

function Save-DragInputRecord($record, [string]$path) {
  try { $record | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $path }
  catch { Write-Host "Could not retain drag input diagnostics: $($_.Exception.Message)" }
}

function Add-LiveDragPointerRecord($record, [string]$path, [string]$stage, $requested, $main, $secondary) {
  try {
    # Both the UIA refresh and the pointer snapshot are diagnostic operations.
    # A failed refresh must not preempt the real drag-start/completion gates.
    $endpoints = Read-DragEndpoints $main $secondary
    $record.observations.Add((Get-DragPointerRecord $stage $requested $endpoints))
  }
  catch { $record.observations.Add(@{ stage = $stage; capturedAt = [DateTime]::UtcNow.ToString("o"); captureError = $_.Exception.Message }) }
  Save-DragInputRecord $record $path
}

function Invoke-NativeDrag($main, $secondary, [bool]$cancel = $false) {
  $script:nativeDragAttempt++
  $path = Join-Path $OutDir ("drag-input-{0:d2}.json" -f $script:nativeDragAttempt)
  $record = [ordered]@{ schemaVersion = 1; sourceRevision = $env:GITHUB_SHA; attempt = $script:nativeDragAttempt; cancelRequested = $cancel
    status = "preparing"; observations = [System.Collections.Generic.List[object]]::new() }
  $primaryFailure = $null; $cleanupFailure = $null; $buttonPressed = $false; $endpoints = $null; $requested = $null
  try {
    $record.foregroundRequestAccepted = [NativeWindow]::SetForegroundWindow([IntPtr]$main.Current.NativeWindowHandle)
    $endpoints = Wait-DragEndpoints $main $secondary
    $record.stability = @{ intervalMs = 100; requiredConsecutive = 3; observations = $endpoints.stabilityObservations }
    $metrics = [NativeWindow]::DragMetrics(); $record.systemDragMetrics = @{ x = $metrics.X; y = $metrics.Y }
    $s = $endpoints.source.bounds; $t = $endpoints.target.bounds
    $sx = [int]($s.x + $s.width / 2); $sy = [int]($s.y + $s.height / 2)
    $tx = [int]($t.x + $t.width / 2); $ty = [int]($t.y + $t.height / 2)
    $requested = @{ x = $sx; y = $sy }
    Move-NativePointer $sx $sy | Out-Null
    $current = Read-DragEndpoints $main $secondary
    if (-not (Test-DragEndpoints $current) -or (Get-DragEndpointKey $current) -ne (Get-DragEndpointKey $endpoints)) {
      throw "Native drag endpoint identity, geometry or foreground changed before button-down"
    }
    $endpoints = $current
    $before = Get-DragPointerRecord "before-down" $requested $endpoints
    $record.observations.Add($before); Save-DragInputRecord $record $path
    if ($before.foregroundWindowHandle -ne $endpoints.main.windowHandle -or $before.foregroundProcessId -ne $process.Id -or
        $before.hitProcessId -ne $process.Id -or $before.hitRootHandle -ne $endpoints.main.windowHandle -or
        [Math]::Abs($before.actualCursor.x - $sx) -gt 1 -or [Math]::Abs($before.actualCursor.y - $sy) -gt 1) {
      throw "Native drag pointer did not reach the source inside the owned foreground window"
    }
    if ($before.leftButtonDown) { throw "Left mouse button was already held before the native drag gesture" }
    $buttonPressed = $true
    [NativeWindow]::Mouse(0x0002)
    Add-LiveDragPointerRecord $record $path "after-down" $requested $main $secondary
    # Keep the existing threshold and path. Mouse moves now use the same checked
    # SendInput stream as down/up, with the actual OS cursor observed after each.
    $requested = @{ x = $sx + 24; y = $sy }
    Move-NativePointer ($sx + 24) $sy | Out-Null
    Add-LiveDragPointerRecord $record $path "threshold" $requested $main $secondary
    Find-ByName $main "Native drag phase: dragging" 10 | Out-Null
    $record.status = "dragging"
    for ($step = 1; $step -le 24; $step++) {
      $requested = @{ x = [int]($sx + ($tx - $sx) * $step / 24); y = [int]($sy + ($ty - $sy) * $step / 24) }
      Move-NativePointer $requested.x $requested.y | Out-Null
      Start-Sleep -Milliseconds 20
    }
    Add-LiveDragPointerRecord $record $path "over-target" $requested $main $secondary
    if ($cancel) { [System.Windows.Forms.SendKeys]::SendWait("{ESC}") }
  } catch {
    $primaryFailure = $_
    $record.status = "failed"
    $record.primaryFailure = @{ message = $_.Exception.Message; position = $_.InvocationInfo.PositionMessage; scriptStack = $_.ScriptStackTrace }
    try { Add-LiveDragPointerRecord $record $path "failure-before-release" $requested $main $secondary }
    catch { Write-Host "Could not observe the failed drag pointer: $($_.Exception.Message)" }
    throw
  } finally {
    if ($buttonPressed) {
      try { [NativeWindow]::Mouse(0x0004); $record.buttonUp = "inserted" }
      catch { $cleanupFailure = $_; $record.status = "failed"; $record.buttonUp = "failed"; $record.buttonUpError = $_.Exception.Message }
    }
    Save-DragInputRecord $record $path
    if ($null -eq $primaryFailure -and $null -ne $cleanupFailure) { throw $cleanupFailure }
  }
}
