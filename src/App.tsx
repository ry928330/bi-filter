import React, { useState } from 'react';
import { Layout, Menu, Typography, Card } from 'antd';
import {
  FilterOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  SearchOutlined,
  FallOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { BasicFilterDemo } from './demos/BasicFilterDemo';
import { ChartLinkageDemo } from './demos/ChartLinkageDemo';
import { CascadeFilterDemo } from './demos/CascadeFilterDemo';
import { QueryButtonDemo } from './demos/QueryButtonDemo';
import { DrillDownDemo } from './demos/DrillDownDemo';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph, Link } = Typography;

type DemoKey = 'home' | 'basic' | 'chart' | 'cascade' | 'query' | 'drilldown';

function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoKey>('home');

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'basic',
      icon: <FilterOutlined />,
      label: 'Demo 1: 基本筛选',
    },
    {
      key: 'chart',
      icon: <BarChartOutlined />,
      label: 'Demo 2: 图表联动',
    },
    {
      key: 'cascade',
      icon: <ApartmentOutlined />,
      label: 'Demo 3: 三级联动',
    },
    {
      key: 'query',
      icon: <SearchOutlined />,
      label: 'Demo 4: 查询按钮',
    },
    {
      key: 'drilldown',
      icon: <FallOutlined />,
      label: 'Demo 5: 下钻功能',
    },
  ];

  const renderContent = () => {
    switch (selectedDemo) {
      case 'home':
        return (
          <Card style={{ margin: 20 }}>
            <Title level={2}>BI 筛选器系统 Demo</Title>
            <Paragraph>
              本项目基于文章《
              <Link
                href="https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/166.%E7%B2%BE%E8%AF%BB%E3%80%8ABI%20%E6%90%AD%E5%BB%BA%20-%20%E7%AD%9B%E9%80%89%E6%9D%A1%E4%BB%B6%E3%80%8B.md"
                target="_blank"
              >
                精读《BI 搭建 - 筛选条件》
              </Link>
              》的设计理念，实现了一个完整的筛选器系统。
            </Paragraph>

            <Title level={3}>核心特性</Title>
            <ul>
              <li>
                <strong>通用筛选能力：</strong>
                任何组件都可以作为筛选源或筛选目标，不局限于传统的输入框、下拉框。
              </li>
              <li>
                <strong>低侵入设计：</strong>
                组件保持独立性，通过元信息配置实现筛选能力，而非在组件内部硬编码。
              </li>
              <li>
                <strong>筛选作用域：</strong>
                支持筛选作用域隔离，可实现查询按钮聚合等高级功能。
              </li>
              <li>
                <strong>筛选就绪机制：</strong>
                通过 filterReady 依赖配置，避免三级联动等场景的频繁取数问题。
              </li>
              <li>
                <strong>事件驱动：</strong>
                基于事件配置（eventConfigs）实现组件间的筛选关系，灵活且易于扩展。
              </li>
            </ul>

            <Title level={3}>Demo 场景说明</Title>
            <ul>
              <li>
                <strong>Demo 1 - 基本筛选：</strong>
                展示最基础的筛选场景，输入框和下拉框实时筛选表格数据。
              </li>
              <li>
                <strong>Demo 2 - 图表联动：</strong>
                展示展示类组件之间的联动，点击图表元素筛选其他图表和表格。
              </li>
              <li>
                <strong>Demo 3 - 三级联动：</strong>
                展示国家-省-市三级联动场景，使用 filterReady 机制避免频繁取数。
              </li>
              <li>
                <strong>Demo 4 - 查询按钮聚合：</strong>
                展示筛选作用域的应用，多个筛选条件通过查询按钮统一提交。
              </li>
              <li>
                <strong>Demo 5 - 下钻功能：</strong>
                展示组件自身触发自身筛选，实现年-月-日的数据下钻。
              </li>
            </ul>

            <Title level={3}>技术栈</Title>
            <ul>
              <li>Vite + React 18 + TypeScript</li>
              <li>Ant Design 5.x</li>
              <li>自研筛选引擎（基于 Context + 元信息配置）</li>
            </ul>

            <Paragraph style={{ marginTop: 20, color: '#666' }}>
              请点击左侧菜单查看各个 Demo 场景。
            </Paragraph>
          </Card>
        );
      case 'basic':
        return <BasicFilterDemo />;
      case 'chart':
        return <ChartLinkageDemo />;
      case 'cascade':
        return <CascadeFilterDemo />;
      case 'query':
        return <QueryButtonDemo />;
      case 'drilldown':
        return <DrillDownDemo />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          BI 筛选器系统 Demo
        </div>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedDemo]}
            items={menuItems}
            onClick={({ key }) => setSelectedDemo(key as DemoKey)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: 0 }}>
          <Content
            style={{
              background: '#f0f2f5',
              minHeight: 280,
              overflow: 'auto',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
