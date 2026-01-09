<script setup>
import { ref, onMounted } from 'vue'

const repos = ref([
  {
    name: 'tensorflow/tensorflow',
    description: '开源机器学习框架',
    language: 'Python',
    stars: 185000,
    forks: 74000,
    trend: '+1.2k'
  },
  {
    name: 'facebook/react',
    description: '用于构建用户界面的 JS 库',
    language: 'JavaScript',
    stars: 227000,
    forks: 46000,
    trend: '+856'
  },
  {
    name: 'vuejs/vue',
    description: '渐进式 JavaScript 框架',
    language: 'TypeScript',
    stars: 207000,
    forks: 34000,
    trend: '+645'
  },
  {
    name: 'microsoft/vscode',
    description: '代码编辑器',
    language: 'TypeScript',
    stars: 162000,
    forks: 28000,
    trend: '+523'
  },
  {
    name: 'vercel/next.js',
    description: 'React 框架',
    language: 'JavaScript',
    stars: 124000,
    forks: 26000,
    trend: '+412'
  },
  {
    name: 'rust-lang/rust',
    description: '系统编程语言',
    language: 'Rust',
    stars: 96000,
    forks: 12000,
    trend: '+378'
  },
  {
    name: 'golang/go',
    description: 'Go 编程语言',
    language: 'Go',
    stars: 122000,
    forks: 17000,
    trend: '+334'
  },
  {
    name: 'nodejs/node',
    description: 'Node.js JavaScript 运行时',
    language: 'JavaScript',
    stars: 106000,
    forks: 29000,
    trend: '+289'
  }
])

const languageColors = {
  'Python': '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#2b7489',
  'Rust': '#dea584',
  'Go': '#00ADD8'
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

onMounted(() => {
  // 可以添加滚动动画
})
</script>

<template>
  <div class="trending-repos">
    <div class="repos-list">
      <div 
        v-for="(repo, index) in repos" 
        :key="repo.name"
        class="repo-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="repo-rank">{{ index + 1 }}</div>
        <div class="repo-content">
          <div class="repo-header">
            <div class="repo-name">{{ repo.name }}</div>
            <div class="repo-trend">{{ repo.trend }}</div>
          </div>
          <div class="repo-description">{{ repo.description }}</div>
          <div class="repo-footer">
            <div class="repo-language">
              <span 
                class="language-dot" 
                :style="{ backgroundColor: languageColors[repo.language] }"
              ></span>
              {{ repo.language }}
            </div>
            <div class="repo-stats">
              <span class="stat-item">⭐ {{ formatNumber(repo.stars) }}</span>
              <span class="stat-item">🔱 {{ formatNumber(repo.forks) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trending-repos {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.repos-list {
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
}

.repos-list::-webkit-scrollbar {
  width: 6px;
}

.repos-list::-webkit-scrollbar-track {
  background: rgba(26, 61, 107, 0.3);
  border-radius: 3px;
}

.repos-list::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.5);
  border-radius: 3px;
}

.repos-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.7);
}

.repo-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 10px;
  background: rgba(10, 20, 50, 0.5);
  border: 1px solid rgba(0, 180, 255, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.repo-item:hover {
  border-color: #00d4ff;
  background: rgba(10, 20, 50, 0.8);
  transform: translateX(5px);
}

.repo-rank {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00d4ff 0%, #0088ff 100%);
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}

.repo-content {
  flex: 1;
  min-width: 0;
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.repo-name {
  font-size: 14px;
  font-weight: bold;
  color: #00d4ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-trend {
  font-size: 12px;
  color: #00ff88;
  flex-shrink: 0;
  margin-left: 10px;
}

.repo-description {
  font-size: 12px;
  color: #8b9dc3;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.repo-language {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6dd5ed;
}

.language-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.repo-stats {
  display: flex;
  gap: 12px;
  color: #8b9dc3;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
}
</style>
