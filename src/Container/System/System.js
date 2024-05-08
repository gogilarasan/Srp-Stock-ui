import React, { useState, useEffect } from "react";
import { Layout, Card, Button } from "antd";
import Navbar from "../../Component/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './System.css';
import config from '../../../config';
const apiUrl = config.apiUrl;

const { Content } = Layout;
const { Meta } = Card;

const System = () => {
  const [labs, setLabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/admin/get_all_labs`);
      setLabs(response.data);
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const redirectToDetails = (lab) => {
    navigate(`/System/SysStocks?lab=${lab.lab_id}`);
  };

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
        <Layout style={{ padding: "24px", overflow: "hidden" }}>
          <Content style={{ overflowY: 'auto', height: "calc(100vh - 48px)" }}>
            <div className="labs-container">
              {labs.map((lab) => (
                <Card
                  key={lab.lab_id}
                  style={{
                    width: 350, // Increased width
                    borderRadius: '16px', // Increased border radius
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // Increased box shadow
                    marginBottom: '24px', // Added margin bottom
                    backgroundColor: '#ff521', // Random background color
                    color: '#ffffff', // Text color
                  }}
                  actions={[
                    <Button type="text" onClick={() => redirectToDetails(lab)}>
                      View
                    </Button>,
                  ]}
                >
                  <Meta
                    title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>{lab.lab_name.toUpperCase()}</span>} // Increased font size
                    description={<span style={{ fontSize: '16px' }}>{lab.lab_description}</span>} // Adjusted font size
                  />
                </Card>
              ))}
            </div>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

// const getRandomColor = () => {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

export default System;
