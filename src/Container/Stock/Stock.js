import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, Space, message, Select, FloatButton, Tooltip, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import "./Stocks.css"

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Stock = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedItem, setSelectedItem] = useState(null);
    const [fileFormat, setFileFormat] = useState("json");
    const [downloadModalVisible, setDownloadModalVisible] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState("");
    const [downloadFileType, setDownloadFileType] = useState("json");
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [uploadFile, setUploadFile] = useState(null)

    const columns = [
        { title: "Stock Register Page No.", dataIndex: "stockRegisterPageNo", key: "stockRegisterPageNo" },
        { title: "Stock Register Sl.No.", dataIndex: "stockRegisterSlNo", key: "stockRegisterSlNo" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Book Figure Quantity", dataIndex: "bookFigureQuantity", key: "bookFigureQuantity" },
        { title: "Book Stock Value Rs.", dataIndex: "bookStockValueRs", key: "bookStockValueRs" },
        { title: "Issued to / Remarks", dataIndex: "issuedToRemarks", key: "issuedToRemarks" },
        { title: "Location", dataIndex: "location", key: "location" },
        {
            title: "Actions",
            dataIndex: "",
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)} style={{ color: 'blue' }}>
                        <EditOutlined /> Edit
                    </Button>
                    <Button type="danger" onClick={() => handleDelete(record)} style={{ color: 'red' }}>
                        <DeleteOutlined /> Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await axios.post("http://localhost:3000/admin/get_all_stock_depts");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let response;
            if (selectedItem) {
                response = await axios.post("http://localhost:3000/admin/update_stock_dept", { ...values, deptId: selectedItem.id });
            } else {
                response = await axios.post("http://localhost:3000/admin/create_stock_dept", values);
            }
            if (response.data.message === "Stock department created successfully" || response.data.message === "Stock department updated successfully") {
                fetchData();
                form.resetFields();
                setIsModalVisible(false);
                setSelectedItem(null);
            } else {
                message.error("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving data: ", error);
            message.error("Failed to save data");
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const handleEdit = (record) => {
        setSelectedItem(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            const response = await axios.post("http://localhost:3000/admin/delete_stock_dept", { deptId: record.id });
            if (response.data.message === "Stock department deleted successfully") {
                fetchData();
            } else {
                message.error("Failed to delete data");
            }
        } catch (error) {
            console.error("Error deleting data: ", error);
            message.error("Failed to delete data");
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
            XLSX.utils.book_append_sheet(workbook, worksheet, "Stocks");
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

    const handleUpload = async (file) => {
        setUploadFile(file);
        setUploadModalVisible(true);
        handleUploadConfirm();
    };

    const handleUploadConfirm = async () => {
        if (!uploadFile) {
            message.error("Please select a file");
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                records.shift();
                processAndStoreData(records);
            };
            fileReader.readAsArrayBuffer(uploadFile.originFileObj);
        } catch (error) {
            console.error("Error processing file: ", error);
            message.error("Failed to process file");
        }

        setUploadModalVisible(false);
    };

    const processAndStoreData = async (records) => {
        try {
            const response = await axios.post("http://localhost:3000/admin/bulk_create_stock_dept", {records});
            if (response.data.message === "Bulk stock departments created successfully") {
                fetchData();
                message.success("Bulk data imported successfully");
            } else {
                message.error("Failed to import bulk data");
            }
        } catch (error) {
            console.error("Error importing bulk data: ", error);
            message.error("Failed to import bulk data");
        }
    };


    return (
        <Layout>
            <Navbar>
                <Content style={{ padding: "24px" }}>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Add Stock</Button>
                        <FloatButton icon={<DownloadOutlined />} onClick={handleDownload} tooltip={<div>Download</div>} />
                        <Upload accept=".xlsx" beforeUpload={handleUpload}>
                            <Button icon={<UploadOutlined />} style={{ marginLeft: 8 }}>Bulk Import</Button>
                        </Upload>
                    </div>
                    <Layout style={{ maxHeight: "80vh", overflowY: "auto" }} >
                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{ pageSize: 20 }}
                        />
                    </Layout>
                    <Modal
                        title={selectedItem ? "Edit Stock" : "Add Stock"}
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item label="Stock Register Page No." name="stockRegisterPageNo" rules={[{ required: true, message: "Please enter Stock Register Page No." }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Stock Register Sl.No." name="stockRegisterSlNo" rules={[{ required: true, message: "Please enter Stock Register Sl.No." }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter Description." }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Book Figure Quantity" name="bookFigureQuantity" rules={[{ required: true, message: "Please enter Book Figure Quantity." }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Book Stock Value Rs." name="bookStockValueRs" rules={[{ required: true, message: "Please enter Book Stock Value Rs." }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Issued to / Remarks" name="issuedToRemarks">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Location" name="location">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
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
            </Navbar>
        </Layout>
    );
};

export default Stock;
