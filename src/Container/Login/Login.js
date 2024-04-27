import React, { useState } from "react";
import { Form, Input, Button, Layout, Typography, Row, Col, Tabs, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Login.css';

const { Content } = Layout;
// const { Title } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinishSignIn = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/admin/signin', values);
      if (response.status === 200) {
        message.success('Logged in successfully');
        document.cookie = `username=${values.username}`;
        navigate("/Home");
      } else {
        message.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      message.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const onFinishSignUp = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/admin/create_login', values);
      console.log('Response:', response);

      if (response.status === 200 || response.status === 201) {
        message.success('Account created successfully');
        document.cookie = `username=${values.username}`;
        navigate("/Home");
      } else {
        console.log('Unexpected response status:', response.status);
        message.error('Failed to create account');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || 'Username or email already exists';
        message.error(errorMessage);
      } else {
        console.error('Error signing up:', error);
        message.error('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };


  const onFinishForgotPassword = async (values) => {
    try {
      setLoading(true);
      // Implement your forget password logic here
      // For example:
      // const response = await axios.post('http://localhost:3000/admin/forgot_password', values);
      // Handle response accordingly
      message.info('Forget password functionality not implemented');
    } catch (error) {
      console.error('Error forgetting password:', error);
      message.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card className="login-card" bordered={false}>
              <Tabs defaultActiveKey="login" centered>
                <TabPane
                  tab={
                    <div className="tab-pane tab-title">
                      <UserOutlined className="tab-icon" />
                      <span>Login</span>
                    </div>
                  }
                  key="login"
                >
                  <Form
                    name="login-form"
                    onFinish={onFinishSignIn}
                    layout="vertical"
                  >
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
                        size="large"
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
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your password"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-button" size="large" loading={loading}>
                        Log in
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane
                  tab={
                    <div className="tab-pane tab-title">
                      <UserAddOutlined className="tab-icon" />
                      <span>Sign up</span>
                    </div>
                  }
                  key="signup"
                >
                  <Form
                    name="signup-form"
                    onFinish={onFinishSignUp}
                    layout="vertical"
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Invalid email address" }
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your email"
                        size="large"
                      />
                    </Form.Item>
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
                        size="large"
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
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Enter your password"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-button" size="large" loading={loading}>
                        Sign Up
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                {/* <TabPane
                  tab={
                    <div className="tab-pane tab-title">
                      <UserOutlined className="tab-icon" />
                      <span>Forgot Password</span>
                    </div>
                  }
                  key="forgot"
                >
                  <Form
                    name="forgot-password-form"
                    onFinish={onFinishForgotPassword}
                    layout="vertical"
                  >
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
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-button" size="large" loading={loading}>
                        Reset Password
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane> */}
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
