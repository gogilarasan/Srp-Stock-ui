import React, { useEffect, useState } from "react";
import { Layout, Typography, Card, Row, Col, Space } from "antd";
import { UserOutlined, TeamOutlined, BookOutlined, DesktopOutlined, DollarOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar";
import axios from "axios";
import Graph from "../../Component/Chart";
import SGraph from "../../Component/LChart";

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const [counts, setCounts] = useState({
    total_stocks: 0,
    total_staff: 0,
    total_rs: 0,
    total_system: 0,
  });
  const [chartData, setData] = useState([]);
  const [stockData, setStocksData] = useState([]);
  const [totalStockValue, setTotalStockValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, staffsRes, scholarsRes, system] = await Promise.all([
          axios.post("http://localhost:3000/admin/get_all_stock_depts"),
          axios.post("http://localhost:3000/admin/get_all_staffs"),
          axios.post("http://localhost:3000/admin/get_all_research_scholars"),
          axios.post("http://localhost:3000/admin/get_all_stocks"),
        ]);
        setCounts({
          total_stocks: stocksRes.data.length,
          total_staff: staffsRes.data.length,
          total_rs: scholarsRes.data.length,
          system: system.data.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchLab = async () => {
      try {
        const response = await axios.post("http://localhost:3000/admin/get_all_labs");
        const labs = response.data;

        const graphData = [];

        for (const lab of labs) {
          const labId = lab.lab_id;
          const labName = lab.lab_name;

          const stocksResponse = await axios.post("http://localhost:3000/admin/get_stock_by_Labid", { lab_id: labId });
          const stocks = stocksResponse.data;
          const stockCount = stocks.length;

          graphData.push({ Lab: labName, Stock: stockCount });
        }
        setData(graphData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchStocks = async () => {
      try {
        const response = await axios.post("http://localhost:3000/admin/get_all_stock_depts");
        const stocks = response.data;

        const stockData = [];
        let totalValue = 0;

        stocks.forEach(stock => {
          const { description, bookFigureQuantity, bookStockValueRs } = stock;
          const value = parseFloat(bookStockValueRs);
          stockData.push({ Description: description, Quantity: bookFigureQuantity, Value: value });

          if (!isNaN(value) && value > 0) {
            totalValue += value;
          }
        });

        console.log("Stocks Data:", stockData);
        setStocksData(stockData);
        setTotalStockValue(totalValue);
        console.log("Values total :" + totalValue);

      } catch (error) {
        console.error("Error fetching stocks data:", error);
      }
    };



    fetchStocks();
    fetchLab();
    fetchData();
  }, []);

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
        <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <Content style={{ padding: '24px', minHeight: '280px', maxHeight: 'calc(100vh - 64px)' }}>
            <Row gutter={[16, 32]}>
              <Col span={8}>
                <Card title="Details" style={{ marginBottom: "16px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Row gutter={[16, 32]} justify="center">
                    <Col span={24}>
                      <Space direction="horizontal" align="center">
                        <div style={{ background: '#1890ff', padding: '8px', borderRadius: '8px' }}>
                          <UserOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '16px' }}>
                          <div>Total Staffs</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{counts.total_staff}</div>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <Row gutter={[16, 32]} justify="center">
                    <Col span={24}>
                      <Space direction="horizontal" align="center">
                        <div style={{ background: '#52c41a', padding: '8px', borderRadius: '8px' }}>
                          <TeamOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '16px' }}>
                          <div>Total Research Scholars</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{counts.total_rs}</div>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <Row gutter={[16, 32]} justify="center">
                    <Col span={24}>
                      <Space direction="horizontal" align="center">
                        <div style={{ background: '#fa8c16', padding: '8px', borderRadius: '8px' }}>
                          <BookOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '16px' }}>
                          <div>Total Stocks</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{counts.total_stocks}</div>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <Row gutter={[16, 32]} justify="center">
                    <Col span={24}>
                      <Space direction="horizontal" align="center">
                        <div style={{ background: '#f5222d', padding: '8px', borderRadius: '8px' }}>
                          <DesktopOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '16px' }}>
                          <div>Total Stocks</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{counts.system}</div>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>
                <Card
                  title="Total Stock Value"
                  style={{ marginBottom: "16px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '8px' }} />
                    <div>
                      <p style={{ fontSize: '18px', color: '#52c41a', margin: 0 }}>
                        {totalStockValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={16}>
                <Card title="System Stocks" style={{
                  height: "470px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ffffff',
                }} headStyle={{ backgroundColor: '#2196F3', color: 'white' }}>
                  <Graph data={chartData} graphType="bar" />
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: '32px' }}></div>
            <Row gutter={[16, 32]}>
              <Col span={24}>
                <Card
                  title="Stocks"
                  style={{
                    minHeight: "750px",
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff',
                  }}
                  headStyle={{ backgroundColor: '#ffffff', color: 'black' }}
                >
                  <div style={{ height: '100%' }}>
                    <SGraph data={stockData} graphType="sinusoidal-section" />
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Navbar>
    </Layout>
  );
};

export default Home;
