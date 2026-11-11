require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))
Pod::Spec.new do |s|
  s.name = 'NYCTronAppKit'
  s.version = package['version']
  s.summary = package['description']
  s.homepage = 'https://github.com/mikevocalz/NYC-Tron-UI'
  s.license = { :type => 'MIT', :file => 'LICENSE' }
  s.author = 'NYC-Tron contributors'
  s.source = { :git => 'https://github.com/mikevocalz/NYC-Tron-UI.git', :tag => "v#{s.version}" }
  s.platforms = { :osx => '14.0' }
  s.source_files = 'macos/**/*.{h,mm}'
  s.osx.frameworks = 'AppKit', 'CoreGraphics'
  # Use the pinned RNmacOS Fabric helper for private Yoga headers, transitive
  # renderer dependencies and the matching C++ standard/compiler definitions.
  install_modules_dependencies(s)
end
