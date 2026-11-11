"""Create an isolated source-pinned Expo decoder host; never installs dependencies."""
from pathlib import Path
import argparse, hashlib, json, os, shutil

root = Path(__file__).resolve().parents[3]
template = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--host', type=Path, default=root.parent / 'p03-decoder-native-host-reproduction')
parser.add_argument('--lab', type=Path, default=root.parent / 'forge-complete/examples/native-cadence')
args = parser.parse_args()
host, lab = args.host.resolve(), args.lab.resolve()
assert host != lab and not host.exists(), 'Use a new task-owned host path, never the existing lab'
provenance = json.loads((template / 'provenance.json').read_text())
for name, expected in provenance['sourceFiles'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, f'Source changed: {name}; review and update provenance before rebuilding'
host.mkdir(parents=True)
shutil.copytree(lab / 'ios', host / 'ios', ignore=shutil.ignore_patterns('build', 'Pods'))
shutil.copyfile(lab / 'app.json', host / 'app.json')
manifest = json.loads((lab / 'package.json').read_text())
manifest['name'] = '@nyc-tron/p03-decoder-native-host'
manifest['dependencies'] = {name: version for name, version in manifest['dependencies'].items() if name in ['expo', 'expo-constants', 'expo-file-system', 'react', 'react-native', 'zustand', '@nyc-tron/platform-services']}
manifest['dependencies']['@nyc-tron/platform-services'] = 'file:' + str(root / 'packages/platform-services')
manifest['devDependencies'].pop('react-native-video', None)
(host / 'package.json').write_text(json.dumps(manifest, indent=2) + '\n')
modules = host / 'node_modules'
modules.mkdir()
for entry in (lab / 'node_modules').iterdir():
    if entry.name == '@nyc-tron':
        scope = modules / entry.name
        scope.mkdir()
        for child in entry.iterdir():
            target = root / 'packages/platform-services' if child.name == 'platform-services' else child.resolve()
            (scope / child.name).symlink_to(target, target_is_directory=True)
    else:
        (modules / entry.name).symlink_to(entry.resolve(), target_is_directory=entry.is_dir())
# The direct symlink lets the shared-runtime resolver use Expo's own core instance.
expo = (modules / 'expo').resolve()
core = (expo.parent / 'expo-modules-core').resolve()
assert core.is_dir(), 'Expected the installed Expo dependency graph to provide expo-modules-core'
if not (modules / 'expo-modules-core').exists():
    (modules / 'expo-modules-core').symlink_to(core, target_is_directory=True)
for name in ['App.js', 'index.js', 'fixtures.json', 'QA-CONTRACT.md']:
    shutil.copyfile(template / name, host / name)
relative_tron = os.path.relpath(root, host).replace(os.sep, '/')
app = host / 'App.js'
app.write_text(app.read_text().replace('../tron-complete/', relative_tron + '/'))
helper = lab.parents[1] / 'tooling/nyc-tron-metro.cjs'
(host / 'metro.config.js').write_text("const path=require('node:path');const {getDefaultConfig}=require('expo/metro-config');const {pinToApp}=require(" + json.dumps(str(helper)) + ");const c=getDefaultConfig(__dirname);c.watchFolders=[" + json.dumps(str(root)) + "];c.resolver.nodeModulesPaths=[path.join(__dirname,'node_modules')];module.exports=pinToApp(c,{projectRoot:__dirname,packages:['react','react-native','expo','expo-modules-core','expo-file-system','zustand']});\n")
pbx = host / 'ios/NitroForgeCadenceNative.xcodeproj/project.pbxproj'
pbx.write_text(pbx.read_text().replace('ai.nitroforge.cadence.native', 'ai.nyctron.p03bridge'))
config = json.loads((host / 'app.json').read_text())
config['expo']['ios']['bundleIdentifier'] = 'ai.nyctron.p03bridge'
config['expo']['name'] = 'NYC-Tron P03 Decoder Bridge'
config['expo']['slug'] = 'nyc-tron-p03-decoder-bridge'
(host / 'app.json').write_text(json.dumps(config, indent=2) + '\n')
flows = host / '.argent/e2e'
flows.mkdir(parents=True)
shutil.copyfile(template / 'qa-p03-decoder-bridge.yaml', flows / 'qa-p03-decoder-bridge.yaml')
print(host)
print('Run all following commands with this host as cwd; default lab files are untouched.')
