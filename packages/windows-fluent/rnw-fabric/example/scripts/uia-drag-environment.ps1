# Read-only evidence for the owned app's native drag routing boundary. This
# never creates a drag manager, subscribes a native target, or changes security.
function Initialize-DragEnvironmentReader {
  if ("NativeDragEnvironment" -as [type]) { return }
  Add-Type @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
public static class NativeDragEnvironment {
  [DllImport("kernel32.dll")] static extern void SetLastError(uint error);
  [DllImport("kernel32.dll", SetLastError=true)] static extern uint GetProcessId(IntPtr process);
  [DllImport("kernel32.dll", SetLastError=true)] static extern bool CloseHandle(IntPtr handle);
  [DllImport("user32.dll")] static extern bool IsWindow(IntPtr window);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr window);
  [DllImport("user32.dll")] static extern bool IsWindowEnabled(IntPtr window);
  [DllImport("user32.dll", SetLastError=true)] static extern uint GetWindowThreadProcessId(IntPtr window, out uint process);
  [DllImport("user32.dll", SetLastError=true)] static extern IntPtr GetParent(IntPtr window);
  [DllImport("user32.dll", SetLastError=true)] static extern IntPtr GetAncestor(IntPtr window, uint flags);
  [DllImport("user32.dll", CharSet=CharSet.Unicode, SetLastError=true)] static extern int GetClassName(IntPtr window, StringBuilder value, int length);
  [DllImport("user32.dll", SetLastError=true)] static extern bool GetWindowRect(IntPtr window, out RECT rect);
  delegate bool EnumChildProc(IntPtr window, IntPtr state);
  [DllImport("user32.dll")] static extern bool EnumChildWindows(IntPtr parent, EnumChildProc callback, IntPtr state);
  [DllImport("advapi32.dll", SetLastError=true)] static extern bool OpenProcessToken(IntPtr process, uint access, out IntPtr token);
  [DllImport("advapi32.dll", SetLastError=true)] static extern bool GetTokenInformation(IntPtr token, int informationClass, IntPtr buffer, uint bytes, out uint needed);
  [DllImport("advapi32.dll")] static extern bool IsValidSid(IntPtr sid);
  [DllImport("advapi32.dll")] static extern IntPtr GetSidSubAuthorityCount(IntPtr sid);
  [DllImport("advapi32.dll")] static extern IntPtr GetSidSubAuthority(IntPtr sid, uint index);
  [StructLayout(LayoutKind.Sequential)] struct RECT { public int Left, Top, Right, Bottom; }
  public sealed class WindowRecord {
    public long windowHandle, parentHandle, ancestorParentHandle, rootHandle;
    public uint processId, threadId;
    public bool exists, owned;
    public bool? visible, enabled;
    public string className, status;
    public object screenRect;
    public Dictionary<string,int> errors = new Dictionary<string,int>();
  }
  public static WindowRecord Window(IntPtr window, uint expectedProcess) {
    var value = new WindowRecord { windowHandle=window.ToInt64(), status="unavailable" };
    value.exists=window!=IntPtr.Zero && IsWindow(window);
    if (!value.exists) { value.status="window-absent"; return value; }
    SetLastError(0);
    value.threadId=GetWindowThreadProcessId(window, out value.processId);
    if (value.threadId==0) { value.errors["GetWindowThreadProcessId"]=Marshal.GetLastWin32Error(); return value; }
    value.owned=value.processId==expectedProcess && expectedProcess!=0;
    if (!value.owned) { value.status="outside-owned-process"; return value; }
    // Foreign windows are never queried for class, geometry, text or children.
    value.status="observed";
    SetLastError(0); value.parentHandle=GetParent(window).ToInt64();
    int error=Marshal.GetLastWin32Error();
    if (value.parentHandle==0 && error!=0) value.errors["GetParent"]=error;
    SetLastError(0); value.ancestorParentHandle=GetAncestor(window,1).ToInt64();
    error=Marshal.GetLastWin32Error();
    if (value.ancestorParentHandle==0 && error!=0) value.errors["GetAncestorParent"]=error;
    SetLastError(0); value.rootHandle=GetAncestor(window,2).ToInt64();
    error=Marshal.GetLastWin32Error();
    if (value.rootHandle==0 && error!=0) value.errors["GetAncestorRoot"]=error;
    value.visible=IsWindowVisible(window); value.enabled=IsWindowEnabled(window);
    var name=new StringBuilder(256);
    SetLastError(0);
    if (GetClassName(window,name,name.Capacity)>0) value.className=name.ToString();
    else value.errors["GetClassName"]=Marshal.GetLastWin32Error();
    RECT rect;
    SetLastError(0);
    if (GetWindowRect(window,out rect)) value.screenRect=new { left=rect.Left, top=rect.Top, right=rect.Right, bottom=rect.Bottom };
    else value.errors["GetWindowRect"]=Marshal.GetLastWin32Error();
    uint finalProcess;
    SetLastError(0);
    uint finalThread=GetWindowThreadProcessId(window,out finalProcess);
    if (finalThread==0 || finalProcess!=expectedProcess) {
      // A recycled HWND cannot retain content observed after its first owner
      // check. Keep only minimal identity/error information for that race.
      if (finalThread==0) value.errors["FinalProcessCheck"]=Marshal.GetLastWin32Error();
      value.status="window-owner-changed"; value.owned=false; value.exists=IsWindow(window);
      value.processId=finalProcess; value.threadId=finalThread;
      value.parentHandle=0; value.ancestorParentHandle=0; value.rootHandle=0;
      value.className=null; value.screenRect=null; value.visible=null; value.enabled=null;
    }
    return value;
  }
  public static object Children(IntPtr parent, uint expectedProcess) {
    var root=Window(parent,expectedProcess);
    var children=new List<WindowRecord>();
    int visited=0; bool limitReached=false; string callbackError=null;
    if (!root.owned || root.status!="observed") return new { status="owned-root-unavailable", root=root, limit=128, visited=0, limitReached=false, children=children };
    EnumChildProc callback=delegate(IntPtr window,IntPtr state) {
      try {
        // Bound visits, including foreign/stale windows, not only retained ones.
        if (visited>=128) { limitReached=true; return false; }
        visited++;
        children.Add(Window(window,expectedProcess));
        return true;
      } catch (Exception error) { callbackError=error.GetType().FullName; return false; }
    };
    // EnumChildWindows' return value is unspecified; only a callback error or
    // the explicit visit cap labels the enumeration incomplete.
    EnumChildWindows(parent,callback,IntPtr.Zero);
    GC.KeepAlive(callback);
    var rootAfter=Window(parent,expectedProcess);
    return new { status=callbackError!=null ? "callback-failed" : (!rootAfter.owned ? "owned-root-changed" : (limitReached ? "visit-limit" : "completed")), root=root, rootAfter=rootAfter, limit=128, visited=visited, limitReached=limitReached, callbackErrorType=callbackError, children=children };
  }
  public sealed class TokenField {
    public string status="unavailable", errorType;
    public uint? value;
    public int? win32Error;
  }
  static TokenField ReadTokenField(IntPtr token,int informationClass,bool integrity) {
    var result=new TokenField(); IntPtr buffer=IntPtr.Zero;
    try {
      uint needed;
      SetLastError(0);
      bool sized=GetTokenInformation(token,informationClass,IntPtr.Zero,0,out needed);
      int error=Marshal.GetLastWin32Error();
      if (!sized && error!=122) { result.status="query-failed"; result.win32Error=error; return result; }
      if (needed<4 || needed>4096) { result.status="invalid-size"; return result; }
      buffer=Marshal.AllocHGlobal((int)needed);
      uint actual;
      if (!GetTokenInformation(token,informationClass,buffer,needed,out actual)) {
        result.status="query-failed"; result.win32Error=Marshal.GetLastWin32Error(); return result;
      }
      if (actual>needed || actual<4) { result.status="invalid-size"; return result; }
      if (!integrity) result.value=unchecked((uint)Marshal.ReadInt32(buffer));
      else {
        if (actual<IntPtr.Size+4) { result.status="invalid-size"; return result; }
        IntPtr sid=Marshal.ReadIntPtr(buffer);
        // The integrity label contains a SID, but only its final numeric RID is
        // retained. No user/group SID, token handle or token bytes leave here.
        long sidOffset=sid.ToInt64()-buffer.ToInt64();
        if (sid==IntPtr.Zero || sidOffset<0 || sidOffset>(long)actual-8) { result.status="invalid-integrity-label"; return result; }
        byte boundedCount=Marshal.ReadByte(sid,1);
        if (boundedCount==0 || boundedCount>15 || sidOffset+8+4*boundedCount>actual || !IsValidSid(sid)) {
          result.status="invalid-integrity-label"; return result;
        }
        byte count=Marshal.ReadByte(GetSidSubAuthorityCount(sid));
        if (count==0 || count>15) { result.status="invalid-integrity-label"; return result; }
        result.value=unchecked((uint)Marshal.ReadInt32(GetSidSubAuthority(sid,(uint)count-1)));
      }
      result.status="observed";
    } catch (Exception error) { result.status="query-failed"; result.errorType=error.GetType().FullName; }
    finally { if (buffer!=IntPtr.Zero) Marshal.FreeHGlobal(buffer); }
    return result;
  }
  public static object Security(IntPtr processHandle,uint expectedProcess) {
    var fields=new Dictionary<string,TokenField>();
    IntPtr token=IntPtr.Zero; string status="unavailable", errorType=null; int? error=null, closeError=null;
    try {
      if (processHandle==IntPtr.Zero || expectedProcess==0) status="owned-process-handle-absent";
      else {
        SetLastError(0); uint actualProcess=GetProcessId(processHandle);
        if (actualProcess==0) { status="process-query-failed"; error=Marshal.GetLastWin32Error(); }
        else if (actualProcess!=expectedProcess) status="owned-process-handle-mismatch";
        else if (!OpenProcessToken(processHandle,0x0008,out token)) { status="token-open-failed"; error=Marshal.GetLastWin32Error(); }
        else {
          // TOKEN_QUERY only: never request a linked token or adjust privileges.
          fields["elevation"]=ReadTokenField(token,20,false);
          fields["elevationType"]=ReadTokenField(token,18,false);
          fields["integrityRid"]=ReadTokenField(token,25,true);
          fields["uiAccess"]=ReadTokenField(token,26,false);
          status="queried";
        }
      }
    } catch (Exception failure) { status="query-failed"; errorType=failure.GetType().FullName; }
    finally { if (token!=IntPtr.Zero && !CloseHandle(token)) closeError=Marshal.GetLastWin32Error(); }
    return new { status=status, processId=expectedProcess, access="TOKEN_QUERY", fields=fields, win32Error=error, errorType=errorType, tokenCloseError=closeError };
  }
}
"@
}

