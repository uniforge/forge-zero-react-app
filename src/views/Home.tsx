import { useSelector, useDispatch } from "react-redux";
import { State as StoreState, ActionType } from "../store/reducer";
import { Breadcrumb, Layout, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useWallet } from "../components/WalletProvider";
import { ClaimButton } from "../components/ClaimButton";
import { useEffect } from "react";

const { Content } = Layout;
const { Title } = Typography;

export function Home(props: { height: number }) {
  const { wallet, connection } = useWallet();

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
          dispatch({
            type: ActionType.CommonSetBalance,
            item: { newBalance: balance / 1e9 },
          });
        })
        .catch(() => {});
    }
  }, [isWalletConnected, dispatch, connection, wallet]);

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
        <Title level={2}>
          Welcome!{" "}
          {balanceSol
            ? "Balance: ◎" + balanceSol
            : "Connect a wallet to get started."}
        </Title>

        {wallet.publicKey ? (
          <div>
            <Title level={3}>Create an account!</Title>
            <ClaimButton />
          </div>
        ) : (
          ""
        )}
      </div>
    </Content>
  );
}
