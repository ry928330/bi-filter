import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDesigner } from '../core/DesignerContext';

interface InputFilterProps {
  componentId: string;
  placeholder?: string;
  defaultValue?: string;
  style?: React.CSSProperties;
}

/**
 * 输入框筛选组件
 */
export const InputFilter: React.FC<InputFilterProps> = ({
  componentId,
  placeholder = '请输入',
  defaultValue = '',
  style,
}) => {
  const { onFilterChange } = useDesigner();
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // 立即触发筛选变化
    onFilterChange(componentId, newValue);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      style={style}
    />
  );
};