function Get-DragEnableLuaRecord {
  $record = [ordered]@{ status = "unavailable"; hive = "LocalMachine"; view = "Registry64"; valueName = "EnableLUA" }
  $base = $null; $key = $null
  try {
    $base = [Microsoft.Win32.RegistryKey]::OpenBaseKey([Microsoft.Win32.RegistryHive]::LocalMachine, [Microsoft.Win32.RegistryView]::Registry64)
    $key = $base.OpenSubKey("SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System", $false)
    if ($null -eq $key) { $record.status = "key-absent" }
    elseif ($key.GetValueNames() -notcontains "EnableLUA") { $record.status = "value-absent" }
    else {
      $record.kind = $key.GetValueKind("EnableLUA").ToString()
      if ($record.kind -ne "DWord") { $record.status = "unexpected-value-kind" }
      else { $record.value = [uint32]$key.GetValue("EnableLUA", $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames); $record.status = "observed" }
    }
  } catch { $record.status = "query-failed"; $record.errorType = $_.Exception.GetType().FullName; $record.hresult = $_.Exception.HResult }
  finally {
    foreach ($resource in @($key, $base)) {
      try { if ($null -ne $resource) { $resource.Dispose() } }
      catch { $record.closeErrorType = $_.Exception.GetType().FullName }
    }
  }
  return $record
}

