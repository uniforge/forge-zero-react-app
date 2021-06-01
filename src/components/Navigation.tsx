import { useEffect, ReactElement } from "react";
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
import { useWallet } from "./WalletProvider";
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
      notification.info({ message: "Disconnected from wallet" });
    });
    wallet.on("connect", async () => {
      dispatch({
        type: ActionType.CommonWalletDidConnect,
        item: {},
      });
      notification.success({ message: "Connected to wallet" });
    });
  }, [wallet, dispatch, forgeClient.provider.connection]);

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
        <img src={logo} alt="Uniforge logo" />
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
