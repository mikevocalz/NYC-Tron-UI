Pod::Spec.new do |s|
  s.name = 'NYCTronAcceptanceDriver'
  s.version = '1.0.0'
  s.summary = 'Native AppKit control acceptance commands for the isolated reference only'
  s.homepage = 'https://github.com/mikevocalz/NYC-Tron-UI'
  s.license = { :type => 'MIT' }
  s.author = 'NYC-Tron contributors'
  s.source = { :path => '.' }
  s.platforms = { :osx => '14.0' }
  s.source_files = '*.{mm}'
  s.dependency 'RNDesktopApp'
  s.dependency 'NYCTronAppKit'
  s.dependency 'RNDesktopDrag'
  s.osx.frameworks = 'AppKit', 'UniformTypeIdentifiers', 'ApplicationServices'
  s.pod_target_xcconfig = { 'SPARK_TEST_DRIVER' => ENV['SPARK_TEST_DRIVER_RELEASE'] == '1' ? '1' : '0', 'SPARK_TEST_DRIVER[config=Debug]' => '1', 'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) SPARK_TEST_DRIVER=$(SPARK_TEST_DRIVER)' }
  # The public popover header exposes a Fabric component. This helper merges
  # into the existing test-driver flags and supplies Fabric's private Yoga path.
  install_modules_dependencies(s)
end
