# Slide authoring and presenter controls

Reviewed J-03, J-04, J-06, J-08 and J-11 through J-13.

MasterLayoutEditor exposes parent masters, placeholder type/geometry and theme inheritance, rejecting parent cycles. ThemeAndTemplateGallery shares a virtual source-backed preset gallery and theme color/font fields. ShapePresetGallery shares that gallery and adds a selected native RNGH scalar adjustment handle with actual vector preview values and numeric alternatives. Preset previews and native/vector rendering remain actual host inputs, not invented thumbnail content.

TransitionPicker admits supported effects, bounded durations, easing and automatic/manual advance, with real host preview progress. SlideNotesEditor reuses native text selection/plain-text editing or an explicit native-rich-text editor plus shared ribbon. PresenterView composes actual current/next surfaces, notes and host clock/elapsed values with scoped navigation, pause, audience-blanking and end actions. The presenter keeps seeing the current surface while the host audience display is blanked. RehearsalTimers displays supplied timing records and admits start/pause/resume/finish/save/reset by current session state; reset requires confirmation.

Validation: combined UI TypeScript build passed. Full source/browser/native drag/text, motion, presentation service and accessibility tests remain deferred until user review. Native rich text, vector geometry rendering, transition/morph playback and audience-display routing remain consuming-service acceptance. No app window contract or native manifest was changed.
