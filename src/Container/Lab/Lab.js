import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, Modal, Button, Form, Input, message, Menu, Dropdown } from "antd";
import { PlusOutlined, UserOutlined, EllipsisOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Lab.css';

const { Content } = Layout;
const { Title } = Typography;

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
      const response = await axios.post("http://localhost:3000/admin/get_all_labs");
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
        const response = await axios.post("http://localhost:3000/admin/update_lab", {
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
        const response = await axios.post("http://localhost:3000/admin/create_lab", {
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
      const response = await axios.post("http://localhost:3000/admin/delete_lab", {
        lab_id: lab.lab_id
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
    console.log("Selected Lab after modal closed:", selectedLab);
  }, [selectedLab]);




  const redirectToDetails = (lab) => {
    navigate(`/Lab/Labdet?lab=${lab.lab_id}`);
  };

  const menu = (lab) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(lab)}>
        <EditOutlined />
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(lab)}>
        <DeleteOutlined />
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
        <Layout style={{ padding: "24px" }}>
          <Content>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 24 }}>
              Add Lab
            </Button>
            <div className="labs-container">
              {labs.map((lab) => (
                <Card
                  key={lab.id}
                  className="lab-card"
                  actions={[
                    <Button icon={<UserOutlined />} key="staff">Staff: {lab.lab_incharge}</Button>,
                    <Dropdown overlay={menu(lab)} trigger={['click']} placement="bottomRight">
                      <Button icon={<EllipsisOutlined />} />
                    </Dropdown>,
                    <Button icon={<SearchOutlined />} key="view" onClick={() => redirectToDetails(lab)}>View</Button>,
                  ]}
                >
                  <Card.Meta
                    title={lab.lab_name.toUpperCase()}
                    description={lab.lab_description}
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