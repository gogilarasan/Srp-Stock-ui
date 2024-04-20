import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { Button } from 'antd';
import 'antd/dist/antd';

const LargeDataChart = ({ data: initialData }) => {
    const [graphType, setGraphType] = useState('line');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(formatData(initialData || []));
    }, [initialData]);

    // Function to format data for different chart types
    const formatData = (data) => {
        return data.map((item, index) => ({
            index,
            Description: item.Description,
            Quantity: parseFloat(item.Quantity),
            Value: parseFloat(item.Value),
        }));
    };

    // Custom tooltip content
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                    <p>{`Description: ${payload[0].payload.Description}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>{`${entry.dataKey}: ${entry.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Function to handle graph type change
    const handleGraphTypeChange = (type) => {
        setGraphType(type);
    };

    // Render different chart based on graphType
    const renderChart = () => {
        switch (graphType) {
            case 'line':
                return (
                    <LineChart data={data}>
                        {/* Line chart components */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Line type="monotone" dataKey="Quantity" stroke="#ff0000" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Value" stroke="#0000ff" strokeWidth={2} dot={{ r: 5 }} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
                        {/* Area chart components */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Area type="monotone" dataKey="Quantity" fill="#ff0000" />
                        <Area type="monotone" dataKey="Value" fill="#0000ff" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={data}>
                        {/* Bar chart components */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Bar dataKey="Quantity" fill="#ff0000" />
                        <Bar dataKey="Value" fill="#0000ff" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ width: '100%', height: '600px', padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <Button type={graphType === 'line' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('line')} style={{ marginRight: '10px' }}>Line Chart</Button>
                <Button type={graphType === 'area' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('area')} style={{ marginRight: '10px' }}>Area Chart</Button>
                <Button type={graphType === 'bar' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('bar')}>Bar Chart</Button>
            </div>
            <ResponsiveContainer>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default LargeDataChart;
