import SwiftUI

struct TronPointerSurface: UIViewRepresentable {
  @ObservedObject var props: TronPointerInputProps
  func makeUIView(context: Context) -> TronPointerCaptureView { TronPointerCaptureView() }
  func updateUIView(_ view: TronPointerCaptureView, context: Context) {
    view.accessibilityLabel = props.label
    view.emitBatch = { props.onBatch($0) }
    view.emitKey = { props.onKey($0) }
  }
  static func dismantleUIView(_ view: TronPointerCaptureView, coordinator: ()) { view.close() }
}
