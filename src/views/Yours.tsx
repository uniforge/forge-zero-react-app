import { Button, Layout, Row, Col, Space, Typography } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useWallet } from "../contexts/WalletProvider";
import { useForge } from "../contexts/ForgeProvider";
import { Forge } from "../components/Forge";
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
        Your {LABELS.TOKEN_NAME}{" "}
        <Text type="secondary">
          ({forge?.supplyUnclaimed} remain unclaimed)
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
            {/* ToDo condition airdrop availability on the current network */}
            <Col>
              <Airdrop getBalance={getBalance} balance={balanceSol} />
            </Col>
          </Row>
          <TokenAccount
            getBalance={getBalance}
            getForge={getForge}
            balanceSol={balanceSol}
          />
        </Space>
      ) : (
        <Text className="home-text">
          <Link onClick={() => wallet.connect()}>Connect</Link> a wallet to try{" "}
          {LABELS.TOKEN_NAME}.
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
