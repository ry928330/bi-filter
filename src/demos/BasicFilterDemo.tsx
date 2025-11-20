import React from 'react';
import { Card, Space } from 'antd';
import { BIDesignerProvider } from '../core/BIDesignerProvider';
import { ComponentRenderer } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';

/**
 * Demo 1: 基本筛选
 * 场景：输入框和下拉框筛选表格数据
 */
export const BasicFilterDemo: React.FC = () => {
  // 模拟表格数据
  const tableData = [
    { key: '1', name: '张三', city: '北京', age: 28, department: '技术部' },
    { key: '2', name: '李四', city: '上海', age: 32, department: '产品部' },
    { key: '3', name: '王五', city: '深圳', age: 25, department: '技术部' },
    { key: '4', name: '赵六', city: '北京', age: 30, department: '市场部' },
    { key: '5', name: '钱七', city: '杭州', age: 27, department: '技术部' },
  ];

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '部门', dataIndex: 'department', key: 'department' },
  ];

  // 组件实例配置（DSL）
  const componentInstances: ComponentInstance[] = [
    {
      id: 'search-input',
      componentName: 'InputFilter',
      props: {
        placeholder: '搜索姓名或城市',
        targets: ['data-table'], // 作用于表格
      },
    },
    {
      id: 'department-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择部门',
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '市场部', value: '市场部' },
        ],
        targets: ['data-table'], // 作用于表格
      },
    },
    {
      id: 'data-table',
      componentName: 'TableDisplay',
      props: {
        columns,
        dataSource: tableData,
      },
    },
  ];

  return (
    <BIDesignerProvider componentInstances={componentInstances}>
      <Card title="Demo 1: 基本筛选" style={{ margin: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: '#666', marginBottom: 16 }}>
            场景说明：输入框和下拉框可以实时筛选表格数据。这是最基础的筛选场景。
          </p>
          <Space size="middle">
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>搜索：</div>
              <ComponentRenderer componentId="search-input" />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>部门：</div>
              <ComponentRenderer componentId="department-select" />
            </div>
          </Space>
        </div>
        <ComponentRenderer componentId="data-table" />
      </Card>
    </BIDesignerProvider>
  );
};

