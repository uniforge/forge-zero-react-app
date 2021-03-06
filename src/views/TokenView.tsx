import { useState, useEffect } from "react";
import { useParams, useHistory, generatePath } from "react-router-dom";
import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Col, Typography, Switch, notification } from "antd";
import {
  FieldNumberOutlined,
  LeftOutlined,
  RightOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import { FORGE_ID } from "../constants";
import { useForge } from "../contexts/ForgeProvider";
import { SearchQuery } from "../components/SearchQuery";
import { PixelArt } from "../components/PixelArt";
import { Token, TokenMetadata } from "../types";
import { LABELS } from "../constants";
import { useExplorerQueryString } from "../utils";




const { Text, Title } = Typography;

export function TokenView(props: { height: number; setActivePage?: any }) {
  props.setActivePage("/browse");
  let { tokenId } = useParams<{ tokenId: string }>();
  let history = useHistory();
  const { forge } = useForge();
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.contentNetwork,
    };
  });
  const [metadata, setMetadata] = useState<TokenMetadata>();
  const [showJSON, setShowJSON] = useState<boolean>(false);

  const token = { id: Number(tokenId) } as Token;

  const imgUriBase =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/";

  const queryString = useExplorerQueryString();
  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
  });

  useEffect(() => {
    fetch(
      imgUriBase + "metadata_" + String(token.id).padStart(9, "0") + ".json"
    )
      .then((res) => res.json())
      .then((out) => {
        const tokenMeta = out as TokenMetadata;
        setMetadata(tokenMeta);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [tokenId, setMetadata, imgUriBase, token.id]);

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

  const handleJSONSwitch = () => {
    setShowJSON(!showJSON);
  };

  const coverUri =
    imgUriBase + "cover_" + String(token.id).padStart(9, "0") + ".png";
  const insertUri =
    imgUriBase + "insert_" + String(token.id).padStart(9, "0") + ".png";
  const explurl = "https://explorer.solana.com/tx/" + metadata?.tx + "?" + queryString;
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
      <Row style={{ paddingBottom: "2.6em" }}>
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
        <Col span={24}>
        <Title level={5} style={{marginTop: "-1.0em"}}><a href={explurl} target="_blank" rel="noreferrer"><Text type="secondary">{metadata?.tx}</Text></a></Title>
        </Col>
      </Row>
      <Row gutter={[64, 0]} style={{ paddingBottom: "1.5em" }}>
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
                width={96}
                height={96}
                className={"token-card"}
              />
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Title level={5}>BEACH SCENE</Title>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title level={2}>{metadata?.name}</Title>
        </Col>
        <Col flex="auto"></Col>
        <Col>
          <Switch
            checkedChildren={"JSON"}
            unCheckedChildren={"JSON"}
            onClick={handleJSONSwitch}
          ></Switch>
        </Col>
      </Row>
      <Row style={{ paddingBottom: "1.6em" }}>
        {metadata?.attributes.map((attribute, index) => {
          return (
            <Col key={index} span={24}>
              <Text type="secondary" className="attribute-name">
                {attribute.name.replace(/[0-9]/g, "")}
              </Text>
            </Col>
          );
        })}
      </Row>
      {showJSON ? (
        <Row>
          <Col>
            <Text>
              <pre>{JSON.stringify(metadata, null, 4)}</pre>
            </Text>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col></Col>
        </Row>
      )}
    </div>
  );
}
