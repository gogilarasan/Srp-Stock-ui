import React from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  StockOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  BookOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Navbar = () => {
  const location = useLocation();

  return (
    <Sider width={270} theme="light" style={{ minHeight: "100vh" }}>
      <Menu mode="vertical" theme="light" style={{ flexGrow: 1 }} selectedKeys={[location.pathname]}>
        <Menu.Item key="/" icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/Stock" icon={<StockOutlined />}>
          <Link to="/Stock">Stock</Link>
        </Menu.Item>
        <Menu.Item key="/System" icon={<DesktopOutlined />}>
          <Link to="/System">Systems</Link>
        </Menu.Item>
        <Menu.Item key="/Lab" icon={<ExperimentOutlined />}>
          <Link to="/Lab">Lab</Link>
        </Menu.Item>
        <Menu.Item key="/Research" icon={<BookOutlined />}>
          <Link to="/Research">Research</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Navbar;
