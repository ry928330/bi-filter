import React from 'react';
import { Card, Button } from 'antd';
import { DesignerProvider } from '../core/DesignerContext';
import { ComponentInstancesProvider } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';
import { componentMetas } from '../components/componentMetas';

/**
 * Demo 5: 组件自身下钻
 * 场景：图表点击后自己触发自己的筛选，实现下钻功能
 * 例如：点击年度数据，下钻到月度数据
 */
export const DrillDownDemo: React.FC = () => {
  const [level, setLevel] = React.useState<'year' | 'month' | 'day'>('year');
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');

  // 年度数据
  const yearData = [
    { name: '2021年', value: 8500 },
    { name: '2022年', value: 9200 },
    { name: '2023年', value: 10300 },
    { name: '2024年', value: 11800 },
  ];

  // 月度数据（根据年份）
  const monthDataMap: Record<string, Array<{ name: string; value: number }>> = {
    '2021年': [
      { name: '1月', value: 650 },
      { name: '2月', value: 720 },
      { name: '3月', value: 680 },
      { name: '4月', value: 700 },
    ],
    '2022年': [
      { name: '1月', value: 720 },
      { name: '2月', value: 780 },
      { name: '3月', value: 750 },
      { name: '4月', value: 800 },
    ],
    '2023年': [
      { name: '1月', value: 820 },
      { name: '2月', value: 880 },
      { name: '3月', value: 850 },
      { name: '4月', value: 900 },
    ],
    '2024年': [
      { name: '1月', value: 920 },
      { name: '2月', value: 1000 },
      { name: '3月', value: 980 },
      { name: '4月', value: 1050 },
    ],
  };

  // 日数据（根据年份和月份）
  const dayData = [
    { name: '1日', value: 25 },
    { name: '2日', value: 28 },
    { name: '3日', value: 22 },
    { name: '4日', value: 30 },
    { name: '5日', value: 27 },
  ];

  const getCurrentData = () => {
    if (level === 'year') return yearData;
    if (level === 'month' && selectedYear) return monthDataMap[selectedYear] || [];
    if (level === 'day') return dayData;
    return yearData;
  };

  const getTitle = () => {
    if (level === 'year') return '年度销售数据';
    if (level === 'month') return `${selectedYear} 月度销售数据`;
    if (level === 'day') return `${selectedYear} ${selectedMonth} 日销售数据`;
    return '销售数据';
  };

  // 自定义图表组件包装器，用于处理下钻逻辑
  const DrillDownChart: React.FC<any> = (props) => {
    const handleBarClick = (item: { name: string; value: number }) => {
      if (level === 'year') {
        setSelectedYear(item.name);
        setLevel('month');
      } else if (level === 'month') {
        setSelectedMonth(item.name);
        setLevel('day');
      }
    };

    return (
      <Card title={getTitle()}>
        <div style={{ padding: '10px 0' }}>
          {getCurrentData().map((item, index) => {
            const maxValue = Math.max(...getCurrentData().map((d) => d.value), 1);
            return (
              <div
                key={index}
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: level !== 'day' ? 'pointer' : 'default',
                }}
                onClick={() => level !== 'day' && handleBarClick(item)}
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
                    if (level !== 'day') {
                      e.currentTarget.style.background = '#40a9ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1890ff';
                  }}
                >
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
        {level !== 'year' && (
          <Button
            type="link"
            onClick={() => {
              if (level === 'day') {
                setLevel('month');
              } else if (level === 'month') {
                setLevel('year');
                setSelectedYear('');
              }
            }}
          >
            ← 返回上一层
          </Button>
        )}
      </Card>
    );
  };

  const componentInstances: ComponentInstance[] = [
    {
      id: 'sales-drill-chart',
      componentName: 'ChartDisplay',
      props: {
        title: getTitle(),
        data: getCurrentData(),
        targets: ['sales-drill-chart'], // 自己作用于自己
      },
    },
  ];

  return (
    <DesignerProvider
      componentInstances={componentInstances}
      componentMetas={componentMetas}
    >
      <ComponentInstancesProvider instances={componentInstances}>
        <Card title="Demo 5: 组件自身下钻" style={{ margin: 20 }}>
          <p style={{ color: '#666', marginBottom: 16 }}>
            场景说明：图表点击后触发自身的筛选行为，实现下钻功能。年 → 月 → 日逐层查看数据。
          </p>
          <p style={{ color: '#999', fontSize: 12, marginBottom: 16 }}>
            提示：点击图表的柱子可以下钻到下一层级，点击"返回上一层"可以回到上层。
          </p>
          <DrillDownChart />
        </Card>
      </ComponentInstancesProvider>
    </DesignerProvider>
  );
};