function Get-DragInputSiteRecord($element, [uint32]$ownedProcessId) {
  $record = [ordered]@{ status = "input-site-not-found"; uiaAncestorLimit = 24; uiaVisited = 0; nativeAncestorLimit = 16
    uiaAncestors = [System.Collections.Generic.List[object]]::new(); nativeAncestors = [System.Collections.Generic.List[object]]::new() }
  try {
    $seed = [IntPtr]::Zero
    for ($current = $element; $null -ne $current -and $record.uiaVisited -lt $record.uiaAncestorLimit;
        $current = [System.Windows.Automation.TreeWalker]::RawViewWalker.GetParent($current)) {
      $record.uiaVisited++
      $value = $current.Current
      if ($value.ProcessId -ne $ownedProcessId) { $record.status = "uia-left-owned-process"; break }
      $record.uiaAncestors.Add([ordered]@{ processId = $value.ProcessId; windowHandle = $value.NativeWindowHandle
        className = $value.ClassName; controlType = $value.ControlType.ProgrammaticName; runtimeId = ($current.GetRuntimeId() -join ",") })
      if ($value.ClassName -eq "InputSiteWindowClass" -and $value.NativeWindowHandle -ne 0) { $seed = [IntPtr]$value.NativeWindowHandle; break }
    }
    if ($seed -eq [IntPtr]::Zero) {
      if ($record.uiaVisited -ge $record.uiaAncestorLimit) { $record.status = "uia-ancestor-limit" }
      return $record
    }
    $record.inputSiteWindowHandle = $seed.ToInt64()
    $seen = [System.Collections.Generic.HashSet[long]]::new()
    $record.status = "native-ancestor-limit"
    for ($windowHandle = $seed; $windowHandle -ne [IntPtr]::Zero -and $record.nativeAncestors.Count -lt $record.nativeAncestorLimit;) {
      if (-not $seen.Add($windowHandle.ToInt64())) { $record.status = "native-parent-cycle"; break }
      $native = [NativeDragEnvironment]::Window($windowHandle, $ownedProcessId)
      $record.nativeAncestors.Add($native)
      if (-not $native.owned -or $native.status -ne "observed") { $record.status = $native.status; break }
      if ($native.errors.ContainsKey("GetAncestorParent")) { $record.status = "native-parent-query-failed"; break }
      # GA_PARENT is the parent-only chain. GetParent's possible owner value is
      # retained separately in each record and must not be conflated with it.
      $windowHandle = [IntPtr]$native.ancestorParentHandle
      if ($windowHandle -eq [IntPtr]::Zero) { $record.status = "completed" }
    }
  } catch { $record.status = "query-failed"; $record.errorType = $_.Exception.GetType().FullName; $record.hresult = $_.Exception.HResult }
  return $record
}

