import React from "react";
import { registerRootComponent } from "expo";
import NativeReferenceApp from "./ReferenceApp";

// This entry is the ordinary-phone acceptance host. Tablet/headset runners
// supply a verified family here; live fold capability is retained by the host.
function ReferencePhone() { return React.createElement(NativeReferenceApp, { deviceFamily: "phone" }); }
registerRootComponent(ReferencePhone);
