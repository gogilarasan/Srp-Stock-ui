import React, { useState, useEffect } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import { Button, Card } from 'antd'; // Import Button and Card components from Ant Design
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Chart = ({ data }) => {
    const [currentLabIndex, setCurrentLabIndex] = useState(0);

    useEffect(() => {
        // Any side effects related to data changes can be handled here
    }, [data]);
    console.log("Data :", data);

    const handleNextLab = () => {
        setCurrentLabIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    const handlePreviousLab = () => {
        setCurrentLabIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
    };

    const renderGraph = () => {
        const currentLab = data[currentLabIndex];
        if (!currentLab || !currentLab.Timetable || currentLab.Timetable.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    {/* <h2>{currentLab.Lab}</h2> */}
                    <p>No timetable available for  current lab</p>
                </div>
            );
        }

        const xLabels = ["FN", "AN"];
        const yLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // Initialize an empty heatmap data array
        const heatmapData = new Array(yLabels.length)
            .fill(0)
            .map(() =>
                new Array(xLabels.length).fill(0)
            );

        // Populate heatmap data with subject names
        currentLab.Timetable.forEach(entry => {
            const xIndex = xLabels.indexOf(entry.session_type);
            const yIndex = yLabels.indexOf(entry.day);
            heatmapData[yIndex][xIndex] = entry.subject_name;
        });

        return (
            <div>
                <h5 style={{ textAlign: 'center' }}>{currentLab.Lab}</h5>
                <HeatMapGrid
                    data={heatmapData}
                    xLabels={xLabels}
                    yLabels={yLabels}
                    cellRender={(x, y, value) => (
                        <div
                            title={`${value}`}
                            style={{
                                border: '0.5px solid',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center'
                            }}
                        >
                            {value}
                        </div>
                    )}
                    cellStyle={(_x, _y, value) => {
                        const ratio = 1;
                        return {
                            background: `rgba(176, 174, 242,${ratio})`,
                            fontSize: '0.8rem', // Font size
                            color: `rgba(0, 0, 0, ${ratio / 2 + 0.4})`,
                        };
                    }}
                    cellHeight='3rem'
                    cellWidth='3rem'
                    xLabelsPos='top'
                    yLabelsPos='right'
                    rectangle
                    xLabelsStyle={(index) => ({
                        fontSize: '0.8rem',
                        color: '#333'
                    })}
                    yLabelsStyle={(index) => ({
                        fontSize: '0.8rem',
                        color: '#333'
                    })}
                />
            </div>
        );
    };


    return (
        <Card style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                {renderGraph()}
            </div>
            <div style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={handlePreviousLab} style={{
                    marginRight: '10px',
                    backgroundColor: '#ffffff', 
                    borderColor: '#1890ff', 
                    color: '#1890ff', 
                }}
                    icon={<LeftOutlined style={{ color: 'blue' }} />} />
                <Button type="primary" onClick={handleNextLab} style={{
                    marginRight: '10px',
                    backgroundColor: '#ffffff', 
                    borderColor: '#1890ff', 
                    color: '#1890ff', 
                }}
                    icon={<RightOutlined style={{ color: 'blue' }} />} />
            </div>
        </Card>
    );
};

export default Chart;
