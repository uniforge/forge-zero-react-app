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
  CLAIM_TOKEN: "Claim a ForgeZero",
  CREATE_ACCOUNT: "Create and claim",
  MAX_SUPPLY: 8192,
  MAX_TOKENS_PER_WALLET: 16,
  MIN_FEE: 0.5,
  NOT_FOR_SALE: "-",
  SOL_SYM: "◎",
  SOL_CHARS: "Sol",
  TOKEN_NAME: "ForgeZero",
  UNFUNDED:
    "This action requires at least ◎0.5, request some above if you are on Devnet. If you are on Mainnet, please connect a wallet that contains Sol.",
  WALLET_FULL: "Your wallet is full, try selling some to open up new slots.",
  WAITING_FOR_CONF: "Waiting for confirmation",
};
