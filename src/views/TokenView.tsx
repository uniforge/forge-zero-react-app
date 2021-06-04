import { useState, useEffect } from "react";
import { useParams, useHistory, generatePath } from "react-router-dom";
import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Col, Typography, notification } from "antd";
import {
  FieldNumberOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { FORGE_ID } from "../constants";
import { useForge } from "../contexts/ForgeProvider";
import { SearchQuery } from "../components/SearchQuery";
import { PixelArt } from "../components/PixelArt";
import { Token } from "../types";
import { LABELS } from "../constants";
import questionMark from "../questionMark.png";

const { Text, Title } = Typography;

export function TokenView(props: { height: number; setActivePage?: any }) {
  let { tokenId } = useParams<{ tokenId: string }>();
  let history = useHistory();
  const { forge } = useForge();
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.explorerClusterSuffix,
    };
  });

  const goToToken = (value: number) => {
    // Valid max token
    try {
      //@ts-ignore
      const validMaxToken = forge?.maxSupply - forge?.supplyUnclaimed;

      if (Number(value) <= validMaxToken && Number(value) > 0) {
        const newPath = generatePath("/tokenDetail/:tokenId", {
          tokenId: value,
        });
        history.push(newPath);
      } else {
        notification.error({
          message: "Invalid " + LABELS.TOKEN_NAME + " Number",
          description:
            "Numbers start at 1 and only " +
            validMaxToken +
            " " +
            LABELS.TOKEN_NAME +
            " have been forged",
        });
      }
    } catch {
      notification.error({
        message: "Invalid query",
        description:
          "Try a Solana wallet address or a " + LABELS.TOKEN_NAME + " number",
      });
    }
  };

  const token = { id: Number(tokenId) } as Token;

  const imgUriBase =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/";

  const coverUri =
    imgUriBase + "cover_" + String(token.id).padStart(9, "0") + ".png";
  const insertUri =
    imgUriBase + "insert_" + String(token.id).padStart(9, "0") + ".png";

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Row style={{ paddingBottom: "2.6em" }}>
        <Col flex="auto"></Col>
        <Col>
          <SearchQuery />
        </Col>
        <Col flex="auto"></Col>
      </Row>
      <Row>
        <Col>
          <Title level={1}>
            <FieldNumberOutlined />
            {tokenId.padStart(4, "0")}
          </Title>
        </Col>
        <Col flex="auto"></Col>
        <Col>
          <Title level={1}>
            <LeftOutlined onClick={() => goToToken(token.id - 1)} />
          </Title>
        </Col>
        <Col>
          <Title level={1}>
            <RightOutlined onClick={() => goToToken(token.id + 1)} />
          </Title>
        </Col>
      </Row>

      <Row gutter={[64, 0]}>
        <Col xs={24} md={12}>
          <Row gutter={[0, 0]}>
            <Col span={24}>
              <PixelArt
                src={coverUri}
                alt={LABELS.TOKEN_NAME + " token number " + token.id}
                width={48}
                height={48}
                className={"token-card"}
              />
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Title level={5}>COVER</Title>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12}>
          <Row gutter={[0, 0]}>
            <Col span={24}>
              <PixelArt
                src={insertUri}
                alt={LABELS.TOKEN_NAME + " token number " + token.id}
                width={48}
                height={48}
                className={"token-card"}
              />
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Title level={5}>INSERT</Title>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          <Title level={3}>Description:</Title>
        </Col>
      </Row> */}
    </div>
  );
}
