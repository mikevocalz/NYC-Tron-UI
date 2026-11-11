"""Build the exact production producer in a minimal simulator host (no Expo bridge)."""
from pathlib import Path
import json, plistlib, subprocess, tempfile

root = Path(__file__).resolve().parents[3]
output = Path(tempfile.gettempdir()) / 'forge-p03-producer'
app = output / 'P03Producer.app'
app.mkdir(parents=True, exist_ok=True)
for name, extra in [
    ('cfr', ['-frames:v', '12', '-bf', '0']),
    ('vfr', ['-vf', 'select=not(mod(n\\,3))+not(mod(n\\,7))', '-frames:v', '12', '-fps_mode', 'vfr', '-bf', '0']),
    ('bframes', ['-frames:v', '12', '-bf', '2', '-g', '12']),
]:
    path = app / (name + '.mp4')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'testsrc2=size=64x64:rate=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p'] + extra + [str(path)], check=True)
    frames = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'frame=pts_time,pict_type', '-of', 'json', str(path)]))['frames']
    times = [round(float(frame['pts_time']) * 1_000_000) for frame in frames]
    assert len(times) == len(set(times)) == 12
    if name == 'vfr': assert len(set(times[i] - times[i-1] for i in range(1, len(times)))) > 1
    if name == 'bframes': assert any(frame['pict_type'] == 'B' for frame in frames)
    (app / (name + '.json')).write_text(json.dumps(times))
    (output / (name + '-ffprobe.json')).write_text(json.dumps(frames, indent=2))
    print(name, times)
(app / 'malformed.mp4').write_bytes(b'not a media container')
sdk = subprocess.check_output(['xcrun', '--sdk', 'iphonesimulator', '--show-sdk-path'], text=True).strip()
sources = ['tooling/native/presentation-index-ios/Harness.swift', 'packages/platform-services/ios/MediaSource.swift', 'packages/platform-services/ios/PresentationIndexData.swift', 'packages/platform-services/ios/DecodedImageData.swift', 'packages/platform-services/ios/Extensions/AVURLAsset+decodedImage.swift', 'packages/platform-services/ios/Extensions/CMTime+microseconds.swift', 'packages/platform-services/ios/MediaDecodeFailure.swift', 'packages/platform-services/ios/Extensions/MediaDecodeFailure+avError.swift', 'packages/platform-services/ios/Extensions/AVURLAsset+presentationIndex.swift']
subprocess.run(['xcrun', '--sdk', 'iphonesimulator', 'swiftc', '-sdk', sdk, '-target', 'arm64-apple-ios16.4-simulator', '-swift-version', '6', '-module-name', 'P03Producer', '-o', str(app / 'P03Producer')] + [str(root / p) for p in sources], check=True)
(app / 'Info.plist').write_bytes(plistlib.dumps({'CFBundleIdentifier': 'ai.nyctron.p03producer', 'CFBundleExecutable': 'P03Producer', 'CFBundleName': 'P03 Producer', 'CFBundleVersion': '1', 'CFBundleShortVersionString': '1.0', 'CFBundlePackageType': 'APPL', 'MinimumOSVersion': '16.4', 'UILaunchScreen': {}, 'LSRequiresIPhoneOS': True, 'UIDeviceFamily': [1, 2], 'UIApplicationSceneManifest': {'UIApplicationSupportsMultipleScenes': False, 'UISceneConfigurations': {'UIWindowSceneSessionRoleApplication': [{'UISceneConfigurationName': 'P03', 'UISceneDelegateClassName': 'P03Producer.ProducerScene'}]}}, 'UISupportedInterfaceOrientations': ['UIInterfaceOrientationPortrait', 'UIInterfaceOrientationLandscapeLeft', 'UIInterfaceOrientationLandscapeRight']}))
subprocess.run(['codesign', '--force', '--sign', '-', str(app)], check=True)
print(app)
