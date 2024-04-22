import React, { useState } from "react";
import { Layout, Menu, Button, Tooltip } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  StockOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    const isCollapsed = localStorage.getItem("collapsed");
    return isCollapsed === "true";
  });

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("collapsed", newState.toString());
  };

  const handleLogout = () => {
    navigate("/");
    document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const onBreakpoint = broken => {
    if (broken) {
      setCollapsed(true);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        width={270}
        style={{
          overflow: "auto",
          background: "#f5f5f5",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
        }}
        breakpoint="md"
        collapsedWidth={60}
        onBreakpoint={onBreakpoint}
      >
        <div style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Button
            className="trigger"
            onClick={toggleCollapsed}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>
        <Menu
          mode="inline"
          style={{ flexGrow: 1, background: "#f5f5f5", borderRight: "none" }}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/Home" icon={<HomeOutlined />}>
            <Link to="/Home">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/Lab" icon={<ExperimentOutlined />}>
            <Link to="/Lab">Lab</Link>
          </Menu.Item>
          <Menu.Item key="/Stock" icon={<StockOutlined />}>
            <Link to="/Stock">Stock</Link>
          </Menu.Item>
          <Menu.Item key="/System" icon={<DesktopOutlined />}>
            <Link to="/System">System Stocks</Link>
          </Menu.Item>
          <Menu.Item key="/Staff" icon={<TeamOutlined />}>
            <Link to="/Staff">Staff</Link>
          </Menu.Item>
          <Menu.Item key="/Research" icon={<BookOutlined />}>
            <Link to="/Research">Research</Link>
          </Menu.Item>
          <Menu.Item key="/TimeTable" icon={<ScheduleOutlined />}>
            <Link to="/TimeTable">TimeTable</Link>
          </Menu.Item>
          <Menu.Item key="/Report" icon={<FileTextOutlined />}>
            <Link to="/Report">Remarks</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#f5f5f5",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "24px" }}>
            <Tooltip title="Logout">
              <LogoutOutlined
                style={{
                  fontSize: "18px",
                  color: "#000",
                  padding: "8px",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
                onClick={handleLogout}
              />
            </Tooltip>
          </div>
        </Header>
        <Content style={{ padding: "24px", minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
