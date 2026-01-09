## GitHub 数据大屏适配方案说明

本项目的整体布局采用 **1920 × 1080 大屏设计稿**，通过缩放与自适应布局结合的方式，在 21:9、16:9 及常见分辨率的显示器上实现良好的展示效果。下面从实现方案、关键代码、难点与亮点几个方面进行说明。

---

## 一、整体适配思路

- **固定设计尺寸，整体缩放**
  - 设计层面统一以 `1920 × 1080` 为基准尺寸。
  - 页面真实分辨率可能更大或更小，通过 **等比缩放** 将该设计稿整体缩放到当前视口内。
  - 优点：所有组件（图表、卡片、地图、文字）在不同分辨率下保持比例一致，不需要为每种分辨率单独适配。

- **外层容器铺满视口**
  - `#app` 设置为 `width: 100vw; height: 100vh;`，保证应用始终占满浏览器可视区域。
  - `App.vue` 中的 `.app-wrapper` 和 `.screen-container` 负责居中与缩放，`DataScreen` 则严格以 1920×1080 为画布进行布局。

- **局部容器使用百分比 / 弹性布局**
  - 大屏内部各模块（左右面板、中间地图区域、顶部标题区）使用 `flex`、百分比高度与 `calc` 等布局方式。
  - 这样在整体缩放的基础上，内部模块之间仍保持合理的伸缩关系，不会出现某块明显“撑不满”或“压扁”的问题。

---

## 二、关键实现细节

### 1. 全局容器与缩放逻辑（App.vue）

`App.vue` 中的核心逻辑：根据当前窗口大小计算缩放比例，并作用到固定尺寸的 `.screen-container` 上：

```startLine:endLine:src/App.vue
const handleResize = () => {
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  )
  const screen = document.querySelector('.screen-container')
  if (screen) {
    screen.style.transform = `scale(${scale})`
  }
}
```

- **缩放比例计算**：  
  - 以宽度比例 `window.innerWidth / 1920` 与高度比例 `window.innerHeight / 1080` 取最小值，保证不超出屏幕。
  - 这样在 21:9 的超宽屏下，由于高度通常更紧张，`scale` 会以高度为基准；在一些比较“矮胖”的屏幕上，可能以宽度为基准。

- **容器尺寸与居中**：

```startLine:endLine:src/App.vue
.app-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.screen-container {
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  transition: transform 0.3s ease;
}
```

- `.screen-container` 固定为设计尺寸，配合 `transform: scale(...)` 实现整体等比缩放。
- `.app-wrapper` 通过 `flex` 居中，并 `overflow: hidden`，避免超出屏幕出现滚动条或黑边。

### 2. 全局样式与视口铺满（main.css）

在 `src/assets/main.css` 中对 `html、body、#app` 做了统一处理，确保大屏能完整占据视口：

```startLine:endLine:src/assets/main.css
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100vw;
  height: 100vh;
  font-weight: normal;
}
```

- 取消 Vite 默认模板中对 `#app` 的固定宽度和居中网格布局，改为大屏场景友好的全屏容器。
- 避免了浏览器窗口较大时出现内容只占中间一小块的情况。

### 3. 大屏内部网格布局（DataScreen.vue）

`DataScreen.vue` 使用 `flex` 将大屏划分为左中右三大区域，并通过固定宽度 + 自适应的方式保证整体观感：

```startLine:endLine:src/components/DataScreen.vue
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
```

- 顶部标题区占用固定高度（约 100px），主体部分使用 `height: calc(100% - 120px)` 保证剩余区域用于图表展示。
- 左右面板采用固定宽度，保证信息密集区（例如排行榜、活跃度）有稳定的布局。
- 中间区域自适应扩展，放置统计卡片和世界地图，使视觉焦点自然落在中间。

### 4. ECharts 图表的自适应

所有使用 ECharts 的组件（语言排行、仓库活跃度、世界地图）都使用统一的 `useECharts` Hook 来处理初始化与自适应：

```startLine:endLine:src/hooks/useECharts.js
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
```

- 每个图表组件内部只关心 **如何构造 option**，不再重复写实例化、resize 和销毁逻辑。
- 由于外层大屏是整体缩放，内部容器尺寸发生变化时，通过 `resize` 能保证图表内容不会被裁剪或拉伸。

---

## 三、在 21:9、16:9 等比例下的表现

- **21:9 宽屏显示器**
  - 宽度相对高度更富余，`scale` 通常由高度决定。
  - 1920×1080 画布上下贴合，高度刚好占满；左右有少量留白，由 `.app-wrapper` 居中处理。
  - 不会出现拉伸变形，比例完全与设计稿一致。

- **16:9 标准显示器 / 1080p 显示器**
  - 分辨率接近设计尺寸，缩放比例接近 `1`，几乎等于原始大小。
  - 所有元素按设计稿 1:1 呈现，是视觉设计的最佳参照环境。

- **其他常见分辨率（例如 1366×768、2K、4K）**
  - 使用相同的缩放比例计算逻辑，整体画布等比缩放。
  - 字体、间距、图表比例均随缩放等比变化，避免组件间比例失衡。

---

## 四、实现难点与解决思路

- **难点一：大屏整体缩放与布局细节的平衡**
  - 单纯使用 `transform: scale` 容易出现：
    - 容器未居中、缩放后出现滚动条；
    - 内部元素无法很好地撑满剩余空间。
  - 解决方案：
    - 统一将 `html, body, #app` 设置为 100% 宽高，外层 `.app-wrapper` 负责居中与裁剪。
    - 内部使用 `flex` + 百分比高度，保证缩放前后的空间分配一致。

- **难点二：多图表组件的自适应与性能**
  - 多处手动 `echarts.init` + `resize` + `dispose` 容易：
    - 代码重复，维护成本高；
    - 监听事件忘记移除导致内存泄漏；
    - 全量引入 ECharts 体积较大。
  - 解决方案：
    - 使用 `echarts/core` + `useECharts` Hook 实现 **按需引入 + 统一生命周期管理**。
    - 所有图表只需关注业务配置项（`option`），复用 Hook 完成实例管理和自适应。

- **难点三：世界地图数据源不可用（404）**
  - 原有方案依赖阿里云远程 `world.json`，接口变更后直接 404，导致地图空白。
  - 解决方案：
    - 将世界地图 GeoJSON 文件放入 `public/world.json`，组件中通过 `fetch('/world.json')` 本地加载并 `registerMap`。
    - 不再受外部服务稳定性影响，是大屏项目更稳妥的做法。

---

## 五、方案亮点总结

- **1）统一的 1920×1080 画布 + 等比缩放**
  - 设计与实现高度一致，便于设计稿落地。
  - 在不同分辨率、不同宽高比下都能保持一致的视觉比例。

- **2）按需引入的 ECharts Hook 设计**
  - 使用 `echarts/core` 和 `useECharts` Hook 统一管理实例、缩放、销毁。
  - 避免了全局 `import * as echarts from 'echarts'` 带来的体积与维护问题。
  - 任何新图表组件只需：
    - `const { chartRef, init, echarts } = useECharts()`
    - 构造 `option` 后调用 `init(option)` 即可。

- **3）大屏布局语义清晰，扩展性好**
  - 通过 `DataScreen` 将大屏语义化拆分为：顶部标题、左右面板、中间地图与统计区。
  - 后续新增模块（例如新增一个右侧图表、底部趋势区）都可以在现有 `flex` 架构下平滑扩展。

整体而言，本项目的大屏适配方案兼顾了 **视觉一致性、代码复用性和工程稳定性**，适合作为类似可视化运营大屏、监控大屏项目的基础模板。


