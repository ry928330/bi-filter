import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useDesigner } from '../core/DesignerContext';

interface ChartDisplayProps {
  componentId: string;
  title?: string;
  chartType?: 'bar' | 'line' | 'pie';
  data?: Array<{ name: string; value: number }>;
  style?: React.CSSProperties;
}

/**
 * 图表展示组件（简化版，使用文字和条形图模拟）
 * 可以响应筛选条件，也可以作为筛选源（点击图表元素触发筛选）
 */
export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  componentId,
  title = '图表',
  chartType = 'bar',
  data = [],
  style,
}) => {
  const { onFilterChange, getFiltersForComponent } = useDesigner();
  const [chartData, setChartData] = useState(data);
  const [loading, setLoading] = useState(false);

  // 监听筛选条件变化
  useEffect(() => {
    const filters = getFiltersForComponent(componentId);

    if (filters.length > 0) {
      setLoading(true);
      setTimeout(() => {
        console.log(`图表 ${componentId} 接收到筛选条件:`, filters);
        // 模拟数据过滤
        let filteredData = [...data];

        filters.forEach((filter) => {
          if (filter.value) {
            filteredData = filteredData.filter((item) =>
              item.name.toLowerCase().includes(String(filter.value).toLowerCase())
            );
          }
        });

        setChartData(filteredData);
        setLoading(false);
      }, 500);
    } else {
      setChartData(data);
    }
  }, [componentId, data, getFiltersForComponent]);

  // 点击图表元素触发筛选
  const handleBarClick = (item: { name: string; value: number }) => {
    onFilterChange(componentId, item.name);
  };

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <Card title={title} loading={loading} style={style}>
      <div style={{ padding: '10px 0' }}>
        {chartData.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleBarClick(item)}
          >
            <div style={{ width: 80, fontSize: 12 }}>{item.name}</div>
            <div
              style={{
                flex: 1,
                height: 24,
                background: '#1890ff',
                width: `${(item.value / maxValue) * 100}%`,
                minWidth: 20,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                color: 'white',
                fontSize: 12,
                borderRadius: 4,
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#40a9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1890ff';
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
