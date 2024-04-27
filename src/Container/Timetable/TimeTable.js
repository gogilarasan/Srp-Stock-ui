import React, { useState, useEffect } from "react";
import { Layout, Typography, Tabs, Card, Modal, Form, Input, Button, Select, TimePicker, Table, Tag, Space, message } from "antd";
import { ScheduleOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar/Navbar";
import axios from "axios";

const { Content } = Layout;
// const { Title } = Typography;
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
  const [selectedEntry, setSelectedEntry] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

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
    form.setFieldsValue({
      timings: [null, null],
    });
  };

  const handleModalSubmit = async (values) => {
    const startTime = values.timings && values.timings.length > 0 ? values.timings[0].format("HH:mm") : "";
    const endTime = values.timings && values.timings.length > 1 ? values.timings[1].format("HH:mm") : "";

    if (!startTime || !endTime) {
      console.error("Invalid timings provided");
      return;
    }

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
        fetchTimeTable();
        form.resetFields();
      } else {
        console.error("Failed to create timetable entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating timetable entry:", error);
    }
  };


  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


  const handleDelete = async (timetableId) => {
    try {
      const response = await axios.post('http://localhost:3000/admin/delete_timetable', {
        timetable_id: timetableId
      });
      if (response.status === 200) {
        fetchTimeTable();
        message.success('Timetable deleted successfully');
      } else {
        message.error('Failed to delete timetable');
      }
    } catch (error) {
      message.error('An error occurred while deleting timetable');
      console.error(error);
    }
  };

  const handleOpenUpdateModal = (entry) => {
    console.log(entry);
    setSelectedEntry(entry);
    setUpdateModalVisible(true);
    form.setFieldsValue({
      lab_id: entry.lab_id,
      subject_id: entry.subject_id,
      subject_name: entry.subject_name,
      day: entry.day,
      session_type: entry.session_type,
      //timings: [moment(entry.timings.split('-')[0], 'HH:mm'), moment(entry.timings.split('-')[1], 'HH:mm')],
      subject_teacher: entry.subject_teacher,
      sem: entry.sem,
      batch: entry.batch
    });
  };


  const handleUpdateModalCancel = () => {
    console.log("Cancelling update modal");
    setUpdateModalVisible(false);
    form.resetFields();
    form.setFieldsValue({
      timings: [null, null], // Reset the TimePicker.RangePicker values
    });
  };

  const handleUpdate = async (values) => {
    try {
      console.log("Selected entry", selectedEntry);
      const updatedEntry = { ...selectedEntry, ...values };
      console.log("Update entry : ", updatedEntry);
      const response = await axios.post('http://localhost:3000/admin/update_timetable', updatedEntry);
      if (response.status === 200) {
        message.success('Timetable updated successfully');
        fetchTimeTable();
        setUpdateModalVisible(false);
        form.resetFields();
      } else {
        message.error('Failed to update timetable');
      }
    } catch (error) {
      message.error('An error occurred while updating timetable');
      console.error(error);
    }
  };


  useEffect(() => {
    console.log("Selected Entry updated:", selectedEntry);
  }, [selectedEntry]);

  const getTimetableData = (timetableData, selectedLab) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const renderPeriod = (record) => {
      const day = record && record.day;
      if (!day || !Array.isArray(timetableData)) {
        return <span>No data</span>;
      }

      const periodData = timetableData.filter(
        entry => entry.day === day && entry.session_type === record.session_type && entry.lab_id === selectedLab?.lab_id
      );

      const groupedData = {};

      periodData.forEach(entry => {
        const startTime = entry.timings.split("-")[0];

        if (!groupedData[startTime]) {
          groupedData[startTime] = [];
        }

        groupedData[startTime].push(entry);
      });

      return (
        <div>
          {Object.keys(groupedData).map(startTime => (
            <div key={startTime} style={{ marginBottom: 16 }}>
              <Space wrap>
                {groupedData[startTime].map(entry => (
                  <Card
                    key={entry.timetable_id}
                    size="small"
                    title={entry.subject_name}
                    style={{ width: 300, marginBottom: 16 }}
                    actions={[
                      <Button type="primary" onClick={() => handleOpenUpdateModal(entry)}>Update</Button>,
                      <Button type="danger" onClick={() => handleDelete(entry.timetable_id)}>Delete</Button>
                    ]}
                  >
                    <p>
                      <Tag color="#2db7f5">Teacher: {entry.subject_teacher}</Tag>
                      <Tag color="#87d068">Timings: {entry.timings}</Tag>
                    </p>
                  </Card>
                ))}
              </Space>
            </div>
          ))}
        </div>
      );

    };

    const data = daysOfWeek.map(day => {
      const rowData = {
        key: day,
        day,
      };
      if (timetableData && selectedLab) {
        ["FN", "AN"].forEach(sessionType => {
          const periodData = timetableData.find(entry => entry.day === day && entry.session_type === sessionType && entry.lab_id === selectedLab?.lab_id);
          rowData[sessionType] = periodData ? { ...periodData } : null;
        });
      }
      return rowData;
    });

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
            title: "08:15 - 10:15",
            dataIndex: "FN",
            key: "FN",
            render: renderPeriod,
          },
        ],
      },
      {
        title: "AN",
        children: [
          {
            title: "13:10 - 15:00",
            dataIndex: "AN",
            key: "AN",
            render: renderPeriod,
          },
        ],
      },
    ];

    return { columns, data };
  };


  const { columns, data } = getTimetableData(timetableData, selectedLab);


  return (
    <Layout hasSider>
      <Navbar>
        <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <Content style={{ padding: '24px', minHeight: '280px', maxHeight: 'calc(100vh - 64px)' ,background:'#ffff'}}>
            <Tabs defaultActiveKey="1" tabPosition="top">
              <TabPane tab="Time Table Creation" key="1">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {labs.map(lab => (
                    <Card
                      key={lab.lab_id}
                      style={{ width: 350, margin: 16 }}
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
                    <Form.Item name="sem" label="Semester" rules={[{ required: true, message: 'Please enter semester!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="batch" label="Batch" rules={[{ required: true, message: 'Please enter batch!' }]}>
                      <Input />
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
                <div style={{ height: '450px', overflow: 'auto' }}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    size="small"
                    pagination={false}
                    scroll={{ x: true }}
                  />
                </div>
              </TabPane>
            </Tabs>
            <Modal
              title="Update Timetable Entry"
              visible={updateModalVisible}
              onCancel={handleUpdateModalCancel}
              footer={[
                <Button key="cancel" onClick={handleUpdateModalCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>Update</Button>
              ]}
            >
              <Form
                form={form}
                onFinish={(values) => handleUpdate(values)}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                initialValues={selectedEntry}
              >
                <Form.Item name="lab_id" label="Lab ID" rules={[{ required: true, message: 'Please enter lab ID!' }]}>
                  <Select placeholder="Select lab ID">
                    {labs.map(lab => (
                      <Option key={lab.lab_id} value={lab.lab_id}>{lab.lab_id}</Option>
                    ))}
                  </Select>
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
                <Form.Item name="subject_teacher" label="Subject Teacher" rules={[{ required: true, message: 'Please select subject teacher!' }]}>
                  <Select placeholder="Select subject teacher">
                    {staffs.map(staff => (
                      <Option key={staff.staffid} value={staff.staffid}>{staff.staffname}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="sem" label="Semester" rules={[{ required: true, message: 'Please enter semester!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="batch" label="Batch" rules={[{ required: true, message: 'Please enter batch!' }]}>
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

export default TimeTable;
