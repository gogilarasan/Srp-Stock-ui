import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, Menu, Dropdown, Table, Modal } from "antd";
import { EllipsisOutlined, UserOutlined, DesktopOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import { useParams } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

const Details = () => {
    const { labId } = useParams();
    const [labs, setLab] = useState(null);
    const [systemss, setSystems] = useState([]);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [systemLogs, setSystemLogs] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const lab = [
        { id: 1, name: "Lab 1" },
        { id: 2, name: "Lab 2" },
        { id: 3, name: "Lab 3" },
    ];

    const systems = [
        { id: 1, labId: 1, name: "System 1", details: "Details for System 1" },
        { id: 2, labId: 1, name: "System 2", details: "Details for System 2" },
        { id: 3, labId: 2, name: "System 3", details: "Details for System 3" },
        { id: 4, labId: 2, name: "System 4", details: "Details for System 4" },
        { id: 5, labId: 3, name: "System 5", details: "Details for System 5" },
        { id: 6, labId: 3, name: "System 6", details: "Details for System 6" },
    ];

    const systemLogsData = {
        1: [
            { key: 1, log: "Log 1 for System 1", username: "User 1", rollno: "Roll No 1", startTime: "Start Time 1", stopTime: "Stop Time 1" },
            { key: 2, log: "Log 2 for System 1", username: "User 2", rollno: "Roll No 2", startTime: "Start Time 2", stopTime: "Stop Time 2" },
        ],
        2: [
            { key: 3, log: "Log 1 for System 2", username: "User 3", rollno: "Roll No 3", startTime: "Start Time 3", stopTime: "Stop Time 3" },
            { key: 4, log: "Log 2 for System 2", username: "User 4", rollno: "Roll No 4", startTime: "Start Time 4", stopTime: "Stop Time 4" },
        ],
        3: [
            { key: 5, log: "Log 1 for System 3", username: "User 5", rollno: "Roll No 5", startTime: "Start Time 5", stopTime: "Stop Time 5" },
            { key: 6, log: "Log 2 for System 3", username: "User 6", rollno: "Roll No 6", startTime: "Start Time 6", stopTime: "Stop Time 6" },
        ],
        4: [
            { key: 7, log: "Log 1 for System 4", username: "User 7", rollno: "Roll No 7", startTime: "Start Time 7", stopTime: "Stop Time 7" },
            { key: 8, log: "Log 2 for System 4", username: "User 8", rollno: "Roll No 8", startTime: "Start Time 8", stopTime: "Stop Time 8" },
        ],
        5: [
            { key: 9, log: "Log 1 for System 5", username: "User 9", rollno: "Roll No 9", startTime: "Start Time 9", stopTime: "Stop Time 9" },
            { key: 10, log: "Log 2 for System 5", username: "User 10", rollno: "Roll No 10", startTime: "Start Time 10", stopTime: "Stop Time 10" },
        ],
        6: [
            { key: 11, log: "Log 1 for System 6", username: "User 11", rollno: "Roll No 11", startTime: "Start Time 11", stopTime: "Stop Time 11" },
            { key: 12, log: "Log 2 for System 6", username: "User 12", rollno: "Roll No 12", startTime: "Start Time 12", stopTime: "Stop Time 12" },
        ],
    };

    useEffect(() => {
        fetchLabDetails();
    }, [labId]);

    const fetchLabDetails = async () => {
        const labResponse = await fetch(`your_api_url/labs/${labId}`);
        const labData = await labResponse.json();
        setLab(labData);

        const systemResponse = await fetch(`your_api_url/labs/${labId}/systems`);
        const systemData = await systemResponse.json();
        setSystems(systemData);
    };


    const viewSystemDetails = async (systemId) => {
        const response = await fetch(`your_api_url/systems/${systemId}/logs`);
        const data = await response.json();
        setSystemLogs(data);

        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const menu = (systemId) => (
        <Menu>
            <Menu.Item key="1" icon={<UserOutlined />} onClick={() => viewSystemDetails(systemId)}>
                View
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Log',
            dataIndex: 'log',
            key: 'log',
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
        },
    ];

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar />
            <Layout>
                <Content style={{ padding: "24px", minHeight: "280px" }}>
                    {lab && (
                        <>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {systems.map((system) => (
                                    <Card
                                        key={system.id}
                                        style={{ width: 250, margin: "0 16px 16px 0" }}
                                        actions={[
                                            <Dropdown overlay={menu(system.id)} trigger={['click']} key="ellipsis">
                                                <EllipsisOutlined />
                                            </Dropdown>,
                                        ]}
                                    >
                                        <Card.Meta title={system.name} description={system.details} />
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                    <Modal
                        title="View System Details"
                        visible={isModalVisible}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <Table dataSource={systemLogsData} columns={columns} />
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Details;
