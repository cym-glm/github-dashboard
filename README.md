# GitHub 全球开发者数据大屏

一个基于 Vue 3 + ECharts 的数据可视化大屏项目，展示 GitHub 全球开发者和仓库数据。

![Dashboard Preview](https://via.placeholder.com/1920x1080/0a0e27/00d4ff?text=GitHub+Data+Dashboard)

## ✨ 技术栈

- **Vue 3** - Composition API + Setup 语法糖（不使用 TypeScript）
- **ECharts 5** - 强大的数据可视化图表库
- **Axios** - HTTP 请求库
- **Vite** - 快速的构建工具

## 🎯 功能特性

### 1. 自适应屏幕
- ✅ 使用 scale 缩放方案，完美适配各种尺寸屏幕
- ✅ 设计尺寸：1920 x 1080
- ✅ 支持宽屏、超宽屏等多种显示器

### 2. 数据展示

**🗺️ 中间区域 - 世界地图**
- 全球 GitHub 开发者分布热力图
- 散点图展示各国开发者数量
- Top 5 国家高亮特效动画
- 交互式 tooltip 显示详细数据

**📊 左侧区域**
- 编程语言排行榜（柱状图）
- 仓库活跃度趋势（折线图 + 面积图）

**🔥 右侧区域**
- 热门项目 Top 榜单
- 实时趋势数据展示

**📈 顶部区域**
- 统计卡片：总仓库数、活跃开发者、今日提交、Star 总数
- 数字滚动动画效果

## 📁 项目结构

```
github-dashboard/
├── src/
│   ├── components/
│   │   ├── DataScreen.vue      # 主大屏容器
│   │   ├── WorldMap.vue         # 世界地图组件
│   │   ├── LanguageChart.vue    # 编程语言图表
│   │   ├── RepoActivity.vue     # 仓库活跃度图表
│   │   ├── StatsCards.vue       # 统计卡片
│   │   └── TrendingRepos.vue    # 热门项目列表
│   ├── App.vue                  # 根组件（含自适应逻辑）
│   └── main.js
├── package.json
└── vite.config.js
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看效果

### 构建生产版本
```bash
npm run build
```

## 📐 自适应方案说明

项目使用 **scale 缩放方案**实现屏幕自适应：

```javascript
const scale = Math.min(
  window.innerWidth / 1920,
  window.innerHeight / 1080
)
screen.style.transform = `scale(${scale})`
```

**优点：**
- ✅ 等比缩放，不会变形
- ✅ 实现简单，兼容性好
- ✅ 所有元素自动适配

**适用场景：**
- 固定比例的大屏展示
- 会议室、展厅等固定场景
- 不需要响应式布局的场景

## 📊 数据源说明

### 当前使用
- Mock 数据（演示用）
- 模拟的 GitHub 统计数据

### 可接入的真实数据源

**1. GitHub API**
```javascript
// 获取热门仓库
GET https://api.github.com/search/repositories?q=stars:>1000&sort=stars

// 获取语言统计
GET https://api.github.com/search/repositories?q=language:javascript

// 获取用户信息
GET https://api.github.com/users/{username}
```

**注意：** GitHub API 有速率限制
- 未认证：60 次/小时
- 认证后：5000 次/小时

**2. GitHub Archive**
```
https://www.gharchive.org/
```
提供完整的 GitHub 事件数据存档

**3. 自建数据采集**
- 定时任务爬取 GitHub Trending
- 存储到数据库（MySQL/MongoDB）
- 提供 API 接口给前端

## 🔧 接入真实 API 示例

### 方法 1：直接调用 GitHub API

在 `WorldMap.vue` 中修改：

```javascript
import axios from 'axios'

const fetchGitHubData = async () => {
  try {
    // 获取不同语言的仓库数量
    const languages = ['javascript', 'python', 'java', 'go', 'rust']
    const requests = languages.map(lang => 
      axios.get(`https://api.github.com/search/repositories`, {
        params: {
          q: `language:${lang}`,
          sort: 'stars',
          per_page: 1
        }
      })
    )
    
    const responses = await Promise.all(requests)
    const data = responses.map((res, index) => ({
      name: languages[index],
      value: res.data.total_count
    }))
    
    return data
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error)
  }
}
```

### 方法 2：使用自己的后端 API

```javascript
// 在 src 下创建 api/github.js
import axios from 'axios'

const API_BASE = 'http://your-backend-api.com'

export const getGlobalStats = () => {
  return axios.get(`${API_BASE}/api/github/global-stats`)
}

export const getLanguageRanking = () => {
  return axios.get(`${API_BASE}/api/github/languages`)
}

export const getTrendingRepos = () => {
  return axios.get(`${API_BASE}/api/github/trending`)
}
```

然后在组件中使用：

```javascript
import { getGlobalStats } from '@/api/github'

