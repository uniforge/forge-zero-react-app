import { PublicKey } from "@solana/web3.js";

export const UNIFORGE_PROGRAM_ID = new PublicKey(
  "DAAEUH92w79oLQtgwmHinJMXec3w1zHdEyTbTJRQ9juc"
);
export const FORGE_ID = new PublicKey(
  "3Pw7jbQRoZsA6WbMuF2bHGWvJxaceoWoWA9zvgZczPg6"
);

export const LABELS = {
  AIRDROP_REQUEST: "Request Sol",
  AIRDROP_SUCCESS: "Airdrop successful",
  CLAIM_TOKEN: "Claim a Solset",
  CREATE_ACCOUNT: "Claim a Solset",
  MAX_SUPPLY: 8192,
  MAX_TOKENS_PER_WALLET: 16,
  MIN_FEE: 0.25,
  NOT_FOR_SALE: "-",
  SOL_SYM: "◎",
  SOL_CHARS: "Sol",
  TOKEN_NAME: "Solset",
  TOKEN_NAME_PLURAL: "Solsets",
  UNFUNDED:
    "This action requires at least ◎0.5, request some above if you are on Devnet. If you are on Mainnet, please connect a wallet that contains Sol.",
  WALLET_FULL: "Your wallet is full, try selling some to open up new slots.",
  WAITING_FOR_CONF: "Waiting for confirmation",
};
