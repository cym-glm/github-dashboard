<script setup>
import { onMounted } from 'vue'
import { useECharts } from '../hooks/useECharts'

const { chartRef, init, echarts } = useECharts()

const languageData = [
  { name: 'JavaScript', value: 45820 },
  { name: 'Python', value: 38650 },
  { name: 'Java', value: 32540 },
  { name: 'TypeScript', value: 28900 },
  { name: 'C++', value: 22340 },
  { name: 'Go', value: 18760 },
  { name: 'Rust', value: 15200 },
  { name: 'PHP', value: 12880 }
]

const initChart = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 20, 50, 0.95)',
      borderColor: '#00d4ff',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      formatter: '{b}: {c} 个仓库'
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#1a3d6b'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(26, 61, 107, 0.3)'
        }
      },
      axisLabel: {
        color: '#6dd5ed',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'category',
      data: languageData.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: '#1a3d6b'
        }
      },
      axisLabel: {
        color: '#fff',
        fontSize: 12
      }
    },
    series: [
      {
        type: 'bar',
        data: languageData.map(item => item.value),
        barWidth: '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#0088ff' },
            { offset: 1, color: '#00d4ff' }
          ]),
          borderRadius: [0, 5, 5, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: '#00d4ff',
          fontSize: 11
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
  <div ref="chartRef" class="chart"></div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
