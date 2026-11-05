import SwiftUI
import ExpoModulesCore

struct TronChartSeries: Record {
  @Field var id: String = ""
  @Field var label: String = ""
  @Field var color: Color = .accentColor
  @Field var points: [TronChartPoint] = []
}
