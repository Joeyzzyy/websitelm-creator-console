<template>
  <div :class="['workflow-container', { 'inline-mode': inlineMode }]">
    <a-spin :spinning="loading">
      <div v-if="!hasWorkflowData" class="empty-workflow">
        <a-empty
          description="No generation history available"
        />
      </div>

      <template v-else>
        <div class="workflow-summary">
          <div class="summary-item">
            <span class="summary-label">Total Time:</span>
            <span class="summary-value">{{ getTotalTime() }} seconds</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Steps:</span>
            <span class="summary-value">{{ workflowSteps.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Completed Steps:</span>
            <span class="summary-value">{{ getCompletedSteps() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Status:</span>
            <span class="summary-value" :class="getStatusClass()">
              {{ getWorkflowStatus() }}
            </span>
          </div>
        </div>

        <a-divider style="margin: 12px 0" />
        <a-timeline>
          <a-timeline-item 
            v-for="step in reversedWorkflowSteps" 
            :key="step.nodeId"
            :color="getStepColor(step.status)"
          >
            <template #dot v-if="step.status === 'processing'">
              <a-spin size="small" />
            </template>
            <div class="step-content" :class="{ 'step-active': isActiveStep(step) }">
              <div class="step-header">
                <div class="step-header-left">
                  <span class="step-name">{{ translateNodeName(step.nodeName) }}</span>
                  <span class="step-time">{{ formatTime(step.elapsedTime) }}</span>
                </div>
                <a-button 
                  v-if="step.output"
                  type="link" 
                  class="expand-button"
                  @click="toggleOutput(step.nodeId)"
                >
                  {{ expandedSteps.includes(step.nodeId) ? 'Collapse' : 'Expand' }}
                </a-button>
              </div>
              <div 
                v-if="step.output" 
                class="step-message"
                :class="{ 'expanded': expandedSteps.includes(step.nodeId) }"
              >
                {{ formatOutput(step.output) }}
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </template>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../api/api'

export default defineComponent({
  name: 'WorkflowStatus',
  props: {
    pageId: {
      type: String,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    inlineMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    console.log('WorkflowStatus setup with props:', props);
    const workflowSteps = ref([]);
    const expandedSteps = ref([]); // 存储已展开的步骤ID
    const loading = ref(true);
    const workflowStatus = ref(''); // 添加工作流状态
    let pollingInterval = null;

    const translateNodeName = (nodeName) => {
      // 翻译节点名称
      if (nodeName === '開始') return 'Start';
      // 其他翻译可以根据需要添加
      return nodeName;
    };

    const getStepColor = (status) => {
      switch (status) {
        case 'succeeded': return 'green';
        case 'started': 
        case 'iteration_started':
        case 'iteration_next': return 'blue';
        case 'failed': return 'red';
        default: return 'gray';
      }
    };

    const formatTime = (elapsedTime) => {
      if (!elapsedTime) return 'Processing...';
      return `${elapsedTime.toFixed(2)} seconds`;
    };

    const formatOutput = (output) => {
      try {
        const outputObj = JSON.parse(output);
        // 根据实际输出格式进行处理
        return outputObj.text || outputObj.result || output;
      } catch (e) {
        return output;
      }
    };

    const hasWorkflowData = computed(() => {
      return workflowSteps.value?.length > 0 && workflowStatus.value;
    });

    const reversedWorkflowSteps = computed(() => {
      return [...workflowSteps.value].reverse();
    });

    const fetchWorkflow = async () => {
      try {
        console.log('Fetching workflow for pageId:', props.pageId);
        const response = await apiClient.getPageWorkflow(props.pageId);
        console.log('Workflow response:', response);
        if (response?.code === 200) {
          if (!response.data.workflowId || !response.data.steps) {
            workflowSteps.value = [];
            workflowStatus.value = '';
            stopPolling();
          } else {
            workflowSteps.value = response.data.steps;
            workflowStatus.value = response.data.status;
            
            const isCompleted = response.data.status === 'completed' || 
                              response.data.status === 'failed';
            
            if (isCompleted) {
              stopPolling();
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch workflow status:', error);
      } finally {
        loading.value = false;
      }
    };

    const startPolling = () => {
      // 如果已经存在轮询，先清除
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      
      // 设置新的轮询
      pollingInterval = setInterval(fetchWorkflow, 3000);
    };

    const stopPolling = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    };

    // 切换输出的展开/折叠状态
    const toggleOutput = (nodeId) => {
      const index = expandedSteps.value.indexOf(nodeId);
      if (index === -1) {
        expandedSteps.value.push(nodeId);
      } else {
        expandedSteps.value.splice(index, 1);
      }
    };

    // 修改 watch 逻辑
    watch(() => props.isProcessing, async (newVal, oldVal) => {
      console.log('isProcessing changed:', newVal, oldVal);
      if (newVal) {
        startPolling();
      } else {
        stopPolling();
        // 停止轮询时，再获取一次最新数据
        await fetchWorkflow();
      }
    });

    onMounted(async () => {
      console.log('WorkflowStatus mounted, isProcessing:', props.isProcessing);
      // 无论是否处理中，都先获取一次数据
      await fetchWorkflow();
      
      // 如果是处理中状态，则开始轮询
      if (props.isProcessing) {
        console.log('Starting polling...');
        startPolling();
      }
    });

    onUnmounted(() => {
      stopPolling();
    });

    const getTotalTime = () => {
      const total = workflowSteps.value.reduce((sum, step) => {
        return sum + (step.elapsedTime || 0);
      }, 0);
      return total.toFixed(2);
    };

    const getCompletedSteps = () => {
      return workflowSteps.value.filter(step => 
        step.status === 'succeeded' || step.status === 'failed'
      ).length;
    };

    const getWorkflowStatus = () => {
      if (loading.value) return 'Processing';
      
      // 检查是否有任何步骤失败
      const hasFailedStep = workflowSteps.value.some(step => step.status === 'failed');
      if (hasFailedStep) {
        return 'Failed';
      }
      
      // 使用API返回的status来判断
      switch (workflowStatus.value) {
        case 'completed':
          return 'Completed';
        case 'failed':
          return 'Failed';
        case 'processResponse':
        case 'processing':
          return 'In Progress';
        default:
          return 'Processing';
      }
    };

    const getStatusClass = () => {
      const status = getWorkflowStatus();
      return {
        'status-processing': status === 'Processing' || status === 'In Progress',
        'status-completed': status === 'Completed',
        'status-failed': status === 'Failed'
      };
    };

    const isActiveStep = (step) => {
      return step.status === 'processing' || 
             step.status === 'started' || 
             step.status === 'iteration_started' ||
             step.status === 'iteration_next';
    };

    return {
      workflowSteps,
      reversedWorkflowSteps,
      expandedSteps,
      loading,
      getStepColor,
      formatTime,
      formatOutput,
      toggleOutput,
      translateNodeName,
      getTotalTime,
      getCompletedSteps,
      getWorkflowStatus,
      getStatusClass,
      workflowStatus,
      hasWorkflowData,
      isActiveStep,
    };
  }
});
</script>

<style scoped>
.workflow-container {
  padding: 20px;
}

.workflow-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-weight: 500;
  color: #666;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
}

.status-processing {
  color: #1890ff;
}

.status-completed {
  color: #52c41a;
}

.status-failed {
  color: #f5222d;
}

.step-content {
  margin-left: 8px;
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.step-active {
  background-color: #e6f7ff;  /* 浅蓝色背景 */
  border: 1px solid #91d5ff;  /* 浅蓝色边框 */
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.step-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-name {
  font-weight: bold;
}

.step-time {
  font-size: 12px;
  color: #999;
}

.step-message {
  font-size: 14px;
  color: #666;
  max-height: 42px; /* 默认显示两行 */
  overflow: hidden;
  transition: max-height 0.3s ease;
  position: relative;
}

.step-message.expanded {
  max-height: 1000px; /* 展开时的最大高度 */
}

.step-message:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(transparent, white);
}

.expand-button {
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

:deep(.ant-timeline-item-content) {
  margin-left: 28px !important;
}

.empty-workflow {
  padding: 40px 0;
  text-align: center;
}

:deep(.ant-empty) {
  margin: 32px 0;
}

:deep(.ant-empty-description) {
  color: #666;
  font-size: 14px;
}

/* 调整时间轴项的间距 */
:deep(.ant-timeline-item) {
  padding-bottom: 20px;
}

/* 确保最后一个项目没有底部间距 */
:deep(.ant-timeline-item:last-child) {
  padding-bottom: 0;
}

/* 添加内联模式的样式 */
.workflow-container.inline-mode {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 0;
  border-top: 1px solid #f0f0f0;
  max-height: 300px;
  overflow-y: auto;
}

/* 可能需要调整其他样式以适应内联模式 */
</style> 