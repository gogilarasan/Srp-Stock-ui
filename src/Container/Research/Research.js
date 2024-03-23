import React, { useState } from "react";
import { Layout, Typography, Modal, Form, Input, Button, Card, Row, Col } from "antd";
import Navbar from "../../Component/Navbar";

const { Content } = Layout;
const { Title } = Typography;
const { Meta } = Card;

const Research = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      rs_id: "RS123",
      rs_name: "John Doe",
      seat_no: "A1",
      tenure: "2024-03-16T00:00:00.000Z",
      distid: null,
      guide: "Dr. Smith",
      staff_id: "S1",
      key: "1",
    },
  ]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newData = {
        rs_id: values.rs_id,
        rs_name: values.rs_name,
        seat_no: values.seat_no,
        tenure: values.tenure,
        distid: values.distid,
        guide: values.guide,
        staff_id: values.staff_id,
        key: (dataSource.length + 1).toString(),
      };
      setDataSource([...dataSource, newData]);
      setVisible(false);
      form.resetFields();
    });
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setVisible(true);
  };

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
      <Layout>
        <Content style={{ padding: "24px" }}>
          <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
            Add Scholar
          </Button>
          <Row gutter={[16, 16]}>
            {dataSource.map((data) => (
              <Col key={data.key} xs={24} sm={12} md={8} lg={6} xl={4}>
                <Card
                  title={data.rs_name}
                  extra={<Button type="link" onClick={() => handleEdit(data)}>Edit</Button>}
                >
                  <p>ID: {data.rs_id}</p>
                  <p>Seat No: {data.seat_no}</p>
                  <p>Tenure: {data.tenure}</p>
                  <p>Dist ID: {data.distid}</p>
                  <p>Guide: {data.guide}</p>
                  <p>Staff ID: {data.staff_id}</p>
                </Card>
              </Col>
            ))}
          </Row>
          <Modal
            title="Add Scholar"
            visible={visible}
            onCancel={handleCancel}
            onOk={handleAdd}
            okText="Add"
            cancelText="Cancel"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="ID"
                name="rs_id"
                rules={[{ required: true, message: "Please enter ID" }]}
              >
                <Input />
              </Form.Item>
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
                rules={[{ required: true, message: "Please enter tenure" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Dist ID"
                name="distid"
                rules={[{ required: true, message: "Please enter dist id" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Guide"
                name="guide"
                rules={[{ required: true, message: "Please enter guide" }]}
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
      </Layout>
      </Navbar>
    </Layout>
  );
};

export default Research;
