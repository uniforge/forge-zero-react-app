import { useEffect, useRef, useState } from "react";
import { Card, Tooltip, Row, Col, Typography } from "antd";
import {
  UndoOutlined,
  ToTopOutlined,
  FieldNumberOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { BN } from "@project-serum/anchor";
import ReactCardFlip from "react-card-flip";
import { Token } from "../types";
import { LABELS } from "../constants";
import { PixelArt } from "./PixelArt";
import questionMark from "../questionMark.png";

const { Text } = Typography;

export function BeachCard(props: { token: Token; imgUri: string }) {
  const minBidSol = props.token.minBidLamports
    ? props.token.minBidLamports.div(new BN(1e9)).toNumber()
    : "";
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

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

  function handleClick(e: any) {
    e.preventDefault();
    setIsFlipped((isFlipped) => !isFlipped);
  }

  return (
    <Card
      //   style={{ width: 300 }}
      cover={
        <ReactCardFlip isFlipped={isFlipped}>
          <PixelArt
            src={props.imgUri}
            alt={LABELS.TOKEN_NAME + " token number " + props.token.id}
            width={48}
            height={48}
            className={"token-card"}
            onClick={handleClick}
          />
          <PixelArt
            src={questionMark}
            alt={LABELS.TOKEN_NAME + " token number " + props.token.id}
            width={32}
            height={32}
            className={"token-card"}
            onClick={handleClick}
          />
        </ReactCardFlip>
      }
      actions={[
        <Tooltip title="Flip the card over">
          <UndoOutlined key="flip" onClick={handleClick} />
        </Tooltip>,
        // <Tooltip title="Offer for sale">
        //   <ToTopOutlined key="sell" />
        // </Tooltip>,
        // <Tooltip title={"See the details of this " + LABELS.TOKEN_NAME}>
        //   <InfoCircleOutlined key="details" />
        // </Tooltip>,
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
