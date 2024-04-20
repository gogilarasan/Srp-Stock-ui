import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, message, Modal, Card, Col, Row, Popconfirm, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar/Navbar";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const { Content } = Layout;
const { Title } = Typography;

const Details = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lab = searchParams.get("lab");

    const [form] = Form.useForm();
    const [stocks, setStocks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedStock, setSelectedStock] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);

    const fetchStocks = async () => {
        try {
            const response = await axios.post("http://localhost:3000/admin/get_stock_by_Labid", {
                lab_id: lab
            });
            setStocks(response.data);
        } catch (error) {
            console.error("Error fetching stocks:", error);
        }
    };

    const createStock = async (values) => {
        try {
            await axios.post("http://localhost:3000/admin/create_stock", values);
            message.success("Stock created successfully");
            fetchStocks();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error creating stock:", error);
        }
    };

    const updateStock = async (values) => {
        try {
            await axios.post("http://localhost:3000/admin/update_stock", { ...values, stock_id: selectedStock.stock_id });
            message.success("Stock updated successfully");
            fetchStocks();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    const deleteStock = async (stock_id) => {
        try {
            await axios.post("http://localhost:3000/admin/delete_stock", { stock_id });
            message.success("Stock deleted successfully");
            fetchStocks();
        } catch (error) {
            console.error("Error deleting stock:", error);
        }
    };

    const showModal = (type, stock) => {
        setModalType(type);
        setSelectedStock(stock);
        setIsModalVisible(true);
        if (type === "update" && stock) {
            form.setFieldsValue({
                lab_id: stock.lab_id,
                dist_id: stock.dist_id,
                seat_number: stock.seat_number,
                remarks: stock.remarks,
                stock_type: stock.stock_type
            });
        } else {
            form.resetFields();
        }
    };


    const handleUpload = (file) => {
        setUploadFile(file);
        processAndStoreData(file);
    };

    const processAndStoreData = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('lab_id', lab);

            const response = await axios.post("http://localhost:3000/admin/bulk-import-dept", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.message === "Bulk import successful") {
                message.success("Bulk data imported successfully");
                fetchStocks();
            } else {
                message.error("Failed to import bulk data");
            }
        } catch (error) {
            console.error("Error importing bulk data:", error);
            message.error("Failed to import bulk data");
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar>
                <Layout>
                    <Content style={{ padding: '24px', minHeight: '280px', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal("create", null)} style={{ marginBottom: 24 }}>Add Stock</Button>
                        <Upload beforeUpload={(file) => { setUploadFile(file); handleUpload(file); return false; }}>
                            <Button icon={<UploadOutlined />} style={{ marginLeft: 8 }}>Bulk Import</Button>
                        </Upload>
                        <Row gutter={[16, 16]}>
                            {stocks.map(stock => (
                                <Col key={stock.stock_id} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        title={<Title level={5}>{stock.dist_id}</Title>}
                                        actions={[
                                            <Button type="primary" icon={<EditOutlined />} onClick={() => showModal("update", stock)}>Update</Button>,
                                            <Popconfirm
                                                title="Are you sure you want to delete this stock?"
                                                onConfirm={() => deleteStock(stock.stock_id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="danger" icon={<DeleteOutlined />}>Delete</Button>
                                            </Popconfirm>
                                        ]}
                                    >
                                        <p><strong>Seat Number:</strong> {stock.seat_number}</p>
                                        <p><strong>Stock Type:</strong> {stock.stock_type}</p>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Modal
                            title={modalType === "create" ? "Add Stock" : "Update Stock"}
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                        >
                            <Form
                                form={form}
                                onFinish={modalType === "create" ? createStock : updateStock}
                            >
                                <Form.Item name="lab_id" hidden initialValue={lab}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="dist_id" label="Dist ID" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="seat_number" label="Seat Number" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="remarks" label="Remarks">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="stock_type" label="Stock Type">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="cpu" label="CPU">
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        {modalType === "create" ? "Add Stock" : "Update Stock"}
                                    </Button>
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
