import React, { useState } from "react";
import { Layout, Typography, Card, Modal, Button, Form, Input, Space } from "antd";
import { PlusOutlined, UserOutlined, DesktopOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

const Lab = () => {
  const [labs, setLabs] = useState([
    { id: 1, name: "Lab 1", staffName: "Ramkumar", systemCount: 20, description: "First Floor Lab" },
    { id: 2, name: "Lab 2", staffName: "Harishkumar", systemCount: 15, description: "Second Floor Lab" },
    { id: 3, name: "Lab 3", staffName: "Mukeshkumar", systemCount: 18, description: "Third Floor Lab" },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (values) => {
    const newLab = {
      id: labs.length + 1,
      name: values.name,
      staffName: values.staffName,
      systemCount: values.systemCount,
    };
    setLabs([...labs, newLab]);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const redirectToDetails = (lab) => {
    navigate(`/Lab/Labdet?lab=${lab.id}`);
  };


  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar />

      <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
        <Content style={{ padding: "24px", minHeight: "280px", overflowY: "auto" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 24 }}>
            Add Lab
          </Button>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {labs.map((lab) => (
              <Card
                key={lab.id}
                style={{ width: "100%", margin: "0 0 16px" }}
                actions={[
                  <Button icon={<UserOutlined />} key="staff">Staff: {lab.staffName}</Button>,
                  <Button icon={<DesktopOutlined />} key="system">Systems: {lab.systemCount}</Button>,
                ]}
                onDoubleClick={() => redirectToDetails(lab)}
              >
                <Card.Meta
                  title={<div style={{ fontFamily: "Arial", fontSize: "20px" }}>{lab.name}</div>}
                  description={<div style={{ fontFamily: "Arial", fontSize: "16px" }}>{lab.description}</div>}
                />
              </Card>

            ))}
          </div>
          <Modal
            title="Add New Lab"
            visible={isModalVisible}
            footer={null}
            onCancel={handleCancel}
          >
            <AddLabForm onFinish={handleOk} />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

const AddLabForm = ({ onFinish }) => {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="addLab"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ systemCount: 0 }}
    >
      <Form.Item
        label="Lab Name"
        name="name"
        rules={[{ required: true, message: "Please input the lab name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Staff Name"
        name="staffName"
        rules={[{ required: true, message: "Please input the staff name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="System Count"
        name="systemCount"
        rules={[{ required: true, message: "Please input the system count!" }]}
      >
        <Input type="number" min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Lab;
