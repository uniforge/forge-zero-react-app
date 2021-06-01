import { useState } from "react";
import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Button, message, notification } from "antd";
import {
  Connection,
  Keypair,
  Signer,
  Transaction,
  SystemProgram,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  NATIVE_MINT,
} from "@solana/spl-token";
import { BN } from "@project-serum/anchor";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "./WalletProvider";

notification.config({
  duration: 5,
  rtl: true,
  placement: "topRight",
});

// ToDo put this in a main file and make it an import
const programAddress = new PublicKey(
  "9ZaKmWXHigQFH6FfGTf5WLgkd6GmeMPjy22S3yfEwFeR"
);
const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);

export function ClaimButton() {
  // Get URL params from redux store
  const { params } = useSelector((state: StoreState) => {
    const suffix = state.common.network.explorerClusterSuffix;
    const url = state.common.network.url;

    if (suffix === "localhost") {
      return {
        params:
          "cluster=custom" +
          "&customUrl=" +
          encodeURIComponent("http://127.0.0.1:8899"),
      };
    } else {
      return { params: "cluster=" + suffix };
    }
  });
  console.log("Main of ClaimButton");
  const { wallet, forgeClient } = useWallet();
  const connection = forgeClient.provider.connection;

  async function singleShot() {
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );

    const newAccount = Keypair.generate();
    const transaction = new Transaction();
    const forgeAccount = await forgeClient.state();
    console.log(forgeAccount);
    const artistAddress = forgeAccount.artist.toBase58();

    try {
      // Create the account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: newAccount.publicKey,
          lamports: balanceNeeded,
          space: AccountLayout.span,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      // Fund it
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: newAccount.publicKey,
          lamports: 1e8,
        })
      );
      // Assign the account to the native mint
      transaction.add(
        Token.createInitAccountInstruction(
          TOKEN_PROGRAM_ID,
          NATIVE_MINT,
          newAccount.publicKey,
          wallet.publicKey
        )
      );

      // Create the account on the Forge
      // Get an associated account for the forge
      const accountAddress =
        await forgeClient.account.tokenAccount.associatedAddress(
          wallet.publicKey,
          forgeAddress
        );

      // Create the account on the forge
      const accounts = {
        tokenAccount: accountAddress,
        authority: wallet.publicKey,
        from: newAccount.publicKey,
        artist: artistAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        forge: forgeAddress,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      };

      // @ts-ignore
      const createAcctInst = await forgeClient.state[
        "instruction"
      ].createAccount(new BN(1e8), {
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
      console.log(allSigned);
      let signature = await connection.sendRawTransaction(
        allSigned.serialize()
      );

      const hide = message.loading("Waiting for confirmations", 0);
      await connection
        .confirmTransaction(signature, "singleGossip")
        .then(() => {
          hide();
        });

      const url = "https://explorer.solana.com/tx/" + signature + "?" + params;

      notification.success({
        message: "Created a new token account",
        description: (
          <a href={url} target="_blank">
            View transaction on explorer
          </a>
        ),
      });
    } catch (e) {
      console.warn(e);
      notification.error({ message: "Failed to create a new token account" });
    }
  }

  return (
    <Button type="primary" onClick={singleShot}>
      Create account
    </Button>
  );
}
