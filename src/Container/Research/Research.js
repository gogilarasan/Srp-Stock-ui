import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, message } from "antd";
import Navbar from "../../Component/Navbar";
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { DatePicker } from "antd";
import moment from "moment";

const { Content } = Layout;
const { Title } = Typography;

const Research = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchResearchScholars();
  }, []);

  const fetchResearchScholars = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin/get_all_research_scholars");
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching research scholars:", error);
    }
  };

  const showModal = () => {
    setVisible(true);
    setIsUpdate(false);
    setSelectedRecord(null);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post("http://localhost:3000/admin/create_research_scholar", values);
      if (response.status === 200) {
        message.success("Research Scholar added successfully");
        fetchResearchScholars();
        setVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error adding research scholar:", error);
      message.error("Failed to add research scholar");
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      tenure: moment(record.tenure)
    });
    setVisible(true);
    setIsUpdate(true);
    setSelectedRecord(record);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post("http://localhost:3000/admin/update_research_scholar", values);
      if (response.status === 200) {
        message.success("Research Scholar updated successfully");
        fetchResearchScholars();
        setVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error updating research scholar:", error);
      message.error("Failed to update research scholar");
    }
  };

  const handleDelete = async (rs_id) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/delete_research_scholar", { scholarId: rs_id });
      if (response.status === 200) {
        message.success("Research Scholar deleted successfully");
        fetchResearchScholars();
      }
    } catch (error) {
      console.error("Error deleting research scholar:", error);
      message.error("Failed to delete research scholar");
    }
  };

  const handleDeleteConfirmation = (record) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete ${record.rs_name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(record.rs_id);
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'rs_name',
      key: 'rs_name',
    },
    {
      title: 'Seat No',
      dataIndex: 'seat_no',
      key: 'seat_no',
    },
    {
      title: 'Tenure',
      dataIndex: 'tenure',
      key: 'tenure',
      render: (tenure) => moment(tenure).format('YYYY-MM-DD'),
    },
    {
      title: 'Dist ID',
      dataIndex: 'distid',
      key: 'distid',
    },
    {
      title: 'Staff ID',
      dataIndex: 'staff_id',
      key: 'staff_id',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)} style={{ color: 'blue' }}><EditOutlined />Edit</Button>
          <Button type="danger" danger onClick={() => handleDeleteConfirmation(record)} style={{ color: 'red' }}><DeleteOutlined />Delete</Button>
        </span >
      ),
    },
  ];

  return (
    <Layout >
      <Navbar>
        <Content style={{ padding: "24px" }}>
          <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
            Add Scholar
          </Button>
          <Layout style={{ maxHeight: "70vh", overflowY: "auto" }} >
            <Table dataSource={dataSource} columns={columns} pagination={20} />
          </Layout>
          <Modal
            title={isUpdate ? "Edit Scholar" : "Add Scholar"}
            visible={visible}
            onCancel={handleCancel}
            onOk={isUpdate ? handleUpdate : handleAdd}
            okText={isUpdate ? "Update" : "Add"}
            cancelText="Cancel"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Name"
                name="rs_name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Seat No"
                name="seat_no"
                rules={[{ required: true, message: "Please enter seat no" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Tenure"
                name="tenure"
                rules={[{ required: true, message: "Please select tenure" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Dist ID"
                name="distid"
                rules={[{ required: true, message: "Please enter dist id" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Staff ID"
                name="staff_id"
                rules={[{ required: true, message: "Please enter staff id" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Navbar>
    </Layout>
  );
};

export default Research;
