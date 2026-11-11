package com.nyctron.instruments

import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList

@OptimizedComposeProps
data class TronPointerInputProps(val label:String="Drawing surface",val modifiers:ModifierList=emptyList()):ComposeProps
