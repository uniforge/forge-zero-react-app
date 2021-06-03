import { useEffect, useRef } from "react";
import { Card, Tooltip, Row, Col, Typography } from "antd";
import {
  ToTopOutlined,
  FieldNumberOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { BN } from "@project-serum/anchor";
import { Token } from "../types";
import { LABELS } from "../constants";
import anvil from "../Anvil.png";

const { Text } = Typography;

export function BeachCard(props: { token: Token }) {
  const minBidSol = props.token.minBidLamports.div(new BN(1e9)).toNumber();
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img !== null) {
      //@ts-ignore
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
          //@ts-ignore
          const context = canvas.getContext("2d");
          context.drawImage(imgRef.current, 0, 0);
        }
      };
    }
  }, [canvasRef, imgRef]);

  return (
    <Card
      //   style={{ width: 300 }}
      cover={
        <div>
          <canvas ref={canvasRef} width="32" height="32"></canvas>
          <div style={{ display: "none" }}>
            <img
              ref={imgRef}
              src={anvil}
              width="32"
              height="32"
              alt={"Image of token ID " + props.token.id}
            />
          </div>
        </div>
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
