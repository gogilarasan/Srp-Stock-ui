import React, { useState } from "react";
import { Layout, Typography, Card, Modal, Button, Form, Input } from "antd";
import { PlusOutlined, UserOutlined, DesktopOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import { useNavigate } from "react-router-dom";
import './Lab.css'

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
      <Navbar> 
        <Layout style={{ padding: "24px" }}>
          <Content>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 24 }}>
              Add Lab
            </Button>
            <div className="labs-container">
              {labs.map((lab) => (
                <Card
                  key={lab.id}
                  className="lab-card"
                  actions={[
                    <Button icon={<UserOutlined />} key="staff">Staff: {lab.staffName}</Button>,
                    <Button icon={<DesktopOutlined />} key="system">Systems: {lab.systemCount}</Button>,
                  ]}
                  onClick={() => redirectToDetails(lab)}
                >
                  <Card.Meta
                    title={lab.name}
                    description={lab.description}
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
      </Navbar>
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
