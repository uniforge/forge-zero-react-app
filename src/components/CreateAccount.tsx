import { useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Typography,
  message,
  notification,
} from "antd";
import {
  Keypair,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  NATIVE_MINT,
} from "@solana/spl-token";
import { BN, Program } from "@project-serum/anchor";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { useExplorerQueryString, createWrappedNativeAccountTx } from "../utils";
import { FORGE_ID, LABELS } from "../constants";

const { Text } = Typography;

notification.config({
  duration: 5,
  rtl: true,
  placement: "topLeft",
});

export function CreateAccount(props: { getBalance: any; getForge: any }) {
  const [artistFeeSol, setArtistFeeSol] = useState<number>(LABELS.MIN_FEE);
  const { wallet, forgeClient } = useWallet();
  const { getTokenAccount } = useTokenAccount();
  const queryString = useExplorerQueryString();

  async function createAccount(
    wallet: Wallet,
    forgeClient: Program,
    queryString: string
  ) {
    const connection = forgeClient.provider.connection;
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );

    // Initialize an account to pay the artist
    const newAccount = Keypair.generate();
    const forgeAccount = await forgeClient.state();
    const artistAddress = forgeAccount.artist.toBase58();
    const artistFeeLamports = artistFeeSol * LAMPORTS_PER_SOL;

    try {
      // Create the base transaction contents
      const transaction = createWrappedNativeAccountTx(
        wallet,
        newAccount,
        balanceNeeded,
        artistFeeLamports
      );

      // Create the account on the Forge
      // Get an associated account for the forge
      const accountAddress =
        await forgeClient.account.tokenAccount.associatedAddress(
          wallet.publicKey,
          FORGE_ID
        );

      // Create the account on the forge
      const accounts = {
        tokenAccount: accountAddress,
        authority: wallet.publicKey,
        from: newAccount.publicKey,
        artist: artistAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        forge: FORGE_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      };

      // @ts-ignore
      const createAcctInst = await forgeClient.state[
        "instruction"
      ].createAccount(new BN(artistFeeLamports), {
        accounts,
      });
      transaction.add(createAcctInst);

      // Attach transaction details
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;
      transaction.sign(...[newAccount]);

      // Here is the part that breaks... This method of signing using the
      // wallet works
      let allSigned = await wallet.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(
        allSigned.serialize()
      );

      const hide = message.loading("Waiting for confirmations", 0);
      await connection
        .confirmTransaction(signature, "singleGossip")
        .then(() => {
          hide();
        });

      const url =
        "https://explorer.solana.com/tx/" + signature + "?" + queryString;

      notification.success({
        message: "Created a new token account",
        description: (
          <a href={url} target="_blank" rel="noreferrer">
            View transaction on explorer
          </a>
        ),
      });

      // Get the updated the account
      getTokenAccount();
      props.getBalance();
      props.getForge();
    } catch (e) {
      console.warn(e);
      notification.error({ message: "Failed to create a new token account" });
    }
  }

  return (
    <Input.Group compact>
      <InputNumber
        style={{ width: "20%" }}
        defaultValue={artistFeeSol}
        min={artistFeeSol}
        formatter={(value) => {
          if (value && !isNaN(value)) {
            setArtistFeeSol(value);
          }
          return (
            "Artist's fee: " +
            LABELS.SOL_SYM +
            ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }}
        // @ts-ignore
        parser={(value) => value.replace(/Artist's fee: ◎\s?|(,*)/g, "")}
        step={0.1}
        onPressEnter={(event) => {
          createAccount(wallet, forgeClient, queryString);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          createAccount(wallet, forgeClient, queryString);
        }}
      >
        {LABELS.CREATE_ACCOUNT}
      </Button>
    </Input.Group>
  );
}
