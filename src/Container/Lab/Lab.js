import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, Modal, Button, Form, Input, message, Menu, Dropdown, Popconfirm, Tooltip } from "antd";
import { PlusOutlined, UserOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Lab.css';
import config from '../../../config';
const apiUrl = config.apiUrl;

const { Content } = Layout;
// const { Title } = Typography;
const { Meta } = Card;

const Lab = () => {
  const [labs, setLabs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [createLab, setCreateLab] = useState(false);
  const [editLab, setEditLab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await axios.post(`${apiUrl}/admin/get_all_labs`);
      setLabs(response.data);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const showModal = () => {
    setCreateLab(true);
    setEditLab(false);
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    try {
      if (editLab) {
        const response = await axios.post(`${apiUrl}/admin/update_lab`, {
          lab_id: selectedLab.lab_id,
          lab_name: values.labName,
          lab_incharge: values.labIncharge,
          lab_description: values.labDescription
        });
        if (response.status === 200) {
          message.success("Lab updated successfully");
          fetchLabs();
        }
      } else {
        const response = await axios.post(`${apiUrl}/admin/create_lab`, {
          lab_id: values.labId,
          lab_name: values.labName,
          lab_incharge: values.labIncharge,
          lab_description: values.labDescription
        });
        if (response.status === 200) {
          message.success("Lab created successfully");
          fetchLabs();
        }
      }
    } catch (error) {
      console.error("Error updating/creating lab:", error);
      message.error("Failed to update/create lab");
    }
    setIsModalVisible(false);
  };

  const handleEdit = (lab) => {
    setSelectedLab(lab);
    setEditLab(true);
    setCreateLab(false);
    setIsModalVisible(true);
  };

  const handleDelete = async (lab) => {
    try {
      console.log(lab);
      const response = await axios.post(`${apiUrl}/admin/delete_lab`, {
        labId: lab.lab_id
      });
      if (response.status === 200) {
        message.success("Lab deleted successfully");
        fetchLabs();
      }
    } catch (error) {
      console.error("Error deleting lab:", error);
      message.error("Failed to delete lab");
    }
  };

  const handleCancel = () => {
    setSelectedLab(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
  }, [selectedLab]);

  const redirectToDetails = (lab) => {
    navigate(`/Lab/Labdet?lab=${lab.lab_id}`);
  };

  const menu = (lab) => (
    <Menu style={{ border: '1px solid #f0f0f0', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Menu.Item key="edit" onClick={() => handleEdit(lab)} style={{ padding: '8px 16px', fontSize: '14px', lineHeight: '1.5' }}>
        <EditOutlined style={{ marginRight: '8px' }} />
        Edit
      </Menu.Item>
      <Menu.Item key="delete" style={{ padding: '8px 16px', fontSize: '14px', lineHeight: '1.5' }}>
        <Popconfirm
          title="Are you sure you want to delete this lab?"
          onConfirm={() => handleDelete(lab)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ marginRight: '8px' }} />
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
      <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <Content style={{ overflowY: 'auto',padding: '24px',minHeight: '280px', backgroundColor: '#f0f2f5' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 24 }}>
              Add Lab
            </Button>
            <div className="labs-container">
              {labs.map((lab) => (
                <Card
                  key={lab.lab_id}
                  style={{
                    width: 350,
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    marginBottom: '24px', // Added margin bottom
                  }}
                  actions={[
                    <Button><UserOutlined key="staff" />{lab.lab_incharge}</Button>,
                    <Button key="view" onClick={() => redirectToDetails(lab)}>View</Button>,
                    <Dropdown overlay={menu(lab)} trigger={['click']} placement="bottomRight">
                      <EllipsisOutlined />
                    </Dropdown>,
                  ]}
                >
                  <Meta
                    title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>{lab.lab_name.toUpperCase()}</span>}
                    description={<span style={{ fontSize: '16px' }}>{lab.lab_description}</span>}
                  />
                </Card>
              ))}
            </div>
            <Modal
              title={editLab ? "Edit Lab Details" : "Add New Lab"}
              visible={isModalVisible}
              footer={null}
              onCancel={handleCancel}
            >
              {createLab && <AddLabForm onFinish={handleOk} />}
              {editLab && selectedLab && <AddLabForm onFinish={handleOk} selectedLab={selectedLab} />}
            </Modal>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

const AddLabForm = ({ onFinish, selectedLab }) => {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const initialValues = selectedLab ? {
    labId: selectedLab.lab_id,
    labName: selectedLab.lab_name,
    labIncharge: selectedLab.lab_incharge,
    labDescription: selectedLab.lab_description
  } : {};

  const formKey = selectedLab ? selectedLab.lab_id : "new";

  return (
    <Form
      key={formKey}
      name="addLab"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
    >
      <Form.Item
        label="Lab ID"
        name="labId"
        rules={[{ required: true, message: "Please input the lab ID!" }]}
      >
        <Input disabled={!!selectedLab} />
      </Form.Item>
      <Form.Item
        label="Lab Name"
        name="labName"
        rules={[{ required: true, message: "Please input the lab name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Lab Incharge"
        name="labIncharge"
        rules={[{ required: true, message: "Please input the lab incharge!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Lab Description"
        name="labDescription"
        rules={[{ required: true, message: "Please input the lab description!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {selectedLab ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Lab;
