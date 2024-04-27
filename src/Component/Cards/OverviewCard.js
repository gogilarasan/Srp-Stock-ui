import React from 'react';
import { Card, Space } from 'antd';

const CustomCard = ({ backgroundColor, title, count, icon, iconColor, iconBackground, circleColor }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
      <div style={{ position: 'relative', zIndex: '1' }}>
        <Card
          style={{
            backgroundColor: '#fff', // Set card background color to white
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            padding: '16px',
          }}
        >
          {/* Circle Component Inside Card */}
          <div
            style={{
              position: 'absolute',
              top: '-30px', // Adjusted top position relative to the card
              right: '-30px', // Adjusted right position relative to the card
              backgroundColor: backgroundColor, // Set circle color dynamically
              width: '120px', // Adjusted width of the circle
              height: '120px', // Adjusted height of the circle
              borderRadius: '50%',
              zIndex: '1',
              transform: 'rotate(0deg)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Icon */}
            <div
              style={{
                background: iconBackground,
                padding: '12px',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {icon}
            </div>
          </div>

          {/* Title and Count */}
          <Space direction="horizontal" align="center">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '34px', fontWeight: 'bold', color: iconColor }}>{count}</div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default CustomCard;
