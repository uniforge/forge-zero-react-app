import { Breadcrumb, Layout, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useWallet } from "../contexts/WalletProvider";
import { useForge } from "../contexts/ForgeProvider";
import { Forge } from "../components/Forge";
import { TokenAccount } from "../components/TokenAccount";
import { Airdrop } from "../components/Airdrop";
import { useCallback, useEffect, useState } from "react";
import { LABELS } from "../constants";

const { Content } = Layout;
const { Title, Text } = Typography;

export function YoursView(props: { height: number }) {
  const { wallet, connection } = useWallet();
  const { getForge } = useForge();
  const [balanceSol, setBalanceSol] = useState<number>();

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
    <Content className="site-layout" style={{ padding: "0 50px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Your account</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: props.height - 214 }}
      >
        <Title level={2}>Welcome! </Title>
        <Forge />
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
        )}
      </div>
    </Content>
  );
}
