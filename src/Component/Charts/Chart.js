import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ data, graphType: initialGraphType }) => {
    const [graphType, setGraphType] = useState(initialGraphType || 'bar');

    useEffect(() => {
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
                            <Bar dataKey="Stock" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            {renderGraph()}
        </div>
    );
};

export default Chart;
