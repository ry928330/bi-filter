import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { useDesigner } from '../core/DesignerContext';

interface SelectFilterProps {
  componentId: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[]; // 静态选项
  dataSource?: {
    // 动态数据源配置
    url?: string; // 接口地址
    method?: 'GET' | 'POST';
    params?: Record<string, any>; // 请求参数
    transform?: (data: any) => { label: string; value: string | number }[]; // 数据转换函数
  };
  defaultValue?: string | number;
  style?: React.CSSProperties;
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
}

/**
 * 下拉框筛选组件（支持动态数据源）
 */
export const SelectFilter: React.FC<SelectFilterProps> = ({
  componentId,
  placeholder = '请选择',
  options: staticOptions,
  dataSource,
  defaultValue,
  style,
  mode,
  allowClear = true,
}) => {
  const { onFilterChange, getFilterInfo } = useDesigner();
  const [value, setValue] = useState<any>(defaultValue);
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>(
    staticOptions || []
  );
  const [loading, setLoading] = useState(false);

  // 监听外部筛选变化（用于联动场景）
  useEffect(() => {
    const filterInfo = getFilterInfo(componentId);
    if (filterInfo && filterInfo.value !== value) {
      setValue(filterInfo.value);
    }
  }, [componentId, getFilterInfo]);

  // 获取动态数据
  useEffect(() => {
    if (dataSource) {
      fetchOptions();
    }
  }, [dataSource?.url, dataSource?.params]);

  const fetchOptions = async () => {
    if (!dataSource) return;

    setLoading(true);
    try {
      // 模拟接口请求
      const response = await fetch(dataSource.url || '', {
        method: dataSource.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: dataSource.method === 'POST' ? JSON.stringify(dataSource.params) : undefined,
      });

      const data = await response.json();

      // 使用转换函数处理数据
      const transformedOptions = dataSource.transform
        ? dataSource.transform(data)
        : data;

      setOptions(transformedOptions);
    } catch (error) {
      console.error('获取选项失败:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newValue: any) => {
    setValue(newValue);
    onFilterChange(componentId, newValue);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      options={options}
      style={{ width: 200, ...style }}
      mode={mode}
      allowClear={allowClear}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
    />
  );
};
