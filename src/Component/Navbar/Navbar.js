import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Tooltip, Modal, Typography, Avatar } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    const isCollapsed = localStorage.getItem("collapsed");
    return isCollapsed === "true";
  });

  const [userDetails, setUserDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");

      if (username) {
        try {
          const response = await axios.post("http://localhost:3000/admin/userDetails", { username: username });
          setUserDetails(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("collapsed", newState.toString());
  };

  const onBreakpoint = broken => {
    if (broken) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    navigate("/");
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  const openUserModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px"
          }}
        >
          <div>
            <Typography.Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              IST
            </Typography.Title>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {userDetails && (
              <Tooltip title={`Logged in as ${userDetails.username}`}>
                <span style={{ marginRight: "10px" }}>
                  <UserOutlined
                    onClick={openUserModal}
                    style={{
                      fontSize: "18px",
                      color: "#000",
                      padding: "8px",
                      borderRadius: "50%",
                      background: "#fff",
                      cursor: "pointer"
                    }}
                  />
                </span>
              </Tooltip>
            )}
            <Tooltip title="Logout">
              <LogoutOutlined
                style={{
                  fontSize: "18px",
                  color: "#000",
                  padding: "8px",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer"
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
      <Modal
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        centered
      >
        {userDetails ? (
          <>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", marginBottom: "16px" }}>
              <Avatar icon={<UserOutlined />} size={100} style={{ marginBottom: "16px", backgroundColor: "#f56a00" }} />
              <div style={{ marginBottom: "16px" }}>
                <Typography.Text strong style={{ color: "#1890ff" }}>Username:</Typography.Text> {userDetails.username || "No Username"}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <Typography.Text strong style={{ color: "#1890ff" }}>Email:</Typography.Text> {userDetails.email || "No Email"}
              </div>
              <Button type="primary">Change Password</Button>
              {/* onClick={handleChangePassword} */}
            </div>
          </>
        ) : (
          <Typography.Text type="danger">User details not available.</Typography.Text>
        )}
      </Modal>
    </Layout>
  );
};

export default Navbar;
