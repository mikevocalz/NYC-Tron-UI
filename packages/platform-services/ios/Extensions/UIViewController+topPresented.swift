// The controller a sheet should be presented from: the key window's root,
// followed down through whatever it is already presenting (an RN Modal).
import UIKit

extension UIViewController {
  @MainActor
  static var topPresented: UIViewController? {
    let root = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }?
      .rootViewController
    var top = root
    while let presented = top?.presentedViewController, !presented.isBeingDismissed {
      top = presented
    }
    return top
  }
}
