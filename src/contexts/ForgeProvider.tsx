import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { useWallet } from "./WalletProvider";
import { Forge } from "../types";
import { byteToHexString } from "../utils";

export function useForge(): ForgeContextValues {
  const w = useContext(ForgeContext);
  if (!w) {
    throw new Error("Missing forge context");
  }
  // @ts-ignore
  return w;
}

const ForgeContext = React.createContext<null | ForgeContextValues>(null);

type ForgeContextValues = {
  forge: Forge | undefined;
  getForge: any;
};

export function ForgeProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { forgeClient } = useWallet();
  const [forge, setForge] = useState<Forge>();

  useEffect(() => {
    if (!forge) {
      getForge();
    }
  }, []);

  const getForge = async () => {
    // Get the forge account data from network
    const forgeFromNet = await forgeClient.state();

    // Coerce Forge account data into Forge type
    const newForge: Forge = {
      name: String.fromCharCode.apply(null, forgeFromNet.name).trim(),
      symbol: String.fromCharCode.apply(null, forgeFromNet.symbol).trim(),
      contentHash: byteToHexString(forgeFromNet.contentHash),
      authority: forgeFromNet.authority,
      maxSupply: forgeFromNet.maxSupply,
      supplyUnclaimed: forgeFromNet.supplyUnclaimed,
      artist: forgeFromNet.artist,
      minFeeSol: forgeFromNet.minFeeLamports / 1e9,
      secondaryFeeBps: forgeFromNet.secondaryFeeBps.toNumber(),
    };

    // Update the state
    setForge(newForge);
  };

  return (
    <ForgeContext.Provider value={{ forge, getForge }}>
      {props.children}
    </ForgeContext.Provider>
  );
}
