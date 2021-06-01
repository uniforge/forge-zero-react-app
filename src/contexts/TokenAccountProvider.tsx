import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { useWallet } from "./WalletProvider";
import { AccountState } from "../types";
import { FORGE_ID } from "../constants";

export function useTokenAccount(): TokenAccountContextValues {
  const w = useContext(TokenAccountContext);
  if (!w) {
    throw new Error("Missing forge context");
  }
  // @ts-ignore
  return w;
}

const TokenAccountContext =
  React.createContext<null | TokenAccountContextValues>(null);

type TokenAccountContextValues = {
  tokenAccount?: AccountState;
  getTokenAccount: any;
};

export function TokenAccountProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { wallet, forgeClient } = useWallet();
  const [tokenAccount, setTokenAccount] = useState<AccountState>();

  useEffect(() => {
    if (wallet.publicKey) {
      if (!tokenAccount) {
        getTokenAccount();
      }
    }
  }, [wallet.publicKey, tokenAccount]);

  const getTokenAccount = async () => {
    const tokenAccountFromNet =
      await forgeClient.account.tokenAccount.associated(
        wallet.publicKey,
        FORGE_ID
      );

    console.log(tokenAccountFromNet);
    setTokenAccount(tokenAccountFromNet);
  };

  return (
    <TokenAccountContext.Provider value={{ tokenAccount, getTokenAccount }}>
      {props.children}
    </TokenAccountContext.Provider>
  );
}
