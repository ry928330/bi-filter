import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useDesigner } from '../core/DesignerContext';

interface TableDisplayProps {
  componentId: string;
  columns?: any[];
  dataSource?: any[];
  style?: React.CSSProperties;
  onCellClick?: (record: any, column: any) => void;
}

/**
 * 表格展示组件
 * 可以响应筛选条件，也可以作为筛选源（点击单元格触发筛选）
 */
export const TableDisplay: React.FC<TableDisplayProps> = ({
  componentId,
  columns = [],
  dataSource = [],
  style,
  onCellClick,
}) => {
  const { onFilterChange, getFiltersForComponent } = useDesigner();
  const [data, setData] = useState(dataSource);
  const [loading, setLoading] = useState(false);

  // 模拟取数：监听筛选条件变化
  useEffect(() => {
    const filters = getFiltersForComponent(componentId);

    if (filters.length > 0) {
      setLoading(true);
      // 模拟异步取数
      setTimeout(() => {
        console.log(`表格 ${componentId} 接收到筛选条件:`, filters);
        // 这里可以根据 filters 过滤数据
        let filteredData = [...dataSource];

        filters.forEach((filter) => {
          if (filter.value) {
            filteredData = filteredData.filter((item) =>
              JSON.stringify(item).toLowerCase().includes(String(filter.value).toLowerCase())
            );
          }
        });

        setData(filteredData);
        setLoading(false);
      }, 500);
    } else {
      setData(dataSource);
    }
  }, [componentId, dataSource, getFiltersForComponent]);

  // 增强列配置，支持单元格点击
  const enhancedColumns = columns.map((col) => ({
    ...col,
    onCell: (record: any) => ({
      onClick: () => {
        if (onCellClick) {
          onCellClick(record, col);
        }
        // 点击单元格也可以触发筛选
        if (col.dataIndex) {
          onFilterChange(componentId, record[col.dataIndex]);
        }
      },
      style: { cursor: 'pointer' },
    }),
  }));

  return (
    <Table
      columns={enhancedColumns}
      dataSource={data}
      loading={loading}
      pagination={false}
      style={style}
      size="small"
    />
  );
};
