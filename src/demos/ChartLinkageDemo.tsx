import React from 'react';
import { Card, Row, Col } from 'antd';
import { DesignerProvider } from '../core/DesignerContext';
import { ComponentRenderer, ComponentInstancesProvider } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';
import { componentMetas } from '../components/componentMetas';

/**
 * Demo 2: 图表联动
 * 场景：点击左侧图表的某个项，右侧图表和表格会根据该项进行筛选
 */
export const ChartLinkageDemo: React.FC = () => {
  // 左侧图表数据：各城市销售额
  const cityData = [
    { name: '北京', value: 1200 },
    { name: '上海', value: 980 },
    { name: '深圳', value: 850 },
    { name: '杭州', value: 720 },
  ];

  // 右侧图表数据：各部门销售额
  const departmentData = [
    { name: '技术部', value: 560 },
    { name: '产品部', value: 430 },
    { name: '市场部', value: 380 },
    { name: '运营部', value: 310 },
  ];

  // 表格数据
  const tableData = [
    { key: '1', city: '北京', department: '技术部', sales: 280 },
    { key: '2', city: '北京', department: '产品部', sales: 220 },
    { key: '3', city: '上海', department: '技术部', sales: 200 },
    { key: '4', city: '上海', department: '市场部', sales: 180 },
    { key: '5', city: '深圳', department: '产品部', sales: 210 },
    { key: '6', city: '杭州', department: '运营部', sales: 310 },
  ];

  const columns = [
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '销售额', dataIndex: 'sales', key: 'sales' },
  ];

  // 组件实例配置
  const componentInstances: ComponentInstance[] = [
    {
      id: 'city-chart',
      componentName: 'ChartDisplay',
      props: {
        title: '各城市销售额',
        data: cityData,
        targets: ['department-chart', 'sales-table'], // 点击后筛选右侧图表和表格
      },
    },
    {
      id: 'department-chart',
      componentName: 'ChartDisplay',
      props: {
        title: '各部门销售额',
        data: departmentData,
        targets: ['sales-table'], // 点击后筛选表格
      },
    },
    {
      id: 'sales-table',
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
        <Card title="Demo 2: 图表联动" style={{ margin: 20 }}>
          <p style={{ color: '#666', marginBottom: 16 }}>
            场景说明：点击左侧"城市"图表的柱子，会筛选右侧"部门"图表和下方表格的数据。这展示了展示类组件之间的联动能力。
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <ComponentRenderer
                componentId="city-chart"
                componentMetas={componentMetas}
              />
            </Col>
            <Col span={12}>
              <ComponentRenderer
                componentId="department-chart"
                componentMetas={componentMetas}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 16 }}>
            <ComponentRenderer
              componentId="sales-table"
              componentMetas={componentMetas}
            />
          </div>
        </Card>
      </ComponentInstancesProvider>
    </DesignerProvider>
  );
};
