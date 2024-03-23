import React, { useState } from "react";
import { Layout, Menu, Button, Avatar } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  StockOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  MenuOutlined,
  LogoutOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const Navbar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        theme="light"
        width={270}
        style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0 }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/">
            <div style={{ color: "#1890ff", fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
              {collapsed ? "Logo" : "Your Brand Name"}
            </div>
          </Link>
        </div>
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="/Home" icon={<HomeOutlined />}>
            <Link to="/Home">Home</Link>
          </Menu.Item>
          <Menu.Item key="/Lab" icon={<ExperimentOutlined />}>
            <Link to="/Lab">Lab</Link>
          </Menu.Item>
          <Menu.Item key="/Stock" icon={<StockOutlined />}>
            <Link to="/Stock">Stock</Link>
          </Menu.Item>
          <Menu.Item key="/System" icon={<DesktopOutlined />}>
            <Link to="/System">Systems</Link>
          </Menu.Item>
          <Menu.Item key="/Research" icon={<BookOutlined />}>
            <Link to="/Research">Research</Link>
          </Menu.Item>
          <Menu.Item key="/Staff" icon={<TeamOutlined />}>
            <Link to="/Staff">Staff</Link>
          </Menu.Item>
          <Menu.Item key="/TimeTable" icon={<ScheduleOutlined />}>
            <Link to="/TimeTable">TimeTable</Link>
          </Menu.Item>
          <Menu.Item key="/Report" icon={<FileTextOutlined />}>
            <Link to="/Report">Report</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 270 }}>
        <Layout.Header style={{ background: '#fff', padding: 0 }}>
          <Button
            className="trigger"
            style={{ float: 'left' }}
            onClick={toggleCollapsed}
          >
            <MenuOutlined />
          </Button>
          <div style={{ float: 'right', marginRight: '20px' }}>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<LogoutOutlined />} />
          </div>
          <div style={{ float: 'right', marginRight: '20px' }}>
            Your Brand Name
          </div>
        </Layout.Header>
      </Layout>
    </Layout>
  );
};

export default Navbar;
