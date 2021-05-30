import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { Connection, ConfirmOptions, PublicKey } from "@solana/web3.js";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { Program, Idl, Provider } from "@project-serum/anchor";
import { State as StoreState } from "../store/reducer";
import MultisigIdl from "../idl";
import forgeZero from "../idl/forge_zero.json";

const programAddress = new PublicKey(
  "9ZaKmWXHigQFH6FfGTf5WLgkd6GmeMPjy22S3yfEwFeR"
);

export function useWallet(): WalletContextValues {
  const w = useContext(WalletContext);
  if (!w) {
    throw new Error("Missing wallet context");
  }
  // @ts-ignore
  return w;
}

const WalletContext = React.createContext<null | WalletContextValues>(null);

type WalletContextValues = {
  wallet: typeof Wallet;
  forgeClient: Program;
};

export function WalletProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { walletProvider, network } = useSelector((state: StoreState) => {
    return {
      walletProvider: state.common.walletProvider,
      network: state.common.network,
    };
  });

  const { wallet, forgeClient } = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    const connection = new Connection(network.url, opts.preflightCommitment);
    const wallet = new Wallet(walletProvider, network.url);
    const provider = new Provider(connection, wallet, opts);

    const forgeClient = new Program(forgeZero as Idl, programAddress, provider);

    return {
      wallet,
      forgeClient,
    };
  }, [walletProvider, network]);

  return (
    <WalletContext.Provider value={{ wallet, forgeClient }}>
      {props.children}
    </WalletContext.Provider>
  );
}
