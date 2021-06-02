import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useState,
  useEffect,
  useContext,
  useCallback,
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
  setTokenAccountState: any;
};

export function TokenAccountProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { wallet, forgeClient } = useWallet();
  const [tokenAccountState, setTokenAccountState] = useState<{
    has: boolean;
    account: AccountState | undefined;
  }>({ has: true, account: undefined });

  const getTokenAccount = useCallback(async () => {
    // console.log("Getting state of token account");
    try {
      const tokenAccountFromNet =
        await forgeClient.account.tokenAccount.associated(
          wallet.publicKey,
          FORGE_ID
        );

      setTokenAccountState({ has: true, account: tokenAccountFromNet });
    } catch (e) {
      // This user has not created a token account
      setTokenAccountState({ has: false, account: undefined });
    }
  }, [forgeClient, wallet.publicKey, setTokenAccountState]);

  useEffect(() => {
    if (wallet.publicKey) {
      if (tokenAccountState.has && !tokenAccountState.account) {
        getTokenAccount();
      }
    }
  }, [wallet.publicKey, tokenAccountState, getTokenAccount]);

  return (
    <TokenAccountContext.Provider
      value={{
        tokenAccount: tokenAccountState.account,
        getTokenAccount,
        setTokenAccountState,
      }}
    >
      {props.children}
    </TokenAccountContext.Provider>
  );
}
