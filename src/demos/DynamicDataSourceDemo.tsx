import React from 'react';
import { Card, Space, Alert } from 'antd';
import { BIDesignerProvider } from '../core/BIDesignerProvider';
import { ComponentRenderer } from '../core/ComponentRenderer';
import { ComponentInstance } from '../core/types';

/**
 * Demo: 动态数据源筛选
 * 场景：下拉框选项从接口动态获取
 */
export const DynamicDataSourceDemo: React.FC = () => {
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

  const componentInstances: ComponentInstance[] = [
    {
      id: 'search-input',
      componentName: 'InputFilter',
      props: {
        placeholder: '搜索姓名',
        targets: ['data-table'],
      },
    },
    {
      id: 'department-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择部门',
        // 方式1：静态选项（适用于固定数据）
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '市场部', value: '市场部' },
        ],
        targets: ['data-table'],
      },
    },
    {
      id: 'city-select',
      componentName: 'SelectFilter',
      props: {
        placeholder: '选择城市',
        // 方式2：动态数据源（从接口获取）
        dataSource: {
          url: '/api/cities', // 接口地址
          method: 'GET',
          // 数据转换函数：将接口返回的数据转换为下拉选项格式
          transform: (data: any) => {
            // 假设接口返回: { list: [{ cityName: '北京', cityCode: '110000' }] }
            return data.list?.map((item: any) => ({
              label: item.cityName,
              value: item.cityCode,
            })) || [];
          },
        },
        targets: ['data-table'],
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
      <Card title="Demo: 动态数据源筛选" style={{ margin: 20 }}>
        <Alert
          message="数据源配置方式"
          description={
            <div>
              <p><strong>方式1 - 静态选项：</strong>适用于固定的、少量的选项数据</p>
              <p><strong>方式2 - 动态数据源：</strong>适用于需要从接口获取的选项数据，支持数据转换</p>
            </div>
          }
          type="info"
          style={{ marginBottom: 16 }}
        />
        <div style={{ marginBottom: 20 }}>
          <Space size="middle" wrap>
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>搜索：</div>
              <ComponentRenderer componentId="search-input" />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>部门（静态）：</div>
              <ComponentRenderer componentId="department-select" />
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>城市（动态）：</div>
              <ComponentRenderer componentId="city-select" />
            </div>
          </Space>
        </div>
        <ComponentRenderer componentId="data-table" />
      </Card>
    </BIDesignerProvider>
  );
};
