import { useSelector, useDispatch } from "react-redux";
import { State as StoreState, ActionType } from "../store/reducer";
import { Breadcrumb, Button, Layout, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { Forge } from "../components/Forge";
import { useEffect } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

export function Home(props: { height: number }) {
  const { wallet, connection } = useWallet();

  const { tokenAccount, getTokenAccount } = useTokenAccount();

  const { isWalletConnected, balanceSol } = useSelector((state: StoreState) => {
    return {
      isWalletConnected: state.common.isWalletConnected,
      balanceSol: state.common.walletDetails.balance,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (isWalletConnected) {
      connection
        .getBalance(wallet.publicKey)
        .then((balance) => {
          console.log("Updating wallet balance.");
          dispatch({
            type: ActionType.CommonSetBalance,
            item: { newBalance: balance / 1e9 },
          });
        })
        .catch(() => {});
    }
  }, [isWalletConnected, connection, dispatch, wallet]);

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
            <Text>
              {balanceSol
                ? "Balance: ◎" + balanceSol
                : "Connect a wallet to get started."}
            </Text>
            {tokenAccount ? (
              <div>
                <Title level={4}>Holdings</Title>
                <Text>{"Number of tokens: " + tokenAccount.nTokens}</Text>
                <br />
                <Text>{JSON.stringify(tokenAccount.ownedTokens)}</Text>
                <br />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </Content>
  );
}
