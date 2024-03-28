import React, { useState, useEffect } from "react";
import { Layout, Typography, Tabs, Card, Modal, Form, Input, Button, Select, TimePicker, Table } from "antd";
import { ScheduleOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Meta } = Card;

const TimeTable = () => {
  const [form] = Form.useForm();
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [timetableData, setTimetableData] = useState(null);
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetchLabs();
    fetchTimeTable();
    fetchStaffs();
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

  const fetchTimeTable = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin/get_all_timetables");
      console.log(response.data);
      setTimetableData(response.data);
    } catch (error) {
      console.log("Error Fetching the Time Table", error);
    }
  }

  const fetchStaffs = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/get_all_staffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStaffs(data);
      } else {
        console.error("Failed to fetch staffs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching staffs:", error);
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
    const startTime = values.timings[0].format("HH:mm");
    const endTime = values.timings[1].format("HH:mm");
    values.timings = `${startTime}-${endTime}`;
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

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const columns = [
    {
      title: "Days",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "FN",
      children: [
        {
          title: "08:00 - 09:00",
          dataIndex: "time1",
          key: "time1",
        },
        {
          title: "09:00 - 10:00",
          dataIndex: "time2",
          key: "time2",
        },
      ],
    },
    {
      title: "AN",
      children: [
        {
          title: "10:00 - 11:00",
          dataIndex: "time3",
          key: "time3",
        },
        {
          title: "11:00 - 12:00",
          dataIndex: "time4",
          key: "time4",
        },
      ],
    },
  ];

  const data = timetableData?.filter(entry => entry.lab_id === selectedLab?.lab_id).map(entry => ({
    key: entry.id,
    day: entry.day,
    time1: entry.FN_1,
    time2: entry.FN_2,
    time3: entry.AN_1,
    time4: entry.AN_2,

  })) || [];

  return (
    <Layout hasSider>
      <Navbar>
        <Layout>
          <Content style={{ padding: "24px", background: "#fff" }}>
            <Tabs defaultActiveKey="1" tabPosition="top">
              <TabPane tab="Time Table Creation" key="1">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {labs.map(lab => (
                    <Card
                      key={lab.lab_id}
                      style={{ width: 300, margin: 16 }}
                      actions={[<Button
                        type="primary"
                        icon={<ScheduleOutlined />}
                        onClick={() => handleCreateTimetable(lab)}
                      >
                        Time Table
                      </Button>]}
                    >
                      <Meta
                        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{lab.lab_name.toUpperCase()}</span>}
                        description={lab.lab_description}
                      />
                    </Card>
                  ))}
                </div>
                <Modal
                  title="Create Timetable Entry"
                  visible={modalVisible}
                  onCancel={handleModalCancel}
                  footer={null}
                >
                  <Form form={form} onFinish={handleModalSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
                      <Select placeholder="Select day">
                        {daysOfWeek.map(day => (
                          <Option key={day} value={day}>{day}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="session_type" label="Session Type" rules={[{ required: true, message: 'Please enter session type!' }]}>
                      <Select placeholder="Select session type">
                        <Option value="FN">FN</Option>
                        <Option value="AN">AN</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="timings" label="Timings" rules={[{ required: true, message: 'Please enter timings!' }]}>
                      <TimePicker.RangePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item name="subject_teacher" label="Subject Teacher" rules={[{ required: true, message: 'Please select subject teacher!' }]}>
                      <Select placeholder="Select subject teacher">
                        {staffs.map(staff => (
                          <Option key={staff.staffid} value={staff.staffid}>{staff.staffname}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6 }}>
                      <Button type="primary" htmlType="submit">Create Timetable Entry</Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </TabPane>
              <TabPane tab="View" key="2">
                <Select
                  style={{ width: 200, marginBottom: 16 }}
                  placeholder="Select Lab"
                  onChange={labId => setSelectedLab(labs.find(lab => lab.lab_id === labId))}
                >
                  {labs.map(lab => (
                    <Option key={lab.lab_id} value={lab.lab_id}>{lab.lab_name}</Option>
                  ))}
                </Select>
                <Table
                  columns={columns}
                  dataSource={data}
                  bordered
                  size="small"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

export default TimeTable;
