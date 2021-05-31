import { Breadcrumb, Layout, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

export function Home(props: { height: number }) {
  return (
    <Content className="site-layout" style={{ padding: "0 50px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: props.height - 254 }}
      >
        <Title level={2}>Welcome!</Title>
      </div>
    </Content>
  );
}
