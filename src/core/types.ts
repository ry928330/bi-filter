/**
 * 核心类型定义
 * 基于文章中的 bi-designer 设计理念
 */

// 组件实例
export interface ComponentInstance {
  id: string;
  componentName: string;
  props: Record<string, any>;
  children?: ComponentInstance[];
}

// 事件配置类型
export type EventConfigType = 'filterFetch' | 'filterReady';

// 事件配置
export interface EventConfig {
  type: EventConfigType;
  source: string; // 触发组件 ID
  target: string; // 作用组件 ID
  ignoreFilterScope?: boolean; // 是否突破筛选作用域
}

// 筛选信息
export interface FilterInfo {
  id: string; // 筛选组件 ID
  value: any; // 筛选值
  ready: boolean; // 筛选是否就绪
  componentName: string;
}

// 获取取数参数的回调函数参数
export interface GetFetchParamContext {
  componentInstance: ComponentInstance;
  filters: FilterInfo[]; // 作用于该组件的所有筛选信息
}

// 组件元信息
export interface ComponentMeta {
  componentName: string;
  component: React.ComponentType<any>;
  // 事件配置：返回该组件触发的事件配置
  eventConfigs?: (context: { componentInstance: ComponentInstance }) => EventConfig[];
  // 获取取数参数：组件如何响应筛选条件
  getFetchParam?: (context: GetFetchParamContext) => any;
  // 筛选作用域：返回组件所在的筛选作用域
  filterScope?: (context: { componentInstance: ComponentInstance }) => string[];
}

// Designer Context 值
export interface DesignerContextValue {
  // 组件触发筛选变化
  onFilterChange: (componentId: string, value: any) => void;
  // 提交某个筛选作用域
  submitFilterScope: (scopeName: string) => void;
  // 获取组件的筛选信息
  getFilterInfo: (componentId: string) => FilterInfo | undefined;
  // 获取作用于某个组件的所有筛选信息
  getFiltersForComponent: (componentId: string) => FilterInfo[];
}

// DSL 配置
export interface DSL {
  componentInstances: ComponentInstance[];
}
