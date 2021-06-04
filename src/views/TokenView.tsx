import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Col, Typography } from "antd";
import { FieldNumberOutlined } from "@ant-design/icons";
import { FORGE_ID } from "../constants";
import { SearchQuery } from "../components/SearchQuery";
import { BeachCard } from "../components/BeachCard";
import { Token } from "../types";

const { Text, Title } = Typography;

export function TokenView(props: { height: number; setActivePage?: any }) {
  let { tokenId } = useParams<{ tokenId: string }>();
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.explorerClusterSuffix,
    };
  });

  const token = { id: Number(tokenId) } as Token;

  const imgUri =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/" +
    String(token.id).padStart(9, "0") +
    ".png";

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
      <Title level={1}>
        <FieldNumberOutlined />
        {tokenId.padStart(4, "0")}
      </Title>
      <BeachCard token={token} imgUri={imgUri} />
      {/* <Row style={{ paddingBottom: "2em" }}>
        <Col>
          <Text className="list-account-heading" type="secondary">
            <WalletOutlined /> {publickey}
          </Text>
        </Col>
        <Col flex="auto"></Col>
      </Row> */}
    </div>
  );
}
