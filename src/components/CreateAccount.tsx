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
import { BN, Program } from "@project-serum/anchor";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { FORGE_ID } from "../constants";

notification.config({
  duration: 5,
  rtl: true,
  placement: "topRight",
});

export function CreateAccount(props: { getBalance: any }) {
  console.log("ClaimButton main body");
  // Get URL params from redux store
  const { params } = useSelector((state: StoreState) => {
    const suffix = state.common.network.explorerClusterSuffix;
    const url = state.common.network.url;
    console.log("ClaimButton - useSelector");

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

  const { wallet, forgeClient } = useWallet();
  const { getTokenAccount } = useTokenAccount();

  async function createAccount(
    wallet: Wallet,
    forgeClient: Program,
    params: string
  ) {
    console.log("Main of account creation");
    const connection = forgeClient.provider.connection;
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

      // Get the updated the account
      getTokenAccount();
      props.getBalance();
    } catch (e) {
      console.warn(e);
      notification.error({ message: "Failed to create a new token account" });
    }
  }

  return (
    <Button
      type="primary"
      onClick={() => {
        createAccount(wallet, forgeClient, params);
      }}
    >
      Create account
    </Button>
  );
}
