// M1-a spike: prove that a real AppKit control surface can be instantiated,
// laid out and composited on this machine's Xcode/Swift toolchain.
//
// Builds with:  swiftc -O AppKitProof.swift -o appkit-proof
// Runs with:    ./appkit-proof [staySeconds]
//
// Prints control/window facts and WINDOWID=<CGWindowID> on stdout, then stays
// alive for `staySeconds` so the real on-screen window can be captured with:
//   screencapture -l<WINDOWID> out.png
// (CGWindowListCreateImage is obsoleted in the macOS 15+ SDK; ScreenCaptureKit
// or the screencapture CLI are the supported capture paths.)

import Cocoa
import CoreGraphics

let staySeconds = CommandLine.arguments.count > 1 ? Double(CommandLine.arguments[1]) ?? 0 : 0

let app = NSApplication.shared
app.setActivationPolicy(.accessory) // no Dock icon; still a real NSApplication

let window = NSWindow(
    contentRect: NSRect(x: 80, y: 80, width: 720, height: 420),
    styleMask: [.titled, .closable, .resizable],
    backing: .buffered,
    defer: false
)
window.title = "M1-a AppKit spike"
// Deterministic on-screen position, top-left area, away from the Dock.
if let screen = NSScreen.screens.first {
    let f = window.frame
    window.setFrameOrigin(NSPoint(x: 80, y: screen.frame.maxY - f.height - 90))
}

// Sidebar-equivalent: a real NSSegmentedControl (select-one mode) plus a
// real NSButton, hosted in an NSStackView like an NSSplitView sidebar would.
let segment = NSSegmentedControl(
    labels: ["Lessons", "Tutors", "Inbox"],
    trackingMode: .selectOne,
    target: nil,
    action: nil
)
segment.selectedSegment = 1
segment.controlSize = .regular
segment.segmentStyle = .rounded

let action = NSButton(title: "Start lesson", target: nil, action: nil)
action.bezelStyle = .rounded
action.controlSize = .regular

let sidebarStack = NSStackView(views: [segment, NSView(), action])
sidebarStack.orientation = .vertical
sidebarStack.spacing = 16
sidebarStack.edgeInsets = NSEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
sidebarStack.translatesAutoresizingMaskIntoConstraints = false
sidebarStack.widthAnchor.constraint(equalToConstant: 220).isActive = true

let detailLabel = NSTextField(labelWithString: "Detail pane - real NSTextField inside the same window")
detailLabel.font = .systemFont(ofSize: 18, weight: .medium)
detailLabel.textColor = .labelColor

let root = NSStackView(views: [sidebarStack, detailLabel])
root.orientation = .horizontal
root.spacing = 24
root.edgeInsets = NSEdgeInsets(top: 24, left: 24, bottom: 24, right: 24)
root.translatesAutoresizingMaskIntoConstraints = false
window.contentView = NSView()
window.contentView?.addSubview(root)
NSLayoutConstraint.activate([
    root.leadingAnchor.constraint(equalTo: window.contentView!.leadingAnchor),
    root.trailingAnchor.constraint(equalTo: window.contentView!.trailingAnchor),
    root.topAnchor.constraint(equalTo: window.contentView!.topAnchor),
    root.bottomAnchor.constraint(equalTo: window.contentView!.bottomAnchor),
])

window.orderFrontRegardless()
RunLoop.main.run(until: Date().addingTimeInterval(0.5))
window.contentView?.layoutSubtreeIfNeeded()

// Control-level evidence on stdout.
print("NSSegmentedControl segments=\(segment.segmentCount) selected=\(segment.selectedSegment)")
print("NSButton title=\"\(action.title)\" bezelStyle=\(action.bezelStyle.rawValue)")
print("NSWindow frame=\(NSStringFromRect(window.frame)) title=\"\(window.title)\"")

// Find this process's on-screen window number for capture.
let myPID = Int(getpid())
var windowNumber: CGWindowID = 0
if let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as? [[String: Any]] {
    for info in list {
        if let owner = info[kCGWindowOwnerPID as String] as? Int,
           owner == myPID,
           let num = info[kCGWindowNumber as String] as? CGWindowID,
           (info[kCGWindowLayer as String] as? Int) == 0 {
            windowNumber = num
            break
        }
    }
}
print("WINDOWID=\(windowNumber)")
fflush(stdout)

if staySeconds > 0 {
    RunLoop.main.run(until: Date().addingTimeInterval(staySeconds))
}
exit(0)
