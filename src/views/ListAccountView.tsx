import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Col, Typography } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "../contexts/WalletProvider";
import { SearchQuery } from "../components/SearchQuery";
import { TokenDisplay } from "../components/TokenDisplay";
import { FORGE_ID } from "../constants";
import { AccountState } from "../types";

const { Text, Title } = Typography;

export function ListAccountView(props: {
  height: number;
  setActivePage?: any;
}) {
  let { publickey } = useParams<{ publickey: string }>();
  const { forgeClient } = useWallet();
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.contentNetwork,
    };
  });
  const [listedAccount, setListedAccount] = useState<AccountState>();

  useEffect(() => {
    forgeClient.account.tokenAccount
      .associated(new PublicKey(publickey), FORGE_ID)
      .then((account) => {
        console.log("Callback running");
        setListedAccount(account);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [forgeClient, setListedAccount, publickey]);

  const imgUriBase =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/";

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
      <Title level={1}>Account</Title>
      <Row style={{ paddingBottom: "2em" }}>
        <Col>
          <Text className="list-account-heading" type="secondary">
            <WalletOutlined /> {publickey}
          </Text>
        </Col>
        <Col flex="auto"></Col>
      </Row>
      {listedAccount ? (
        <TokenDisplay
          tokens={listedAccount.ownedTokens}
          imgUrilBase={imgUriBase}
        />
      ) : (
        "Null"
      )}
    </div>
  );
}
