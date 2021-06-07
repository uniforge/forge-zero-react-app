import { useEffect, useState, ReactElement } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Menu,
  Select,
  Space,
  Typography,
  Button,
  Col,
  notification,
} from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { State as StoreState, ActionType, networks } from "../store/reducer";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { useForge } from "../contexts/ForgeProvider";
import logo from "../Anvil.png";
import { LABELS } from "../constants";

const { Header } = Layout;
const { Text } = Typography;
const { Option } = Select;

notification.config({
  duration: 3,
  rtl: true,
  placement: "topLeft",
});

function NetworkSelector(props: any) {
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network,
    };
  });
  const dispatch = useDispatch();

  function handleChange(value: any) {
    switch (value) {
      case "Localhost":
        dispatch({
          type: ActionType.CommonSetNetwork,
          item: { network: networks.localhost },
        });
        break;
      case "Devnet":
        dispatch({
          type: ActionType.CommonSetNetwork,
          item: { network: networks.devnet },
        });
        break;
      case "Mainnet":
        dispatch({
          type: ActionType.CommonSetNetwork,
          item: { network: networks.mainnet },
        });
        break;
    }
  }

  return (
    <Select defaultValue={network.label} onChange={handleChange}>
      <Option value="Localhost">Localhost</Option>
      <Option value="Devnet">Devnet</Option>
      <Option value="Mainnet">Mainnet Beta</Option>
    </Select>
  );
}

type WalletConnectButtonProps = {
  setActivePage: any;
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
  let history = useHistory();
  const { wallet } = useWallet();
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
      props.setActivePage("/yours");
      history.push("/yours");
    });
  }, [wallet, dispatch, key, setTokenAccountState]);

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

export function Navigation(props: { activePage: string; setActivePage: any }) {
  let history = useHistory();
  const { wallet } = useWallet();
  const { getForge } = useForge();

  function handleClick(e: any) {
    let page: string;
    e.key === "/about" ? (page = "/") : (page = e.key);
    props.setActivePage(e.key);
    getForge();
    history.push(page);
  }

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <Space size="large">
        <Link to="/" onClick={handleClick} key="/">
          <img src={logo} style={{ maxHeight: "32px" }} alt="Uniforge logo" />
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[props.activePage]}
        >
          <Menu.Item key="/yours">Your {LABELS.TOKEN_NAME_PLURAL}</Menu.Item>
          <Menu.Item key="/browse">Browse</Menu.Item>
          <Menu.Item disabled key="/marketplace">
            Marketplace
          </Menu.Item>
          <Menu.Item key="/about">About</Menu.Item>
        </Menu>
      </Space>
      {/* <Col flex="auto"></Col>
      <Search
        placeholder="Search for a public key"
        onSearch={onSearch}
        enterButton
        style={{ width: 500 }}
      /> */}
      <Col flex="auto"></Col>
      <Space>
        {/* <Col>
          <NetworkSelector />
        </Col> */}
        {!wallet.publicKey ? (
          <WalletConnectButton
            style={{
              display: wallet.publicKey ? "none" : "",
            }}
            setActivePage={props.setActivePage}
          />
        ) : (
          <UserSelector />
        )}
      </Space>
    </Header>
  );
}