function Get-DragModuleFileDigest([string]$path, [long]$maximumBytes) {
  if ($maximumBytes -le 0 -or $maximumBytes -gt 67108864) { throw "Invalid module hash byte limit" }
  $stream = $null; $hash = $null
  try {
    $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, ([System.IO.FileShare]::ReadWrite -bor [System.IO.FileShare]::Delete))
    $hash = [System.Security.Cryptography.SHA256]::Create()
    $buffer = [byte[]]::new(65536)
    [long]$readBytes = 0
    $end = $false
    while ($readBytes -lt $maximumBytes) {
      $count = $stream.Read($buffer, 0, [int][Math]::Min($buffer.Length, $maximumBytes - $readBytes))
      if ($count -eq 0) { $end = $true; break }
      $hash.TransformBlock($buffer, 0, $count, $buffer, 0) | Out-Null
      $readBytes += $count
    }
    # One bounded extra-byte probe distinguishes an exact-size file from a
    # file that grew beyond the cap. No partial digest is reported as complete.
    if (-not $end -and $stream.ReadByte() -ne -1) {
      return @{ status = "byte-limit"; bytesRead = $readBytes + 1; maximumBytes = $maximumBytes }
    }
    $hash.TransformFinalBlock([byte[]]::new(0), 0, 0) | Out-Null
    return @{ status = "hashed"; bytesRead = $readBytes; maximumBytes = $maximumBytes
      sha256 = [BitConverter]::ToString($hash.Hash).Replace("-", "").ToLowerInvariant() }
  } finally {
    try { if ($null -ne $hash) { $hash.Dispose() } }
    finally { if ($null -ne $stream) { $stream.Dispose() } }
  }
}

