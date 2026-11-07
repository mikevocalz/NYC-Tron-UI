# Audio input, automation and metering implementation

Reviewed E-01, E-03, E-04, E-06, E-07, E-08, E-11, E-12, E-14, E-15, E-16 and E-33 as controlled library components with independent exports.

Transport uses host session actions and sample-clock measurements. Arming, monitoring and device/channel/sample-rate selection preserve host ownership, recording locks and permission/feedback decisions. Waveforms consume actual supplied peaks/RMS; the recording view preserves missing time windows instead of closing gaps.

Automation supports bounded custom linear/log parameters and all six modes, with explicit host capability admission. The existing lane owns point editing. VerticalFader shares LevelFader's implementation; vertical input uses RNGH 3 pan/double-tap recognizers with horizontal scroll escape, fine travel, numeric dB, visible nudge buttons, keyboard and accessibility actions. Native consumers require GestureHandlerRootView. Stereo pan reuses PanControl; surround positioning uses the supplied speaker field and host routing.

Meter sample peaks and reported true peaks remain distinct. The meter uses host monotonic timestamps for visual hold/falloff; no synthetic audio measurements or DSP are claimed. Scope/revision changes cancel obsolete operations and asynchronous failures remain visible.

Validation: the combined UI TypeScript build passed. Broad source, browser, device, DSP, latency and accessibility acceptance are deferred until the user's review. Existing horizontal fader and automation gesture adapters remain; native runtime acceptance is not claimed.
