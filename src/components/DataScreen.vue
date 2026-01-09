<script setup>
import { ref, onMounted } from 'vue'
import WorldMap from './WorldMap.vue'
import LanguageChart from './LanguageChart.vue'
import TrendingRepos from './TrendingRepos.vue'
import StatsCards from './StatsCards.vue'
import RepoActivity from './RepoActivity.vue'

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<template>
  <div class="data-screen">
    <!-- 顶部标题 -->
    <header class="screen-header">
      <div class="header-left">
        <div class="logo">📊</div>
      </div>
      <div class="header-center">
        <h1 class="title">GitHub 全球开发者数据大屏</h1>
        <p class="subtitle">Global Developer Data Dashboard</p>
      </div>
      <div class="header-right">
        <div class="time">{{ currentTime }}</div>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="screen-body">
      <!-- 左侧区域 -->
      <div class="left-panel">
        <div class="panel-item">
          <div class="panel-title">编程语言排行</div>
          <LanguageChart />
        </div>
        <div class="panel-item">
          <div class="panel-title">仓库活跃度</div>
          <RepoActivity />
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="center-panel">
        <div class="stats-row">
          <StatsCards />
        </div>
        <div class="map-container">
          <WorldMap />
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-panel">
        <div class="panel-item full">
          <div class="panel-title">热门项目</div>
          <TrendingRepos />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #0a0e27 0%, #151b3d 100%);
  padding: 20px;
  color: #fff;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.screen-header {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: linear-gradient(90deg, rgba(20, 30, 70, 0.8) 0%, rgba(10, 20, 50, 0.6) 100%);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 180, 255, 0.2);
  margin-bottom: 20px;
}

.header-left,
.header-right {
  flex: 1;
}

.logo {
  font-size: 40px;
}

.header-center {
  flex: 2;
  text-align: center;
}

.title {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(90deg, #00d4ff 0%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 4px;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #6dd5ed;
  letter-spacing: 2px;
  opacity: 0.8;
}

.time {
  text-align: right;
  font-size: 18px;
  color: #00d4ff;
  font-weight: 500;
  letter-spacing: 1px;
}

.screen-body {
  display: flex;
  gap: 20px;
  height: calc(100% - 120px);
}

.left-panel,
.right-panel {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-item {
  background: rgba(20, 30, 70, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 15px rgba(0, 180, 255, 0.1);
  flex: 1;
  overflow: hidden;
}

.panel-item.full {
  height: 100%;
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(0, 180, 255, 0.3);
  letter-spacing: 1px;
}

.stats-row {
  height: 120px;
}

.map-container {
  flex: 1;
  background: rgba(20, 30, 70, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 15px rgba(0, 180, 255, 0.1);
  overflow: hidden;
}
</style>
