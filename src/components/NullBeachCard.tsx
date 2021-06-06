import { useEffect, useRef } from "react";
import { Card, Tooltip, Row, Col, Typography } from "antd";
import {
  DashOutlined,
  FieldNumberOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { LABELS } from "../constants";
import questionMark from "../questionMark.png";

const { Text } = Typography;

export function NullBeachCard() {
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
          <Tooltip
            color="blue"
            title={
              "This is an empty slot in your wallet. You can fill it with an unclaimed " +
              LABELS.TOKEN_NAME +
              " or buy one on the secondary market."
            }
          >
            <canvas ref={canvasRef} width="32" height="32"></canvas>
          </Tooltip>
          <div style={{ display: "none" }}>
            <img
              ref={imgRef}
              src={questionMark}
              width="32"
              height="32"
              alt="Question mark image for empty slot in wallet"
            />
          </div>
        </div>
      }
      actions={[
        <Tooltip
          color="blue"
          title={
            "This is an empty slot in your wallet. You can fill it with an unclaimed " +
            LABELS.TOKEN_NAME +
            " or buy one on the secondary market."
          }
        >
          <InfoCircleOutlined key="details" />
        </Tooltip>,
      ]}
    >
      <Row>
        <Col>
          <Text strong>
            <FieldNumberOutlined style={{ fontSize: "1.3em" }} />{" "}
            <DashOutlined />
          </Text>
        </Col>
        <Col flex="auto"></Col>
      </Row>
    </Card>
  );
}
