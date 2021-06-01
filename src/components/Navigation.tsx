import { useEffect, useState, ReactElement } from "react";
import { Link, useHistory, generatePath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Select,
  Input,
  Typography,
  Button,
  Col,
  notification,
} from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { State as StoreState, ActionType } from "../store/reducer";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import logo from "../Anvil.png";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

notification.config({
  duration: 3,
  rtl: true,
  placement: "topRight",
});

type WalletConnectButtonProps = {
  style?: any;
};

export function WalletConnectButton(
  props: WalletConnectButtonProps
): ReactElement {
  const { showDisconnect } = useSelector((state: StoreState) => {
    return {
      showDisconnect: state.common.isWalletConnected,
    };
  });
  const dispatch = useDispatch();
  const { wallet, forgeClient } = useWallet();
  const { setTokenAccountState } = useTokenAccount();
  const [key, setKey] = useState<number>(0);

  // Wallet connection event listeners.
  useEffect(() => {
    wallet.on("disconnect", () => {
      dispatch({
        type: ActionType.CommonWalletDidDisconnect,
        item: {},
      });
      dispatch({
        type: ActionType.CommonTriggerShutdown,
        item: {},
      });
      notification.info({
        key: key.toString(),
        message: "Disconnected from wallet",
      });
      setKey(key + 1);
      setTokenAccountState({ has: true, account: undefined });
    });
    wallet.on("connect", async () => {
      dispatch({
        type: ActionType.CommonWalletDidConnect,
        item: {},
      });
      notification.success({
        key: key.toString(),
        message: "Connected to wallet",
      });
      setKey(key + 1);
    });
  }, [wallet, dispatch, forgeClient.provider.connection, key]);

  return showDisconnect ? (
    <Button style={props.style} onClick={() => wallet.disconnect()}>
      <CloseOutlined />
      <Text>Disconnect</Text>
    </Button>
  ) : (
    <Button style={props.style} onClick={() => wallet.connect()}>
      <UserOutlined />
      <Text>Connect wallet</Text>
    </Button>
  );
}

function UserSelector() {
  const { wallet } = useWallet();

  return (
    <span>
      <UserOutlined />
      <Select
        style={{
          marginLeft: "12px",
          width: "150px",
        }}
        onChange={(e) => {
          if (e === "disconnect") {
            wallet.disconnect();
          }
        }}
        defaultValue={wallet.publicKey.toString()}
      >
        <Option value="disconnect">
          <Button color="inherit">
            <CloseOutlined />
            <Text>Disconnect</Text>
          </Button>
        </Option>
      </Select>
    </span>
  );
}

export function Navigation() {
  let history = useHistory();

  const onSearch = (value: string) => {
    if (value !== "") {
      const newPath = generatePath("/listAccount/:pubKey", { pubKey: value });
      history.push(newPath);
    }
  };
  const { wallet } = useWallet();

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <Link to="/">
        <img src={logo} style={{ maxHeight: "32px" }} alt="Uniforge logo" />
      </Link>
      <Col flex="auto"></Col>
      <Search
        placeholder="Search for a public key"
        onSearch={onSearch}
        enterButton
        style={{ width: 500 }}
      />
      <Col flex="auto"></Col>
      {!wallet.publicKey ? (
        <WalletConnectButton
          style={{
            display: wallet.publicKey ? "none" : "",
          }}
        />
      ) : (
        <UserSelector />
      )}
    </Header>
  );
}
