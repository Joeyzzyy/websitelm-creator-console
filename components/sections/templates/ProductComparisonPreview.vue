<template>
  <div class="bg-white py-6 w-full">
    <div class="comparison-table-container">
      <h2 class="text-xl font-bold text-gray-900 text-center mb-6">
        {{ section.topContent?.title || section.title }}
      </h2>
      
      <div class="comparison-table">
        <table class="w-full">
          <thead class="bg-gray-50 text-gray-700">
            <tr>
              <th class="py-3 px-4 text-left text-xs font-medium">Features</th>
              <th class="py-3 px-3 text-center text-xs font-medium">
                {{ section.topContent?.companies?.competitor || 'Competitor' }}
              </th>
              <th class="py-3 px-3 text-center text-xs font-medium">
                {{ section.topContent?.companies?.us || 'Us' }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <template v-if="section.bottomContent && section.bottomContent.length > 0">
              <tr 
                v-for="(feature, index) in section.bottomContent" 
                :key="index" 
                :class="[
                  'hover:bg-gray-50',
                  feature.isEmpty ? 'empty-row' : ''
                ]"
              >
                <td class="py-2 px-4 border-t border-gray-100">
                  <div class="flex items-center gap-2" v-if="!feature.isEmpty">
                    <i 
                      :class="getIconClass(feature.name)" 
                      class="text-[#3374FF] text-sm"
                    ></i>
                    <span class="text-black/80 text-xs font-medium">{{ feature.name }}</span>
                  </div>
                  <div v-else class="empty-row-content">
                    {{ feature.name }}
                  </div>
                </td>
                <td class="py-2 px-3 text-center border-t border-x border-gray-100">
                  <template v-if="!feature.isEmpty">
                    <template v-if="!feature.type || feature.type === 'boolean'">
                      <i 
                        :class="[
                          feature.competitor ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500',
                          'text-base'
                        ]"
                      ></i>
                    </template>
                    <template v-else-if="feature.type === 'text'">
                      <span class="text-xs">{{ feature.competitorText }}</span>
                    </template>
                  </template>
                </td>
                <td class="py-2 px-3 text-center border-t border-gray-100">
                  <template v-if="!feature.isEmpty">
                    <template v-if="!feature.type || feature.type === 'boolean'">
                      <i 
                        :class="[
                          feature.us ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500',
                          'text-base'
                        ]"
                      ></i>
                    </template>
                    <template v-else-if="feature.type === 'text'">
                      <span class="text-xs">{{ feature.usText }}</span>
                    </template>
                  </template>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr class="hover:bg-gray-50">
                <td class="py-2 px-4 border-t border-gray-100 text-center text-xs" colspan="3">
                  No features added yet. Please add features to display here.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        
        <div class="table-footer">
          <button class="action-button">
            {{ section.buttonText || '了解更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductComparisonPreview',
  props: {
    section: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: 'normal'
    }
  },
  methods: {
    getIconClass(featureName) {
      // 定义特征组及其关键词
      const featureGroups = {
        AI: {
          icon: 'fas fa-robot',
          keywords: ['ai', 'artificial', 'intelligence', 'smart', 'automated', 'machine', 'learning', 'neural', 'cognitive', 'bot']
        },
        Interface: {
          icon: 'fas fa-desktop',
          keywords: ['interface', 'ui', 'ux', 'user', 'friendly', 'dashboard', 'screen', 'display', 'layout', 'design']
        },
        Editing: {
          icon: 'fas fa-pencil-alt',
          keywords: ['edit', 'modify', 'change', 'customize', 'real-time', 'live', 'instant', 'update', 'adjust']
        },
        Language: {
          icon: 'fas fa-language',
          keywords: ['language', 'translate', 'localization', 'global', 'international', 'multi-language', 'speech']
        },
        Media: {
          icon: 'fas fa-mobile-alt',
          keywords: ['video', 'media', 'audio', 'record', 'play', 'stream', 'content', 'watch']
        },
        Collaboration: {
          icon: 'fas fa-users',
          keywords: ['collaboration', 'team', 'group', 'share', 'together', 'social', 'community', 'collective']
        },
        Storage: {
          icon: 'fas fa-cloud',
          keywords: ['storage', 'cloud', 'save', 'backup', 'store', 'data', 'upload', 'download']
        },
        Analytics: {
          icon: 'fas fa-chart-line',
          keywords: ['analytics', 'statistics', 'metrics', 'measure', 'track', 'monitor', 'performance', 'report']
        },
        Support: {
          icon: 'fas fa-headset',
          keywords: ['support', 'help', 'service', 'assist', 'customer', 'care', 'contact']
        },
        Security: {
          icon: 'fas fa-shield-alt',
          keywords: ['security', 'protect', 'safe', 'privacy', 'secure', 'guard', 'encrypt']
        },
        Pricing: {
          icon: 'fas fa-dollar-sign',
          keywords: ['price', 'cost', 'payment', 'affordable', 'budget', 'money', 'subscription', 'plan']
        },
        Performance: {
          icon: 'fas fa-rocket',
          keywords: ['performance', 'speed', 'fast', 'quick', 'efficient', 'optimize', 'boost']
        }
      };

      // 将特征名称转换为小写并分词
      const words = featureName.toLowerCase().split(/[\s-]+/);
      
      // 计算每个特征组的匹配分数
      const scores = Object.entries(featureGroups).map(([group, { icon, keywords }]) => {
        let score = 0;
        words.forEach(word => {
          // 完全匹配得3分
          if (keywords.includes(word)) {
            score += 3;
          } else {
            // 部分匹配得1分（如果关键词包含当前词或当前词包含关键词
            keywords.forEach(keyword => {
              if (keyword.includes(word) || word.includes(keyword)) {
                score += 1;
              }
            });
          }
        });
        return { group, icon, score };
      });

      // 获取得分最高的特征组
      const bestMatch = scores.reduce((best, current) => 
        current.score > best.score ? current : best
      , { score: -1 });

      // 如果没有任何匹配（得分为0），返回默认图标
      return bestMatch.score > 0 ? bestMatch.icon : 'fas fa-tools';
    }
  }
};
</script>

<style scoped>
.comparison-table-container {
  @apply w-full mx-auto px-4;
}

.comparison-table {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg w-full;
  transition: all 0.3s ease;
}

.preview-content {
  background: white;
  border-radius: 8px;
  flex: 1;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.empty-row {
  background-color: #f9f9f9;
}

.empty-row-content {
  width: 100%;
  text-align: center;
  color: #666;
  font-size: 12px;
}

.table-footer {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  background-color: #f9f9f9;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  background-color: #3374FF;
  color: white;
  font-weight: 500;
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #2361e6;
}
</style>