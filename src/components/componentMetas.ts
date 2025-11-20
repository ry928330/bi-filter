import { ComponentMeta } from '../core/types';
import { InputFilter } from './InputFilter';
import { SelectFilter } from './SelectFilter';
import { TableDisplay } from './TableDisplay';
import { ChartDisplay } from './ChartDisplay';
import { QueryButton } from './QueryButton';

/**
 * 所有组件的元信息配置
 */
export const componentMetas: Record<string, ComponentMeta> = {
  InputFilter: {
    componentName: 'InputFilter',
    component: InputFilter,
    // 输入框的事件配置：根据 props.targets 生成 filterFetch 事件
    eventConfigs: ({ componentInstance }) => {
      const targets = componentInstance.props.targets || [];
      return targets.map((targetId: string) => ({
        type: 'filterFetch' as const,
        source: componentInstance.id,
        target: targetId,
      }));
    },
    // 输入框的筛选作用域
    filterScope: ({ componentInstance }) => {
      return componentInstance.props.filterScope || ['default'];
    },
  },

  SelectFilter: {
    componentName: 'SelectFilter',
    component: SelectFilter,
    eventConfigs: ({ componentInstance }) => {
      const targets = componentInstance.props.targets || [];
      const configs = targets.map((targetId: string) => ({
        type: 'filterFetch' as const,
        source: componentInstance.id,
        target: targetId,
        ignoreFilterScope: componentInstance.props.ignoreFilterScope,
      }));

      // 如果有 filterReady 依赖配置
      if (componentInstance.props.filterReadyTargets) {
        componentInstance.props.filterReadyTargets.forEach((targetId: string) => {
          configs.push({
            type: 'filterReady' as const,
            source: componentInstance.id,
            target: targetId,
          });
        });
      }

      return configs;
    },
    filterScope: ({ componentInstance }) => {
      return componentInstance.props.filterScope || ['default'];
    },
  },

  TableDisplay: {
    componentName: 'TableDisplay',
    component: TableDisplay,
    // 表格也可以作为筛选源（点击单元格）
    eventConfigs: ({ componentInstance }) => {
      const targets = componentInstance.props.targets || [];
      return targets.map((targetId: string) => ({
        type: 'filterFetch' as const,
        source: componentInstance.id,
        target: targetId,
      }));
    },
    // 表格如何响应筛选条件
    getFetchParam: ({ componentInstance, filters }) => {
      return {
        componentId: componentInstance.id,
        filters: filters.map((f) => ({
          field: f.componentName,
          value: f.value,
        })),
      };
    },
  },

  ChartDisplay: {
    componentName: 'ChartDisplay',
    component: ChartDisplay,
    // 图表也可以作为筛选源（点击图表元素）
    eventConfigs: ({ componentInstance }) => {
      const targets = componentInstance.props.targets || [];
      return targets.map((targetId: string) => ({
        type: 'filterFetch' as const,
        source: componentInstance.id,
        target: targetId,
      }));
    },
    // 图表如何响应筛选条件
    getFetchParam: ({ componentInstance, filters }) => {
      return {
        componentId: componentInstance.id,
        filters: filters.map((f) => ({
          field: f.componentName,
          value: f.value,
        })),
      };
    },
  },

  QueryButton: {
    componentName: 'QueryButton',
    component: QueryButton,
  },
};