function Get-DragModuleIdentityRecord($nativeProcess, [uint32]$expectedProcessId, [string]$expectedStartedAt) {
  $record = [ordered]@{ status = "unavailable"; processId = $expectedProcessId; expectedStartedAt = $expectedStartedAt
    processStable = $false; moduleLimit = 2; fileByteLimit = 67108864; hashReadByteLimit = 67108865; identityKind = "loaded-module-path-file"
    modules = [System.Collections.Generic.List[object]]::new() }
  try {
    $nativeProcess.Refresh()
    $record.before = @{ processId = $nativeProcess.Id; hasExited = $nativeProcess.HasExited
      startedAt = $nativeProcess.StartTime.ToUniversalTime().ToString("o") }
    if ($record.before.hasExited -or $record.before.processId -ne $expectedProcessId -or
        [string]::IsNullOrEmpty($expectedStartedAt) -or $record.before.startedAt -ne $expectedStartedAt) {
      $record.status = "owned-process-identity-unverified"; return $record
    }
    $loaded = $nativeProcess.Modules
    foreach ($basename in @("Microsoft.UI.Xaml.dll", "Microsoft.UI.Input.dll")) {
      $entry = [ordered]@{ expectedBasename = $basename; basename = $null; status = "unavailable" }
      try {
        $matchingModules = @($loaded | Where-Object { $_.ModuleName -ieq $basename })
        if ($matchingModules.Count -eq 0) { $entry.status = "not-loaded" }
        elseif ($matchingModules.Count -ne 1) { $entry.status = "ambiguous-loaded-basename"; $entry.matches = $matchingModules.Count }
        else {
          # Resolve only these two already-loaded module files. Do not retain
          # paths or other modules, and do not describe file hashes as memory.
          $module = $matchingModules[0]
          $entry.basename = $module.ModuleName
          $file = Get-Item -LiteralPath $module.FileName -ErrorAction Stop
          $size = $file.Length; $writtenAt = $file.LastWriteTimeUtc
          if ($size -le 0 -or $size -gt $record.fileByteLimit) { $entry.status = "module-file-size-outside-bound" }
          else {
            $entry.fileVersion = $module.FileVersionInfo.FileVersion
            $entry.productVersion = $module.FileVersionInfo.ProductVersion
            $entry.bytes = $size
            $digest = Get-DragModuleFileDigest $module.FileName $record.fileByteLimit
            $entry.bytesRead = $digest.bytesRead
            if ($digest.status -ne "hashed") { $entry.status = "module-file-read-limit" }
            else {
              $entry.sha256 = $digest.sha256
              $file.Refresh()
              $entry.fileStable = $file.Exists -and $file.Length -eq $size -and $digest.bytesRead -eq $size -and $file.LastWriteTimeUtc -eq $writtenAt
              $entry.status = if ($entry.fileStable) { "observed" } else { "module-file-changed" }
            }
          }
        }
      } catch { $entry.status = "query-failed"; $entry.errorType = $_.Exception.GetType().FullName; $entry.hresult = $_.Exception.HResult }
      $record.modules.Add($entry)
    }
    $nativeProcess.Refresh()
    $record.after = @{ processId = $nativeProcess.Id; hasExited = $nativeProcess.HasExited
      startedAt = $nativeProcess.StartTime.ToUniversalTime().ToString("o") }
    $record.processStable = -not $record.after.hasExited -and $record.after.processId -eq $expectedProcessId -and $record.after.startedAt -eq $expectedStartedAt
    $record.status = if ($record.processStable) { "queried" } else { "owned-process-changed" }
  } catch { $record.status = "query-failed"; $record.errorType = $_.Exception.GetType().FullName; $record.hresult = $_.Exception.HResult }
  return $record
}

