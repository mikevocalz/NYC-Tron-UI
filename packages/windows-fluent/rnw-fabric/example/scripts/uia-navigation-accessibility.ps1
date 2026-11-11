# Invoked by uia-smoke.ps1 in its existing, deployed native app session.
# The parent supplies Find-ByName, Invoke-Button, Save-Screenshot and selection checks.
param([Parameter(Mandatory = $true)]$Window, [Parameter(Mandatory = $true)][string]$OutDir)
$ErrorActionPreference = "Stop"
Add-Type @"
using System;
using System.ComponentModel;
using System.Drawing;
using System.Runtime.InteropServices;
public static class NavigationAccessibilityNative {
  [StructLayout(LayoutKind.Sequential)] private struct HC { public uint size, flags; public IntPtr scheme; }
  public sealed class Contrast { public uint Flags; public string Scheme; }
  [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
  private static extern bool SystemParametersInfoW(uint action, uint size, ref HC data, uint flags);
  [DllImport("user32.dll", SetLastError=true)]
  public static extern bool SetWindowPos(IntPtr window, IntPtr after, int x, int y, int width, int height, uint flags);
  public static Contrast ReadContrast() {
    HC value = new HC { size = (uint)Marshal.SizeOf(typeof(HC)) };
    if (!SystemParametersInfoW(0x42, value.size, ref value, 0)) throw new Win32Exception(Marshal.GetLastWin32Error());
    // SPI_GETHIGHCONTRAST returns a borrowed scheme pointer; copy without freeing it.
    // Ownership follows dotnet/dotnet 461c220ba5d192fea95ca9249b22b96d3c9e9903, PInvokeCore.SystemParametersInfo.
    return new Contrast { Flags=value.flags, Scheme=Marshal.PtrToStringUni(value.scheme) };
  }
  public static void SetContrast(Contrast original, bool enabled) {
    // Apply to this disposable runner session and notify native controls; do not persist a profile change.
    HC value = new HC { size=(uint)Marshal.SizeOf(typeof(HC)),
      flags=(original.Flags & ~0x1001u) | (enabled ? 1u : 0u),
      scheme=original.Scheme == null ? IntPtr.Zero : Marshal.StringToHGlobalUni(original.Scheme) };
    try { if (!SystemParametersInfoW(0x43, value.size, ref value, 2)) throw new Win32Exception(Marshal.GetLastWin32Error()); }
    finally { if (value.scheme != IntPtr.Zero) Marshal.FreeHGlobal(value.scheme); }
  }

  [StructLayout(LayoutKind.Sequential)] private struct FT { public uint low, high; }
  [StructLayout(LayoutKind.Sequential)] private struct FileInfo {
    public uint attributes; public FT created, accessed, written;
    public uint volume, sizeHigh, sizeLow, links, indexHigh, indexLow;
  }
  public sealed class ProbeFile { public byte[] Bytes; public string Text, Sha256; }
  [DllImport("kernel32.dll", SetLastError=true)]
  private static extern uint GetProcessId(IntPtr process);
  [DllImport("kernel32.dll", SetLastError=true)]
  private static extern bool GetProcessTimes(IntPtr process, out FT created, out FT exited, out FT kernel, out FT user);
  [DllImport("kernel32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
  private static extern Microsoft.Win32.SafeHandles.SafeFileHandle CreateFileW(
      string path, uint access, uint share, IntPtr security, uint disposition, uint flags, IntPtr template);
  [DllImport("kernel32.dll", SetLastError=true)]
  private static extern bool GetFileInformationByHandle(Microsoft.Win32.SafeHandles.SafeFileHandle file, out FileInfo info);
  [DllImport("kernel32.dll", SetLastError=true)]
  private static extern uint GetFileType(Microsoft.Win32.SafeHandles.SafeFileHandle file);
  [DllImport("kernel32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
  private static extern uint GetFinalPathNameByHandleW(Microsoft.Win32.SafeHandles.SafeFileHandle file,
      System.Text.StringBuilder path, uint capacity, uint flags);
  [DllImport("user32.dll", SetLastError=true, CharSet=CharSet.Unicode)]
  public static extern uint RegisterWindowMessageW(string name);
  [DllImport("user32.dll", SetLastError=true)]
  public static extern bool PostMessageW(IntPtr window, uint message, UIntPtr sequence, IntPtr phase);
  public static bool OwnsProcess(IntPtr process, uint processId, long creation) {
    FT created, exited, kernel, user;
    return creation > 0 && GetProcessId(process) == processId &&
      GetProcessTimes(process, out created, out exited, out kernel, out user) &&
      (((ulong)created.high << 32) | created.low) == (ulong)creation;
  }
  private static void RequirePath(Microsoft.Win32.SafeHandles.SafeFileHandle file, string path) {
    var resolved = new System.Text.StringBuilder(4096);
    uint length = GetFinalPathNameByHandleW(file, resolved, 4096, 0);
    string expected = @"\\?\" + System.IO.Path.GetFullPath(path);
    if (length == 0 || length >= 4096 || !String.Equals(resolved.ToString(), expected, StringComparison.OrdinalIgnoreCase))
      throw new System.IO.IOException("Probe path is not the exact local file");
  }
  private static void RequireDirectory(string path) {
    string parent = System.IO.Path.GetDirectoryName(System.IO.Path.GetFullPath(path));
    if ((System.IO.File.GetAttributes(parent) & (System.IO.FileAttributes.ReparsePoint | System.IO.FileAttributes.Directory)) != System.IO.FileAttributes.Directory)
      throw new System.IO.IOException("Probe directory is unavailable or redirected");
  }
  private static bool SameInfo(FileInfo a, FileInfo b) {
    return a.attributes == b.attributes && a.volume == b.volume &&
      a.sizeHigh == b.sizeHigh && a.sizeLow == b.sizeLow &&
      a.indexHigh == b.indexHigh && a.indexLow == b.indexLow &&
      a.written.low == b.written.low && a.written.high == b.written.high;
  }
  public static ProbeFile ReadProbeFile(string path, int maximum) {
    if (maximum <= 0 || maximum > 8192) throw new ArgumentOutOfRangeException("maximum");
    RequireDirectory(path);
    using (var file = CreateFileW(path, 0x80000000, 1, IntPtr.Zero, 3, 0x00200000, IntPtr.Zero)) {
      if (file.IsInvalid) {
        int error = Marshal.GetLastWin32Error();
        if (error == 2 || error == 3) return null;
        throw new System.IO.IOException("Probe file could not be opened");
      }
      FileInfo before, after;
      if (GetFileType(file) != 1 || !GetFileInformationByHandle(file, out before) ||
          (before.attributes & 0x410) != 0 || before.sizeHigh != 0 ||
          before.sizeLow == 0 || before.sizeLow > maximum)
        throw new System.IO.IOException("Probe file type or size is invalid");
      RequirePath(file, path);
      byte[] bytes = new byte[(int)before.sizeLow];
      using (var stream = new System.IO.FileStream(file, System.IO.FileAccess.Read)) {
        int offset = 0;
        while (offset < bytes.Length) {
          int count = stream.Read(bytes, offset, bytes.Length-offset);
          if (count == 0) throw new System.IO.IOException("Probe file is incomplete");
          offset += count;
        }
        if (stream.ReadByte() != -1 || !GetFileInformationByHandle(file, out after) || !SameInfo(before, after))
          throw new System.IO.IOException("Probe file changed during its bounded read");
      }
      string text = new System.Text.UTF8Encoding(false, true).GetString(bytes);
      string hash;
      using (var sha = System.Security.Cryptography.SHA256.Create())
        hash = BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-", "").ToLowerInvariant();
      return new ProbeFile { Bytes=bytes, Text=text, Sha256=hash };
    }
  }
  private static void WriteNew(string path, byte[] bytes) {
    RequireDirectory(path);
    using (var file = CreateFileW(path, 0x40000000, 0, IntPtr.Zero, 1, 0x80200000, IntPtr.Zero)) {
      if (file.IsInvalid) throw new System.IO.IOException("Probe evidence destination already exists or is unavailable");
      RequirePath(file, path);
      using (var stream = new System.IO.FileStream(file, System.IO.FileAccess.Write)) {
        stream.Write(bytes, 0, bytes.Length);
        stream.Flush(true);
      }
    }
  }
  public static void RetainProbeFile(string path, ProbeFile value) {
    if (value == null || value.Bytes == null || value.Bytes.Length == 0 || value.Bytes.Length > 8192)
      throw new ArgumentException("Invalid probe evidence");
    WriteNew(path, value.Bytes);
    var copied = ReadProbeFile(path, 8192);
    if (copied == null || copied.Bytes.Length != value.Bytes.Length || copied.Sha256 != value.Sha256)
      throw new System.IO.IOException("Probe retained bytes do not match their source");
  }
  public static void PublishProbeRequest(string path, string text) {
    byte[] bytes = new System.Text.UTF8Encoding(false, true).GetBytes(text);
    if (bytes.Length == 0 || bytes.Length > 2048) throw new ArgumentException("Probe request exceeds its byte limit");
    string temporary = path + ".tmp";
    WriteNew(temporary, bytes);
    // File.Move on .NET Framework refuses an existing destination. The native
    // receiver never opens the temporary name or a partially written request.
    System.IO.File.Move(temporary, path);
  }
  public static void ValidateProbeJson(string text) {
    // The fixed native protocol uses object records, ASCII strings, integers,
    // booleans and null only. Reject duplicate/case-aliased keys before PS 5.1
    // materializes properties. This is deliberately not a general JSON reader.
    int position = 0;
    ReadJsonObject(text, ref position, 0);
    SkipJsonSpace(text, ref position);
    if (position != text.Length) throw new FormatException("Trailing probe JSON data");
  }
  private static void SkipJsonSpace(string text, ref int p) {
    while (p < text.Length && (text[p]==' ' || text[p]=='\r' || text[p]=='\n' || text[p]=='\t')) p++;
  }
  private static string ReadJsonString(string text, ref int p) {
    if (p >= text.Length || text[p++] != '"') throw new FormatException("Invalid probe JSON string");
    int start = p;
    while (p < text.Length && text[p] != '"') {
      if (text[p] < 32 || text[p] > 126 || text[p] == '\\' || p-start >= 256)
        throw new FormatException("Unsupported probe JSON string");
      p++;
    }
    if (p >= text.Length) throw new FormatException("Unterminated probe JSON string");
    return text.Substring(start, p++-start);
  }
  private static void ReadJsonObject(string text, ref int p, int depth) {
    SkipJsonSpace(text, ref p);
    if (depth > 8 || p >= text.Length || text[p++] != '{') throw new FormatException("Invalid probe JSON object");
    var keys = new System.Collections.Generic.Dictionary<string, bool>(StringComparer.OrdinalIgnoreCase);
    SkipJsonSpace(text, ref p);
    if (p < text.Length && text[p] == '}') { p++; return; }
    while (true) {
      string key = ReadJsonString(text, ref p);
      if (keys.Count >= 32 || keys.ContainsKey(key)) throw new FormatException("Duplicate or excessive probe JSON keys");
      keys.Add(key, true);
      SkipJsonSpace(text, ref p);
      if (p >= text.Length || text[p++] != ':') throw new FormatException("Invalid probe JSON separator");
      SkipJsonSpace(text, ref p);
      if (p >= text.Length) throw new FormatException("Missing probe JSON value");
      if (text[p] == '{') ReadJsonObject(text, ref p, depth+1);
      else if (text[p] == '"') ReadJsonString(text, ref p);
      else if (text[p] == '-' || (text[p] >= '0' && text[p] <= '9')) {
        int start = p;
        if (text[p] == '-') p++;
        if (p >= text.Length || text[p] < '0' || text[p] > '9') throw new FormatException("Invalid probe JSON integer");
        if (text[p] == '0') p++;
        else while (p < text.Length && text[p] >= '0' && text[p] <= '9') p++;
        if (p < text.Length && text[p] == '.') {
          p++; int digits = p;
          while (p < text.Length && text[p] >= '0' && text[p] <= '9') p++;
          if (p == digits) throw new FormatException("Invalid probe JSON fraction");
        }
        if (p < text.Length && (text[p] == 'e' || text[p] == 'E')) {
          p++; if (p < text.Length && (text[p] == '+' || text[p] == '-')) p++;
          int digits = p;
          while (p < text.Length && text[p] >= '0' && text[p] <= '9') p++;
          if (p == digits) throw new FormatException("Invalid probe JSON exponent");
        }
        double number;
        if (!Double.TryParse(text.Substring(start,p-start), System.Globalization.NumberStyles.Float,
            System.Globalization.CultureInfo.InvariantCulture, out number) || Double.IsNaN(number) || Double.IsInfinity(number))
          throw new FormatException("Probe JSON number overflow");
      } else {
        string literal = null;
        foreach (string value in new[] { "true", "false", "null" }) {
          if (p+value.Length <= text.Length && String.CompareOrdinal(text,p,value,0,value.Length)==0) { literal=value; break; }
        }
        if (literal == null) throw new FormatException("Unsupported probe JSON value");
        p += literal.Length;
      }
      SkipJsonSpace(text, ref p);
      if (p < text.Length && text[p] == '}') { p++; return; }
      if (p >= text.Length || text[p++] != ',') throw new FormatException("Invalid probe JSON continuation");
      SkipJsonSpace(text, ref p);
    }
  }
  public static double ChangedPixels(string before, string after, int x, int y, int width, int height) {
    using (Bitmap a=new Bitmap(before)) using (Bitmap b=new Bitmap(after)) {
      if (a.Size != b.Size) throw new InvalidOperationException("Contrast captures have different window sizes");
      int left=Math.Max(0,x), top=Math.Max(0,y), right=Math.Min(a.Width,x+width), bottom=Math.Min(a.Height,y+height);
      if (right<=left || bottom<=top) throw new InvalidOperationException("Native navigation capture region is empty");
      long changed=0, total=0;
      for (int row=top; row<bottom; row+=2) for (int col=left; col<right; col+=2) {
        Color ca=a.GetPixel(col,row), cb=b.GetPixel(col,row); total++;
        if (Math.Abs(ca.R-cb.R)+Math.Abs(ca.G-cb.G)+Math.Abs(ca.B-cb.B)>24) changed++;
      }
      return (double)changed/total;
    }
  }
}
"@ -ReferencedAssemblies System, System.Drawing

# Fixed call sites outside loops keep this diagnostic bounded. Reporting errors
# stay secondary; labels do not read providers or identify a corrupting call.
function Write-NavigationCheckpoint([string]$label) {
  try {
    if ($label -notin @(
      "rtl-status-before",
      "rtl-status-returned",
      "rtl-toggle-poll-before",
      "rtl-toggle-poll-returned",
      "rtl-pane-bounds-before",
      "rtl-pane-bounds-returned",
      "rtl-host-bounds-before",
      "rtl-host-bounds-returned",
      "rtl-selection-before",
      "rtl-selection-returned",
      "rtl-screenshot-before",
      "rtl-screenshot-returned",
      "navigation-catch-entered",
      "navigation-finally-entered",
      "restore-contrast-before",
      "restore-contrast-returned",
      "restore-window-before",
      "restore-window-returned",
      "navigation-result-before",
      "navigation-result-returned"
    )) { return }
    Write-Host ("NYCTRON_NAVIGATION_CHECKPOINT " + $label)
  } catch {}
}

$ae = [System.Windows.Automation.AutomationElement]
$tree = [System.Windows.Automation.TreeScope]
$checks = New-Object System.Collections.Generic.List[object]
$stage = "start"
$result = "failed"
$failure = $null
$rtlWitness = @{
  schemaVersion=1; method="native-visual-icon-physical-screen"; status="not-started"; failure=$null
  limits=@{ nodes=512; depth=24; runtimeIdIntegers=32; requests=128; requestUtf8Bytes=2048; responseUtf8Bytes=8192; pollSeconds=10; pollSleepMilliseconds=100 }
  deadlineScope="shared retry-window; synchronous UIA and file calls are not cancellable by it"
  binding=$null; discovery=@{ initial=$null; final=$null; latest=$null }; pollAttempts=0; ltr=$null; latest=$null
  transport=@{ readyMatched=$null; requests=0; latestSequence=$null; latestPhase=$null; latestMatched=$null; nativeFailure=$null; ready=$null; latestResponse=$null }
}
$contrast = [NavigationAccessibilityNative]::ReadContrast()
$windowPattern = $Window.GetCurrentPattern([System.Windows.Automation.WindowPattern]::Pattern)
$originalState = $windowPattern.Current.WindowVisualState
$originalRect = $Window.Current.BoundingRectangle
$handle = [IntPtr]$Window.Current.NativeWindowHandle
function Runtime-Id($element) { return [string]::Join(",", $element.GetRuntimeId()) }
function Find-Id([string]$id) {
  $condition = New-Object System.Windows.Automation.PropertyCondition($ae::AutomationIdProperty, $id)
  $deadline = (Get-Date).AddSeconds(15)
  do {
    $element = $Window.FindFirst($tree::Descendants, $condition)
    if ($null -ne $element) { return $element }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native element '$id' did not appear"
}
function Wait-Focus($element) {
  $deadline = (Get-Date).AddSeconds(15)
  do {
    if ($element.Current.HasKeyboardFocus) { return }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Native keyboard focus did not return to '$($element.Current.Name)'"
}
function Wait-Contrast([bool]$enabled) {
  $deadline = (Get-Date).AddSeconds(15)
  do {
    $observed = [NavigationAccessibilityNative]::ReadContrast()
    if ((($observed.Flags -band 1) -ne 0) -eq $enabled) { Start-Sleep -Milliseconds 500; return $observed }
    Start-Sleep -Milliseconds 100
  } while ((Get-Date) -lt $deadline)
  throw "Windows did not apply the requested contrast mode"
}
function Native-Pane {
  $condition = New-Object System.Windows.Automation.PropertyCondition($ae::NameProperty, "NYC-Tron")
  $items = $Window.FindAll($tree::Descendants, $condition)
  $largest = $null; $area = 0
  foreach ($item in $items) {
    $r = $item.Current.BoundingRectangle
    # Rect.Empty dimensions multiply to positive infinity; they are not pane bounds.
    if ($r.IsEmpty -or $item.Current.IsOffscreen -or $r.Width -le 0 -or $r.Height -le 0) { continue }
    $paneBoundsFinite = $true
    foreach ($paneCoordinate in @($r.X, $r.Y, $r.Width, $r.Height, $r.Right, $r.Bottom, ($r.Width*$r.Height))) {
      if ([double]::IsNaN($paneCoordinate) -or [double]::IsInfinity($paneCoordinate)) { $paneBoundsFinite = $false; break }
    }
    if (-not $paneBoundsFinite) { continue }
    if ($r.Width*$r.Height -gt $area) { $area = $r.Width*$r.Height; $largest = $item }
  }
  if ($null -eq $largest) { throw "The native navigation landmark is absent" }
  return $largest
}
function Write-NativeRtlWitnessSummary {
  # Captured typed state only: no provider, process or file reads in reporting.
  try {
    function Rtl-SummaryEnum($value, [string[]]$allowed) {
      if ($value -is [string] -and $allowed -ccontains $value) { return $value }
      return $null
    }
    function Rtl-SummaryNumber($value) {
      if (($value -is [int] -or $value -is [long] -or $value -is [double] -or $value -is [uint32]) -and
          -not [double]::IsNaN([double]$value) -and -not [double]::IsInfinity([double]$value)) { return $value }
      return $null
    }
    function Rtl-SummaryCount($value, [int]$maximum) {
      $number = Rtl-SummaryNumber $value
      if ($null -ne $number -and $number -ge 0 -and $number -le $maximum -and [Math]::Floor($number) -eq $number) { return $number }
      return $null
    }
    function Rtl-SummaryBool($value) {
      if ($value -is [bool]) { return $value }
      return $null
    }
    function Rtl-SummaryRect($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{}
      foreach ($key in @("x","y","left","top","width","height","right","bottom")) { $copy[$key] = Rtl-SummaryNumber $value[$key] }
      return $copy
    }
    function Rtl-SummarySnapshot($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{ phase=(Rtl-SummaryEnum $value.phase @("ltr","rtl","rtl-final")); stable=(Rtl-SummaryBool $value.stable) }
      foreach ($role in @("owner","navigation","toggle","icon")) { $copy[$role] = Rtl-SummaryRect $value[$role] }
      return $copy
    }
    function Rtl-SummaryCounts($value) {
      if ($value -isnot [hashtable]) { return $null }
      $copy = @{ complete=(Rtl-SummaryBool $value.complete) }
      foreach ($key in @("registryEntries","nodesDiscovered","nodesRead","toggles","icons")) { $copy[$key] = Rtl-SummaryCount $value[$key] 512 }
      $copy.maxDepth = Rtl-SummaryCount $value.maxDepth 24
      return $copy
    }
    function Rtl-SummaryFile($value) {
      if ($value -isnot [hashtable]) { return $null }
      return @{
        bytes=(Rtl-SummaryCount $value.bytes 8192); retained=(Rtl-SummaryBool $value.retained)
        sha256=$(if ($value.sha256 -is [string] -and $value.sha256 -cmatch '\A[a-f0-9]{64}\z') { $value.sha256 } else { $null })
      }
    }
    $binding = $null
    if ($rtlWitness.binding -is [hashtable]) {
      $value = $rtlWitness.binding
      $binding = @{
        processId=(Rtl-SummaryCount $value.processId 2147483647); threadId=(Rtl-SummaryCount $value.threadId 2147483647)
        hwnd=$(if ($value.hwnd -is [long]) { $value.hwnd.ToString([Globalization.CultureInfo]::InvariantCulture) } else { $null })
        creationFileTime=$(if ($value.creationFileTime -is [string] -and $value.creationFileTime -cmatch '\A[1-9][0-9]{0,18}\z') { $value.creationFileTime } else { $null })
        sessionMatched=(Rtl-SummaryBool $value.sessionMatched); ownerRuntimeId=$null; native=$null
      }
      if ($value.ownerRuntimeId -is [int[]] -and $value.ownerRuntimeId.Count -gt 0 -and $value.ownerRuntimeId.Count -le 32) { $binding.ownerRuntimeId = $value.ownerRuntimeId }
      if ($value.native -is [hashtable]) {
        $binding.native = @{ identityVerified=(Rtl-SummaryBool $value.native.identityVerified); componentTag=$null }
        if (Probe-Integer $value.native.componentTag -2147483648 2147483647) { $binding.native.componentTag = $value.native.componentTag }
        foreach ($key in @("generation","navigation","root","toggle","icon")) { $binding.native[$key] = Rtl-SummaryCount $value.native[$key] 128 }
      }
    }
    $failureSummary = $null
    if ($rtlWitness.failure -is [hashtable]) {
      $failureSummary = @{
        code=(Rtl-SummaryEnum $rtlWitness.failure.code @("runtime-id-unavailable-or-over-limit","runtime-id-malformed","empty-offscreen-or-nonpositive-bounds","nonfinite-bounds","owner-hwnd-or-process-mismatch","owner-identity-changed","bounds-outside-owned-container","ltr-icon-not-stably-left","rtl-icon-not-stably-right","owned-process-changed-or-exited","probe-file-invalid-or-unreadable","probe-file-unavailable","probe-evidence-retention-failed","probe-json-invalid","owned-process-identity-unavailable","source-revision-invalid","probe-channel-unavailable","probe-message-invalid","probe-session-invalid","probe-ready-identity-or-limits-mismatch","native-probe-unavailable","native-geometry-invalid","probe-sequence-or-phase-invalid","probe-response-deadline","probe-response-already-exists","probe-request-publish-failed","probe-post-failed","probe-response-status-invalid","probe-response-identity-mismatch","native-snapshot-invalid","native-binding-invalid","native-binding-changed","native-traversal-incomplete-or-ambiguous","provider-or-native-probe-read-failed"))
        role=(Rtl-SummaryEnum $rtlWitness.failure.role @("tree","owner","navigation","toggle","icon","geometry","transport"))
      }
    }
    $revision = if ($env:GITHUB_SHA -is [string] -and $env:GITHUB_SHA -cmatch '\A[a-f0-9]{40}\z') { $env:GITHUB_SHA } else { $null }
    $summary = @{
      schemaVersion=1; summaryStatus="captured-state"; sourceRevision=$revision; method="native-visual-icon-physical-screen"
      status=(Rtl-SummaryEnum $rtlWitness.status @("not-started","binding-ltr","waiting-for-right","geometry-observed","failed"))
      failure=$failureSummary; binding=$binding; pollAttempts=(Rtl-SummaryCount $rtlWitness.pollAttempts 2147483647)
      limits=@{ nodes=512; depth=24; runtimeIdIntegers=32; requests=128; requestUtf8Bytes=2048; responseUtf8Bytes=8192; outputUtf8Bytes=8192; pollSeconds=10; pollSleepMilliseconds=100 }
      deadlineScope="shared retry-window; synchronous UIA and file calls are not cancellable by it"
      coordinateContract="same-XamlRoot-RectInt32-physical-screen"
      stabilityScope="matching-sequential-observations-not-atomic-or-render-complete"
      byteScope="UTF-8 envelope including its trailing newline; excludes runner timestamps"
      transport=@{
        readyMatched=(Rtl-SummaryBool $rtlWitness.transport.readyMatched); requests=(Rtl-SummaryCount $rtlWitness.transport.requests 128)
        latestSequence=(Rtl-SummaryCount $rtlWitness.transport.latestSequence 128); latestPhase=(Rtl-SummaryCount $rtlWitness.transport.latestPhase 2)
        latestMatched=(Rtl-SummaryBool $rtlWitness.transport.latestMatched); nativeFailure=(Probe-NativeFailure $rtlWitness.transport.nativeFailure)
        ready=(Rtl-SummaryFile $rtlWitness.transport.ready); latestResponse=(Rtl-SummaryFile $rtlWitness.transport.latestResponse)
      }
      discovery=@{ initial=(Rtl-SummaryCounts $rtlWitness.discovery.initial); final=(Rtl-SummaryCounts $rtlWitness.discovery.final); latest=(Rtl-SummaryCounts $rtlWitness.discovery.latest) }
      ltr=(Rtl-SummarySnapshot $rtlWitness.ltr); latest=(Rtl-SummarySnapshot $rtlWitness.latest)
    }
    $json = $summary | ConvertTo-Json -Depth 8 -Compress
    $envelope = "NYCTRON_RTL_WITNESS_BEGIN" + [Environment]::NewLine + $json + [Environment]::NewLine + "NYCTRON_RTL_WITNESS_END"
    if ([Text.Encoding]::UTF8.GetByteCount($envelope + [Environment]::NewLine) -gt 8192) {
      $json = @{ schemaVersion=1; summaryStatus="output-limit"; sourceRevision=$revision; outputByteLimit=8192 } | ConvertTo-Json -Compress
      $envelope = "NYCTRON_RTL_WITNESS_BEGIN" + [Environment]::NewLine + $json + [Environment]::NewLine + "NYCTRON_RTL_WITNESS_END"
    }
    if ([Text.Encoding]::UTF8.GetByteCount($envelope + [Environment]::NewLine) -le 8192) { Write-Host $envelope }
  } catch {}
}

# Runtime IDs bind the retained UIA owner only. Template roles come from the
# private native hook and are never inferred from absent accessibility peers.
function Fail-RawRtlWitness([string]$code, [string]$role = "tree") {
  $rtlWitness.status = "failed"
  $rtlWitness.failure = @{ code=$code; role=$role }
  throw "Native RTL witness: $code ($role)"
}
function Raw-RuntimeId($element, [string]$role) {
  $values = @($element.GetRuntimeId())
  if ($values.Count -eq 0 -or $values.Count -gt 32) { Fail-RawRtlWitness "runtime-id-unavailable-or-over-limit" $role }
  foreach ($value in $values) {
    if ($value -isnot [int]) { Fail-RawRtlWitness "runtime-id-malformed" $role }
  }
  return ,([int[]]$values)
}
function Raw-Rect($element, [string]$role) {
  $current = $element.Current
  $rect = $current.BoundingRectangle
  if ($rect.IsEmpty -or $current.IsOffscreen -or $rect.Width -le 0 -or $rect.Height -le 0) {
    Fail-RawRtlWitness "empty-offscreen-or-nonpositive-bounds" $role
  }
  foreach ($coordinate in @($rect.X,$rect.Y,$rect.Width,$rect.Height,$rect.Right,$rect.Bottom)) {
    if ([double]::IsNaN($coordinate) -or [double]::IsInfinity($coordinate)) {
      Fail-RawRtlWitness "nonfinite-bounds" $role
    }
  }
  return @{ x=[double]$rect.X; y=[double]$rect.Y; left=[double]$rect.Left; top=[double]$rect.Top; width=[double]$rect.Width; height=[double]$rect.Height; right=[double]$rect.Right; bottom=[double]$rect.Bottom }
}
function Same-RawRect($a, $b) {
  return $a.x -eq $b.x -and $a.y -eq $b.y -and $a.width -eq $b.width -and $a.height -eq $b.height -and $a.right -eq $b.right -and $a.bottom -eq $b.bottom
}
function Contains-RawRect($outer, $inner) {
  return $inner.x -ge $outer.x -and $inner.y -ge $outer.y -and $inner.right -le $outer.right -and $inner.bottom -le $outer.bottom
}
function Assert-RawOwner($expected) {
  $current = $Window.Current
  $observedHandle = [IntPtr]$current.NativeWindowHandle
  [uint32]$observedProcessId = 0
  $ownerThread = [NativeWindow]::GetWindowThreadProcessId($handle, [ref]$observedProcessId)
  if ($handle -eq [IntPtr]::Zero -or $observedHandle -ne $handle -or -not [NativeWindow]::IsWindow($handle) -or
      $ownerThread -eq 0 -or $observedProcessId -eq 0 -or $current.ProcessId -ne $observedProcessId) {
    Fail-RawRtlWitness "owner-hwnd-or-process-mismatch" "owner"
  }
  $identity = Raw-RuntimeId $Window "owner"
  $key = [string]::Join(",", $identity)
  if ($null -ne $expected -and ($expected.processId -ne $observedProcessId -or $expected.hwnd -ne $handle.ToInt64() -or $expected.threadId -ne $ownerThread -or $expected.key -cne $key)) {
    Fail-RawRtlWitness "owner-identity-changed" "owner"
  }
  return @{ processId=[int]$observedProcessId; hwnd=$handle.ToInt64(); threadId=[uint32]$ownerThread; runtimeId=$identity; key=$key }
}
# The fixture reports actual template visuals; no UIA Icon peer is assumed.
# All requests are observation-only. Fixed immutable files and the registered
# message bind this driver to its existing process, window and native session.
function Probe-Integer($value, [long]$minimum, [long]$maximum) {
  return ($value -is [int] -or $value -is [long] -or $value -is [double] -or $value -is [uint32]) -and
    -not [double]::IsNaN([double]$value) -and -not [double]::IsInfinity([double]$value) -and
    $value -ge $minimum -and $value -le $maximum -and [Math]::Floor([double]$value) -eq $value
}
function Probe-Fields($value, [string[]]$names) {
  if ($value -isnot [pscustomobject]) { return $false }
  $actual = @($value.PSObject.Properties.Name)
  if ($actual.Count -ne $names.Count) { return $false }
  foreach ($name in $actual) { if ($names -cnotcontains $name) { return $false } }
  return $true
}
function Probe-NativeFailure($value) {
  if ($value -is [string] -and @("object-unavailable","registration-object-unavailable","nonfinite-record","request-integer-invalid","request-file-unavailable","request-file-invalid","request-file-incomplete","response-byte-limit","response-file-create-failed","response-file-write-failed","response-file-publish-failed","process-creation-unavailable","session-unavailable","message-registration-failed","wrong-ui-thread","owner-window-unavailable","ticket-output-unavailable","component-not-mounted","registry-limit-or-prior-failure","registry-duplicate","window-observer-unavailable","registration-ticket-stale","registration-ticket-invalid","registration-failed","unregistration-failed","visual-child-count-invalid","visual-node-limit","visual-depth-limit","visual-identity-duplicate","toggle-ambiguous","toggle-unavailable","icon-ambiguous","icon-unavailable","component-unmounted-or-changed","island-unavailable","xaml-root-unavailable","xaml-root-changed","xaml-owner-mismatch","navigation-unavailable","visual-ancestry-invalid","visual-not-visible","visual-ancestry-depth-limit","visual-root-changed","visual-size-invalid","visual-transform-invalid","coordinate-converter-unavailable","screen-bounds-invalid","navigation-registration-missing","navigation-registration-ambiguous","binding-generation-mismatch","template-identity-changed","screen-bounds-outside-container","request-identity-mismatch","native-observation-failed") -ccontains $value) { return $value }
  return $null
}
function Probe-Header($value, $binding, [int]$sequence, [int]$phase) {
  return (Probe-Integer $value.schemaVersion 1 1) -and
    ($value.sourceRevision -is [string] -and $value.sourceRevision -ceq $binding.revision) -and
    ($value.session -is [string] -and $value.session -ceq $binding.session) -and
    ($value.creationFileTime -is [string] -and $value.creationFileTime -ceq $binding.creationText) -and
    (Probe-Integer $value.processId $binding.owner.processId $binding.owner.processId) -and
    ($value.windowHandle -is [string] -and $value.windowHandle -ceq $binding.hwndText) -and
    (Probe-Integer $value.threadId $binding.owner.threadId $binding.owner.threadId) -and
    (Probe-Integer $value.sequence $sequence $sequence) -and (Probe-Integer $value.phase $phase $phase) -and
    ($value.complete -is [bool] -and $value.complete)
}
function Assert-ProbeProcess($binding, [bool]$readOwner = $true) {
  if ($readOwner) { Assert-RawOwner $binding.owner | Out-Null }
  $process.Refresh()
  if ($process.HasExited -or $process.Id -ne $binding.owner.processId -or
      -not [NavigationAccessibilityNative]::OwnsProcess($process.Handle, [uint32]$binding.owner.processId, $binding.creation)) {
    Fail-RawRtlWitness "owned-process-changed-or-exited" "owner"
  }
}
function Read-ProbeRecord([string]$path, [string]$evidenceName, [int]$maximum, [bool]$allowMissing) {
  try { $file = [NavigationAccessibilityNative]::ReadProbeFile($path, $maximum) }
  catch { Fail-RawRtlWitness "probe-file-invalid-or-unreadable" "transport" }
  if ($null -eq $file) {
    if ($allowMissing) { return $null }
    Fail-RawRtlWitness "probe-file-unavailable" "transport"
  }
  $receipt = @{ bytes=$file.Bytes.Length; sha256=$file.Sha256; retained=$false }
  if ($evidenceName -ceq "navigation-probe-ready.json") { $rtlWitness.transport.ready = $receipt }
  else { $rtlWitness.transport.latestResponse = $receipt }
  try { [NavigationAccessibilityNative]::RetainProbeFile((Join-Path $OutDir $evidenceName), $file) }
  catch { Fail-RawRtlWitness "probe-evidence-retention-failed" "transport" }
  $receipt.retained = $true
  try {
    [NavigationAccessibilityNative]::ValidateProbeJson($file.Text)
    $record = $file.Text | ConvertFrom-Json
  } catch { Fail-RawRtlWitness "probe-json-invalid" "transport" }
  return $record
}
function Open-NativeRtlWitness {
  try {
    $owner = Assert-RawOwner $null
    if ($process -isnot [System.Diagnostics.Process] -or $process.Id -ne $owner.processId -or
        $ownedProcessId -ne $owner.processId -or $ownedProcessStartTime -isnot [string] -or
        $process.StartTime.ToUniversalTime().ToString("o") -cne $ownedProcessStartTime) {
      Fail-RawRtlWitness "owned-process-identity-unavailable" "owner"
    }
    if ($env:GITHUB_SHA -isnot [string] -or $env:GITHUB_SHA -cnotmatch '\A[a-f0-9]{40}\z') {
      Fail-RawRtlWitness "source-revision-invalid" "transport"
    }
    [long]$creation = $process.StartTime.ToFileTimeUtc()
    $binding = @{
      owner=$owner; creation=$creation; creationText=$creation.ToString([Globalization.CultureInfo]::InvariantCulture)
      hwndText=$owner.hwnd.ToString([Globalization.CultureInfo]::InvariantCulture)
      revision=$env:GITHUB_SHA; session=$null; sequence=0; generation=0; native=$null
    }
    Assert-ProbeProcess $binding
    try {
      $tracePath = Resolve-NativeDragTracePath $AppUserModelId $owner.processId
      $directory = [IO.Path]::GetDirectoryName($tracePath)
      $binding.prefix = Join-Path $directory ("nyctron-navigation-probe-" + $owner.processId.ToString([Globalization.CultureInfo]::InvariantCulture) + "-" + $binding.creationText)
      $binding.messageId = [NavigationAccessibilityNative]::RegisterWindowMessageW("NYCTron.Example.NavigationProbe.v1")
    } catch { Fail-RawRtlWitness "probe-channel-unavailable" "transport" }
    if ($binding.messageId -lt 0xC000 -or $binding.messageId -gt 0xFFFF) { Fail-RawRtlWitness "probe-message-invalid" "transport" }
    $ready = Read-ProbeRecord ($binding.prefix + ".ready.json") "navigation-probe-ready.json" 8192 $false
    [Guid]$session = [Guid]::Empty
    if ($ready.session -isnot [string] -or $ready.session -cnotmatch '\A\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}\z' -or
        -not [Guid]::TryParseExact($ready.session, "B", [ref]$session) -or $session -eq [Guid]::Empty) {
      Fail-RawRtlWitness "probe-session-invalid" "transport"
    }
    $binding.session = $ready.session
    $readyFields = @("schemaVersion","sourceRevision","session","creationFileTime","processId","windowHandle","threadId","sequence","phase","complete","status","messageId","requestLimit","requestBytes","responseBytes")
    if ($ready.status -ceq "unavailable") { $readyFields += "failure" }
    if (-not (Probe-Fields $ready $readyFields) -or -not (Probe-Header $ready $binding 0 0) -or
        -not (Probe-Integer $ready.messageId $binding.messageId $binding.messageId) -or
        -not (Probe-Integer $ready.requestLimit 128 128) -or -not (Probe-Integer $ready.requestBytes 2048 2048) -or
        -not (Probe-Integer $ready.responseBytes 8192 8192)) {
      Fail-RawRtlWitness "probe-ready-identity-or-limits-mismatch" "transport"
    }
    Assert-ProbeProcess $binding
    $rtlWitness.transport.readyMatched = $true
    $rtlWitness.binding = @{
      processId=$owner.processId; hwnd=$owner.hwnd; ownerRuntimeId=$owner.runtimeId; threadId=$owner.threadId
      creationFileTime=$binding.creationText; sessionMatched=$true; native=$null
    }
    if ($ready.status -cne "ready") {
      $rtlWitness.transport.nativeFailure = Probe-NativeFailure $ready.failure
      Fail-RawRtlWitness "native-probe-unavailable" "transport"
    }
    return $binding
  } catch {
    if ($null -eq $rtlWitness.failure) { $rtlWitness.status="failed"; $rtlWitness.failure=@{code="provider-or-native-probe-read-failed";role="geometry"} }
    throw
  }
}
function Probe-PixelRect($value, [string]$role) {
  if (-not (Probe-Fields $value @("x","y","left","top","width","height","right","bottom"))) {
    Fail-RawRtlWitness "native-geometry-invalid" $role
  }
  $copy = @{}
  foreach ($key in @("x","y","left","top","width","height","right","bottom")) {
    if (-not (Probe-Integer $value.$key -2147483648 2147483647)) { Fail-RawRtlWitness "native-geometry-invalid" $role }
    $copy[$key] = [long]$value.$key
  }
  if ($copy.width -le 0 -or $copy.height -le 0 -or $copy.left -ne $copy.x -or $copy.top -ne $copy.y -or
      $copy.right -ne $copy.x+$copy.width -or $copy.bottom -ne $copy.y+$copy.height) {
    Fail-RawRtlWitness "native-geometry-invalid" $role
  }
  return $copy
}
function Read-NativeRtlSnapshot($binding, [string]$phase, [DateTime]$deadline) {
  try {
    $phaseNumber = if ($phase -ceq "ltr") { 1 } elseif ($phase -cin @("rtl","rtl-final")) { 2 } else { 0 }
    if ($phaseNumber -eq 0 -or $binding.sequence -ge 128 -or
        ($phaseNumber -eq 1 -and ($binding.sequence -ne 0 -or $binding.generation -ne 0)) -or
        ($phaseNumber -eq 2 -and $binding.generation -eq 0)) {
      Fail-RawRtlWitness "probe-sequence-or-phase-invalid" "transport"
    }
    if ((Get-Date) -ge $deadline) { Fail-RawRtlWitness "probe-response-deadline" "transport" }
    $snapshot = @{ phase=$phase; stable=$false; owner=$null; navigation=$null; toggle=$null; icon=$null }
    $rtlWitness.latest = $snapshot
    $rtlWitness.discovery.latest = $null
    $rtlWitness.transport.latestResponse = $null
    Assert-ProbeProcess $binding
    $snapshot.owner = Raw-Rect $Window "owner"
    $sequence = $binding.sequence + 1
    $sequenceText = $sequence.ToString([Globalization.CultureInfo]::InvariantCulture)
    $requestPath = $binding.prefix + ".request-" + $sequenceText + ".json"
    $responsePath = $binding.prefix + ".response-" + $sequenceText + ".json"
    try {
      if ($null -ne [NavigationAccessibilityNative]::ReadProbeFile($responsePath, 8192)) {
        Fail-RawRtlWitness "probe-response-already-exists" "transport"
      }
      $request = [ordered]@{
        schemaVersion=1; sourceRevision=$binding.revision; session=$binding.session; creationFileTime=$binding.creationText
        processId=$binding.owner.processId; windowHandle=$binding.hwndText; sequence=$sequence; phase=$phaseNumber; generation=$binding.generation
      }
      $json = ($request | ConvertTo-Json -Depth 3 -Compress) + [Environment]::NewLine
      [NavigationAccessibilityNative]::PublishProbeRequest($requestPath, $json)
      $requestFile = [NavigationAccessibilityNative]::ReadProbeFile($requestPath, 2048)
      if ($null -eq $requestFile -or $requestFile.Text -cne $json) { throw "Request bytes differ" }
      [NavigationAccessibilityNative]::RetainProbeFile((Join-Path $OutDir ("navigation-probe-request-" + $sequenceText + ".json")), $requestFile)
    } catch {
      if ($null -eq $rtlWitness.failure) { $rtlWitness.status="failed"; $rtlWitness.failure=@{code="probe-request-publish-failed";role="transport"} }
      throw
    }
    Assert-ProbeProcess $binding
    if ((Get-Date) -ge $deadline) { Fail-RawRtlWitness "probe-response-deadline" "transport" }
    $binding.sequence = $sequence
    $rtlWitness.transport.requests = $sequence
    $rtlWitness.transport.latestSequence = $sequence
    $rtlWitness.transport.latestPhase = $phaseNumber
    $rtlWitness.transport.latestMatched = $false
    if (-not [NavigationAccessibilityNative]::PostMessageW($handle, [uint32]$binding.messageId, [UIntPtr]::new([uint32]$sequence), [IntPtr]$phaseNumber)) {
      Fail-RawRtlWitness "probe-post-failed" "transport"
    }
    $record = $null
    do {
      if ((Get-Date) -ge $deadline) { Fail-RawRtlWitness "probe-response-deadline" "transport" }
      Assert-ProbeProcess $binding $false
      $record = Read-ProbeRecord $responsePath ("navigation-probe-response-" + $sequenceText + ".json") 8192 $true
      if ($null -ne $record) { break }
      Start-Sleep -Milliseconds 10
    } while ($true)
    $responseFields = @("schemaVersion","sourceRevision","session","creationFileTime","processId","windowHandle","threadId","sequence","phase","complete","status")
    if ($record.status -ceq "observed") { $responseFields += "snapshot" }
    elseif ($record.status -ceq "unavailable") { $responseFields += "failure" }
    else { Fail-RawRtlWitness "probe-response-status-invalid" "transport" }
    if (-not (Probe-Fields $record $responseFields) -or -not (Probe-Header $record $binding $sequence $phaseNumber)) {
      Fail-RawRtlWitness "probe-response-identity-mismatch" "transport"
    }
    Assert-ProbeProcess $binding
    $ownerAfter = Raw-Rect $Window "owner"
    $rtlWitness.transport.latestMatched = $true
    if ($record.status -ceq "unavailable") {
      $rtlWitness.transport.nativeFailure = Probe-NativeFailure $record.failure
      Fail-RawRtlWitness "native-probe-unavailable" "transport"
    }
    $value = $record.snapshot
    if (-not (Probe-Fields $value @("binding","counts","navigation","toggle","icon","stable","coordinateContract","stabilityScope")) -or
        $value.stable -isnot [bool] -or
        $value.coordinateContract -cne "same-XamlRoot-RectInt32-physical-screen" -or
        $value.stabilityScope -cne "matching-sequential-observations-not-atomic-or-render-complete") {
      Fail-RawRtlWitness "native-snapshot-invalid" "transport"
    }
    $native = $value.binding
    if (-not (Probe-Fields $native @("generation","componentTag","navigation","root","toggle","icon","identityVerified")) -or
        -not (Probe-Integer $native.generation 1 128) -or -not (Probe-Integer $native.componentTag -2147483648 2147483647) -or
        -not (Probe-Integer $native.navigation 1 1) -or -not (Probe-Integer $native.root 2 2) -or
        -not (Probe-Integer $native.toggle 3 3) -or -not (Probe-Integer $native.icon 4 4) -or
        $native.identityVerified -isnot [bool] -or -not $native.identityVerified) {
      Fail-RawRtlWitness "native-binding-invalid" "transport"
    }
    $nativeBinding = @{}
    foreach ($key in @("generation","componentTag","navigation","root","toggle","icon")) { $nativeBinding[$key] = [long]$native.$key }
    $nativeBinding.identityVerified = $true
    if ($phaseNumber -eq 2) {
      foreach ($key in @("generation","componentTag","navigation","root","toggle","icon")) {
        if ($nativeBinding[$key] -ne $binding.native[$key]) { Fail-RawRtlWitness "native-binding-changed" "transport" }
      }
    }
    $counts = $value.counts
    if (-not (Probe-Fields $counts @("registryEntries","nodesDiscovered","nodesRead","maxDepth","toggles","icons","complete")) -or
        -not (Probe-Integer $counts.registryEntries 1 1) -or -not (Probe-Integer $counts.nodesDiscovered 1 512) -or
        -not (Probe-Integer $counts.nodesRead $counts.nodesDiscovered $counts.nodesDiscovered) -or
        -not (Probe-Integer $counts.maxDepth 0 24) -or -not (Probe-Integer $counts.toggles 1 1) -or
        -not (Probe-Integer $counts.icons 1 1) -or $counts.complete -isnot [bool] -or -not $counts.complete) {
      Fail-RawRtlWitness "native-traversal-incomplete-or-ambiguous" "transport"
    }
    $countCopy = @{ complete=$true }
    foreach ($key in @("registryEntries","nodesDiscovered","nodesRead","maxDepth","toggles","icons")) { $countCopy[$key] = [long]$counts.$key }
    $rtlWitness.discovery.latest = $countCopy
    if ($phaseNumber -eq 1) { $rtlWitness.discovery.initial = $countCopy }
    if ($phase -ceq "rtl-final") { $rtlWitness.discovery.final = $countCopy }
    foreach ($role in @("navigation","toggle","icon")) { $snapshot[$role] = Probe-PixelRect $value.$role $role }
    if (-not (Contains-RawRect $snapshot.owner $snapshot.navigation) -or
        -not (Contains-RawRect $snapshot.navigation $snapshot.toggle) -or -not (Contains-RawRect $snapshot.toggle $snapshot.icon)) {
      Fail-RawRtlWitness "bounds-outside-owned-container" "geometry"
    }
    if ($phaseNumber -eq 1) {
      $binding.generation = $nativeBinding.generation
      $binding.native = $nativeBinding
      $rtlWitness.binding.native = $nativeBinding
    }
    $snapshot.stable = $value.stable -and (Same-RawRect $snapshot.owner $ownerAfter)
    return $snapshot
  } catch {
    if ($null -eq $rtlWitness.failure) { $rtlWitness.status="failed"; $rtlWitness.failure=@{code="provider-or-native-probe-read-failed";role="geometry"} }
    throw
  }
}
function Test-RawRtlMirrored($ltrSnapshot, $rtlSnapshot) {
  if (-not $ltrSnapshot.stable -or -not $rtlSnapshot.stable) { return $false }
  foreach ($role in @("owner","navigation","toggle")) {
    if (-not (Same-RawRect $ltrSnapshot[$role] $rtlSnapshot[$role])) { return $false }
  }
  if ($ltrSnapshot.icon.width -ne $rtlSnapshot.icon.width -or $ltrSnapshot.icon.height -ne $rtlSnapshot.icon.height -or $ltrSnapshot.icon.y -ne $rtlSnapshot.icon.y) { return $false }
  return $ltrSnapshot.icon.right -le $ltrSnapshot.toggle.x+$ltrSnapshot.toggle.width/2 -and
    $rtlSnapshot.icon.x -ge $rtlSnapshot.toggle.x+$rtlSnapshot.toggle.width/2
}
try {
  $windowPattern.SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Maximized)
  [NativeWindow]::SetForegroundWindow($handle) | Out-Null
  $homeItem = Find-ByName $Window "Home"
  $workspace = Find-ByName $Window "Workspace"
  Assert-Selection $homeItem $workspace "workspace" "accessibility-start"

  $stage = "settings-focus-return"
  $settings = Find-Id "SettingsItem"
  $settings.SetFocus()
  [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
  Find-ByName $Window "Settings opened without changing the committed route." | Out-Null
  Invoke-Button $Window "Close settings"
  Wait-Focus $settings
  Assert-Selection $homeItem $workspace "workspace" $stage
  $checks.Add(@{ name=$stage; focusedName=$settings.Current.Name; nativeRuntimeId=(Runtime-Id $settings) })

  $stage = "resize-retains-selection-and-focus"
  $windowPattern.SetWindowVisualState([System.Windows.Automation.WindowVisualState]::Normal)
  $work = [System.Windows.Forms.Screen]::FromHandle($handle).WorkingArea
  $wide = [Math]::Min(1080, $work.Width-32)
  $narrow = [Math]::Max(640, $wide-220)
  if ($wide-$narrow -lt 100) { throw "The runner work area cannot exercise two distinct desktop sizes" }
  $height = [Math]::Min(760, $work.Height-32)
  $identity = Runtime-Id $workspace
  $rects = @()
  foreach ($width in @($wide, $narrow, $wide)) {
    $workspace.SetFocus()
    if (-not [NavigationAccessibilityNative]::SetWindowPos($handle, [IntPtr]::Zero, $work.X+16, $work.Y+16, $width, $height, 0x14)) { throw "Native window resize failed" }
    $deadline = (Get-Date).AddSeconds(10)
    do {
      Start-Sleep -Milliseconds 100
      $r = $Window.Current.BoundingRectangle
      if ([Math]::Abs($r.Width-$width) -lt 12 -and [Math]::Abs($r.Height-$height) -lt 12) { break }
    } while ((Get-Date) -lt $deadline)
    if ([Math]::Abs($r.Width-$width) -ge 12 -or [Math]::Abs($r.Height-$height) -ge 12) { throw "The actual window did not reach the requested size" }
    $workspace = Find-ByName $Window "Workspace"
    $homeItem = Find-ByName $Window "Home"
    Wait-Focus $workspace
    if ((Runtime-Id $workspace) -ne $identity) { throw "Resize replaced the native selected item" }
    Assert-Selection $homeItem $workspace "workspace" "resize-$width"
    $rects += @{ x=$r.X; y=$r.Y; width=$r.Width; height=$r.Height }
  }
  Save-Screenshot "navigation-resize" $Window
  $checks.Add(@{ name=$stage; observedBounds=$rects; nativeRuntimeId=$identity })

  $stage = "native-rtl-and-physical-left-pane"
  $rtlWitness.status = "binding-ltr"
  $nativeBinding = Open-NativeRtlWitness
  $ltrSnapshot = Read-NativeRtlSnapshot $nativeBinding "ltr" ((Get-Date).AddSeconds(10))
  $rtlWitness.ltr = $ltrSnapshot
  if (-not $ltrSnapshot.stable -or $ltrSnapshot.icon.right -gt $ltrSnapshot.toggle.x+$ltrSnapshot.toggle.width/2) {
    Fail-RawRtlWitness "ltr-icon-not-stably-left" "geometry"
  }
  $ltr = $ltrSnapshot.toggle
  Invoke-Button $Window "Use RTL navigation"
  Write-NavigationCheckpoint "rtl-status-before"
  Find-ByName $Window "Navigation direction: rtl" | Out-Null
  Write-NavigationCheckpoint "rtl-status-returned"
  Write-NavigationCheckpoint "rtl-toggle-poll-before"
  $deadline = (Get-Date).AddSeconds(10)
  $rtlWitness.status = "waiting-for-right"
  do {
    Start-Sleep -Milliseconds 100
    $rtlWitness.pollAttempts++
    $rtlSnapshot = Read-NativeRtlSnapshot $nativeBinding "rtl" $deadline
    $rtlMirrored = Test-RawRtlMirrored $ltrSnapshot $rtlSnapshot
  } while (-not $rtlMirrored -and (Get-Date) -lt $deadline)
  # A final complete native walk rechecks the same weak template identities.
  # It shares the original deadline and never replaces a failed observation.
  if ($rtlMirrored) {
    $rtlSnapshot = Read-NativeRtlSnapshot $nativeBinding "rtl-final" $deadline
    $rtlMirrored = Test-RawRtlMirrored $ltrSnapshot $rtlSnapshot
  }
  $rtl = $rtlSnapshot.toggle
  Write-NavigationCheckpoint "rtl-toggle-poll-returned"
  Write-NavigationCheckpoint "rtl-pane-bounds-before"
  $paneRect = $rtlSnapshot.navigation
  Write-NavigationCheckpoint "rtl-pane-bounds-returned"
  Write-NavigationCheckpoint "rtl-host-bounds-before"
  $hostRect = $rtlSnapshot.owner
  Write-NavigationCheckpoint "rtl-host-bounds-returned"
  if (-not $rtlMirrored) {
    $rtlWitness.status="failed"; $rtlWitness.failure=@{ code="rtl-icon-not-stably-right"; role="geometry" }
    throw "The actual native pane toggle did not mirror for RTL"
  }
  $rtlWitness.status = "geometry-observed"
  if ($paneRect.Right -gt $hostRect.Left+$hostRect.Width/2) { throw "RTL moved the Windows drawer away from the physical left" }
  Write-NavigationCheckpoint "rtl-selection-before"
  Assert-Selection $homeItem $workspace "workspace" $stage
  Write-NavigationCheckpoint "rtl-selection-returned"
  Write-NavigationCheckpoint "rtl-screenshot-before"
  Save-Screenshot "navigation-rtl" $Window
  Write-NavigationCheckpoint "rtl-screenshot-returned"
  $checks.Add(@{ name=$stage; ltrToggleX=$ltr.X; rtlToggleX=$rtl.X; paneLeft=$paneRect.Left; paneRight=$paneRect.Right; hostLeft=$hostRect.Left })
  Invoke-Button $Window "Use LTR navigation"
  Find-ByName $Window "Navigation direction: ltr" | Out-Null

  $stage = "native-pane-collapse-and-restore"
  Invoke-Button $Window "Close pane"
  Find-ByName $Window "Open pane" | Out-Null
  Start-Sleep -Milliseconds 500
  $closedWidth = (Native-Pane).Current.BoundingRectangle.Width
  Invoke-Button $Window "Open pane"
  Find-ByName $Window "Close pane" | Out-Null
  Start-Sleep -Milliseconds 500
  $openWidth = (Native-Pane).Current.BoundingRectangle.Width
  if ($closedWidth -ge $openWidth-100) { throw "The actual native drawer did not collapse and expand" }
  Assert-Selection $homeItem $workspace "workspace" $stage
  $checks.Add(@{ name=$stage; closedWidth=$closedWidth; openWidth=$openWidth })

  $stage = "high-contrast-native-repaint-and-input"
  if (($contrast.Flags -band 2) -eq 0) { throw "High contrast is unavailable in this Windows desktop session" }
  [NavigationAccessibilityNative]::SetContrast($contrast, $false)
  Wait-Contrast $false | Out-Null
  $workspace.SetFocus()
  Save-Screenshot "navigation-contrast-before" $Window
  $a = $homeItem.Current.BoundingRectangle; $b = $workspace.Current.BoundingRectangle
  $hostRect = $Window.Current.BoundingRectangle
  $x = [int]([Math]::Min($a.Left,$b.Left)-$hostRect.Left)
  $y = [int]([Math]::Min($a.Top,$b.Top)-$hostRect.Top)
  $w = [int]([Math]::Max($a.Right,$b.Right)-[Math]::Min($a.Left,$b.Left))
  $h = [int]([Math]::Max($a.Bottom,$b.Bottom)-[Math]::Min($a.Top,$b.Top))
  [NavigationAccessibilityNative]::SetContrast($contrast, $true)
  $enabled = Wait-Contrast $true
  Assert-Selection $homeItem $workspace "workspace" $stage
  $workspace.SetFocus(); Wait-Focus $workspace
  Save-Screenshot "navigation-high-contrast" $Window
  $fraction = [NavigationAccessibilityNative]::ChangedPixels((Join-Path $OutDir "navigation-contrast-before.png"), (Join-Path $OutDir "navigation-high-contrast.png"), $x,$y,$w,$h)
  if ($fraction -lt 0.02) { throw "Windows enabled high contrast, but the native navigation capture did not repaint" }
  $checks.Add(@{ name=$stage; observedFlags=$enabled.Flags; nativeChangedPixelFraction=$fraction; region=@{x=$x;y=$y;width=$w;height=$h}; limit="Mode, repaint and input evidence; no blanket contrast-ratio or Narrator-speech claim" })
  $result = "passed"
} catch {
  $failure = $_.Exception.Message
  Write-NavigationCheckpoint "navigation-catch-entered"
  throw
} finally {
  Write-NavigationCheckpoint "navigation-finally-entered"
  Write-NativeRtlWitnessSummary
  try {
    Write-NavigationCheckpoint "restore-contrast-before"
    [NavigationAccessibilityNative]::SetContrast($contrast, (($contrast.Flags -band 1) -ne 0))
    Wait-Contrast (($contrast.Flags -band 1) -ne 0) | Out-Null
    Write-NavigationCheckpoint "restore-contrast-returned"
  } catch { $result="failed"; $failure="Could not restore original contrast mode: "+$_.Exception.Message }
  try {
    Write-NavigationCheckpoint "restore-window-before"
    if (-not [NavigationAccessibilityNative]::SetWindowPos($handle, [IntPtr]::Zero, [int]$originalRect.X, [int]$originalRect.Y, [int]$originalRect.Width, [int]$originalRect.Height, 0x14)) { throw "Native restoration of window bounds failed" }
    $windowPattern.SetWindowVisualState($originalState)
    $deadline = (Get-Date).AddSeconds(10)
    do {
      Start-Sleep -Milliseconds 100
      $r = $Window.Current.BoundingRectangle
      $restored = $windowPattern.Current.WindowVisualState -eq $originalState -and
        [Math]::Abs($r.X-$originalRect.X) -lt 12 -and [Math]::Abs($r.Y-$originalRect.Y) -lt 12 -and
        [Math]::Abs($r.Width-$originalRect.Width) -lt 12 -and [Math]::Abs($r.Height-$originalRect.Height) -lt 12
    } while (-not $restored -and (Get-Date) -lt $deadline)
    if (-not $restored) { throw "Actual window bounds/state did not return to their original values" }
    Write-NavigationCheckpoint "restore-window-returned"
  } catch { $result="failed"; $failure="Could not restore original window bounds: "+$_.Exception.Message }
  Write-NavigationCheckpoint "navigation-result-before"
  @{ status=$result; platform="windows"; sourceRevision=$env:GITHUB_SHA; processId=$Window.Current.ProcessId; stage=$stage; error=$failure; checks=$checks.ToArray(); rtlWitness=$rtlWitness; completedAt=(Get-Date).ToUniversalTime().ToString("o") } |
    ConvertTo-Json -Depth 8 | Set-Content (Join-Path $OutDir "navigation-accessibility-result.json") -Encoding UTF8
  Write-NavigationCheckpoint "navigation-result-returned"
  if ($result -ne "passed" -and $null -ne $failure) { throw $failure }
}
