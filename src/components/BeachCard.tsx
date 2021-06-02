import { Card, Tooltip, Row, Col, Typography } from "antd";
import {
  ToTopOutlined,
  FieldNumberOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { BN } from "@project-serum/anchor";
import { Token } from "../types";
import { LABELS } from "../constants";

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
        <Tooltip title={"See the details of this " + LABELS.TOKEN_NAME}>
          <InfoCircleOutlined key="details" />
        </Tooltip>,
      ]}
    >
      <Row>
        <Col>
          <Text strong>
            <FieldNumberOutlined style={{ fontSize: "1.3em" }} />{" "}
            {String(props.token.id).padStart(4, "0")}
          </Text>
        </Col>
        <Col flex="auto"></Col>
        <Col>
          {props.token.forSale
            ? LABELS.SOL_SYM + minBidSol
            : LABELS.NOT_FOR_SALE}
        </Col>
      </Row>
    </Card>
  );
}
