protocol AppKitHostProbe { func update() }
@MainActor final class AppKitHost: @MainActor AppKitHostProbe {
  func update() {}
}
