import React, { useEffect, useState } from "react";
import { Layout, Typography, Card, Row, Col, Button, Modal, Form, Input, message, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Report = () => {
  const [complaints, setComplaints] = useState([]);
  const [labs, setLabs] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const labsResponse = await axios.post("http://localhost:3000/admin/get_all_labs");
      setLabs(labsResponse.data);

      const complaintsResponse = await axios.get("http://localhost:3000/admin/get_all_complaints");
      setComplaints(complaintsResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = (complaintId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this complaint?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteComplaint(complaintId);
      },
    });
  };

  const deleteComplaint = async (complaintId) => {
    try {
      await axios.delete("http://localhost:3000/admin/delete_complaint", {
        data: { complaint_id: complaintId },
      });
      message.success("Complaint deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      message.error("Failed to delete complaint");
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("http://localhost:3000/admin/create_complaint", values);
      message.success("Complaint created successfully");
      fetchData();
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating complaint:", error);
      message.error("Failed to create complaint");
    }
  };

  const handleLabChange = async (value) => {
    try {
      const stocksResponse = await axios.post("http://localhost:3000/admin/get_stock_by_Labid", { lab_id: value });
      setStocks(stocksResponse.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  console.log("Labs : ", labs);
  console.log("Stocks : ", stocks);

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
        <Layout>
          <Content style={{ padding: '24px', minHeight: '280px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  style={{ marginBottom: "16px" }}
                  onClick={() => setVisible(true)}
                >
                  <PlusOutlined />Create  Complaint
                </Button>
              </Col>
              {complaints.map((complaint) => (
                <Col key={complaint.complaint_id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={`Complaint`}
                    extra={
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(complaint.complaint_id)}
                      />
                    }
                    style={{ marginBottom: "16px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                  >
                    <p>Complainer Name: {complaint.complainer_name}</p>
                    <p>District ID: {complaint.dist_id}</p>
                    <p>Lab ID: {complaint.lab_id}</p>
                  </Card>
                </Col>
              ))}
            </Row>
            <Modal
              title="New Complaint"
              visible={visible}
              onCancel={() => {
                setVisible(false);
                form.resetFields();
              }}
              onOk={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleCreate(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
            >
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item
                  name="complainer_name"
                  label="Complainer Name"
                  rules={[{ required: true, message: "Please enter complainer name" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lab_id"
                  label="Lab ID"
                  rules={[{ required: true, message: "Please enter lab ID" }]}
                >
                  <Select onChange={handleLabChange}>
                    {labs.map((lab) => (
                      <Option key={lab.lab_id} value={lab.lab_id}>{lab.lab_id}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="dist_id"
                  label="District ID"
                  rules={[{ required: true, message: "Please enter district ID" }]}
                >
                  <Select>
                    {stocks.map((stock) => (
                      <Option key={stock.dist_id} value={stock.dist_id}>{stock.dist_id}</Option>
                    ))}
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

export default Report;
