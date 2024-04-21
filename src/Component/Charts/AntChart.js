import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Line, Bar, Pie, Scatter, Radar } from '@ant-design/charts';

const AntVChartsViewer = ({ data: initialData }) => {
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('line');

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

    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return <LineChart />;
            case 'bar':
                return <BarChart />;
            case 'pie':
                return <PieChart />;
            case 'scatter':
                return <ScatterChart />;
            case 'radar':
                return <RadarChart />;
            default:
                return null;
        }
    };

    const LineChart = () => {
        const config = {
            data,
            xField: 'index',
            yField: ['Quantity', 'Value'],
            color: ['#ff0000', '#0000ff'],
            point: {
                size: 5,
                shape: 'circle',
            },
            label: {
                style: {
                    fill: '#aaa',
                },
                formatter: (datum) => `${datum.Description}: ${datum.Value}`,
            },
            interactions: [{ type: 'marker-active' }],
            tooltip: {
                shared: true,
                showMarkers: true,
                formatter: (datum) => ({
                    name: datum.Description,
                    value: `${datum.Value}`,
                }),
            },
            xAxis: {
                title: {
                    text: 'Index',
                },
            },
            yAxis: {
                title: {
                    text: 'Value',
                },
            },
        };
        return <Line {...config} />;
    };

    const BarChart = () => {
        const config = {
            data,
            xField: 'Description',
            yField: 'Value',
            label: {
                style: {
                    fill: '#aaa',
                },
                formatter: (datum) => `${datum.Description}: ${datum.Value}`,
            },
            interactions: [{ type: 'active-region' }],
            tooltip: {
                shared: true,
                showMarkers: true,
                formatter: (datum) => ({
                    name: datum.Description,
                    value: `${datum.Value}`,
                }),
            },
            xAxis: {
                title: {
                    text: 'Description',
                },
            },
            yAxis: {
                title: {
                    text: 'Value',
                },
            },
        };
        return <Bar {...config} />;
    };

    const PieChart = () => {
        const config = {
            data,
            angleField: 'Quantity',
            colorField: 'Description',
            radius: 0.8,
            label: {
                type: 'outer',
                content: '{name}: {percentage}%',
                style: {
                    fill: '#fff',
                    stroke: '#000',
                    lineWidth: 1,
                    shadowColor: '#666',
                    shadowBlur: 4,
                },
            },
            interactions: [{ type: 'element-active' }],
            tooltip: {
                shared: true,
                showMarkers: true,
                formatter: (datum) => ({
                    name: datum.Description,
                    value: `${datum.Quantity}`,
                }),
            },
        };
        return <Pie {...config} />;
    };


    const ScatterChart = () => {
        const config = {
            data,
            xField: 'Quantity',
            yField: 'Value',
            colorField: 'Description',
            point: {
                size: 5,
                shape: 'circle',
            },
            tooltip: { showMarkers: true },
        };
        return <Scatter {...config} />;
    };

    const RadarChart = () => {
        const config = {
            data,
            xField: 'index',
            yField: 'Value',
            seriesField: 'Description',
            radius: 0.8,
            area: {},
            point: {
                size: 5,
                shape: 'circle',
            },
            tooltip: { showMarkers: true },
        };
        return <Radar {...config} />;
    };

    return (
        <div style={{ width: '100%', height: '600px', padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <Button type={chartType === 'line' ? 'primary' : 'default'} onClick={() => handleChartTypeChange('line')} style={{ marginRight: '10px' }}>Line Chart</Button>
                <Button type={chartType === 'bar' ? 'primary' : 'default'} onClick={() => handleChartTypeChange('bar')} style={{ marginRight: '10px' }}>Bar Chart</Button>
                <Button type={chartType === 'pie' ? 'primary' : 'default'} onClick={() => handleChartTypeChange('pie')} style={{ marginRight: '10px' }}>Pie Chart</Button>
                <Button type={chartType === 'scatter' ? 'primary' : 'default'} onClick={() => handleChartTypeChange('scatter')} style={{ marginRight: '10px' }}>Scatter Chart</Button>
                <Button type={chartType === 'radar' ? 'primary' : 'default'} onClick={() => handleChartTypeChange('radar')} style={{ marginRight: '10px' }}>Radar Chart</Button>
            </div>
            {renderChart()}
        </div>
    );
};

export default AntVChartsViewer;
