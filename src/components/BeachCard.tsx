import { useEffect, useRef, useState } from "react";
import { Card, Tooltip, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
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

export function BeachCard(props: { token: Token; imgUriBase: string }) {
  const minBidSol = props.token.minBidLamports
    ? props.token.minBidLamports.div(new BN(1e9)).toNumber()
    : "";
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const coverUri =
    props.imgUriBase +
    "cover_" +
    String(props.token.id).padStart(9, "0") +
    ".png";
  const insertUri =
    props.imgUriBase +
    "insert_" +
    String(props.token.id).padStart(9, "0") +
    ".png";

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
            src={coverUri}
            alt={LABELS.TOKEN_NAME + " token number " + props.token.id}
            width={48}
            height={48}
            className={"token-card"}
            onClick={handleClick}
          />
          <PixelArt
            src={insertUri}
            alt={LABELS.TOKEN_NAME + " token number " + props.token.id}
            width={48}
            height={48}
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
        <Tooltip title={"See the details of this " + LABELS.TOKEN_NAME}>
          <Link to={"/tokenDetail/" + props.token.id}>
            <InfoCircleOutlined key="details" />
          </Link>
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