function Get-DragEnvironmentRecord($endpoints, $nativeProcess, [string]$expectedStartedAt) {
  Initialize-DragEnvironmentReader
  $ownerId = [uint32]$nativeProcess.Id
  $record = [ordered]@{ schemaVersion = 1; sourceRevision = $env:GITHUB_SHA; capturedAt = [DateTime]::UtcNow.ToString("o")
    processId = $ownerId; status = "queried"; diagnosticOnly = $true; security = $null; enableLua = $null
    source = $null; target = $null; mainChildren = $null; documentChildren = $null; loadedModules = $null }
  try { $record.security = [NativeDragEnvironment]::Security($nativeProcess.Handle, $ownerId) }
  catch { $record.security = @{ status = "query-failed"; errorType = $_.Exception.GetType().FullName; hresult = $_.Exception.HResult } }
  $record.enableLua = Get-DragEnableLuaRecord
  $record.loadedModules = Get-DragModuleIdentityRecord $nativeProcess $ownerId $expectedStartedAt
  $record.source = Get-DragInputSiteRecord $endpoints.sourceElement $ownerId
  $record.target = Get-DragInputSiteRecord $endpoints.targetElement $ownerId
  foreach ($entry in @(@("mainChildren", $endpoints.main.windowHandle), @("documentChildren", $endpoints.secondary.windowHandle))) {
    try { $record[$entry[0]] = [NativeDragEnvironment]::Children([IntPtr]$entry[1], $ownerId) }
    catch { $record[$entry[0]] = @{ status = "query-failed"; errorType = $_.Exception.GetType().FullName; hresult = $_.Exception.HResult } }
  }
  return $record
}

function Select-DragLogFields($value, [string[]]$names) {
  if ($null -eq $value) { return $null }
  $selected = [ordered]@{}
  foreach ($name in $names) {
    $property = $value.PSObject.Properties[$name]
    if ($null -ne $property) { $selected[$name] = $property.Value }
  }
  return $selected
}

function Select-DragLogWindow($value) {
  $selected = Select-DragLogFields $value @("windowHandle", "parentHandle", "ancestorParentHandle", "rootHandle", "processId", "threadId", "exists", "owned", "visible", "enabled", "className", "status")
  if ($null -ne $selected) {
    $selected.screenRect = Select-DragLogFields $value.screenRect @("left", "top", "right", "bottom")
    $selected.errors = Select-DragLogFields $value.errors @("GetWindowThreadProcessId", "GetParent", "GetAncestorParent", "GetAncestorRoot", "GetClassName", "GetWindowRect", "FinalProcessCheck")
  }
  return $selected
}

function Select-DragLogTopologyWindow($value) {
  $selected = Select-DragLogFields $value @("windowHandle", "parentHandle", "ancestorParentHandle", "rootHandle", "processId", "exists", "owned", "className", "status")
  if ($null -ne $selected) {
    $selected.errors = Select-DragLogFields $value.errors @("GetWindowThreadProcessId", "GetParent", "GetAncestorParent", "GetAncestorRoot", "GetClassName", "GetWindowRect", "FinalProcessCheck")
  }
  return $selected
}

