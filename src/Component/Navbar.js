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

const { Header, Sider } = Layout;

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
    <Layout>
      <Sider
        collapsed={collapsed}
        width={270}
        style={{
          overflow: "auto",
          height: "100vh",
          background: "#fff"
        }}
        breakpoint="md"
        collapsedWidth={60}
        onBreakpoint={onBreakpoint}
      >
        <Menu
          mode="inline"
          style={{ flexGrow: 1 }}
          selectedKeys={[location.pathname]}
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
            <Link to="/Report">Report</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, height: "64px", lineHeight: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", color: "#000", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="trigger"
                style={{ marginRight: "20px" }}
                onClick={toggleCollapsed}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            </div>
            <div
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginRight: "10px",
                flexShrink: 0
              }}
            >
              <Tooltip title="Logout">
                <LogoutOutlined style={{ fontSize: "18px", marginRight: "5px", color: "#000", padding: "4px", borderRadius: "50%" }} />
              </Tooltip>
            </div>
          </div>
        </Header>
        <Layout.Content>
          <div style={{ background: "#fff" }}>
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
