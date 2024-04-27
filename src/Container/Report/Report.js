import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Modal, Form, Input, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Navbar from "../../Component/Navbar/Navbar";
import TodoList from "../../Component/ToDo/Todo";

const { Content } = Layout;
// const { Title } = Typography;
const { Option } = Select;

const Report = () => {
    const [todos, setTodos] = useState([]);
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

            const todosResponse = await axios.get("http://localhost:3000/admin/get_all_todos");
            setTodos(todosResponse.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreate = async (values) => {
        try {
            await axios.post("http://localhost:3000/admin/create_todo", values);
            message.success("Task created successfully");
            fetchData();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating task:", error);
            message.error("Failed to create task");
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

    const toggleTodo = async (taskId, newStatus) => {
        try {
            // Update the todo status
            await axios.put("http://localhost:3000/admin/update_todo_status", { taskId, status: newStatus });
            message.success("Task status updated successfully");
            fetchData();
        } catch (error) {
            console.error("Error updating task status:", error);
            message.error("Failed to update task status");
        }
    };

    const deleteTodo = async (taskId) => {
        try {
            // Delete the todo
            await axios.delete("http://localhost:3000/admin/delete_todo", { data: { task_id: taskId } });
            message.success("Task deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting task:", error);
            message.error("Failed to delete task");
        }
    };

    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar>
                <Layout>
                    <Content style={{ padding: '24px', minHeight: '280px' }}>
                        <Button
                            type="primary"
                            style={{ marginBottom: "16px" }}
                            onClick={() => setVisible(true)}
                        >
                            <PlusOutlined />Create Task
                        </Button>
                        <Modal
                            title="New Task"
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
                                    name="task_name"
                                    label="Task Name"
                                    rules={[{ required: true, message: "Please enter task name" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: "Please enter description" }]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    name="due_date"
                                    label="Due Date"
                                    rules={[{ required: true, message: "Please select due date" }]}
                                >
                                    <Input type="date" />
                                </Form.Item>
                                <Form.Item
                                    name="lab_id"
                                    label="Lab ID"
                                    rules={[{ required: false, message: "Please select lab ID" }]}
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
                                    rules={[{ required: false, message: "Please select district ID" }]}
                                >
                                    <Select>
                                        {stocks.map((stock) => (
                                            <Option key={stock.dist_id} value={stock.dist_id}>{stock.dist_id}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="complainer_name"
                                    label="Complainer Name"
                                    rules={[{ required: true, message: "Please enter complainer name" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Modal>
                        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} /> 
                    </Content>
                </Layout>
            </Navbar>
        </Layout>
    );
};

export default Report;
