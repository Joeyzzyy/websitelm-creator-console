export const overviewStats = {
  totalKeywords: 2500,
  ourTopPages: 30,
  competitorPages: 50
}

export const categories = [
  { name: 'Missing', count: 200, color: 'red' },
  { name: 'Weak', count: 150, color: 'orange' },
  { name: 'Strong', count: 80, color: 'green' },
  { name: 'Common', count: 300, color: 'blue' },
  { name: 'Unique', count: 120, color: 'purple' }
]

export const priorities = [
  {
    level: 'P0',
    label: 'P0 - Quick Wins',
    color: '#f50',
    description: 'High impact, low effort opportunities'
  },
  {
    level: 'P1',
    label: 'P1 - High Priority',
    color: '#fa8c16',
    description: 'Important terms with good potential'
  },
  {
    level: 'P2',
    label: 'P2 - Medium Priority',
    color: '#1890ff',
    description: 'Valuable but requires more effort'
  },
  {
    level: 'P3',
    label: 'P3 - Low Priority',
    color: '#52c41a',
    description: 'Long-term opportunities'
  },
  {
    level: 'P4',
    label: 'P4 - Monitor',
    color: '#722ed1',
    description: 'Keep an eye on these terms'
  }
]

export const recommendedKeywords = [
  {
    keyword: 'cloud storage',
    kd: 35,
    volume: 1200,
    krs: 78,
    status: { text: 'Missing', color: 'red' },
    selected: false,
    priority: 'P0',
    reason: 'Low competition (KD=35) with high search volume. Your competitors rank well for this term.'
  },
  {
    keyword: 'online backup',
    kd: 40,
    volume: 900,
    krs: 72,
    status: { text: 'Weak', color: 'orange' },
    selected: false,
    priority: 'P0',
    reason: 'You already rank on page 2. Small optimization could bring big traffic gains.'
  },
  // ... 其他推荐关键词
]

export const pageKeywords = [
  {
    keyword: 'cloud storage solutions',
    kd: 35,
    volume: 1200,
    krs: 85,
    status: { text: 'Missing', color: 'red' },
    selected: false,
    priority: 'P0',
    pageReason: 'aiseo.ai\'s page "aiseo.ai/cloud-guide" ranks #15. High potential for quick improvement.'
  },
  // ... 其他页面关键词
]

export const savedPresets = [
  {
    id: 1,
    name: 'Low KD High Volume',
    filters: [
      { field: 'kd', operator: '<', value: 30 },
      { field: 'volume', operator: '>', value: 1000 }
    ]
  },
  {
    id: 2,
    name: 'High CPC Keywords',
    filters: [
      { field: 'cpc', operator: '>', value: 1 }
    ]
  }
]

export const tableColumns = [
  {
    title: 'Keyword',
    dataIndex: 'keyword',
    width: 200,
    fixed: 'left'
  },
  {
    title: 'KD',
    dataIndex: 'kd',
    width: 80
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    width: 100
  },
  {
    title: 'CPC',
    dataIndex: 'cpc',
    width: 100
  },
  {
    title: 'Competitor Coverage',
    dataIndex: 'coverage',
    width: 120
  },
  {
    title: 'Business Relevance',
    dataIndex: 'relevance',
    width: 140
  },
  {
    title: 'KRS',
    dataIndex: 'krs',
    width: 100
  }
]

export const competitorColumns = [
  {
    title: 'Competitor',
    dataIndex: 'name',
    width: 150
  },
  {
    title: 'Rank',
    dataIndex: 'rank',
    width: 80
  },
  {
    title: 'URL',
    dataIndex: 'url',
    width: 200
  }
] 