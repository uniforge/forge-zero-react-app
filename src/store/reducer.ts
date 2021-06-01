import { PublicKey } from "@solana/web3.js";
import { AccountState } from "../types";

export type Action = {
  type: ActionType;
  item: any;
};

export enum ActionType {
  CommonTriggerShutdown,
  CommonDidShutdown,
  CommonWalletDidConnect,
  CommonWalletDidDisconnect,
  CommonWalletSetProvider,
  CommonSetNetwork,
  CommonSetBalance,
}

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  let newState = {
    common: { ...state.common },
  };
  switch (action.type) {
    case ActionType.CommonWalletSetProvider:
      newState.common.walletProvider = action.item.walletProvider;
      return newState;
    case ActionType.CommonWalletDidConnect:
      newState.common.isWalletConnected = true;
      return newState;
    case ActionType.CommonWalletDidDisconnect:
      newState.common.isWalletConnected = false;
      newState.common.walletDetails.balance = null;
      return newState;
    case ActionType.CommonSetNetwork:
      if (newState.common.network.label !== action.item.network.label) {
        newState.common.network = action.item.network;
      }
      return newState;
    default:
      return newState;
    case ActionType.CommonSetBalance:
      newState.common.walletDetails.balance = action.item.newBalance;
      return newState;
  }
}

export type State = {
  common: CommonState;
};

export type WalletDetails = {
  balance: number | null;
  tokenAccount: AccountState | null;
};

export type CommonState = {
  walletProvider?: string;
  isWalletConnected: boolean;
  network: Network;
  walletDetails: WalletDetails;
};

export const networks: Networks = {
  mainnet: {
    // Cluster.
    label: "Mainnet Beta",
    url: "https://solana-api.projectserum.com",
    explorerClusterSuffix: "",
    forgeProgramId: new PublicKey(
      "ForgeHXbqRF4ssv7QVn9NHkQx4hqUDXrWaJ9EGywjTqv"
    ),
    forgeUpgradeAuthority: new PublicKey(
      "8czvGZQcUDrUop7yw6vybroVu7jrtGsEshDCc4nbUScf"
    ),
  },
  devnet: {
    // Cluster.
    label: "Devnet",
    url: "https://devnet.solana.com",
    explorerClusterSuffix: "devnet",
    forgeProgramId: new PublicKey(
      "ForgeHXbqRF4ssv7QVn9NHkQx4hqUDXrWaJ9EGywjTqv"
    ),
  },
  // Fill in with your local cluster addresses.
  localhost: {
    // Cluster.
    label: "Localhost",
    url: "http://localhost:8899",
    explorerClusterSuffix: "localhost",
    forgeProgramId: new PublicKey(
      "ForgeHXbqRF4ssv7QVn9NHkQx4hqUDXrWaJ9EGywjTqv"
    ),
  },
};

export const initialState: State = {
  common: {
    isWalletConnected: false,
    walletProvider: "https://www.sollet.io",
    network: networks.localhost,
    walletDetails: { balance: null, tokenAccount: null },
  },
};

type Networks = { [label: string]: Network };

export type Network = {
  // Cluster.
  label: string;
  url: string;
  explorerClusterSuffix: string;
  forgeProgramId: PublicKey;
  forgeUpgradeAuthority?: PublicKey;
};