onMounted(async () => {
  const data = await getGlobalStats()
  // 更新图表数据
})
```

## 📊 图表类型说明

### 1. 世界地图 (geo + scatter)
```javascript
series: [
  {
    type: 'scatter',        // 散点图
    coordinateSystem: 'geo' // 地理坐标系
  },
  {
    type: 'effectScatter',  // 带涟漪特效的散点图
    rippleEffect: {
      scale: 3,
      period: 4
    }
  }
]
```

### 2. 柱状图 (bar)
```javascript
series: [{
  type: 'bar',
  itemStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#0088ff' },
      { offset: 1, color: '#00d4ff' }
    ])
  }
}]
```

### 3. 折线图 (line + area)
```javascript
series: [{
  type: 'line',
  smooth: true,           // 平滑曲线
  areaStyle: {},          // 面积填充
  lineStyle: {
    width: 2
  }
}]
```

## 🎨 颜色主题

```css
/* 主色调 */
--primary-color: #00d4ff;      /* 青蓝色 */
--secondary-color: #f4e925;    /* 黄色 */
--success-color: #00ff88;      /* 绿色 */
--danger-color: #ff6b9d;       /* 粉红色 */

/* 背景色 */
--bg-primary: #0a0e27;         /* 深蓝黑 */
--bg-secondary: #151b3d;       /* 深蓝 */
--bg-panel: rgba(20, 30, 70, 0.6);

/* 边框色 */
--border-color: rgba(0, 180, 255, 0.3);
```

## 🛠️ 自定义扩展

### 添加新的图表

**步骤 1：创建组件**
```bash
# 在 src/components/ 下创建新组件
touch src/components/NewChart.vue
```

**步骤 2：编写图表代码**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  const option = {
    // 你的图表配置
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div ref="chartRef" class="chart"></div>
</template>
```

**步骤 3：在 DataScreen.vue 中引入**
```vue
<script setup>
import NewChart from './NewChart.vue'
</script>

<template>
  <div class="panel-item">
    <div class="panel-title">新图表</div>
    <NewChart />
  </div>
</template>
```

### 修改布局

在 `DataScreen.vue` 的 `.screen-body` 样式中调整：

```css
.screen-body {
  display: flex;
  gap: 20px;
}

/* 调整宽度比例 */
.left-panel { width: 400px; }    /* 增加左侧宽度 */
.center-panel { flex: 1; }
.right-panel { width: 300px; }   /* 减少右侧宽度 */
```

### 更换颜色主题

创建 `src/styles/theme.css`：

```css
:root {
  --primary: #00d4ff;
  --secondary: #f4e925;
  /* ... 更多颜色变量 */
}

/* 暗色主题 */
.theme-dark {
  --primary: #1890ff;
  --bg: #001529;
}

/* 亮色主题 */
.theme-light {
  --primary: #1890ff;
  --bg: #f0f2f5;
}
```

## 🐛 常见问题

### 1. 地图不显示？

**原因：** 无法访问阿里云地图 CDN

**解决方案：**
```javascript
// 方法 1：下载地图 JSON 到本地
import worldMap from '@/assets/maps/world.json'
echarts.registerMap('world', worldMap)

// 方法 2：使用其他地图源
const response = await fetch('https://unpkg.com/echarts@5/map/json/world.json')
const worldGeoJSON = await response.json()
```

### 2. 图表错位或不显示？

**原因：** 父容器没有明确的宽高

**解决方案：**
```css
/* 确保父容器有宽高 */
.chart {
  width: 100%;
  height: 100%;  /* 必须设置 */
}

.panel-item {
  height: 400px;  /* 明确高度 */
}
```

### 3. 窗口缩放后图表变形？

**原因：** 未监听 resize 事件

**解决方案：**
```javascript
onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
```

### 4. GitHub API 速率限制？

**解决方案：**
```javascript
// 添加认证 token
axios.get('https://api.github.com/...', {
  headers: {
    'Authorization': 'token YOUR_GITHUB_TOKEN'
  }
})

// 或使用缓存
const cache = new Map()
const getCachedData = async (key, fetcher) => {
  if (cache.has(key)) {
    return cache.get(key)
  }
  const data = await fetcher()
  cache.set(key, data)
  return data
}
```

## 🚀 性能优化

### 1. 图表优化
```javascript
// 使用数据采样
series: [{
  type: 'line',
  sampling: 'lttb',  // 大数据量采样
  large: true,        // 开启大数据量优化
  largeThreshold: 2000
}]
```

### 2. 按需加载
```javascript
// 只导入需要的 ECharts 组件
import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, LineChart, ScatterChart, GridComponent, TooltipComponent, CanvasRenderer])
```

### 3. 动画优化
```javascript
// 使用 requestAnimationFrame
const animate = () => {
  // 更新逻辑
  requestAnimationFrame(animate)
}
```

## 📦 部署

### 构建
```bash
npm run build
```

### 部署到 Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 部署到 Vercel/Netlify
```bash
# 直接连接 GitHub 仓库
# 或使用 CLI
vercel deploy
# netlify deploy
```

## 📝 更新日志

### v1.0.0 (2024-01-09)
- ✨ 初始版本发布
- ✅ 支持世界地图数据展示
- ✅ 集成多种图表类型
- ✅ 实现屏幕自适应
- ✅ Mock 数据演示

## 📄 License

MIT License

## 👨‍💻 作者

Created with ❤️ using Vue 3 and ECharts

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题，欢迎通过以下方式联系：
- GitHub Issues
- Email: your-email@example.com
