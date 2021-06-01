import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export type Forge = {
  name: string;
  symbol: string;
  contentHash: string;
  authority: PublicKey;
  maxSupply: number;
  supplyUnclaimed: number;
  artist: PublicKey;
  minFeeSol: number;
  secondaryFeeBps: number;
};

export type Token = {
  id: number;
  forSale: boolean;
  minBidLamports: BN;
};

export type AccountState = {
  nTokens: number;
  ownedTokens: [Token];
  authority: PublicKey | null;
  nativeTokenAddress: PublicKey | null;
};
