import React, { useEffect, useState } from "react";
import { Layout, Typography, Card, Row, Col, Space, message } from "antd";
import { UserOutlined, TeamOutlined, BookOutlined, DesktopOutlined, DollarOutlined } from "@ant-design/icons";
import Navbar from "../../Component/Navbar/Navbar";
import axios from "axios";
import Graph from "../../Component/Charts/Chart";
import SGraph from "../../Component/Charts/LChart";
import CustomCard from "../../Component/Cards/OverviewCard";
import TodoList from "../../Component/ToDo/Tododash";

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
  const [todos, setTodos] = useState([]);

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

   

    fetchTodo();
    fetchStocks();
    fetchLab();
    fetchData();
  }, []);

  const fetchTodo = async () => {
    try {
      const todosResponse = await axios.get("http://localhost:3000/admin/get_all_todos");
      setTodos(todosResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleTodo = async (taskId, newStatus) => {
    try {
      // Update the todo status
      await axios.put("http://localhost:3000/admin/update_todo_status", { taskId, status: newStatus });
      message.success("Task status updated successfully");
      fetchTodo();
    } catch (error) {
      console.error("Error updating task status:", error);
      message.error("Failed to update task status");
    }
  };

  

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Navbar>
        <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <Content style={{ padding: '24px', minHeight: '280px', maxHeight: 'calc(100vh - 64px)' }}>
            <Row gutter={[16, 32]}>
              <Col xs={24} sm={12}>
                <CustomCard
                  backgroundColor="#f0f2f5"
                  title="Staffs"
                  count={counts.total_staff}
                  icon={<UserOutlined style={{ fontSize: '24px', color: '#fff' }} />}
                  iconColor="#1890ff"
                  iconBackground="#1890ff"
                  circleColor=""
                />
              </Col>
              <Col xs={24} sm={12}>
                <CustomCard
                  backgroundColor="#f0f2f5"
                  title="Research Scholars"
                  count={counts.total_rs}
                  icon={<TeamOutlined style={{ fontSize: '24px', color: '#fff' }} />}
                  iconColor="#52c41a"
                  iconBackground="#52c41a"
                  circleColor=""
                />
              </Col>
            </Row>
            <Row gutter={[16, 32]}>
              <Col xs={24} sm={12}>
                <CustomCard
                  backgroundColor="#f0f2f5"
                  title="Stocks"
                  count={counts.total_stocks}
                  icon={<BookOutlined style={{ fontSize: '24px', color: '#fff' }} />}
                  iconColor="#f5222d"
                  iconBackground="#f5222d"
                  circleColor=""
                />
              </Col>
              <Col xs={24} sm={12}>
                <CustomCard
                  backgroundColor="#f0f2f5"
                  title="Systems"
                  count={counts.system}
                  icon={<DesktopOutlined style={{ fontSize: '24px', color: '#fff' }} />}
                  iconColor="#fa8c16"
                  iconBackground="#fa8c16"
                />
              </Col>
            </Row>
            <Row gutter={[16, 32]}>
              <Col xs={24} sm={12}>
                    <div style={{ flex: 1 }}>
                      <TodoList todos={todos} toggleTodo={toggleTodo} />
                    </div>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <Space direction="horizontal" align="center">
                    <div style={{ flex: 1, paddingLeft: '16px' }}>
                      <div>graph</div>
                    </div>
                  </Space>
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
