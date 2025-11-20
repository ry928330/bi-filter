// 核心类型
export * from './types';

// 核心 Provider
export { BIDesignerProvider } from './BIDesignerProvider';

// 组件渲染器
export { ComponentRenderer } from './ComponentRenderer';

// Hooks
export { useDesigner } from './DesignerContext';
export {
  useComponentMetas,
  useComponentInstances,
} from './ComponentRenderer';

// 如果需要更细粒度的控制，也可以导出底层 Provider
export { DesignerProvider } from './DesignerContext';
export { ComponentInstancesProvider } from './ComponentRenderer';
