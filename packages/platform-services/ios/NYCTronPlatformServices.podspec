# @ExpoModule / @Record / @Event are Expo Modules 2 macros;
# expo-modules-autolinking loads the ExpoModulesMacros plugin into every pod
# that depends on ExpoModulesCore. No ExpoUI dependency (see NYC-Tron #36).
require 'json'
package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))
Pod::Spec.new do |s|
  s.name           = 'NYCTronPlatformServices'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = 'MIT'
  s.author         = 'NYC-Tron UI contributors'
  s.homepage       = 'https://github.com/mikevocalz/NYC-Tron-UI'
  s.source         = { git: 'https://github.com/mikevocalz/NYC-Tron-UI.git' }
  s.platforms      = { ios: '16.4' }
  s.swift_version  = '6.0'
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.frameworks = 'AVFoundation', 'CoreMedia', 'UniformTypeIdentifiers'
  s.source_files = '**/*.{swift,h,m}'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
