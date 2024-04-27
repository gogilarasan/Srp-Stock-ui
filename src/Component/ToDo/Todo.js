import React, { useState } from 'react';
import { List, Checkbox, Card, Typography, Space, Tag, Popconfirm, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import './TodoList.css';

const { Text } = Typography;

const TodoList = ({ todos, toggleTodo, deleteTodo }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const currentDate = new Date(); 

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const handleDeleteTask = (taskId) => {
        deleteTodo(taskId);
        message.success('Task deleted successfully');
    };

    const handleCancelDelete = () => {
        message.info('Deletion canceled');
    };

    return (
        <div className="todo-list-container">
            <Card className="todo-list-card" title={<Text strong>To Do</Text>} style={{ height: '500px', overflowY: 'auto' }}>
                <List
                    dataSource={todos.sort((a, b) => {
                        if (a.status === 'completed' && b.status !== 'completed') {
                            return 1;
                        } else if (a.status !== 'completed' && b.status === 'completed') {
                            return -1;
                        } else {
                            return new Date(a.due_date) - new Date(b.due_date);
                        }
                    })}
                    renderItem={(item) => {
                        const dueDate = new Date(item.due_date);
                        const timeDifference = dueDate.getTime() - currentDate.getTime();
                        const daysDifference = timeDifference / (1000 * 3600 * 24);
                        const isHighPriority = daysDifference <= 5;
                        let tagColor = isHighPriority ? 'red' : 'green';
                        let priorityMessage = isHighPriority ? 'Priority: High' : 'Priority: Low';
                        if (item.status === 'completed') {
                            tagColor = 'blue';
                            priorityMessage = 'Completed';
                        }

                        return (
                            <List.Item
                                key={item.task_id}
                                className={`todo-item ${item.status === 'completed' ? 'completed' : ''}`}
                                style={{ borderColor: item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Checkbox
                                        checked={item.status === 'completed'}
                                        onChange={() => toggleTodo(item.task_id, item.status === 'completed' ? 'pending' : 'completed')}
                                        className="task-checkbox"
                                        style={{ marginRight: '20px' }}
                                    />
                                    <div className="list-item-content">
                                        <List.Item.Meta
                                            title={<span style={{ fontSize: '24px' }}>{item.task_name}</span>}
                                            description={<span style={{ fontSize: '14px' }}>{item.description}</span>}
                                        />
                                    </div>
                                    <div className="actions">
                                        <Tag className="priority-tag" color={tagColor}>
                                            {priorityMessage}
                                        </Tag>
                                        <Space>
                                            <Button
                                                className="view-button"
                                                type="primary"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleTaskClick(item)}
                                                size="small"
                                            />
                                            <Popconfirm
                                                title="Are you sure you want to delete this task?"
                                                onConfirm={() => handleDeleteTask(item.task_id)}
                                                onCancel={handleCancelDelete}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    className="delete-button"
                                                    type="danger"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                />
                                            </Popconfirm>
                                        </Space>
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            </Card>
            <Modal
                title="Task Details"
                visible={modalVisible}
                onCancel={closeModal}
            >
                {selectedTask && (
                    <Card className="task-details-card">
                        <Space direction="vertical">
                            <Text className="detail-title" strong>Task Name:</Text>
                            <Text className="detail-text" style={{ fontSize: '18px' }}>{selectedTask.task_name}</Text>
                            <Text className="detail-title" strong>Description:</Text>
                            <Text className="detail-text">{selectedTask.description}</Text>
                            <Text className="detail-title" strong>Due Date:</Text>
                            <Text className="detail-text">{new Date(selectedTask.due_date).toLocaleDateString()}</Text>
                            <Text className="detail-title" strong>Lab ID:</Text>
                            <Text className="detail-text">{selectedTask.lab_id}</Text>
                            <Text className="detail-title" strong>District ID:</Text>
                            <Text className="detail-text">{selectedTask.dist_id}</Text>
                            <Text className="detail-title" strong>Complainer Name:</Text>
                            <Text className="detail-text">{selectedTask.complainer_name}</Text>
                        </Space>
                    </Card>
                )}
            </Modal>
        </div>
    );
};

export default TodoList;
