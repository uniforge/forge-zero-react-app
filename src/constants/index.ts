import { PublicKey } from "@solana/web3.js";

export const UNIFORGE_PROGRAM_ID = new PublicKey(
  "9ZaKmWXHigQFH6FfGTf5WLgkd6GmeMPjy22S3yfEwFeR"
);
export const FORGE_ID = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);

export const LABELS = {
  AIRDROP_REQUEST: "Request Sol",
  AIRDROP_SUCCESS: "Airdrop successful",
  CREATE_ACCOUNT: "Create and claim",
  MIN_FEE: 0.5,
  SOL_SYM: "◎",
  SOL_CHARS: "Sol",
  TOKEN_NAME: "Token",
  WAITING_FOR_CONF: "Waiting for confirmation",
};
