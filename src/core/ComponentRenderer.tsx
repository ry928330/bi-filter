import React, { createContext, useContext } from 'react';
import { ComponentInstance, ComponentMeta } from './types';
import { componentMetas as defaultComponentMetas } from '../components/componentMetas';

interface ComponentRendererProps {
  instance?: ComponentInstance;
  componentId?: string;
  componentMetas?: Record<string, ComponentMeta>; // 可选，用于特殊场景覆盖
}

// 创建 ComponentMetas Context
const ComponentMetasContext = createContext<Record<string, ComponentMeta>>(
  defaultComponentMetas
);

// 创建 ComponentInstances Context
const ComponentInstancesContext = createContext<ComponentInstance[]>([]);

/**
 * 组件实例和元信息提供者
 * 统一管理组件实例和元信息
 */
export const ComponentInstancesProvider: React.FC<{
  instances: ComponentInstance[];
  componentMetas?: Record<string, ComponentMeta>; // 可选，不传则使用默认值
  children: React.ReactNode;
}> = ({ instances, componentMetas = defaultComponentMetas, children }) => {
  return (
    <ComponentMetasContext.Provider value={componentMetas}>
      <ComponentInstancesContext.Provider value={instances}>
        {children}
      </ComponentInstancesContext.Provider>
    </ComponentMetasContext.Provider>
  );
};

/**
 * 获取 ComponentMetas 的 Hook
 */
export const useComponentMetas = () => {
  return useContext(ComponentMetasContext);
};

/**
 * 获取 ComponentInstances 的 Hook
 */
export const useComponentInstances = () => {
  return useContext(ComponentInstancesContext);
};

/**
 * 组件渲染器
 * 支持两种使用方式：
 * 1. 传入 instance: <ComponentRenderer instance={instance} />
 * 2. 传入 componentId: <ComponentRenderer componentId="input-1" />
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  instance: propInstance,
  componentId,
  componentMetas: propsComponentMetas,
}) => {
  const contextComponentMetas = useComponentMetas();
  const allInstances = useComponentInstances();

  // 优先使用 props 传入的 componentMetas，否则使用 Context 中的
  const componentMetas = propsComponentMetas || contextComponentMetas;

  // 优先使用 instance，如果没有则通过 componentId 查找
  let instance = propInstance;
  if (!instance && componentId) {
    instance = findInstanceById(allInstances, componentId);
  }

  if (!instance) {
    return (
      <div style={{ color: 'red' }}>
        未找到组件: {componentId || '未指定 componentId 或 instance'}
      </div>
    );
  }

  const meta = componentMetas[instance.componentName];

  if (!meta) {
    return <div style={{ color: 'red' }}>未找到组件: {instance.componentName}</div>;
  }

  const Component = meta.component;

  // 渲染子组件
  const children =
    instance.children?.map((child) => (
      <ComponentRenderer key={child.id} instance={child} />
    )) || null;

  return <Component {...instance.props} componentId={instance.id}>{children}</Component>;
};

/**
 * 递归查找组件实例
 */
function findInstanceById(
  instances: ComponentInstance[],
  id: string
): ComponentInstance | undefined {
  for (const instance of instances) {
    if (instance.id === id) {
      return instance;
    }
    if (instance.children) {
      const found = findInstanceById(instance.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}