function Select-DragLogChildren($value) {
  $selected = Select-DragLogFields $value @("status", "limit", "visited", "limitReached", "callbackErrorType", "errorType", "hresult")
  if ($null -eq $selected) { return $null }
  $selected.root = Select-DragLogTopologyWindow $value.root
  $selected.rootAfter = Select-DragLogTopologyWindow $value.rootAfter
  $all = @($value.children | Where-Object { $null -ne $_ })
  # A zero UIA HWND must still leave actual native topology in the log.
  # Prefer ownership-verified rows, then retain enumeration order. UIA class
  # labels do not establish the native GetClassName identity of an input site.
  $ordered = @($all | Where-Object { $_.owned -eq $true })
  $ordered += @($all | Where-Object { $_.owned -ne $true })
  $selected.selection = "owned-children-first-then-enumeration"
  $selected.summaryLimit = 16
  $selected.originalChildCount = $all.Count
  $selected.children = @($ordered | Select-Object -First 16 | ForEach-Object { Select-DragLogTopologyWindow $_ })
  $selected.selectedChildCount = $selected.children.Count
  $selected.omittedChildCount = $all.Count - $selected.children.Count
  $selected.omittedChildren = $selected.omittedChildCount -gt 0
  return $selected
}

function Select-DragLogSnapshot($value) {
  $selected = Select-DragLogFields $value @("schemaVersion", "sourceRevision", "capturedAt", "processId", "status", "diagnosticOnly", "attempt", "byteLimit", "errorType", "hresult")
  $selected.security = Select-DragLogFields $value.security @("status", "processId", "access", "win32Error", "errorType", "tokenCloseError")
  if ($null -ne $selected.security) {
    $selected.security.fields = [ordered]@{}
    foreach ($name in @("elevation", "elevationType", "integrityRid", "uiAccess")) {
      $selected.security.fields[$name] = Select-DragLogFields $value.security.fields.$name @("status", "value", "win32Error", "errorType")
    }
  }
  $selected.enableLua = Select-DragLogFields $value.enableLua @("status", "hive", "view", "valueName", "kind", "value", "errorType", "hresult", "closeErrorType")
  foreach ($name in @("source", "target")) {
    $original = $value.$name
    $entry = Select-DragLogFields $original @("status", "uiaAncestorLimit", "uiaVisited", "nativeAncestorLimit", "inputSiteWindowHandle", "errorType", "hresult")
    if ($null -ne $entry) { $entry.nativeAncestors = @($original.nativeAncestors | Select-Object -First 16 | ForEach-Object { Select-DragLogWindow $_ }) }
    $selected[$name] = $entry
  }
  foreach ($name in @("mainChildren", "documentChildren")) { $selected[$name] = Select-DragLogChildren $value.$name }
  $selected.loadedModules = Select-DragLogFields $value.loadedModules @("status", "processId", "expectedStartedAt", "processStable", "moduleLimit", "fileByteLimit", "hashReadByteLimit", "identityKind", "errorType", "hresult")
  if ($null -ne $selected.loadedModules) {
    $selected.loadedModules.before = Select-DragLogFields $value.loadedModules.before @("processId", "hasExited", "startedAt")
    $selected.loadedModules.after = Select-DragLogFields $value.loadedModules.after @("processId", "hasExited", "startedAt")
    $selected.loadedModules.modules = @($value.loadedModules.modules | Select-Object -First 2 | ForEach-Object {
      Select-DragLogFields $_ @("expectedBasename", "basename", "status", "matches", "fileVersion", "productVersion", "bytes", "bytesRead", "sha256", "fileStable", "errorType", "hresult")
    })
  }
  return $selected
}

