<template>
  <page-layout
    title="Analytics"
    description="Track your website's search performance and visibility"
    icon="📈"
  >
    <div class="analytics-content">
      <!-- Loading state -->
      <div v-if="loading" class="centered-spin">
        <a-spin size="default" />
      </div>
      
      <!-- Domain not configured -->
      <div v-else-if="!domainConfigured" class="domain-not-configured">
        <no-site-configured @go-to-dashboard="goToDashboard" />
      </div>
      
      <!-- Domain configured - show content -->
      <div v-else>
        <!-- Pages Overview Section - Always visible regardless of GSC connection -->
        <a-card class="analytics-card">
          <template #title>
            <div class="card-title">
              <span>Pages Overview</span>
              <div class="header-actions">
                <a-button type="primary" size="small" @click="fetchPageStats">
                  Refresh Data
                </a-button>
              </div>
            </div>
          </template>
          
          <div v-if="loadingPageStats" class="centered-empty-state">
            <a-spin size="default" />
          </div>
          <div v-else class="pages-stats-container">
            <div class="pages-stats-horizontal">
              <div class="stat-item">
                <div class="stat-label">Generated</div>
                <div class="stat-value enlarged">{{ generatorCount || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Published</div>
                <div class="stat-value enlarged">{{ publishCount || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Google Indexed</div>
                <div class="stat-value enlarged">{{ googleIndexedCount || 0 }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Indexed</div>
                <div class="stat-value enlarged">{{ indexedCount || 0 }}</div>
              </div>
            </div>
          </div>
        </a-card>
        
        <!-- GSC not connected -->
        <div v-if="!isGscConnected">
          <a-card class="analytics-card">
            <template #title>
              <div class="card-title">
                <span>Google Search Console</span>
              </div>
            </template>
            
            <div class="connect-gsc-content">
              <div class="domain-info">
                <div class="domain-label">Verified Domain:</div>
                <div class="domain-value">{{ productInfo?.projectWebsite }}</div>
                <a-tag color="success">Verified</a-tag>
              </div>
              
              <div class="gsc-preview-overlay">
                <div class="mock-data-background">
                  <div class="mock-chart"></div>
                  <div class="mock-table">
                    <div class="mock-row" v-for="i in 8" :key="i"></div>
                  </div>
                  <div class="mock-sitemap">
                    <div class="mock-node" v-for="i in 5" :key="i">
                      <div class="mock-subnodes">
                        <div class="mock-subnode" v-for="j in 3" :key="j"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="overlay-content">
                  <h3>Connect Google Search Console</h3>
                  <p>Get insights about your website's search performance, including:</p>
                  <ul>
                    <li>Search traffic and impressions</li>
                    <li>Keyword rankings and click-through rates</li>
                    <li>Indexed pages and crawl status</li>
                    <li>Mobile usability and page experience</li>
                  </ul>
                  <a-button 
                    type="primary" 
                    size="large"
                    @click="connectGSC"
                    class="connect-button"
                  >
                    <GoogleOutlined />
                    Connect Google Search Console
                  </a-button>
                </div>
              </div>
            </div>
          </a-card>
        </div>
        
        <!-- GSC connected - show data -->
        <div v-else>
          <a-row :gutter="[16, 16]">
            <!-- Traffic Data Section -->
            <a-col :span="24">
              <a-card class="analytics-card">
                <template #title>
                  <div class="card-title">
                    <span>Search Traffic</span>
                    <div class="header-actions">
                      <a-space>
                        <a-select v-model:value="timeRange" style="width: 150px" @change="handleTimeRangeChange">
                          <a-select-option value="7">Last 7 days</a-select-option>
                          <a-select-option value="14">Last 14 days</a-select-option>
                          <a-select-option value="28">Last 28 days</a-select-option>
                          <a-select-option value="90">Last 3 months</a-select-option>
                        </a-select>
                        <a-select v-model:value="timeGranularity" style="width: 150px" @change="handleGranularityChange">
                          <a-select-option value="day">Daily</a-select-option>
                          <a-select-option value="week">Weekly</a-select-option>
                          <a-select-option value="month">Monthly</a-select-option>
                        </a-select>
                        <a-button type="primary" size="small" @click="refreshGscData">
                          Refresh Data
                        </a-button>
                      </a-space>
                    </div>
                  </div>
                </template>
                
                <div v-if="loadingGscData" class="centered-empty-state">
                  <a-spin size="default" />
                </div>
                <div v-else-if="gscData && gscData.length" class="gsc-data-container">
                  <div 
                    class="chart-container" 
                    ref="chartContainer" 
                    style="width: 100%; height: 400px; border: 1px solid #eee;"
                  ></div>
                  
                  <!-- Summary stats below chart -->
                  <div class="chart-summary">
                    <div class="summary-item">
                      <div class="summary-label">Date Range</div>
                      <div class="summary-value">{{ dateRange }}</div>
                    </div>
                    <div class="summary-item">
                      <div class="summary-label">Total Clicks</div>
                      <div class="summary-value">{{ totalClicks }}</div>
                    </div>
                    <div class="summary-item">
                      <div class="summary-label">Total Impressions</div>
                      <div class="summary-value">{{ totalImpressions }}</div>
                    </div>
                    <div class="summary-item">
                      <div class="summary-label">Average CTR</div>
                      <div class="summary-value">{{ averageCtr }}%</div>
                    </div>
                    <div class="summary-item">
                      <div class="summary-label">Average Position</div>
                      <div class="summary-value">{{ averagePosition }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="centered-empty-state">
                  No data available
                </div>
              </a-card>
            </a-col>
            
            <!-- Sitemap Section -->
            <a-col :span="24">
              <a-card class="analytics-card">
                <template #title>
                  <div class="card-title">
                    <span>Website Structure</span>
                    <div class="header-actions">
                      <a-space>
                        <a-button 
                          type="primary" 
                          size="small"
                          @click="handleRefreshSitemap"
                        >
                          Refresh Data
                        </a-button>
                        <a-button
                          type="primary" 
                          size="small"
                          danger
                          @click="disconnectGSC"
                        >
                          Disconnect Google Search Console
                        </a-button>
                      </a-space>
                    </div>
                  </div>
                </template>
                
                <div v-if="loadingSitemap" class="centered-empty-state">
                  <a-spin size="default" />
                </div>
                <div v-else-if="sitemapData && sitemapData.length > 0" class="sitemap-content">
                  <a-tree
                    class="sitemap-tree"
                    :tree-data="sitemapData"
                    :expanded-keys="expandedKeys"
                    @expand="onExpand"
                    @select="handleTreeSelect"
                    :auto-expand-parent="true"
                  >
                    <template #title="{ title, key }">
                      <div class="tree-node-title">
                        <span>{{ title }}</span>
                        <div>
                          <a-button
                            v-if="key !== 'empty' && !key.startsWith('folder_') && key !== 'root'"
                            type="link"
                            size="small"
                            class="visit-link"
                            @click.stop="openPreview(key)"
                          >
                            <template #icon><link-outlined /></template>
                            Visit
                          </a-button>
                        </div>
                      </div>
                    </template>
                  </a-tree>
                </div>
                <div v-else class="centered-empty-state">
                  No sitemap data available
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>

    <!-- Add GSC connection success modal -->
    <a-modal
      v-model:open="gscSuccessModalVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      class="gsc-success-modal"
    >
      <div class="success-content">
        <div class="success-icon"></div>
        <h3>Connected Successfully!</h3>
        <p>Please close this window and refresh the page</p>
      </div>
    </a-modal>
  </page-layout>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from './layout/PageLayout.vue'
import { 
  GoogleOutlined,
  GlobalOutlined,
  LinkOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import apiClient from '../api/api'
import { Modal, message } from 'ant-design-vue'
import { createVNode } from 'vue'
import NoSiteConfigured from './common/NoSiteConfigured.vue'
// Import ECharts
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

export default defineComponent({
  components: {
    PageLayout,
    GoogleOutlined,
    GlobalOutlined,
    LinkOutlined,
    ExclamationCircleOutlined,
    NoSiteConfigured
  },
  setup() {
    const router = useRouter()
    const productInfo = ref(null)
    const domainConfigured = ref(false)
    const isGscConnected = ref(false)
    const gscSuccessModalVisible = ref(false)
    const gscCheckInterval = ref(null)
    const gscData = ref(null)
    const loadingGscData = ref(false)
    const sitemapData = ref([])
    const loadingSitemap = ref(false)
    const expandedKeys = ref([])
    const totalClicks = ref(0)
    const totalImpressions = ref(0)
    const averageCtr = ref(0)
    const averagePosition = ref(0)
    const dateRange = ref('')
    const loading = ref(true)
    const totalPages = ref(0)
    const indexedPages = ref(0)
    const crawledPages = ref(0)
    const mobileFriendlyPages = ref(0)
    const loadingPageStats = ref(false)
    const generatorCount = ref(0)
    const publishCount = ref(0)
    const googleIndexedCount = ref(0)
    const indexedCount = ref(0)
    
    // Chart related refs
    const chartContainer = ref(null)
    const chart = ref(null)
    const timeRange = ref('28') // Default to 28 days
    const timeGranularity = ref('day') // Default to daily view
    
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 100,
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
        width: 400,
      },
      {
        title: 'Clicks',
        dataIndex: 'clicks',
        key: 'clicks',
        sorter: (a, b) => (a.clicks || 0) - (b.clicks || 0),
        width: 80,
        align: 'center',
      },
      {
        title: 'Impr.',
        dataIndex: 'impressions',
        key: 'impressions',
        sorter: (a, b) => (a.impressions || 0) - (b.impressions || 0),
        width: 80,
        align: 'center',
      },
      {
        title: 'CTR',
        dataIndex: 'ctr',
        key: 'ctr',
        sorter: (a, b) => (a.ctr || 0) - (b.ctr || 0),
        width: 80,
        align: 'center',
      },
      {
        title: 'Pos.',
        dataIndex: 'position',
        key: 'position',
        sorter: (a, b) => (a.position || 0) - (b.position || 0),
        width: 80,
        align: 'center',
      },
    ]

    // Load product info and check GSC status
    const loadProductInfo = async () => {
      loading.value = true
      try {
        const response = await apiClient.getProductsByCustomerId()
        if (response && response.data) {
          productInfo.value = response.data
          domainConfigured.value = response.data.domainStatus || false
          
          // Check if GSC is connected
          if (domainConfigured.value) {
            fetchPageStats();
            await checkGscStatus()
          }
        }
      } catch (error) {
        console.error('Failed to load product info:', error)
      } finally {
        loading.value = false
      }
    }

    // Check if GSC is connected
    const checkGscStatus = async () => {
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.checkGscAuth(customerId);
        
        if (
          response?.code === 1201 || 
          response?.code === 500 ||  
          response?.code !== 200     
        ) {
          isGscConnected.value = false;
          return;
        }
        
        isGscConnected.value = true;
        
        if (isGscConnected.value) {
          // Load GSC data if connected
          fetchGscData();
          fetchSitemapData();
        }
      } catch (error) {
        console.error('Failed to check GSC status:', error);
        isGscConnected.value = false;
      }
    }

    // Connect to Google Search Console
    const connectGSC = () => {
      const customerId = localStorage.getItem('currentCustomerId')
      const productId = productInfo.value?.productId
      
      if (!customerId || !productId) {
        message.error('Missing customer or product information')
        return
      }
      
      // Open GSC authorization window
      const authWindow = window.open(
        `${apiClient.baseURL}/gsc/auth?customerId=${customerId}&productId=${productId}`,
        'GSC Authorization',
        'width=600,height=600'
      )
      
      // Start checking for GSC connection status
      startGscStatusCheck()
    }

    // Start interval to check GSC connection status
    const startGscStatusCheck = () => {
      if (gscCheckInterval.value) {
        clearInterval(gscCheckInterval.value)
      }
      
      gscCheckInterval.value = setInterval(async () => {
        try {
          const response = await apiClient.checkGscStatus()
          if (response?.data?.isConnected) {
            clearInterval(gscCheckInterval.value)
            isGscConnected.value = true
            gscSuccessModalVisible.value = true
            
            // Load GSC data after successful connection
            fetchGscData()
            fetchSitemapData()
          }
        } catch (error) {
          console.error('Error checking GSC status:', error)
        }
      }, 3000)
    }

    // Handle GSC callback from popup window
    const handleGscCallback = () => {
      window.addEventListener('message', (event) => {
        if (event.data === 'gsc_connected') {
          clearInterval(gscCheckInterval.value)
          isGscConnected.value = true
          gscSuccessModalVisible.value = true
          
          // Load GSC data after successful connection
          fetchGscData()
          fetchSitemapData()
        }
      })
    }

    // Process GSC data for chart display
    const processChartData = (data) => {
      if (!data || !data.length) return { dates: [], clicks: [], impressions: [], ctr: [], position: [] }
      
      // Sort data by date (ascending)
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.keys && a.keys[0] ? new Date(a.keys[0]) : new Date(0)
        const dateB = b.keys && b.keys[0] ? new Date(b.keys[0]) : new Date(0)
        return dateA - dateB
      })
      
      // Extract data for chart
      const dates = []
      const clicks = []
      const impressions = []
      const ctr = []
      const position = []
      
      sortedData.forEach(item => {
        if (item.keys && item.keys[0]) {
          dates.push(formatDate(item.keys[0]))
          clicks.push(Number(item.clicks || 0))
          impressions.push(Number(item.impressions || 0))
          ctr.push(Number(item.ctr ? (item.ctr * 100).toFixed(2) : 0))
          position.push(Number(item.position || 0))
        }
      })
      
      return { dates, clicks, impressions, ctr, position }
    }
    
    // Aggregate data by week or month
    const aggregateData = (data, granularity) => {
      if (!data || !data.length) {
        return {
          dates: [],
          clicks: [],
          impressions: [],
          ctr: [],
          position: []
        };
      }
      
      if (granularity === 'day') {
        return processChartData(data);
      }
      
      const aggregated = []
      const dateMap = new Map()
      
      // Sort data by date (ascending)
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.keys && a.keys[0] ? new Date(a.keys[0]) : new Date(0)
        const dateB = b.keys && b.keys[0] ? new Date(b.keys[0]) : new Date(0)
        return dateA - dateB
      })
      
      sortedData.forEach(item => {
        if (!item.keys || !item.keys[0]) return
        
        const date = new Date(item.keys[0])
        let key
        
        if (granularity === 'week') {
          // Get the week start date (Sunday)
          const dayOfWeek = date.getDay()
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - dayOfWeek)
          key = formatDate(weekStart)
        } else if (granularity === 'month') {
          // Get the month start date
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
        }
        
        if (!dateMap.has(key)) {
          dateMap.set(key, {
            keys: [key],
            clicks: 0,
            impressions: 0,
            ctr: 0,
            position: 0,
            count: 0
          })
        }
        
        const entry = dateMap.get(key)
        entry.clicks += item.clicks || 0
        entry.impressions += item.impressions || 0
        
        if (item.position) {
          entry.position += item.position
          entry.count++
        }
      })
      
      // Calculate averages and create final array
      dateMap.forEach(entry => {
        if (entry.count > 0) {
          entry.position = entry.position / entry.count
        }
        
        if (entry.impressions > 0) {
          entry.ctr = entry.clicks / entry.impressions
        }
        
        aggregated.push(entry)
      })
      
      return processChartData(aggregated)
    }
    
    // Modify renderChart function
    const renderChart = () => {
      console.log('Render chart called, container:', chartContainer.value);
      
      if (!chartContainer.value) {
        console.error('Chart container not found');
        return;
      }
      
      try {
        // 确保容器有尺寸
        console.log('Container size:', chartContainer.value.offsetWidth, chartContainer.value.offsetHeight);
        
        // 检查数据
        const chartData = aggregateData(gscData.value, timeGranularity.value);
        
        // Dispose existing chart if it exists
        if (chart.value) {
          chart.value.dispose();
        }
        
        // 初始化图表
        chart.value = echarts.init(chartContainer.value);
        
        // 使用蓝紫色系的颜色方案
        const colors = [
          '#5470C6', // 蓝色
          '#7B68EE', // 中等紫色
          '#9370DB', // 中等紫色
          '#8A2BE2'  // 蓝紫色
        ];
        
        // 设置图表选项
        const option = {
          color: colors,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['Clicks', 'Impressions', 'CTR (%)', 'Position'],
            top: 10
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.dates
          },
          yAxis: [
            {
              type: 'value',
              name: 'Clicks/Impressions',
              position: 'left',
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: 'CTR/Position',
              position: 'right',
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: 'Clicks',
              type: 'line',
              data: chartData.clicks,
              smooth: true,
              lineStyle: {
                width: 3
              }
            },
            {
              name: 'Impressions',
              type: 'line',
              data: chartData.impressions,
              smooth: true,
              lineStyle: {
                width: 3
              }
            },
            {
              name: 'CTR (%)',
              type: 'line',
              yAxisIndex: 1,
              data: chartData.ctr,
              smooth: true,
              lineStyle: {
                width: 3
              }
            },
            {
              name: 'Position',
              type: 'line',
              yAxisIndex: 1,
              data: chartData.position,
              smooth: true,
              lineStyle: {
                width: 3
              }
            }
          ]
        };
        
        // 设置图表选项
        chart.value.setOption(option);
        
        // 忽略控制台错误，因为图表已经正常显示
        console.log('Chart rendered successfully');
      } catch (error) {
        console.error('Error rendering chart:', error);
      }
    }
    
    // Handle time range change
    const handleTimeRangeChange = () => {
      fetchGscData()
    }
    
    // Handle granularity change
    const handleGranularityChange = () => {
      renderChart()
    }

    // Fetch GSC data
    const fetchGscData = async () => {
      loadingGscData.value = true;
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getGscAnalytics(
          customerId,
          `sc-domain:${productInfo.value?.projectWebsite}`,
          timeRange.value
        )
        
        if (response && response.data) {
          // 根据选择的时间范围过滤数据
          const days = parseInt(timeRange.value);
          let filteredData = response.data;
          
          if (days && !isNaN(days)) {
            const today = new Date();
            const cutoffDate = new Date();
            cutoffDate.setDate(today.getDate() - days);
            
            filteredData = response.data.filter(item => {
              if (item.keys && item.keys[0]) {
                const itemDate = new Date(item.keys[0]);
                return itemDate >= cutoffDate;
              }
              return false;
            });
          }
          
          gscData.value = filteredData;
          
          // 计算统计数据
          calculateSummaryStats(filteredData);
          
          // 设置日期范围
          if (filteredData.length > 0) {
            const sortedData = [...filteredData].sort((a, b) => {
              const dateA = a.keys && a.keys[0] ? new Date(a.keys[0]) : new Date(0)
              const dateB = b.keys && b.keys[0] ? new Date(b.keys[0]) : new Date(0)
              return dateA - dateB
            })
            
            const startDate = formatDate(sortedData[0].keys[0])
            const endDate = formatDate(sortedData[sortedData.length - 1].keys[0])
            dateRange.value = `${startDate} - ${endDate}`
          }
          
          console.log('Data loaded, waiting for DOM update');
          
          // 确保在下一个 tick 后再尝试渲染图表
          setTimeout(() => {
            nextTick(() => {
              console.log('Attempting to render chart');
              if (chartContainer.value) {
                renderChart();
              } else {
                console.error('Chart container still not available after timeout');
              }
            });
          }, 300);
        }
      } catch (error) {
        console.error('Failed to fetch GSC data:', error)
        message.error('Failed to fetch search console data')
      } finally {
        loadingGscData.value = false;
      }
    }

    // Calculate summary statistics for GSC data
    const calculateSummaryStats = (data) => {
      if (!data || !data.length) {
        totalClicks.value = 0
        totalImpressions.value = 0
        averageCtr.value = 0
        averagePosition.value = 0
        return
      }
      
      let clicks = 0
      let impressions = 0
      let positions = 0
      let positionCount = 0
      
      data.forEach(row => {
        clicks += row.clicks || 0
        impressions += row.impressions || 0
        
        if (row.position) {
          positions += row.position
          positionCount++
        }
      })
      
      totalClicks.value = clicks
      totalImpressions.value = impressions
      averageCtr.value = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0
      averagePosition.value = positionCount > 0 ? (positions / positionCount).toFixed(1) : 0
    }

    // Fetch sitemap data
    const fetchSitemapData = async () => {
      loadingSitemap.value = true
      try {
        const customerId = localStorage.getItem('currentCustomerId')
        const response = await apiClient.getSitemap(customerId)
        
        if (response && response.code === 200) {
          sitemapData.value = formatSitemapData(response.data)
          
          // Set all folder nodes to expanded state
          const folderKeys = ['root']
          if (response.data) {
            response.data.forEach(item => {
              if (item.websiteId) {
                folderKeys.push(`folder_${item.websiteId}`)
              }
            })
          }
          expandedKeys.value = folderKeys
        }
      } catch (error) {
        console.error('Failed to fetch sitemap data:', error)
        message.error('获取网站结构失败')
      } finally {
        loadingSitemap.value = false
      }
    }

    // Format sitemap data for tree component
    const formatSitemapData = (data) => {
      if (!data || !data.length) return []
      
      // Create root node
      const root = {
        title: productInfo.value?.projectWebsite || 'Website Root',
        key: 'root',
        children: []
      }
      
      // Process returned data structure
      data.forEach(item => {
        try {
          // Check if it's the new data structure
          if (item.websiteId && item.name && item.urls) {
            // Create folder node
            const folderNode = {
              title: item.name === 'root' ? 'Main Pages' : item.name,
              key: `folder_${item.websiteId}`,
              children: []
            }
            
            // Process all URLs in this folder
            if (Array.isArray(item.urls)) {
              item.urls.forEach(url => {
                try {
                  if (typeof url === 'string' && url.startsWith('http')) {
                    // Extract page name from URL
                    const urlObj = new URL(url);
                    const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
                    let pageName = 'Homepage';
                    
                    if (pathSegments.length > 0) {
                      // Use the last path segment as page name
                      pageName = pathSegments[pathSegments.length - 1];
                      // Replace hyphens with spaces and format
                      pageName = pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    }
                    
                    folderNode.children.push({
                      title: `${pageName} (${url})`,
                      key: url,
                      isLeaf: true
                    });
                  }
                } catch (error) {
                  console.error('Error processing URL item:', url, error);
                }
              });
            }
            
            // Only add to root node if folder has children
            if (folderNode.children.length > 0) {
              root.children.push(folderNode);
            }
          }
        } catch (error) {
          console.error('Error processing folder:', item, error);
        }
      });
      
      // If root node has no children, add an empty state
      if (root.children.length === 0) {
        root.children.push({
          title: 'No sitemap data available',
          key: 'empty',
          isLeaf: true,
          disabled: true
        });
      }
      
      return [root];
    }

    // Refresh sitemap data
    const handleRefreshSitemap = () => {
      fetchSitemapData()
    }

    // Refresh GSC data
    const refreshGscData = () => {
      fetchGscData();
    }

    // Handle tree node selection
    const handleTreeSelect = (selectedKeys, info) => {
      if (selectedKeys.length > 0 && !selectedKeys[0].startsWith('folder_') && selectedKeys[0] !== 'root' && selectedKeys[0] !== 'empty') {
        openPreview(selectedKeys[0])
      }
    }

    // Open URL in new tab
    const openPreview = (url) => {
      if (url && !url.startsWith('folder_')) {
        window.open(url, '_blank')
      }
    }

    // Disconnect GSC
    const disconnectGSC = () => {
      Modal.confirm({
        title: 'Disconnect Google Search Console',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Are you sure you want to disconnect Google Search Console? You will lose access to search traffic data.',
        okText: 'Yes, Disconnect',
        okType: 'danger',
        cancelText: 'Cancel',
        async onOk() {
          try {
            const customerId = localStorage.getItem('currentCustomerId')
            await apiClient.cancelGscAuth(customerId)
            message.success('Google Search Console has been disconnected successfully')
            isGscConnected.value = false
            gscData.value = null
            sitemapData.value = []
          } catch (error) {
            console.error('Failed to disconnect GSC:', error)
            message.error('Failed to disconnect Google Search Console')
          }
        }
      })
    }

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return ''
      
      try {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date)
      } catch (error) {
        return dateString
      }
    }

    // Truncate URL for display
    const truncateUrl = (url) => {
      if (!url) return ''
      
      try {
        const urlObj = new URL(url)
        let path = urlObj.pathname
        
        if (path.length > 50) {
          path = path.substring(0, 25) + '...' + path.substring(path.length - 20)
        }
        
        return urlObj.hostname + path
      } catch (error) {
        return url.length > 50 ? url.substring(0, 47) + '...' : url
      }
    }

    // Navigate to dashboard
    const goToDashboard = () => {
      router.push('/dashboard')
    }

    // Fetch page stats
    const fetchPageStats = async () => {
      loadingPageStats.value = true;
      try {
        const customerId = localStorage.getItem('currentCustomerId');
        const response = await apiClient.getPagesDashboard(customerId);
        
        if (response && response.data) {
          generatorCount.value = response.data.generatorCount || 0;
          googleIndexedCount.value = response.data.googleIndexedCount || 0;
          indexedCount.value = response.data.indexedCount || 0;
          publishCount.value = response.data.publishCount || 0;
        }
      } catch (error) {
        console.error('Failed to fetch page statistics:', error);
        message.error('Failed to fetch page statistics');
      } finally {
        loadingPageStats.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      loadProductInfo();
      handleGscCallback();
      expandedKeys.value = ['root'];
      
      // 添加窗口大小变化监听，确保图表响应式调整
      window.addEventListener('resize', handleResize);
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      
      // 清理图表实例
      if (chart.value) {
        chart.value.dispose();
        chart.value = null;
      }
    })

    // 添加窗口大小变化处理函数
    const handleResize = () => {
      if (chart.value) {
        chart.value.resize();
      }
    }

    // Handle tree node expansion
    const onExpand = (keys) => {
      expandedKeys.value = keys
    }

    return {
      productInfo,
      domainConfigured,
      isGscConnected,
      gscSuccessModalVisible,
      gscData,
      loadingGscData,
      sitemapData,
      loadingSitemap,
      expandedKeys,
      totalClicks,
      totalImpressions,
      averageCtr,
      averagePosition,
      dateRange,
      connectGSC,
      handleRefreshSitemap,
      refreshGscData,
      handleTreeSelect,
      openPreview,
      disconnectGSC,
      formatDate,
      truncateUrl,
      goToDashboard,
      loading,
      onExpand,
      totalPages,
      indexedPages,
      crawledPages,
      mobileFriendlyPages,
      fetchPageStats,
      loadingPageStats,
      generatorCount,
      publishCount,
      googleIndexedCount,
      indexedCount,
      chartContainer,
      timeRange,
      timeGranularity,
      handleTimeRangeChange,
      handleGranularityChange
    }
  }
})
</script>

