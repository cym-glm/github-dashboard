<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  {
    title: '总仓库数',
    value: 0,
    target: 428560000,
    unit: '',
    color: '#00d4ff'
  },
  {
    title: '活跃开发者',
    value: 0,
    target: 100000000,
    unit: '',
    color: '#f4e925'
  },
  {
    title: '今日提交',
    value: 0,
    target: 8560000,
    unit: '',
    color: '#00ff88'
  },
  {
    title: 'Star 总数',
    value: 0,
    target: 15800000000,
    unit: '',
    color: '#ff6b9d'
  }
])

const formatNumber = (num) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(0) + '万'
  }
  return num.toLocaleString()
}

const animateValue = (stat, duration = 2000) => {
  const start = 0
  const end = stat.target
  const startTime = performance.now()

  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    stat.value = Math.floor(start + (end - start) * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      stat.value = end
    }
  }

  requestAnimationFrame(update)
}

onMounted(() => {
  stats.value.forEach((stat, index) => {
    setTimeout(() => {
      animateValue(stat)
    }, index * 200)
  })
})
</script>

<template>
  <div class="stats-cards">
    <div 
      v-for="stat in stats" 
      :key="stat.title"
      class="stat-card"
      :style="{ '--card-color': stat.color }"
    >
      <div class="card-content">
        <div class="card-title">{{ stat.title }}</div>
        <div class="card-value">
          {{ formatNumber(stat.value) }}{{ stat.unit }}
        </div>
      </div>
      <div class="card-glow"></div>
    </div>
  </div>
</template>

<style scoped>
.stats-cards {
  display: flex;
  gap: 15px;
  height: 100%;
  flex-wrap: nowrap;
}

.stat-card {
  flex: 1;
  background: rgba(20, 30, 70, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 0;
  flex-direction: column;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: var(--card-color);
  box-shadow: 0 0 20px rgba(0, 180, 255, 0.3);
}

.card-icon {
  font-size: 40px;
  flex-shrink: 0;
  z-index: 1;
  display: none;
}

.card-content {
  flex: 1;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.card-title {
  font-size: clamp(10px, 2vw, 14px);
  color: #6dd5ed;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.card-value {
  font-size: clamp(16px, 4vw, 28px);
  font-weight: bold;
  color: #fff;
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
  white-space: nowrap;
  max-width: 100%;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 50%,
    var(--card-color) 0%,
    transparent 60%
  );
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.stat-card:hover .card-glow {
  opacity: 0.2;
}
</style>
