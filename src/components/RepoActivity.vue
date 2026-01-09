<script setup>
import { onMounted } from 'vue'
import { useECharts } from '../hooks/useECharts'

const { chartRef, init, echarts } = useECharts()

// 生成最近7天的数据
const generateData = () => {
  const days = []
  const commits = []
  const stars = []
  const forks = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(`${date.getMonth() + 1}/${date.getDate()}`)
    commits.push(Math.floor(Math.random() * 5000) + 3000)
    stars.push(Math.floor(Math.random() * 2000) + 1000)
    forks.push(Math.floor(Math.random() * 800) + 300)
  }
  
  return { days, commits, stars, forks }
}

const initChart = () => {
  const { days, commits, stars, forks } = generateData()

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 20, 50, 0.95)',
      borderColor: '#00d4ff',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: ['Commits', 'Stars', 'Forks'],
      textStyle: {
        color: '#fff',
        fontSize: 11
      },
      top: 0,
      right: 0
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: {
        lineStyle: {
          color: '#1a3d6b'
        }
      },
      axisLabel: {
        color: '#6dd5ed',
        fontSize: 11
      }
    },
    yAxis: {
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
    series: [
      {
        name: 'Commits',
        type: 'line',
        data: commits,
        smooth: true,
        lineStyle: {
          color: '#00d4ff',
          width: 2
        },
        itemStyle: {
          color: '#00d4ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        }
      },
      {
        name: 'Stars',
        type: 'line',
        data: stars,
        smooth: true,
        lineStyle: {
          color: '#f4e925',
          width: 2
        },
        itemStyle: {
          color: '#f4e925'
        }
      },
      {
        name: 'Forks',
        type: 'line',
        data: forks,
        smooth: true,
        lineStyle: {
          color: '#00ff88',
          width: 2
        },
        itemStyle: {
          color: '#00ff88'
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