<style scoped>
.analytics-content {
  width: 100%;
}

.analytics-card {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Domain not configured styles */
.domain-not-configured {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state-container {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-state-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 24px;
}

.empty-state-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.empty-state-description {
  color: #6b7280;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
}

/* GSC not connected styles */
.connect-gsc-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.domain-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.domain-label {
  font-weight: 500;
  color: #374151;
}

.domain-value {
  font-family: monospace;
  color: #1f2937;
}

.gsc-preview-overlay {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.03);
}

.mock-data-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  opacity: 0.15;
}

.mock-chart {
  height: 120px;
  background: linear-gradient(90deg, #4285f4 0%, #4285f4 20%, #0f9d58 40%, #0f9d58 60%, #f4b400 80%, #f4b400 100%);
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
}

.mock-chart::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 60px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath d='M0,150 Q250,50 500,100 T1000,80' fill='none' stroke='white' stroke-width='5'/%3E%3C/svg%3E") repeat-x;
  background-size: contain;
}

.mock-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.mock-row {
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
}

.mock-row::before {
  content: '';
  width: 70%;
  height: 100%;
  background: #4285f4;
  border-radius: 4px 0 0 4px;
}

.mock-sitemap {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mock-node {
  height: 15px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-left: 20px;
  position: relative;
}

.mock-node::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 7px;
  width: 20px;
  height: 1px;
  background: #e0e0e0;
}

