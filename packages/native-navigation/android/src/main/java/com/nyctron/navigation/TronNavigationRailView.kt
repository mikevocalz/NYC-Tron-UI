package com.nyctron.navigation

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.NavigationRailItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.kotlin.views.OptimizedComposeProps
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry

@OptimizedComposeProps
data class TronRailProps(
  val destinationIds: List<String> = emptyList(),
  val destinationLabels: List<String> = emptyList(),
  val destinationGlyphs: List<String> = emptyList(),
  val disabledIds: List<String> = emptyList(),
  val selectedId: String = "",
  val expanded: Boolean = false,
  val enabled: Boolean = true,
  val activeColor: String = "",
  val foregroundColor: String = "",
  val backgroundColor: String = "",
  val modifiers: ModifierList = emptyList()
) : ComposeProps

@OptimizedRecord
data class TronRailSelectPayload(@Field val id: String) : Record

private fun themedColor(hex: String, fallback: Color): Color =
  if (hex.isBlank()) fallback else
    runCatching { Color(android.graphics.Color.parseColor(hex)) }.getOrDefault(fallback)

/** Material 3 native rail. Parent host keeps it physically RIGHT. */
@Composable
fun FunctionalComposableScope.TronRailContent(
  props: TronRailProps,
  onSelect: (TronRailSelectPayload) -> Unit
) {
  val colors = MaterialTheme.colorScheme
  val container = themedColor(props.backgroundColor, colors.surface)
  val foreground = themedColor(props.foregroundColor, colors.onSurface)
  val accent = themedColor(props.activeColor, colors.primary)
  NavigationRail(
    modifier = ModifierRegistry.applyModifiers(
      props.modifiers, appContext, composableScope, globalEventDispatcher
    ).fillMaxHeight().width((if (props.expanded) 208 else 80).dp),
    containerColor = container,
    contentColor = foreground
  ) {
    Spacer(modifier = Modifier.weight(1f))
    props.destinationIds.forEachIndexed { index, id ->
      val label = props.destinationLabels.getOrNull(index) ?: id
      val glyph = props.destinationGlyphs.getOrNull(index).orEmpty()
      val disabled = !props.enabled || props.disabledIds.contains(id)
      val selected = props.selectedId == id
      NavigationRailItem(
        selected = selected,
        enabled = !disabled,
        onClick = { if (!selected) onSelect(TronRailSelectPayload(id)) },
        icon = {
          Text(
            text = if (glyph.isBlank()) label.take(1).uppercase() else glyph,
            // Replace decorative glyph speech with the destination name when
            // collapsed. Expanded rails already expose the visible label.
            // Keep the parent Material item selection/click/disabled semantics.
            modifier = Modifier.clearAndSetSemantics {
              if (!props.expanded) contentDescription = label
            },
            fontSize = 20.sp,
            color = if (selected) accent else foreground
          )
        },
        label = { if (props.expanded) Text(label, maxLines = 1) },
        alwaysShowLabel = props.expanded,
        colors = NavigationRailItemDefaults.colors(
          selectedIconColor = accent, selectedTextColor = accent,
          unselectedIconColor = foreground, unselectedTextColor = foreground,
          indicatorColor = accent.copy(alpha = .15f)
        )
      )
    }
    Spacer(modifier = Modifier.weight(1f))
  }
}
