import { Card, Avatar, Tooltip, Row, Col } from "antd";
import { ToTopOutlined } from "@ant-design/icons";
import { BN } from "@project-serum/anchor";
import { Token } from "../types/types";

const { Meta } = Card;

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
      {/* <Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={props.title}
        description={props.description}
      /> */}
      <Row>
        <Col>{"Solset #" + String(props.token.id).padStart(4, "0")}</Col>
        <Col flex="auto"></Col>
        <Col>{props.token.forSale ? "◎" + minBidSol : "-"}</Col>
      </Row>
    </Card>
  );
}