function Write-DragEnvironmentLog([string]$path) {
  $begin = "NYCTRON_DRAG_ENVIRONMENT_BEGIN"
  $end = "NYCTRON_DRAG_ENVIRONMENT_END"
  $entry = [ordered]@{ schemaVersion = 1; status = "unavailable"; filename = [System.IO.Path]::GetFileName($path)
    originalByteLimit = 262144; originalReadByteLimit = 262145; logByteLimit = 32768; selection = "diagnostic-summary-allowlist"
    omittedOriginalSections = @("source.uiaAncestors", "target.uiaAncestors")
    compactedOriginalSections = @("mainChildren", "documentChildren") }
  $stream = $null
  try {
    if ($entry.filename -notmatch '^drag-environment-[0-9]{2}\.json$') { throw "Unexpected environment receipt filename" }
    # Read the successfully closed original once, with one overflow-detection
    # byte. Hash these actual file bytes, never the intended serialization.
    $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::Read)
    $buffer = [byte[]]::new($entry.originalReadByteLimit)
    $count = 0
    while ($count -lt $buffer.Length) {
      $read = $stream.Read($buffer, $count, $buffer.Length - $count)
      if ($read -eq 0) { break }
      $count += $read
    }
    $stream.Dispose(); $stream = $null
    $entry.originalBytes = $count
    if ($count -gt $entry.originalByteLimit) { $entry.status = "original-over-byte-limit" }
    else {
      $hash = [System.Security.Cryptography.SHA256]::Create()
      try { $entry.originalSha256 = [BitConverter]::ToString($hash.ComputeHash($buffer, 0, $count)).Replace("-", "").ToLowerInvariant() }
      finally { $hash.Dispose() }
      $record = [System.Text.UTF8Encoding]::new($false, $true).GetString($buffer, 0, $count) | ConvertFrom-Json
      if ($record.schemaVersion -ne 1 -or $record.diagnosticOnly -ne $true) { throw "Unexpected environment receipt schema" }
      $entry.summary = Select-DragLogSnapshot $record
      $entry.status = "summary"
    }
  } catch { $entry.status = "readback-unavailable"; $entry.errorType = $_.Exception.GetType().FullName }
  finally {
    try { if ($null -ne $stream) { $stream.Dispose() } }
    catch { $entry.status = "readback-unavailable"; $entry.closeErrorType = $_.Exception.GetType().FullName }
  }
  try {
    $json = $entry | ConvertTo-Json -Depth 16 -Compress
    $encoding = [System.Text.UTF8Encoding]::new($false)
    # Include both fixed delimiters and Windows CRLFs in the emission budget.
    if ($encoding.GetByteCount($json) + $encoding.GetByteCount($begin) + $encoding.GetByteCount($end) + 6 -gt $entry.logByteLimit) {
      $entry.Remove("summary")
      $entry.status = "omitted-over-log-limit"
      $json = $entry | ConvertTo-Json -Depth 4 -Compress
    }
    Write-Host $begin
    Write-Host $json
    Write-Host $end
  } catch {
    # Console/reporting failure cannot escape into the real drag assertions.
    try { Write-Host "Native drag environment log readback unavailable." } catch {}
  }
}

function Save-DragEnvironmentRecord([int]$attempt, $endpoints, $nativeProcess, [string]$directory, [string]$expectedStartedAt) {
  $path = Join-Path $directory ("drag-environment-{0:d2}.json" -f $attempt)
  $stream = $null
  $written = $false; $closed = $false
  try {
    if ($attempt -lt 1 -or $attempt -gt 8) { throw "Native drag environment receipt limit exceeded" }
    try { $record = Get-DragEnvironmentRecord $endpoints $nativeProcess $expectedStartedAt }
    catch { $record = @{ schemaVersion = 1; status = "query-failed"; diagnosticOnly = $true; sourceRevision = $env:GITHUB_SHA
        capturedAt = [DateTime]::UtcNow.ToString("o"); errorType = $_.Exception.GetType().FullName; hresult = $_.Exception.HResult } }
    $record.attempt = $attempt
    $record.byteLimit = 262144
    $encoding = [System.Text.UTF8Encoding]::new($false)
    $bytes = $encoding.GetBytes(($record | ConvertTo-Json -Depth 12))
    if ($bytes.Length -gt $record.byteLimit) { throw "Native drag environment receipt byte limit exceeded" }
    # CreateNew preserves the first observation's bytes if cleanup or a caller
    # attempts to write the same attempt again. Root evidence hashes this JSON.
    $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::Read)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
    $written = $true
  } catch {
    try { Write-Host "Could not retain native drag environment receipt ($($_.Exception.GetType().FullName))" } catch {}
  }
  finally {
    try { if ($null -ne $stream) { $stream.Dispose() }; $closed = $true }
    catch { try { Write-Host "Could not close native drag environment receipt ($($_.Exception.GetType().FullName))" } catch {} }
  }
  if ($written -and $closed) {
    try { Write-DragEnvironmentLog $path } catch {}
  }
}
