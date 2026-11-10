# Native navigation focus and layout acceptance

The app owns its Settings surface and the timing of focus restoration. After
that surface closes, `binding.focusSettings()` dispatches a Fabric command to
the mounted WinUI `NavigationView` and focuses its real Settings item. After
removing a destination or changing routes, `binding.focusSelected()` requests
focus on the current native selected item. Neither command changes the route.
Both return false when no host is mounted; true records command dispatch, not
an observed focus result. A disposed binding rejects new commands. A detached
or replaced host cannot receive a later focus request.

Direct `TronNavigationView` consumers can use a React 19 ref of type
`TronNavigationViewHandle` for the same commands. Native execution only focuses
an existing, loaded, enabled control. The public app callback remains responsible
for choosing when focus should move.

An explicitly authored `style.direction` of `ltr` or `rtl` reaches the native
island. With no explicit direction, it follows `I18nManager.isRTL`. The app still
positions the Windows drawer on the physical left; reading direction is a
separate property. Microsoft's [RTL guidance](https://learn.microsoft.com/en-us/windows/apps/design/globalizing/adjust-layout-and-fonts--and-support-rtl)
describes the native `FlowDirection` behavior.

The mounted-owner regression checks request delivery, detach, replacement and
disposal. `uia-navigation-accessibility.ps1` runs inside the deployed consumer's
UIA session after native menu/inspector/drag acceptance. It observes Settings
focus return, selection and native item identity at two actual window sizes,
RTL toggle-button mirroring while the drawer stays physically left, and native
pane collapse/restoration. Its contrast case uses the documented
[Windows high-contrast API](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-highcontrastw),
requires the observed OS mode, checks native repaint and keyboard input, then
restores and observes the original mode and window bounds in `finally`.

The report records actual geometry, native item identity, contrast flags and
capture comparisons. It is tied to the tested source revision and process. The
passed-package retention step requires all five groups in addition to the other
native checks. Compilation and source tests do not establish these outcomes;
the new native workflow must execute them. Repaint evidence is not a blanket
contrast-ratio audit, Narrator speech proof or physical-device acceptance.
