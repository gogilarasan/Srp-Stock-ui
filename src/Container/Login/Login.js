import React from "react";
import { Form, Input, Button, Layout, Typography, Row, Col, Tabs} from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import usersData from './users.json';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values:', values);

    const user = usersData.users.find(u => u.username === values.username && u.password === values.password);

    if (user) {
      navigate("/Home");
    } else {
      console.log("Invalid credentials");
    }
  };

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <div className="login-form-shadow">
              <Tabs defaultActiveKey="login" centered>
                <TabPane tab="Login" key="login">
                  <Form
                    name="login-form"
                    onFinish={onFinish}
                    layout="vertical"
                  >
                    <Title level={2} className="login-title">
                      Login
                    </Title>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        { required: true, message: "Please input your username!" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your username"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please input your password!" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Enter your password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-button">
                        Log in
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Sign up" key="signup">
                  <Form
                    name="signup-form"
                    onFinish={() => { }}
                    layout="vertical"
                  >
                    <Title level={2} className="login-title">
                      Sign Up
                    </Title>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        { required: true, message: "Please input your username!" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your username"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please input your password!" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Enter your password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-button">
                        Sign Up
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
