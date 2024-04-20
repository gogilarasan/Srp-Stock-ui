import React, { useState } from 'react';
import { List, Checkbox, Button, Modal, Card, Typography, Space, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';


const { Text } = Typography;

const TodoList = ({ todos, toggleTodo, deleteTodo }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const currentDate = new Date(); // Get current date

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    return (
        <div className="todo-list-container">
            <Card className="todo-list-card" title={<Text strong>To Do</Text>} style={{ overflowY: 'auto' }}>
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
