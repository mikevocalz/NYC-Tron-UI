import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Architectural boundary: the reusable player must never become a second focus owner,
// including supported Android versions predating VideoView.setAudioFocusRequest.
test('Android video uses an explicit surface/player without requesting app audio focus',()=>{
 const base=new URL('../android/src/main/java/com/nyctron/instruments/',import.meta.url);
 const owner=readFileSync(new URL('TronVideoOwner.kt',base),'utf8');
 const surface=readFileSync(new URL('TronVideoSurface.kt',base),'utf8');
 assert.match(owner,/MediaPlayer\(\)/);
 assert.match(surface,/SurfaceView\(context\)/);
 for(const source of [owner,surface])assert.doesNotMatch(source,/\bVideoView\b|\bAudioManager\b|requestAudioFocus|abandonAudioFocus/);
});
