import React, { useEffect, useState } from "react";
import { Layout, Button, Modal, Form, Input, message, Select, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Navbar from "../../Component/Navbar/Navbar";
import TodoList from "../../Component/ToDo/Todo";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import necessary components
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import config from '../../../config';
const apiUrl = config.apiUrl;

const { Content } = Layout;
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
            const labsResponse = await axios.post(`${apiUrl}/admin/get_all_labs`);
            setLabs(labsResponse.data);

            const todosResponse = await axios.get(`${apiUrl}/admin/get_all_todos`);
            setTodos(todosResponse.data.data);
        } catch (error) {
            handleError("Error fetching data:", error);
        }
    };

    const handleError = (message, error) => {
        console.error(message, error);
        message.error("Something went wrong");
    };

    const getStatusCounts = () => {
        const statusCounts = {
            pending: 0,
            completed: 0,
            inProgress: 0,
        };

        todos.forEach((task) => {
            if (task.status === "pending") statusCounts.pending++;
            else if (task.status === "completed") statusCounts.completed++;
            else if (task.status === "inProgress") statusCounts.inProgress++;
        });

        return [
            { name: "Pending", value: statusCounts.pending },
            { name: "Completed", value: statusCounts.completed },
            { name: "In Progress", value: statusCounts.inProgress },
        ];
    };

    const handleCreate = async (values) => {
        try {
            await axios.post(`${apiUrl}/admin/create_todo`, values);
            message.success("Task created successfully");
            fetchData();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            handleError("Error creating task:", error);
        }
    };

    const handleLabChange = async (value) => {
        try {
            const stocksResponse = await axios.post(`${apiUrl}/admin/get_stock_by_Labid`, { lab_id: value });
            setStocks(stocksResponse.data);
        } catch (error) {
            handleError("Error fetching stocks:", error);
        }
    };

    const toggleTodo = async (taskId, newStatus) => {
        try {
            await axios.put(`${apiUrl}/admin/update_todo_status`, { taskId, status: newStatus });
            message.success("Task status updated successfully");
            fetchData();
        } catch (error) {
            handleError("Error updating task status:", error);
        }
    };

    const deleteTodo = async (taskId) => {
        try {
            await axios.delete(`${apiUrl}/admin/delete_todo`, { data: { task_id: taskId } });
            message.success("Task deleted successfully");
            fetchData();
        } catch (error) {
            handleError("Error deleting task:", error);
        }
    };

    const COLORS = ["#FFBB28", "#0088FE", "#00C49F"]; // Define colors for each status

    const renderLegend = () => (
        <ul>
            {getStatusCounts().map((entry, index) => (
                <li key={`item-${index}`} style={{ color: COLORS[index] }}>
                    {entry.name}: {entry.value}
                </li>
            ))}
        </ul>
    );

    const handleDownloadPDF = async () => {
        try {
            const pdf = new jsPDF();
            pdf.text("Task List", 14, 15);

            const headers = [['Task Name', 'Description', 'Due Date', 'Status']];
            const data = todos.map(task => [task.task_name, task.description, task.due_date, task.status]);

            pdf.autoTable({
                startY: 20,
                head: headers,
                body: data,
            });

            pdf.save('TaskList.pdf');
        } catch (error) {
            console.error("Error generating or downloading PDF:", error);
            message.error("Failed to download PDF");
        }
    };


    return (
        <Layout hasSider style={{ minHeight: "100vh" }}>
            <Navbar>
                <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
                    <Content style={{ padding: '24px', minHeight: '280px', maxHeight: 'calc(100vh - 90px)' }}>
                        <Button type="primary" style={{ marginBottom: "16px" }} onClick={() => setVisible(true)}>
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
                                    .then((values) => handleCreate(values))
                                    .catch((errorInfo) => console.log("Validate Failed:", errorInfo));
                            }}
                        >
                            <Form form={form} layout="vertical">
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
                                            <Option key={lab.lab_id} value={lab.lab_id}>
                                                {lab.lab_id}
                                            </Option>
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
                                            <Option key={stock.dist_id} value={stock.dist_id}>
                                                {stock.dist_id}
                                            </Option>
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
                        <Card style={{ width: '80%', margin: 'auto', display: 'flex', justifyContent: 'center' }}>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={getStatusCounts()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {getStatusCounts().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend content={renderLegend} />
                            </PieChart>
                        </Card>

                        <Button
                            type="primary"
                            style={{ marginTop: "16px" }}
                            onClick={handleDownloadPDF}
                        >
                            Download as PDF
                        </Button>
                        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
                    </Content>
                </Layout>
            </Navbar>
        </Layout>
    );
};

export default Report;
