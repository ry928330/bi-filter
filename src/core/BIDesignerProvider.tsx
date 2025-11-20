import React from 'react';
import { ComponentInstance, ComponentMeta } from './types';
import { ComponentInstancesProvider } from './ComponentRenderer';
import { DesignerProvider } from './DesignerContext';
import { componentMetas as defaultComponentMetas } from '../components/componentMetas';

interface BIDesignerProviderProps {
  children: React.ReactNode;
  componentInstances: ComponentInstance[];
  componentMetas?: Record<string, ComponentMeta>; // 可选，不传则使用默认值
}

/**
 * BI 设计器根 Provider
 * 组合了 ComponentInstancesProvider 和 DesignerProvider
 *
 * 使用示例：
 * <BIDesignerProvider componentInstances={componentInstances}>
 *   <ComponentRenderer componentId="search-input" />
 * </BIDesignerProvider>
 */
export const BIDesignerProvider: React.FC<BIDesignerProviderProps> = ({
  children,
  componentInstances,
  componentMetas = defaultComponentMetas,
}) => {
  return (
    <ComponentInstancesProvider
      instances={componentInstances}
      componentMetas={componentMetas}
    >
      <DesignerProvider>{children}</DesignerProvider>
    </ComponentInstancesProvider>
  );
};
