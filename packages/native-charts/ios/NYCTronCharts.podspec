require 'json'
package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))
Pod::Spec.new do |s|
  s.name           = 'NYCTronCharts'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = 'MIT'
  s.author         = 'NYC-Tron UI contributors'
  s.homepage       = 'https://github.com/mikevocalz/NYC-Tron-UI'
  s.source         = { git: 'https://github.com/mikevocalz/NYC-Tron-UI.git' }
  # Swift Charts ships with iOS 16; 16.4 matches @nyc-tron/native-controls.
  s.platforms      = { ios: '16.4' }
  s.swift_version  = '5.9'
  s.static_framework = true
  s.frameworks     = 'Charts'
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{swift,h,m}'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
