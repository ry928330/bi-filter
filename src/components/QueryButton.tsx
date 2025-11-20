import React from 'react';
import { Button } from 'antd';
import { useDesigner } from '../core/DesignerContext';

interface QueryButtonProps {
  componentId: string;
  scopeName: string;
  children?: React.ReactNode;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  style?: React.CSSProperties;
}

/**
 * 查询按钮组件
 * 用于提交筛选作用域
 */
export const QueryButton: React.FC<QueryButtonProps> = ({
  scopeName,
  children = '查询',
  type = 'primary',
  style,
}) => {
  const { submitFilterScope } = useDesigner();

  const handleClick = () => {
    submitFilterScope(scopeName);
  };

  return (
    <Button type={type} onClick={handleClick} style={style}>
      {children}
    </Button>
  );
};