.mock-subnodes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  margin-left: 40px;
}

.mock-subnode {
  height: 10px;
  background: #a0a0a0;
  border-radius: 4px;
  position: relative;
}

.mock-subnode::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 5px;
  width: 20px;
  height: 1px;
  background: #a0a0a0;
}

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.overlay-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.overlay-content p {
  color: #4b5563;
  margin-bottom: 16px;
  max-width: 500px;
}

.overlay-content ul {
  text-align: left;
  margin-bottom: 24px;
  color: #4b5563;
}

.overlay-content li {
  margin-bottom: 8px;
}

.connect-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  height: 40px;
}

/* GSC data styles */
.gsc-data-container {
  margin-top: 16px;
}

.table-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 4px;
}

/* Sitemap styles */
.sitemap-content {
  padding: 16px 0;
}

.sitemap-tree {
  max-height: 400px;
  overflow: auto;
}

.tree-node-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.visit-link {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node-title:hover .visit-link {
  opacity: 1;
}

/* Loading and empty states */
.centered-empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* Ensure consistent spinner size */
.centered-empty-state :deep(.ant-spin) {
  font-size: 24px;
}

/* Success modal styles */
.gsc-success-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

.success-content {
  text-align: center;
  padding: 32px 16px;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  background: #10b981;
  border-radius: 50%;
  position: relative;
}

.success-icon::before,
.success-icon::after {
  content: '';
  position: absolute;
  background: white;
}

.success-icon::before {
  width: 32px;
  height: 6px;
  transform: rotate(45deg);
  top: 34px;
  left: 12px;
}

.success-icon::after {
  width: 16px;
  height: 6px;
  transform: rotate(-45deg);
  top: 30px;
  left: 22px;
}

.success-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.success-content p {
  color: #6b7280;
}

/* 确保加载指示器居中 */
.centered-spin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.centered-spin :deep(.ant-spin-spinning) {
  max-height: none;
}

/* Pages Overview Stats Styles (copied from Dashboard) */
.pages-stats-container {
  padding: 16px 0;
}

.pages-stats-horizontal {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 8px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.stat-value.enlarged {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
}

/* Chart styles */
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0; /* 添加边框以便于调试 */
}

.chart-summary {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
  padding: 12px 16px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
  text-align: center;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

/* 为不同类型的数据添加不同的颜色 */
.summary-item:nth-child(1) .summary-value {
  color: #4b5563; /* 日期范围 - 深灰色 */
}

.summary-item:nth-child(2) .summary-value {
  color: #5470C6; /* 点击量 - 蓝色 */
}

.summary-item:nth-child(3) .summary-value {
  color: #7B68EE; /* 展示量 - 紫色 */
}

.summary-item:nth-child(4) .summary-value {
  color: #9370DB; /* CTR - 中紫色 */
}

.summary-item:nth-child(5) .summary-value {
  color: #8A2BE2; /* 位置 - 蓝紫色 */
}
</style>
