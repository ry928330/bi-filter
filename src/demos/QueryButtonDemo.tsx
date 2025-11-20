import React from 'react';
import { Card, Space } from 'antd';
import { DesignerProvider } from '../core/DesignerContext';
import { ComponentRenderer, ComponentInstancesProvider } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';
import { componentMetas } from '../components/componentMetas';

/**
 * Demo 4: 查询按钮聚合
 * 场景：多个筛选条件设置在独立作用域，点击查询按钮后统一作用于表格
 */
export const QueryButtonDemo: React.FC = () => {
  const tableData = [
    { key: '1', product: 'iPhone 14', category: '手机', price: 5999, stock: 120 },
    { key: '2', product: 'MacBook Pro', category: '电脑', price: 12999, stock: 45 },
    { key: '3', product: 'iPad Air', category: '平板', price: 4799, stock: 80 },
    { key: '4', product: 'AirPods Pro', category: '耳机', price: 1999, stock: 200 },
    { key: '5', product: 'Apple Watch', category: '手表', price: 3199, stock: 150 },
  ];

  const columns = [
    { title: '产品名称', dataIndex: 'product', key: 'product' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    { title: '库存', dataIndex: 'stock', key: 'stock' },
  ];

  // 组件实例配置
  const componentInstances: ComponentInstance[] = [
    {
      id: 'product-input',
      componentName: 'InputFilter',
      props: {
        placeholder: '搜索产品名称',
        targets: ['product-table'],
        filterScope: ['queryGroup'], // 设置独立作用域
      },
    },
    {
      id: 'category-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择分类',
        options: [
          { label: '手机', value: '手机' },
          { label: '电脑', value: '电脑' },
          { label: '平板', value: '平板' },
          { label: '耳机', value: '耳机' },
          { label: '手表', value: '手表' },
        ],
        targets: ['product-table'],
        filterScope: ['queryGroup'], // 设置独立作用域
      },
    },
    {
      id: 'price-input',
      componentName: 'InputFilter',
      props: {
        placeholder: '最低价格',
        targets: ['product-table'],
        filterScope: ['queryGroup'], // 设置独立作用域
      },
    },
    {
      id: 'query-button',
      componentName: 'QueryButton',
      props: {
        scopeName: 'queryGroup', // 提交 queryGroup 作用域
      },
    },
    {
      id: 'product-table',
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
        <Card title="Demo 4: 查询按钮聚合" style={{ margin: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#666', marginBottom: 16 }}>
              场景说明：多个筛选条件位于独立的筛选作用域（queryGroup），只有点击"查询"按钮后才会统一作用于表格。这可以避免筛选条件变化时的频繁取数。
            </p>
            <p style={{ color: '#999', fontSize: 12, marginBottom: 16 }}>
              提示：修改筛选条件后，表格不会立即变化，需要点击"查询"按钮。
            </p>
            <Space size="middle" wrap>
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>产品名称：</div>
                <ComponentRenderer
                  componentId="product-input"
                  componentMetas={componentMetas}
                />
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>分类：</div>
                <ComponentRenderer
                  componentId="category-select"
                  componentMetas={componentMetas}
                />
              </div>
              <div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>最低价格：</div>
                <ComponentRenderer
                  componentId="price-input"
                  componentMetas={componentMetas}
                />
              </div>
              <div style={{ paddingTop: 24 }}>
                <ComponentRenderer
                  componentId="query-button"
                  componentMetas={componentMetas}
                />
              </div>
            </Space>
          </div>
          <ComponentRenderer
            componentId="product-table"
            componentMetas={componentMetas}
          />
        </Card>
      </ComponentInstancesProvider>
    </DesignerProvider>
  );
};
