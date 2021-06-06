import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Layout, Row, Col, Space, Typography } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useWallet } from "../contexts/WalletProvider";
import { useForge } from "../contexts/ForgeProvider";
import { TokenAccount } from "../components/TokenAccount";
import { Airdrop } from "../components/Airdrop";
import { useCallback, useEffect, useState } from "react";
import { LABELS } from "../constants";

const { Content } = Layout;
const { Title, Text, Link } = Typography;

export function YoursView(props: { height: number; setActivePage?: any }) {
  const { wallet, connection } = useWallet();
  const { forge, getForge } = useForge();
  const [balanceSol, setBalanceSol] = useState<number>(0);
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.explorerClusterSuffix,
    };
  });

  const getBalance = useCallback(async () => {
    const balance = await connection.getBalance(wallet.publicKey);
    setBalanceSol(balance / 1e9);
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    if (wallet.publicKey) {
      getBalance();
    }
  }, [wallet.publicKey, setBalanceSol, getBalance]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Title level={1}>
        Your {LABELS.TOKEN_NAME_PLURAL}{" "}
        <Text type="secondary">
          ({forge?.supplyUnclaimed} {LABELS.TOKEN_NAME_PLURAL} remain unclaimed)
        </Text>
      </Title>
      {wallet.publicKey ? (
        <Space direction="vertical">
          <Row align="middle">
            <Col>
              <Text style={{ fontSize: "1.2em" }} strong>
                {LABELS.SOL_SYM + balanceSol.toFixed(2)}
              </Text>
            </Col>
            <Col span={1}></Col>
            <Col>
              <Text style={{ fontSize: "1.2em" }} type="secondary">
                <WalletOutlined /> {wallet.publicKey.toBase58()}
              </Text>
            </Col>
            <Col flex="auto"></Col>
            {network !== "" ? (
              <Col>
                <Airdrop getBalance={getBalance} balance={balanceSol} />
              </Col>
            ) : (
              <Col></Col>
            )}
          </Row>
          <TokenAccount
            getBalance={getBalance}
            getForge={getForge}
            balanceSol={balanceSol}
            unclaimedSupply={forge ? forge.supplyUnclaimed > 0 : true}
          />
        </Space>
      ) : (
        <Text className="home-text">
          <Link onClick={() => wallet.connect()}>Connect</Link> a wallet to
          claim a {LABELS.TOKEN_NAME}.
        </Text>
      )}
      {/* <Row>
        <Col>
        <WalletOutlined />
        </Col>
      </Row>
      <Title level={3}>Account info:</Title>
      {wallet.publicKey ? (
        <div>
          <Text>{wallet.publicKey.toBase58()}</Text>
          <br />

          {balanceSol ? (
            <div>
              <Text>{"Balance: " + LABELS.SOL_SYM + balanceSol}</Text>
              <br />
              <Airdrop getBalance={getBalance} />
              <br />
              <TokenAccount getBalance={getBalance} getForge={getForge} />
            </div>
          ) : (
            <div>
              <Text>
                It looks like you don't have any Sol, request some below.
              </Text>
              <br />
              <Airdrop getBalance={getBalance} />
            </div>
          )}
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
}
