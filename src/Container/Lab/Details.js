import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, Select, DatePicker, message } from "antd";
import Navbar from "../../Component/Navbar";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Details = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const labIdFromURL = searchParams.get("lab");

    const [data, setData] = useState([]);
    const [downloadModalVisible, setDownloadModalVisible] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState("");
    const [downloadFileType, setDownloadFileType] = useState("json");
    const [labId, setLabId] = useState(labIdFromURL);
    const [selectedDate, setSelectedDate] = useState(null);

    const columns = [
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Roll No", dataIndex: "rollno", key: "rollno" },
        { title: "System Seat", dataIndex: "sysseat", key: "sysseat" },
        { title: "Dist ID", dataIndex: "distid", key: "distid" },
        { title: "Entry Time", dataIndex: "entry_time", key: "entry_time" },
        { title: "Exit Time", dataIndex: "exit_time", key: "exit_time" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Timetable ID", dataIndex: "timetable_id", key: "timetable_id" },
    ];

    useEffect(() => {
        fetchData();
    }, [labId, selectedDate]);

    const fetchData = async () => {
        try {
            const response = await axios.post("http://localhost:3000/admin/get_user_logs_by_lab_id", { labid: labId, date: selectedDate });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleDownload = () => {
        setDownloadModalVisible(true);
    };

    const handleDownloadConfirm = () => {
        let blob;
        if (downloadFileType === "json") {
            const jsonData = JSON.stringify(data, null, 2);
            blob = new Blob([jsonData], { type: "application/json" });
        } else if (downloadFileType === "csv") {
            const csvData = convertToCSV(data);
            blob = new Blob([csvData], { type: "text/csv" });
        } else if (downloadFileType === "xlsx") {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, "UserLogs");
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        }

        if (blob) {
            saveAs(blob, `${downloadFileName}.${downloadFileType}`);
            setDownloadModalVisible(false);
        }
    };

    const convertToCSV = (data) => {
        const header = Object.keys(data[0]).join(",");
        const body = data.map(item => Object.values(item).join(",")).join("\n");
        return `${header}\n${body}`;
    };

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar>
                <Layout>
                    <Content style={{ padding: '24px', minHeight: '280px' }}>
                        <Form layout="inline">
                            <Form.Item label="Date">
                                <DatePicker onChange={(date) => setSelectedDate(date ? date.format("YYYY-MM-DD") : null)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={fetchData}>Search</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={handleDownload}>Download</Button>
                            </Form.Item>
                        </Form>
                        <Table dataSource={data} columns={columns} />
                        <Modal
                            title="Download Options"
                            visible={downloadModalVisible}
                            onOk={handleDownloadConfirm}
                            onCancel={() => setDownloadModalVisible(false)}
                        >
                            <Form layout="vertical">
                                <Form.Item label="File Name">
                                    <Input value={downloadFileName} onChange={(e) => setDownloadFileName(e.target.value)} />
                                </Form.Item>
                                <Form.Item label="File Type">
                                    <Select value={downloadFileType} onChange={(value) => setDownloadFileType(value)}>
                                        <Option value="json">JSON</Option>
                                        <Option value="csv">CSV</Option>
                                        <Option value="xlsx">Excel</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Navbar>
        </Layout>
    );
};

export default Details;
