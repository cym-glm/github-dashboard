<script setup>
import { onMounted } from 'vue'
import { useECharts } from '../hooks/useECharts'

const { chartRef, init, echarts } = useECharts()

// 模拟的 GitHub 数据（真实项目中从 API 获取）
const mockGitHubData = [
  { name: '美国', value: 125000, coords: [-95.7129, 37.0902] },
  { name: '中国', value: 98000, coords: [104.1954, 35.8617] },
  { name: '印度', value: 76000, coords: [78.9629, 20.5937] },
  { name: '英国', value: 45000, coords: [-3.4360, 55.3781] },
  { name: '德国', value: 42000, coords: [10.4515, 51.1657] },
  { name: '日本', value: 38000, coords: [138.2529, 36.2048] },
  { name: '加拿大', value: 35000, coords: [-106.3468, 56.1304] },
  { name: '法国', value: 32000, coords: [2.2137, 46.2276] },
  { name: '巴西', value: 28000, coords: [-51.9253, -14.2350] },
  { name: '俄罗斯', value: 25000, coords: [105.3188, 61.5240] },
  { name: '韩国', value: 22000, coords: [127.7669, 35.9078] },
  { name: '澳大利亚', value: 18000, coords: [133.7751, -25.2744] },
  { name: '荷兰', value: 15000, coords: [5.2913, 52.1326] },
  { name: '瑞典', value: 12000, coords: [18.6435, 60.1282] },
  { name: '西班牙', value: 11000, coords: [-3.7492, 40.4637] },
]

const initChart = async () => {
  // 加载世界地图（本地 GeoJSON，放在 public/world.json）
  try {
    const response = await fetch('/world.json')
    const worldGeoJSON = await response.json()
    echarts.registerMap('world', worldGeoJSON)
  } catch (error) {
    console.error('Failed to load world map:', error)
    return
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.seriesType === 'scatter') {
          return `${params.data.name}<br/>开发者数量: ${params.data.value[2].toLocaleString()}`
        }
        return params.name
      },
      backgroundColor: 'rgba(0, 20, 50, 0.95)',
      borderColor: '#00d4ff',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    geo: {
      map: 'world',
      roam: false,
      zoom: 1.2,
      label: {
        show: false
      },
      itemStyle: {
        areaColor: '#0f1c3f',
        borderColor: '#1a3d6b',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          areaColor: '#1a4d7a',
          borderColor: '#00d4ff',
          borderWidth: 2
        },
        label: {
          show: false
        }
      }
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: mockGitHubData.map(item => ({
          name: item.name,
          value: [...item.coords, item.value]
        })),
        symbolSize: (val) => {
          return Math.sqrt(val[2]) / 30 + 10
        },
        label: {
          show: false
        },
        itemStyle: {
          color: '#00d4ff',
          shadowBlur: 10,
          shadowColor: '#00d4ff'
        },
        emphasis: {
          scale: true,
          label: {
            show: true,
            formatter: '{b}',
            position: 'top',
            color: '#fff',
            fontSize: 12
          }
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: mockGitHubData.slice(0, 5).map(item => ({
          name: item.name,
          value: [...item.coords, item.value]
        })),
        symbolSize: (val) => {
          return Math.sqrt(val[2]) / 30 + 10
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4
        },
        label: {
          show: false
        },
        itemStyle: {
          color: '#f4e925',
          shadowBlur: 10,
          shadowColor: '#f4e925'
        }
      }
    ]
  }

  init(option)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="world-map">
    <div ref="chartRef" class="chart"></div>
    <div class="map-legend">
      <div class="legend-item">
        <span class="legend-dot hot"></span>
        <span>热门区域（Top 5）</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot normal"></span>
        <span>活跃区域</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.world-map {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(10, 20, 50, 0.8);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 5px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #fff;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.hot {
  background: #f4e925;
  box-shadow: 0 0 8px #f4e925;
}

.legend-dot.normal {
  background: #00d4ff;
  box-shadow: 0 0 8px #00d4ff;
}
</style>
