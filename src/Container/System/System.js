import React, { useState, useEffect } from "react";
import { Layout, Card, Button } from "antd";
import Navbar from "../../Component/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './System.css';

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
      const response = await axios.post("http://localhost:3000/admin/get_all_labs");
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
        <Layout style={{ padding: "24px" }}>
          <Content>
            <div className="labs-container">
              {labs.map((lab) => (
                <Card
                  style={{ width: 270, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                  /*cover={
                    <img
                      alt="Lab"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      style={{ borderRadius: '8px 8px 0 0' }}
                    />
                  }*/
                  actions={[
                    <Button type="text" onClick={() => redirectToDetails(lab)}>
                      View
                    </Button>,
                  ]}
                >
                  <Meta
                    title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{lab.lab_name.toUpperCase()}</span>}
                    description={lab.lab_description}
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


export default System;