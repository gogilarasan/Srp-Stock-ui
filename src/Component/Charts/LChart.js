import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Brush, ScatterChart, Scatter,
    PieChart, Pie, RadarChart, Radar, PolarAngleAxis,
    RadialBarChart, RadialBar, Treemap, ComposedChart,
    PolarGrid, PolarRadiusAxis,
} from 'recharts';
import { Button } from 'antd';
import 'antd/dist/antd';

const LargeDataChart = ({ data: initialData }) => {
    const [graphType, setGraphType] = useState('line');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(formatData(initialData || []));
    }, [initialData]);

    const formatData = (data) => {
        return data.map((item, index) => ({
            index,
            Description: item.Description,
            Quantity: parseFloat(item.Quantity),
            Value: parseFloat(item.Value),
        }));
    };

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

    const handleGraphTypeChange = (type) => {
        setGraphType(type);
    };

    const renderChart = () => {
        switch (graphType) {
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            dataKey="index"
                            startIndex={0}
                            endIndex={50}
                            height={30}
                            stroke="#8884d8"
                        />
                        <Line type="monotone" dataKey="Quantity" stroke="#ff0000" strokeWidth={2} dot={false} />
                        {/* <Line type="monotone" dataKey="Value" stroke="#0000ff" strokeWidth={2} dot={false} /> */}
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={data}>
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
            case 'scatter':
                return (
                    <ScatterChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Scatter name="Quantity" dataKey="Quantity" fill="#ff0000" />
                        <Scatter name="Value" dataKey="Value" fill="#0000ff" />
                    </ScatterChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={data} dataKey="Quantity" fill="#ff0000" label />
                        <Pie data={data} dataKey="Value" fill="#0000ff" label />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Tooltip />
                    </PieChart>
                );
            case 'radar':
                return (
                    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="index" />
                        <PolarRadiusAxis />
                        <Tooltip />
                        <Radar name="Quantity" dataKey="Quantity" stroke="#ff0000" fill="#ff0000" fillOpacity={0.6} />
                        <Radar name="Value" dataKey="Value" stroke="#0000ff" fill="#0000ff" fillOpacity={0.6} />
                    </RadarChart>
                );
            case 'radialBar':
                return (
                    <RadialBarChart cx={300} cy={250} innerRadius={20} outerRadius={200} barSize={10} data={data}>
                        <RadialBar dataKey="Quantity" fill="#ff0000" />
                        <RadialBar dataKey="Value" fill="#0000ff" />
                        <Tooltip />
                    </RadialBarChart>
                );
            case 'treemap':
                return (
                    <Treemap width={400} height={200} data={data} dataKey="Quantity" ratio={4 / 3} />
                );
            case 'composed':
                return (
                    <ComposedChart data={data}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Area type="monotone" dataKey="Quantity" fill="#ff0000" />
                        <Bar dataKey="Value" barSize={20} fill="#0000ff" />
                        <Line type="monotone" dataKey="Value" stroke="#00ff00" />
                    </ComposedChart>
                );
            case 'heatmap':
                return (
                    <ScatterChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis dataKey="Description" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Brush
                            startIndex={0}
                            endIndex={50}
                        />
                        <Scatter name="Quantity" data={data} fill="#ff0000" />
                        <Scatter name="Value" data={data} fill="#0000ff" />
                    </ScatterChart>
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
                <Button type={graphType === 'bar' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('bar')} style={{ marginRight: '10px' }}>Bar Chart</Button>
                <Button type={graphType === 'scatter' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('scatter')} style={{ marginRight: '10px' }}>Scatter Chart</Button>
                {/* <Button type={graphType === 'pie' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('pie')} style={{ marginRight: '10px' }}>Pie Chart</Button>
                <Button type={graphType === 'heatmap' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('heatmap')} style={{ marginRight: '10px' }}>Heatmap</Button>
                <Button type={graphType === 'radar' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('radar')} style={{ marginRight: '10px' }}>Radar Chart</Button>
                <Button type={graphType === 'radialBar' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('radialBar')} style={{ marginRight: '10px' }}>Radial Bar Chart</Button>
                <Button type={graphType === 'treemap' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('treemap')} style={{ marginRight: '10px' }}>Treemap Chart</Button>
                <Button type={graphType === 'composed' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('composed')}>Composed Chart</Button> */}
            </div>
            <ResponsiveContainer>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default LargeDataChart;
