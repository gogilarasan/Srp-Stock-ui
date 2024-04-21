import React, { useState, useEffect } from 'react';
import {
    VictoryLine, VictoryArea, VictoryBar, VictoryScatter, VictoryPie,
    VictoryTooltip, VictoryLegend, VictoryBrushContainer,
    VictoryChart, VictoryAxis,
} from 'victory';
import { Button } from 'antd';

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

    const CustomTooltip = ({ datum }) => {
        return (
            <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p>{`Description: ${datum.Description}`}</p>
                <p>{`${datum.xName}: ${datum.x}`}</p>
                <p>{`${datum.yName}: ${datum.y}`}</p>
            </div>
        );
    };

    const handleGraphTypeChange = (type) => {
        setGraphType(type);
    };

    const renderChart = () => {
        switch (graphType) {
            case 'line':
                return (
                    <VictoryChart>
                        <VictoryLine
                            data={data}
                            x="index"
                            y="Quantity"
                            style={{ data: { stroke: "#ff0000" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                        <VictoryLine
                            data={data}
                            x="index"
                            y="Value"
                            style={{ data: { stroke: "#0000ff" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                    </VictoryChart>
                );
            case 'area':
                return (
                    <VictoryChart>
                        <VictoryArea
                            data={data}
                            x="index"
                            y="Quantity"
                            style={{ data: { fill: "#ff0000" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                        <VictoryArea
                            data={data}
                            x="index"
                            y="Value"
                            style={{ data: { fill: "#0000ff" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                    </VictoryChart>
                );
            case 'bar':
                return (
                    <VictoryChart>
                        <VictoryBar
                            data={data}
                            x="index"
                            y="Quantity"
                            style={{ data: { fill: "#ff0000" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                        <VictoryBar
                            data={data}
                            x="index"
                            y="Value"
                            style={{ data: { fill: "#0000ff" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                    </VictoryChart>
                );
            case 'scatter':
                return (
                    <VictoryChart>
                        <VictoryScatter
                            data={data}
                            x="index"
                            y="Quantity"
                            style={{ data: { fill: "#ff0000" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                        <VictoryScatter
                            data={data}
                            x="index"
                            y="Value"
                            style={{ data: { fill: "#0000ff" } }}
                            labels={({ datum }) => `Description: ${datum.Description}`}
                            labelComponent={<VictoryTooltip />}
                        />
                    </VictoryChart>
                );
            case 'pie':
                return (
                    <VictoryPie
                        data={data}
                        x="Description"
                        y="Quantity"
                        style={{ data: { fill: "#ff0000" } }}
                        labels={({ datum }) => `${datum.Description}: ${datum.Quantity}`}
                        labelComponent={<VictoryTooltip />}
                    />
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
                <Button type={graphType === 'pie' ? 'primary' : 'default'} onClick={() => handleGraphTypeChange('pie')} style={{ marginRight: '10px' }}>Pie Chart</Button>
            </div>
            {renderChart()}
        </div>
    );
};

export default LargeDataChart;
