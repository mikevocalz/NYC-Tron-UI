package com.nyctron.navigation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.NavigationRailItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
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
  val indicatorColor: String = "",
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
  // Material 3 draws the rail indicator with ShapeKeyTokens.CornerFull (a pill);
  // only its fill comes from the app theme token.
  val indicator = themedColor(props.indicatorColor, accent.copy(alpha = .15f))
  NavigationRail(
    modifier = ModifierRegistry.applyModifiers(
      props.modifiers, appContext, composableScope, globalEventDispatcher
    ).fillMaxHeight().fillMaxWidth(),
    containerColor = container,
    contentColor = foreground
  ) {
    // Keep a finite viewport within the Material rail. The content gets a
    // minimum viewport height for centering, but can grow and scroll when
    // short panes or large text need more room. No weighted scroll children.
    BoxWithConstraints(Modifier.weight(1f).fillMaxWidth()) {
      Column(
        modifier = Modifier.fillMaxWidth()
          .verticalScroll(rememberScrollState())
          .heightIn(min = maxHeight),
        verticalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally
      ) {
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
                // Inherit Material item color so disabled destinations stay dimmed.
                fontSize = 20.sp
              )
            },
            label = { if (props.expanded) Text(label, maxLines = 1) },
            alwaysShowLabel = props.expanded,
            colors = NavigationRailItemDefaults.colors(
              selectedIconColor = accent, selectedTextColor = accent,
              unselectedIconColor = foreground, unselectedTextColor = foreground,
              indicatorColor = indicator
            )
          )
        }
      }
    }
  }
}
