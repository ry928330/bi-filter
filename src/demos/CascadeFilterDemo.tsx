import React from 'react';
import { Card, Space } from 'antd';
import { DesignerProvider } from '../core/DesignerContext';
import { ComponentRenderer, ComponentInstancesProvider } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';
import { componentMetas } from '../components/componentMetas';

/**
 * Demo 3: 三级联动筛选
 * 场景：国家 -> 省 -> 市 三级联动，同时作用于表格
 * 使用 filterReady 避免频繁取数
 */
export const CascadeFilterDemo: React.FC = () => {
  // 模拟数据结构
  const regionData: Record<string, Record<string, string[]>> = {
    中国: {
      广东省: ['广州市', '深圳市', '珠海市', '东莞市'],
      浙江省: ['杭州市', '宁波市', '温州市', '嘉兴市'],
      江苏省: ['南京市', '苏州市', '无锡市', '常州市'],
    },
    美国: {
      加利福尼亚州: ['洛杉矶', '旧金山', '圣地亚哥'],
      纽约州: ['纽约市', '布法罗', '罗切斯特'],
    },
  };

  const tableData = [
    { key: '1', country: '中国', province: '广东省', city: '深圳市', population: 1302 },
    { key: '2', country: '中国', province: '广东省', city: '广州市', population: 1501 },
    { key: '3', country: '中国', province: '浙江省', city: '杭州市', population: 1021 },
    { key: '4', country: '中国', province: '江苏省', city: '南京市', population: 843 },
    { key: '5', country: '美国', province: '加利福尼亚州', city: '洛杉矶', population: 3979 },
  ];

  const columns = [
    { title: '国家', dataIndex: 'country', key: 'country' },
    { title: '省/州', dataIndex: 'province', key: 'province' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '人口(万)', dataIndex: 'population', key: 'population' },
  ];

  // 组件实例配置
  const componentInstances: ComponentInstance[] = [
    {
      id: 'country-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择国家',
        options: Object.keys(regionData).map((country) => ({
          label: country,
          value: country,
        })),
        targets: ['province-select', 'region-table'], // 作用于省和表格
        filterReadyTargets: ['province-select'], // 省的 ready 依赖国家
      },
    },
    {
      id: 'province-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择省/州',
        options: [], // 动态更新
        targets: ['city-select', 'region-table'], // 作用于市和表格
        filterReadyTargets: ['city-select'], // 市的 ready 依赖省
      },
    },
    {
      id: 'city-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择城市',
        options: [], // 动态更新
        targets: ['region-table'], // 作用于表格
      },
    },
    {
      id: 'region-table',
      componentName: 'TableDisplay',
      props: {
        columns,
        dataSource: tableData,
      },
    },
  ];

  return (
    <DesignerProvider
      componentInstances={componentInstances}
      componentMetas={componentMetas}
    >
      <ComponentInstancesProvider instances={componentInstances}>
        <Card title="Demo 3: 三级联动筛选" style={{ margin: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#666', marginBottom: 16 }}>
              场景说明：国家 → 省/州 → 城市 三级联动筛选。通过 filterReady 机制，确保只有当所有上级筛选条件就绪后，表格才会取数一次，避免频繁请求。
            </p>
            <p style={{ color: '#999', fontSize: 12, marginBottom: 16 }}>
              提示：选择国家后，省选项会更新；选择省后，市选项会更新。表格会等待所有筛选就绪后才取数。
            </p>
            <Space size="large">
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>国家：</div>
                <ComponentRenderer
                  componentId="country-select"
                  componentMetas={componentMetas}
                />
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>省/州：</div>
                <ComponentRenderer
                  componentId="province-select"
                  componentMetas={componentMetas}
                />
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>城市：</div>
                <ComponentRenderer
                  componentId="city-select"
                  componentMetas={componentMetas}
                />
              </div>
            </Space>
          </div>
          <ComponentRenderer
            componentId="region-table"
            componentMetas={componentMetas}
          />
        </Card>
      </ComponentInstancesProvider>
    </DesignerProvider>
  );
};
