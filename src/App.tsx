import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider, useWallet } from "./components/WalletProvider";
import { ListAccount } from "./components/ListAccount";
import { Navigation } from "./components/Navigation";
import { Layout, Button } from "antd";
import "./App.css";
import builtOn from "./builton.svg";

const { Header, Content, Footer } = Layout;

function App() {
  const height: number = window.innerHeight;

  return (
    <Provider store={store}>
      <WalletProvider>
        <Layout>
          <Navigation />
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
          >
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: height - 132 }}
            >
              <ListAccount />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <div className="builton" />
            <br />
            <div>Uniforge ©2021</div>
          </Footer>
        </Layout>
      </WalletProvider>
    </Provider>
  );
}

export default App;
