import SwiftUI
import ExpoModulesCore

struct TronPointerInputView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronPointerInputProps
  var body: some View { TronPointerSurface(props: props) }
}
