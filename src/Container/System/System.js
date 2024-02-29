import React, { useState } from "react";
import { Layout, Typography, Card, Modal, Table, Button } from "antd";
import Navbar from "../../Component/Navbar";

const { Content } = Layout;
const { Title } = Typography;

const Lab = () => {
  const initialSystems = [
    { 
      id: 1, 
      name: "System 1", 
      logs: [
        { id: 1, message: "Log 1", username: "User 1", rollno: "Roll No 1", startTime: "10:00 AM", stopTime: "11:00 AM" },
        { id: 2, message: "Log 2", username: "User 2", rollno: "Roll No 2", startTime: "11:00 AM", stopTime: "12:00 PM" },
        { id: 3, message: "Log 3", username: "User 3", rollno: "Roll No 3", startTime: "12:00 PM", stopTime: "1:00 PM" }
      ] 
    },
    { 
      id: 2, 
      name: "System 2", 
      logs: [
        { id: 1, message: "Log 4", username: "User 4", rollno: "Roll No 4", startTime: "10:00 AM", stopTime: "11:00 AM" },
        { id: 2, message: "Log 5", username: "User 5", rollno: "Roll No 5", startTime: "11:00 AM", stopTime: "12:00 PM" },
        { id: 3, message: "Log 6", username: "User 6", rollno: "Roll No 6", startTime: "12:00 PM", stopTime: "1:00 PM" }
      ] 
    },
    { 
      id: 3, 
      name: "System 3", 
      logs: [
        { id: 1, message: "Log 7", username: "User 7", rollno: "Roll No 7", startTime: "10:00 AM", stopTime: "11:00 AM" },
        { id: 2, message: "Log 8", username: "User 8", rollno: "Roll No 8", startTime: "11:00 AM", stopTime: "12:00 PM" },
        { id: 3, message: "Log 9", username: "User 9", rollno: "Roll No 9", startTime: "12:00 PM", stopTime: "1:00 PM" }
      ] 
    }
  ];
  const [systems, setSystems] = useState(initialSystems);

  const [selectedSystem, setSelectedSystem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardDoubleClick = (system) => {
    setSelectedSystem(system);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedSystem(null);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Log',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Roll No',
      dataIndex: 'rollno',
      key: 'rollno',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Stop Time',
      dataIndex: 'stopTime',
      key: 'stopTime',
      render: (text) => text || 'Running',
    },
  ];

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar />

      <Layout>
        <Content style={{ padding: "24px", minHeight: "280px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {systems.map((system) => (
              <Card
                key={system.id}
                title={`System ${system.id}`}
                style={{ width: 300, margin: 16 }}
                onClick={() => handleCardDoubleClick(system)}
              >
                <p>Name: {system.name}</p>
              </Card>
            ))}
          </div>
          <Modal
            title={`Logs for System ${selectedSystem?.id}`}
            visible={isModalVisible}
            onCancel={handleCloseModal}
            footer={[
              <Button key="close" onClick={handleCloseModal}>
                Close
              </Button>,
            ]}
          >
            <Table
              dataSource={selectedSystem?.logs}
              columns={columns}
              pagination={false}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Lab;
