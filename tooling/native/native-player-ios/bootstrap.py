"""Extend a new, isolated decoder host with the actual NYC-Tron native player."""
from pathlib import Path
import argparse, hashlib, json, os, shutil, subprocess, sys
root = Path(__file__).resolve().parents[3]
template = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--host', type=Path, default=root.parent / 'p03-native-player-host-reproduction')
parser.add_argument('--lab', type=Path, default=root.parent / 'forge-complete/examples/native-cadence')
args = parser.parse_args()
host = args.host.resolve()
provenance = json.loads((template / 'provenance.json').read_text())
for name, expected in provenance['sourceFiles'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, f'Source changed: {name}; review provenance before rebuilding'
subprocess.run([sys.executable, str(template.parent / 'presentation-bridge-ios/bootstrap.py'), '--host', str(host), '--lab', str(args.lab.resolve())], check=True)
manifest = json.loads((host / 'package.json').read_text())
manifest['dependencies']['@expo/ui'] = '58.0.27'
manifest['dependencies']['@nyc-tron/native-controls'] = 'file:' + str(root / 'packages/native-controls')
(host / 'package.json').write_text(json.dumps(manifest, indent=2) + '\n')
link = host / 'node_modules/@nyc-tron/native-controls'
if link.is_symlink(): link.unlink()
assert not link.exists(), 'Refuse to overwrite a real native-controls directory'
link.symlink_to(root / 'packages/native-controls', target_is_directory=True)
shutil.copyfile(host / 'App.js', host / 'BridgeApp.js')
for name in ['App.js', 'PlayerApp.js', 'player-fixtures.json']:
    shutil.copyfile(template / name, host / name)
p = host / 'PlayerApp.js'
p.write_text(p.read_text().replace('../tron-complete/', os.path.relpath(root, host).replace(os.sep, '/') + '/'))
p = host / 'metro.config.js'
p.write_text(p.read_text().replace("'zustand']", "'zustand','@expo/ui']"))
shutil.copyfile(template / 'qa-p03-native-player.yaml', host / '.argent/e2e/qa-p03-native-player.yaml')
print(host)
