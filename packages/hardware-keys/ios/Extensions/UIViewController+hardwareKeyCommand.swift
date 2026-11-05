// The action every registered UIKeyCommand sends. UIKit delivers a key
// command's action to the first responder in the chain that implements it;
// declaring it on UIViewController means the root controller the commands are
// attached to always answers, with no swizzling. The prefix keeps the
// Objective-C selector from colliding with app code.
import UIKit

extension UIViewController {
  @objc
  func nyctronHardwareKeyCommand(_ sender: UIKeyCommand) {
    HardwareKeyRouter.shared.handle(sender)
  }
}
