import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ data, graphType: initialGraphType }) => {
    const [graphType, setGraphType] = useState(initialGraphType || 'bar');

    useEffect(() => {
        // Add any effect logic here if needed
    }, [data]);

    const renderGraph = () => {
        switch (graphType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={data}
                            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Lab" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Stock" fill="#8884d8" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <Card title="Stock Chart">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px'}}>
                {renderGraph()}
            </div>
        </Card>
    );
};

export default Chart;
