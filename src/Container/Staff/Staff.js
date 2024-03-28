// Existing imports...
import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, Modal, Form, Input, message, Select } from "antd";
import Navbar from "../../Component/Navbar";
import { EditOutlined, ExclamationCircleOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Staff = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [createStaffVisible, setCreateStaffVisible] = useState(false);
  const [updateStaffVisible, setUpdateStaffVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [distdetails, setDistdetails] = useState(null);

  useEffect(() => {
    fetchStaffList();
    fetchDistid();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin/get_all_staffs");
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };
  const fetchDistid = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin/get_all_stocks");
      console.log("DistDetails:", response.data);
      setDistdetails(response.data);
    } catch (error) {
      console.log("Error Fetching the DistDetails", error);
    }
  }

  console.log(distdetails);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      if (createStaffVisible) {
        const response = await axios.post("http://localhost:3000/admin/create_staff", values);
        if (response.status === 200) {
          message.success("Staff created successfully");
          fetchStaffList();
          setVisible(false);
          form.resetFields();
        }
      } else if (updateStaffVisible) {
        const response = await axios.post("http://localhost:3000/admin/update_staff", { staffId: selectedStaff.staffid, ...values });
        if (response.status === 200) {
          message.success("Staff updated successfully");
          fetchStaffList();
          setVisible(false);
          form.resetFields();
        }
      }
    } catch (error) {
      console.error("Error creating/updating staff:", error);
      message.error("Failed to create/update staff");
    }
  };

  const showCreateModal = () => {
    setCreateStaffVisible(true);
    setUpdateStaffVisible(false);
    showModal();
  };

  const showUpdateModal = (staff) => {
    setSelectedStaff(staff);
    setCreateStaffVisible(false);
    setUpdateStaffVisible(true);
    showModal();
    form.setFieldsValue({
      staffid: staff.staffid,
      staffname: staff.staffname,
      distid: staff.distid,
      stock_type: staff.stock_type
    });
  };

  const handleDelete = async (staffId) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/delete_staff", { staffId });
      if (response.status === 200) {
        message.success("Staff deleted successfully");
        fetchStaffList();
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      message.error("Failed to delete staff");
    }
  };

  const handleDeleteConfirmation = (staff) => {
    Modal.confirm({
      title: "Confirm Delete",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${staff.staffname}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(staff.staffid);
      },
    });
  };

  const handleDistrictChange = (value) => {
    console.log("Selected district ID:", value);
    form.setFieldsValue({ distid: value });
  };

  const columns = [
    {
      title: 'SID',
      dataIndex: 'staffid',
      key: 'staffid',
    },
    {
      title: 'Staff Name',
      dataIndex: 'staffname',
      key: 'staffname',
    },
    {
      title: 'Dist ID',
      dataIndex: 'distid',
      key: 'distid',
    },
    {
      title: 'Stock Type',
      dataIndex: 'stock_type',
      key: 'stock_type',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => showUpdateModal(record)} style={{ color: 'blue' }}>Edit</Button>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDeleteConfirmation(record)} style={{ color: 'red' }}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <Navbar>
        <Layout>
          <Content style={{ padding: "24px", background: "#fff" }}>
            <Button type="primary"  icon={<PlusOutlined />} onClick={showCreateModal} style={{ marginBottom: 16 }}>
              Add Staff
            </Button>
            <Layout style={{ maxHeight: "80vh", overflowY: "auto" }} >
              <Table dataSource={staffList} columns={columns} pagination={{ pageSize: 10 }} />
            </Layout>
            <Modal title={createStaffVisible ? "Add Staff" : "Edit Staff"} visible={visible} onCancel={handleCancel} footer={null}>
              <Form form={form} onFinish={onFinish}>
                <Form.Item label="Staff ID" name="staffid" rules={[{ required: true, message: "Please enter Staff ID" }]}>
                  <Input disabled={updateStaffVisible} />
                </Form.Item>
                <Form.Item label="Staff Name" name="staffname" rules={[{ required: true, message: "Please enter Staff Name" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Dist ID" name="distid" rules={[{ required: false, message: "Please enter District ID" }]}>
                  <Select onChange={handleDistrictChange}>
                    {distdetails && distdetails.map(option => (
                      <Option key={option.dist_id} value={option.dist_id}>{option.dist_id}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Stock Type" name="stock_type" rules={[{ required: false, message: "Please enter Stock Type" }]}>
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
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

export default Staff;
