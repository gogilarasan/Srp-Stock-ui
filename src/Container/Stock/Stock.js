import React, { useState } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";

const { Content } = Layout;
const { Title } = Typography;

const Stock = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedItem, setSelectedItem] = useState(null);

    const columns = [
        { title: "S.No", dataIndex: "sNo", key: "sNo" },
        { title: "Stock Register Page No.", dataIndex: "pageNo", key: "pageNo" },
        { title: "Stock Register Sl.No.", dataIndex: "slNo", key: "slNo" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Book Figure Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Book Stock Value Rs.", dataIndex: "stockValue", key: "stockValue" },
        { title: "Issed to / Remarks", dataIndex: "remarks", key: "remarks" },
        { title: "Location", dataIndex: "location", key: "location" },
        {
            title: "Actions",
            dataIndex: "",
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const dummyData = [
      {
        sNo: 1,
        pageNo: 1,
        slNo: 1,
        description: "NAME BORAD",
        quantity: 2,
        stockValue: "32,625.00",
        remarks: "Transferred to FSR",
        location: "OFFICE",
      },
      {
        sNo: 2,
        pageNo: 1,
        slNo: 2,
        description: "500GB SATA LAPTOP HDD",
        quantity: 1,
        stockValue: "3,100.00",
        remarks: "USEAGE OF LAPTOP FOR HOD LAPTOP HANDOVER TO DCSE",
        location: "DCSE",
      },
      {
        sNo: 3,
        pageNo: 1,
        slNo: 3,
        description: "XEROX 5225 DIGITAL COPIER",
        quantity: 1,
        stockValue: "1,42,272.00",
        remarks: "Disposed under buyback for new Cannon Xerox Machine",
        location: "NA",
      },
      {
        sNo: 4,
        pageNo: 1,
        slNo: 3,
        description: "STABILIZER",
        quantity: 1,
        stockValue: "",
        remarks: "",
        location: "",
      },
      {
        sNo: 5,
        pageNo: 1,
        slNo: 3,
        description: "XEROX LASER PRINTER 3117",
        quantity: 1,
        stockValue: "",
        remarks: "Item Condominated in 2020",
        location: "TF",
      },
      {
        sNo: 6,
        pageNo: 2,
        slNo: 4,
        description: "HP LASERJET 2035 PRINTER",
        quantity: 1,
        stockValue: "16,500.00",
        remarks: "Dr. L. Sairamesh",
        location: "SF",
      },
    ];
    

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (selectedItem) {
                const newData = data.map(item => item.key === selectedItem.key ? { ...item, ...values } : item);
                setData(newData);
                setSelectedItem(null);
            } else {
                setData([...data, { key: data.length + 1, ...values }]);
            }
            form.resetFields();
            setIsModalVisible(false);
        });
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

    const handleDelete = (record) => {
        setData(data.filter(item => item.key !== record.key));
    };

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar />
            <Layout>
                <Content style={{ padding: "24px", minHeight: "280px" }}>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                            Add Stock
                        </Button>
                    </div>
                    <Table dataSource={dummyData} columns={columns} />
                    <Modal
                        title={selectedItem ? "Edit Stock" : "Add Stock"}
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item label="S.No" name="sNo" rules={[{ required: true, message: "Please enter S.No" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Stock Register Page No." name="pageNo">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Stock Register Sl.No." name="slNo">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description" name="description">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Book Figure Quantity" name="quantity">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Book Stock Value Rs." name="stockValue">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Issed to / Remarks" name="remarks">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Location" name="location">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Stock;
