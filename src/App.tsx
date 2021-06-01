import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider } from "./components/WalletProvider";
import { Home } from "./views/Home";
import { ListAccount } from "./views/ListAccount";
import { Navigation } from "./components/Navigation";
import { Layout } from "antd";
import "./App.css";

const { Footer } = Layout;

function App() {
  const height: number = window.innerHeight;

  return (
    <Router>
      <Provider store={store}>
        <WalletProvider>
          <Layout>
            <Navigation />
            <Switch>
              <Route
                exact
                path="/"
                component={() => <Home height={height} />}
              ></Route>
              <Route
                path="/listAccount/:pubKey"
                component={() => <ListAccount height={height} />}
              />
            </Switch>
            <Footer style={{ textAlign: "center" }}>
              <div className="builton" />
            </Footer>
          </Layout>
        </WalletProvider>
      </Provider>
    </Router>
  );
}

export default App;
