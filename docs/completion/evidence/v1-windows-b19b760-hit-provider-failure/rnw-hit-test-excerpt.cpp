// Copyright (c) Microsoft Corporation. Licensed under the MIT License.
// Excerpt of react-native-windows 0.85.0; complete provenance in rnw-source.json.
  if (auto contentIsland =
          view.try_as<winrt::Microsoft::ReactNative::Composition::implementation::ContentIslandComponentView>()) {
    if (contentIsland->InnerAutomationProvider()) {
      if (auto childProvider = contentIsland->InnerAutomationProvider()->TryGetChildSiteLinkAutomationProvider()) {
        // ChildProvider is the the automation provider from the ChildSiteLink.  In the case of WinUI, this
        // is a pointer to WinUI's internal CUIAHostWindow object.
        // It seems odd, but even though this node doesn't behave as a fragment root in our case (the real fragment root
        // is the RootComponentView's UIA provider), we still use its IRawElementProviderFragmentRoot -- just so
        // we can do the ElementProviderFromPoint call.  (this was recommended by the team who did the initial
        // architecture work).
        if (auto fragmentRoot = childProvider.try_as<IRawElementProviderFragmentRoot>()) {
          com_ptr<IRawElementProviderFragment> frag;
          // WinUI then does its own hitTest inside the XAML tree.
          fragmentRoot->ElementProviderFromPoint(
              ptScreen
                  .x, // Note since we're going through IRawElementProviderFragment the coordinates are in screen space.
              ptScreen.y,
              frag.put());
          // We return the specific child provider(frag) when hosted XAML has an element
          // under the cursor. This satisfies the UIA "element at point" contract and exposes
          // the control’s patterns/properties. If the hosted tree finds nothing, we fall back
          // to the RNW container’s provider (uiaProvider) to keep the island accessible.
          // (A Microsoft_UI_Xaml!CUIAWrapper object)
          if (frag) {
            return frag.as<winrt::IUnknown>();
          }
        }
      }
    }
  }

  return uiaProvider;
