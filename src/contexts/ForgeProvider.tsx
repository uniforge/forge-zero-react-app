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
import { notification } from "antd";
import { Forge } from "../types";
import { byteToHexString } from "../utils";
import { LABELS } from "../constants";

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

  const getForge = useCallback(async () => {
    // Get the forge account data from network
    try {
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
    } catch {
      console.error("Unable to get the Forge state");
      notification.error({
        message: "Unable to get the state of " + LABELS.TOKEN_NAME,
        description:
          "This can happen if you are trying to connect to a non-existent Forge",
      });
    }
  }, [forgeClient, setForge]);

  useEffect(() => {
    if (!forge) {
      getForge();
    }
  }, [forge, getForge]);

  return (
    <ForgeContext.Provider value={{ forge, getForge }}>
      {props.children}
    </ForgeContext.Provider>
  );
}
