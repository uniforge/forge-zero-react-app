import { BN } from "@project-serum/anchor";

export type Token = {
  id: number;
  forSale: boolean;
  minBidLamports: BN;
};
