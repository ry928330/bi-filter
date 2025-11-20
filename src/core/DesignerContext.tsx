import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  ComponentInstance,
  EventConfig,
  FilterInfo,
  DesignerContextValue,
} from './types';
import { useComponentMetas, useComponentInstances } from './ComponentRenderer';

const DesignerContext = createContext<DesignerContextValue | null>(null);

// 自定义 Hook：供组件使用
export const useDesigner = () => {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error('useDesigner must be used within DesignerProvider');
  }
  return context;
};

interface DesignerProviderProps {
  children: React.ReactNode;
}

export const DesignerProvider: React.FC<DesignerProviderProps> = ({ children }) => {
  // 从 Context 获取 componentInstances 和 componentMetas
  const componentInstances = useComponentInstances();
  const componentMetas = useComponentMetas();
  // 存储所有筛选信息 {componentId: FilterInfo}
  const [filterMap, setFilterMap] = useState<Record<string, FilterInfo>>({});

  // 存储待提交的筛选作用域数据 {scopeName: {componentId: value}}
  const [pendingScopeFilters, setPendingScopeFilters] = useState<
    Record<string, Record<string, any>>
  >({});

  // 构建事件配置映射表
  const eventConfigMap = useMemo(() => {
    const map: Record<string, EventConfig[]> = {};

    componentInstances.forEach((instance) => {
      const meta = componentMetas[instance.componentName];
      if (meta?.eventConfigs) {
        const configs = meta.eventConfigs({ componentInstance: instance });
        configs.forEach((config) => {
          if (!map[config.source]) {
            map[config.source] = [];
          }
          map[config.source].push(config);
        });
      }
    });

    return map;
  }, [componentInstances, componentMetas]);

  // 获取组件的筛选作用域
  const getComponentFilterScope = useCallback(
    (componentId: string): string[] => {
      const instance = componentInstances.find((c) => c.id === componentId);
      if (!instance) return ['default'];

      const meta = componentMetas[instance.componentName];
      if (meta?.filterScope) {
        return meta.filterScope({ componentInstance: instance });
      }

      return ['default'];
    },
    [componentInstances, componentMetas]
  );

  // 组件触发筛选变化
  const onFilterChange = useCallback(
    (componentId: string, value: any) => {
      const sourceScope = getComponentFilterScope(componentId);
      const configs = eventConfigMap[componentId] || [];

      // 更新筛选信息
      setFilterMap((prev) => {
        const newMap = { ...prev };

        // 找到所有 filterFetch 类型的配置
        const filterFetchConfigs = configs.filter((c) => c.type === 'filterFetch');

        filterFetchConfigs.forEach((config) => {
          const targetScope = getComponentFilterScope(config.target);
          const inSameScope = sourceScope.some((s) => targetScope.includes(s));

          // 如果在同一作用域或设置了 ignoreFilterScope，立即更新筛选值
          if (inSameScope || config.ignoreFilterScope) {
            newMap[componentId] = {
              id: componentId,
              value,
              ready: true,
              componentName:
                componentInstances.find((c) => c.id === componentId)?.componentName || '',
            };

            // 处理 filterReady 依赖
            const filterReadyConfigs = configs.filter((c) => c.type === 'filterReady');
            filterReadyConfigs.forEach((readyConfig) => {
              // 将目标组件的 ready 设置为 false
              if (newMap[readyConfig.target]) {
                newMap[readyConfig.target] = {
                  ...newMap[readyConfig.target],
                  ready: false,
                };
              }
            });
          } else {
            // 不在同一作用域，存储到待提交的作用域数据中
            setPendingScopeFilters((prev) => {
              const newPending = { ...prev };
              sourceScope.forEach((scope) => {
                if (!newPending[scope]) {
                  newPending[scope] = {};
                }
                newPending[scope][componentId] = value;
              });
              return newPending;
            });
          }
        });

        return newMap;
      });

      // 触发目标组件取数
      configs
        .filter((c) => c.type === 'filterFetch')
        .forEach((config) => {
          const targetScope = getComponentFilterScope(config.target);
          const inSameScope = sourceScope.some((s) => targetScope.includes(s));

          if (inSameScope || config.ignoreFilterScope) {
            // 触发目标组件重新取数
            const targetInstance = componentInstances.find((c) => c.id === config.target);
            if (targetInstance) {
              const meta = componentMetas[targetInstance.componentName];
              if (meta?.getFetchParam) {
                // 获取所有作用于目标组件的筛选信息
                const targetFilters = getFiltersForComponent(config.target);

                // 检查是否所有筛选都 ready
                const allReady = targetFilters.every((f) => f.ready);

                if (allReady) {
                  const fetchParam = meta.getFetchParam({
                    componentInstance: targetInstance,
                    filters: targetFilters,
                  });
                  console.log(`组件 ${config.target} 取数参数:`, fetchParam);
                }
              }
            }
          }
        });
    },
    [componentInstances, componentMetas, eventConfigMap, getComponentFilterScope]
  );

  // 提交筛选作用域
  const submitFilterScope = useCallback(
    (scopeName: string) => {
      const pendingFilters = pendingScopeFilters[scopeName] || {};

      setFilterMap((prev) => {
        const newMap = { ...prev };
        Object.entries(pendingFilters).forEach(([componentId, value]) => {
          newMap[componentId] = {
            id: componentId,
            value,
            ready: true,
            componentName:
              componentInstances.find((c) => c.id === componentId)?.componentName || '',
          };
        });
        return newMap;
      });

      // 清除已提交的待处理数据
      setPendingScopeFilters((prev) => {
        const newPending = { ...prev };
        delete newPending[scopeName];
        return newPending;
      });

      // 触发所有受影响的组件取数
      Object.keys(pendingFilters).forEach((sourceId) => {
        const configs = eventConfigMap[sourceId] || [];
        configs
          .filter((c) => c.type === 'filterFetch')
          .forEach((config) => {
            const targetInstance = componentInstances.find((c) => c.id === config.target);
            if (targetInstance) {
              const meta = componentMetas[targetInstance.componentName];
              if (meta?.getFetchParam) {
                const targetFilters = getFiltersForComponent(config.target);
                const fetchParam = meta.getFetchParam({
                  componentInstance: targetInstance,
                  filters: targetFilters,
                });
                console.log(`组件 ${config.target} 取数参数:`, fetchParam);
              }
            }
          });
      });
    },
    [pendingScopeFilters, componentInstances, componentMetas, eventConfigMap]
  );

  // 获取组件的筛选信息
  const getFilterInfo = useCallback(
    (componentId: string): FilterInfo | undefined => {
      return filterMap[componentId];
    },
    [filterMap]
  );

  // 获取作用于某个组件的所有筛选信息
  const getFiltersForComponent = useCallback(
    (targetComponentId: string): FilterInfo[] => {
      const filters: FilterInfo[] = [];

      Object.entries(eventConfigMap).forEach(([sourceId, configs]) => {
        configs
          .filter((c) => c.type === 'filterFetch' && c.target === targetComponentId)
          .forEach(() => {
            const filterInfo = filterMap[sourceId];
            if (filterInfo) {
              filters.push(filterInfo);
            }
          });
      });

      return filters;
    },
    [eventConfigMap, filterMap]
  );

  const contextValue: DesignerContextValue = {
    onFilterChange,
    submitFilterScope,
    getFilterInfo,
    getFiltersForComponent,
  };

  return (
    <DesignerContext.Provider value={contextValue}>{children}</DesignerContext.Provider>
  );
};
