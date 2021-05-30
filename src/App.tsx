import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider, useWallet } from "./components/WalletProvider";
import { ListAccount } from "./components/ListAccount";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <WalletProvider>
        <div className="App">
          <header className="App-header">
            <ListAccount />
          </header>
        </div>
      </WalletProvider>
    </Provider>
  );
}

export default App;
