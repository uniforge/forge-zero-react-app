import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider } from "./contexts/WalletProvider";
import { ForgeProvider } from "./contexts/ForgeProvider";
import { TokenAccountProvider } from "./contexts/TokenAccountProvider";
import { HomeView } from "./views/Home";
import { YoursView } from "./views/Yours";
import { BrowseView } from "./views/Browse";
import { ListAccountView } from "./views/ListAccount";
import { Navigation } from "./components/Navigation";
import { Layout } from "antd";
import "./App.css";
import { useState, useLayoutEffect } from "react";

const { Content, Footer } = Layout;

function App() {
  const [height, setHeight] = useState<number>(window.innerHeight);

  useLayoutEffect(() => {
    function handleResize() {
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <WalletProvider>
          <ForgeProvider>
            <TokenAccountProvider>
              <Layout>
                <Navigation />
                <Content className="site-layout" style={{ padding: "0 0px" }}>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={() => <HomeView height={height} />}
                    ></Route>
                    <Route
                      path="/yours"
                      component={() => <YoursView height={height} />}
                    />
                    <Route
                      path="/browse"
                      component={() => <BrowseView height={height} />}
                    />
                  </Switch>
                </Content>
                <Footer
                  style={{
                    textAlign: "center",
                    backgroundColor: "rgb(0,21,36)",
                  }}
                >
                  <div className="builton" />
                </Footer>
              </Layout>
            </TokenAccountProvider>
          </ForgeProvider>
        </WalletProvider>
      </Provider>
    </Router>
  );
}

export default App;
