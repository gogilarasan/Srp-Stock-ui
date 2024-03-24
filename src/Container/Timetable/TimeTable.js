import React, { useState, useEffect } from "react";
import { Layout, Typography, Tabs, Card, Modal, Form, Input, Button, Select } from "antd";
import Navbar from "../../Component/Navbar";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const TimeTable = () => {
  const [form] = Form.useForm();
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/get_all_labs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLabs(data);
      } else {
        console.error("Failed to fetch labs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const handleCreateTimetable = (lab) => {
    setSelectedLab(lab);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/admin/create_timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        console.log("Timetable entry created successfully!");
        setModalVisible(false);
        form.resetFields();
      } else {
        console.error("Failed to create timetable entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating timetable entry:", error);
    }
  };

  return (
    <Layout hasSider>
      <Navbar>
        <Layout>
          <Content style={{ padding: "24px" }}>
            <Tabs defaultActiveKey="1" tabPosition="top">
              <TabPane tab="Time Table Creation" key="1">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {labs.map(lab => (
                    <Card
                      key={lab.lab_id}
                      title={lab.lab_name}
                      style={{ width: 300, margin: 16 }}
                      actions={[<Button type="primary" onClick={() => handleCreateTimetable(lab)}>Create Time Table</Button>]}
                    >
                      <p>{lab.lab_description}</p>
                    </Card>
                  ))}
                </div>
                <Modal
                  title="Create Timetable Entry"
                  visible={modalVisible}
                  onCancel={handleModalCancel}
                  footer={null}
                >
                  <Form form={form} onFinish={handleModalSubmit}>
                    <Form.Item name="lab_id" initialValue={selectedLab ? selectedLab.lab_id : null} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item name="subject_id" label="Subject ID" rules={[{ required: true, message: 'Please enter subject ID!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="subject_name" label="Subject Name" rules={[{ required: true, message: 'Please enter subject name!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="day" label="Day" rules={[{ required: true, message: 'Please enter day!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="session_type" label="Session Type" rules={[{ required: true, message: 'Please enter session type!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="timings" label="Timings" rules={[{ required: true, message: 'Please enter timings!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="subject_teacher" label="Subject Teacher" rules={[{ required: true, message: 'Please enter subject teacher!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">Create Timetable Entry</Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </TabPane>
              <TabPane tab="2" key="2">
                <Title level={3}>2</Title>
                <p>This is the content for Tab 2.</p>
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

export default TimeTable;
