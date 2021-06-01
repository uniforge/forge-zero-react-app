import { Card, Tooltip, Row, Col, Typography } from "antd";
import { ToTopOutlined } from "@ant-design/icons";
import { BN } from "@project-serum/anchor";
import { Token } from "../types";
import { SYMBOLS } from "../constants";

const { Text } = Typography;

export function BeachCard(props: { token: Token }) {
  const minBidSol = props.token.minBidLamports.div(new BN(1e9)).toNumber();
  return (
    <Card
      //   style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <Tooltip title="Offer for sale">
          <ToTopOutlined key="sell" />
        </Tooltip>,
      ]}
    >
      <Row>
        <Col>
          <Text strong>
            {"Solset #" + String(props.token.id).padStart(4, "0")}
          </Text>
        </Col>
        <Col flex="auto"></Col>
        <Col>{props.token.forSale ? SYMBOLS.SOL + minBidSol : "-"}</Col>
      </Row>
    </Card>
  );
}
