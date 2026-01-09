import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  ScatterChart,
  EffectScatterChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 按需注册 ECharts 组件
echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  CanvasRenderer
])

/**
 * 全局 ECharts Hook
 * - 负责：实例创建、窗口缩放自适应、销毁
 * - 返回：chartRef（挂载 DOM）、init（初始化）、getInstance、echarts 实例（用于注册地图等）
 */
export function useECharts() {
  const chartRef = ref(null)
  let chartInstance = null

  const resize = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }

  const init = (optionOrGetter) => {
    if (!chartRef.value) return

    chartInstance = echarts.init(chartRef.value)
    const option =
      typeof optionOrGetter === 'function'
        ? optionOrGetter(echarts)
        : optionOrGetter

    chartInstance.setOption(option)
  }

  const getInstance = () => chartInstance

  onMounted(() => {
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  })

  return {
    chartRef,
    init,
    getInstance,
    echarts
  }
}


