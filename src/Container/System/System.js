import React from "react";
import { Layout, Typography } from "antd"; 

const { Content } = Layout;
const { Title } = Typography;

const System = () => {
  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ padding: '24px', minHeight: '280px' }}>
          
        </Content>
      </Layout>
    </Layout>
  );
};

export default System;
