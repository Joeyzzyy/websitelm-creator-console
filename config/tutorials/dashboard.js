export const dashboardTutorial = {
  steps: [
    {
      target: '.info-card',
      title: 'Product Information',
      content: 'Here you can view and manage basic product information, including product name, official website and other core details. You can also add competitor products for comparative analysis.',
      position: 'right',
      offset: {
        y: -60
      }
    },
    {
      target: '.quick-access-panel',
      title: 'Smart Recommendations',
      content: 'Get personalized recommendations for:\n- Keywords Planning\n- Content Tasks\n- Brand Assets\nBased on your product and website analysis.',
      position: 'left',
      offset: {
        y: -60
      }
    },
    {
      target: '.ant-collapse-item:nth-child(1)',
      title: 'Website Structure & Pages',
      content: 'Click to expand this panel to:\n- View complete website structure\n- Auto-fetch sitemap\n- Check page statistics\n- Submit pages to search engines',
      position: 'right',
      offset: {
        y: -60
      }
    },
    {
      target: '.ant-collapse-item:nth-child(2)',
      title: 'Traffic Analytics',
      content: 'Click to expand this panel to:\n- Monitor website traffic\n- Track impressions and clicks\n- Analyze traffic trends',
      position: 'right',
      offset: {
        y: -60
      }
    }
  ]
}; 