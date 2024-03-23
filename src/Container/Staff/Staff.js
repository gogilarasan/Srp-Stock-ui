import React, { useState } from "react";
import { Layout, Typography, Card, Modal, Form, Input, Button, Avatar } from "antd";
import { UserOutlined, SettingOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
const { Meta } = Card;

const Staff = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const staffList = [
    { staffid: "1", staffname: "John Doe", researchscholarcount: 5 },
    { staffid: "2", staffname: "Jane Smith", researchscholarcount: 7 },
    { staffid: "3", staffname: "Alice Johnson", researchscholarcount: 4 },
    { staffid: "4", staffname: "Bob Brown", researchscholarcount: 6 },
    { staffid: "5", staffname: "Eve Williams", researchscholarcount: 3 },
  ];

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log("Received values:", values);
    setVisible(false);
  };

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: "24px", minHeight: "480px" }}>
          <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
            Add Staff
          </Button>
          <div className="card-container" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
            {staffList.map((staff) => (
              <Card
                key={staff.staffid}
                style={{ width: "calc(100% - 16px)", margin: "0 8px 16px 8px" }}
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                <Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={staff.staffname}
                  description={
                    <>
                      <p>Research Scholar Count: {staff.researchscholarcount}</p>
                      <p>Staff ID: {staff.staffid}</p>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
          <Modal title="Add Staff" visible={visible} onCancel={handleCancel} footer={null}>
            <Form form={form} onFinish={onFinish}>
              <Form.Item label="Staff ID" name="staffid">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Staff Name" name="staffname">
                <Input />
              </Form.Item>
              <Form.Item label="Research Scholar Count" name="researchscholarcount">
                <Input type="number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Staff;
