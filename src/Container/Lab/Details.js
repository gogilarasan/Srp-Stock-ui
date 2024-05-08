import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, Select, DatePicker } from "antd";
import Navbar from "../../Component/Navbar/Navbar";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
// const { Title } = Typography;
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
        { title: "S.No", render: (text, record, index) => index + 1, key: "sno" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Roll No", dataIndex: "rollno", key: "rollno", sorter: (a, b) => a.rollno - b.rollno },
        { title: "System Seat", dataIndex: "sysseat", key: "sysseat" },
        { title: "Dist ID", dataIndex: "distid", key: "distid" },
        { title: "Entry Time", dataIndex: "entry_time", key: "entry_time" },
        { title: "Date", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
        { title: "Subject Name", dataIndex: "subjectName", key: "subjectName" },
    ];

    useEffect(() => {
        fetchData();
    }, [labId, selectedDate]);

    const fetchData = async () => {
        try {
            console.log("LabId : ",labId)
            let response = await axios.post("http://localhost:3000/admin/get_user_logs_by_lab_id", { labid: labId });
            let responseData = response.data;

            if (selectedDate) {
                responseData = responseData.filter(item => item.date === selectedDate.format("YYYY-MM-DD"));
            }

            const updatedData = await Promise.all(responseData.map(async (item) => {
                const timetableResponse = await axios.post("http://localhost:3000/admin/get_timetable_by_id", { timetableId: item.timetable_id });
                return { ...item, subjectName: timetableResponse.data.subject_name };
            }));
            setData(updatedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };


    const handleDownload = () => {
        setDownloadModalVisible(true);
    };

    const handleDownloadConfirm = () => {
        let filteredData = data;
        if (selectedDate && data.length > 0) {
            filteredData = data.filter(item => item.date === selectedDate.format("YYYY-MM-DD"));
        }

        let blob;
        if (downloadFileType === "json") {
            const jsonData = JSON.stringify(filteredData, null, 2);
            blob = new Blob([jsonData], { type: "application/json" });
        } else if (downloadFileType === "csv") {
            const csvData = convertToCSV(filteredData);
            blob = new Blob([csvData], { type: "text/csv" });
        } else if (downloadFileType === "xlsx") {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(filteredData.map(({ createdAt, updatedAt, timetable_id, ...rest }) => rest));
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
        const body = data.map(item => Object.keys(item)
            .filter(key => key !== "timetable_id")
            .map(key => item[key])
            .join(","))
            .join("\n");
        return `${header}\n${body}`;
    };

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar>
                <Layout>
                    <Content style={{ padding: '24px', minHeight: '280px' }}>
                        <div style={{ marginBottom: 16 }}>
                            <Form layout="inline">
                                <Form.Item label="Date">
                                    <DatePicker onChange={(date) => setSelectedDate(date)} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleDownload}>Download</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <Layout style={{ maxHeight: "80vh", overflowY: "auto" }} >
                            <Table dataSource={data} columns={columns} />
                        </Layout>
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
