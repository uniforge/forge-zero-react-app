import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider } from "./contexts/WalletProvider";
import { ForgeProvider } from "./contexts/ForgeProvider";
import { TokenAccountProvider } from "./contexts/TokenAccountProvider";
import { HomeView } from "./views/HomeView";
import { YoursView } from "./views/YoursView";
import { BrowseView } from "./views/BrowseView";
import { ListAccountView } from "./views/ListAccountView";
import { TokenView } from "./views/TokenView";
import { Navigation } from "./components/Navigation";
import { Layout } from "antd";
import "./App.css";
import { useState, useLayoutEffect } from "react";
import { TechView } from "./views/TechView";

const { Content, Footer } = Layout;

function App() {
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [activePage, setActivePage] = useState<string>("/");

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
                <Navigation
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
                <Content className="site-layout" style={{ padding: "0 0px" }}>
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={() => (
                        <HomeView
                          height={height}
                          setActivePage={setActivePage}
                        />
                      )}
                    ></Route>
                    <Route
                      path="/yours"
                      component={() => (
                        <YoursView
                          height={height}
                          setActivePage={setActivePage}
                        />
                      )}
                    />
                    <Route
                      path="/browse"
                      component={() => <BrowseView height={height} />}
                    />
                    <Route
                      path="/listAccount/:publickey"
                      component={() => <ListAccountView height={height} />}
                    />
                    <Route
                      path="/tokenDetail/:tokenId"
                      component={() => (
                        <TokenView
                          height={height}
                          setActivePage={setActivePage}
                        />
                      )}
                    />
                    <Route
                      path="/tech"
                      component={() => <TechView height={height} />}
                    />
                    <Route
                      path="/marketplace"
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
