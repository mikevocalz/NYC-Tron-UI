// The key window's root view controller: the responder React Native's views
// and presented Modals all chain up to.
import UIKit

extension UIWindow {
  @MainActor
  static var keyRootViewController: UIViewController? {
    UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }?
      .rootViewController
  }
}
