import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Row, Button, notification } from "antd";
import {
  Connection,
  Keypair,
  Signer,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  AccountLayout,
  NATIVE_MINT,
} from "@solana/spl-token";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "./WalletProvider";

notification.config({
  duration: 3,
  rtl: true,
  placement: "topRight",
});

export function ClaimButton() {
  const { params } = useSelector((state: StoreState) => {
    const suffix = state.common.network.explorerClusterSuffix;
    const url = state.common.network.url;

    if (suffix === "localhost") {
      return {
        params:
          "cluster=" +
          suffix +
          "&customUrl=" +
          encodeURIComponent("http://127.0.0.1:8899"),
      };
    } else {
      return { params: "cluster=" + suffix };
    }
  });
  const { wallet, forgeClient } = useWallet();
  const selectedWallet = wallet;
  const connection = forgeClient.provider.connection;

  function addLog(log: string) {
    console.log(log);
  }

  async function claimToken() {
    // Something is broken with the combination of the sol-wallet-adapter
    // and the Token.createWrappedNativeAccount method. I think the adapter
    // is not using uint8 arrays and that is causing an issue.

    // Cleaner but broken code:
    // await Token.createWrappedNativeAccount(
    //   connection,
    //   TOKEN_PROGRAM_ID,
    //   selectedWallet.publicKey,
    //   selectedWallet,
    //   1e8
    // );

    // Work around needed for now. Manually create all the transactions
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );

    const newAccount = Keypair.generate();
    const transaction = new Transaction();

    try {
      // Create the account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: selectedWallet.publicKey,
          newAccountPubkey: newAccount.publicKey,
          lamports: balanceNeeded,
          space: AccountLayout.span,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      // Fund it
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: selectedWallet.publicKey,
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
          selectedWallet.publicKey
        )
      );

      // Attach transaction details
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = selectedWallet.publicKey;
      transaction.sign(...[newAccount]);

      // Here is the part that breaks... This method of signing using the
      // wallet works
      let allSigned = await selectedWallet.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(
        allSigned.serialize()
      );
      await connection.confirmTransaction(signature, "singleGossip");
      console.log(allSigned);
      const url = "https://explorer.solana.com/tx/" + signature + "?" + params;
      console.log(url);

      notification.success({ message: "Created a new token account" });
    } catch (e) {
      console.warn(e);
      notification.error({ message: "Failed to create a new token account" });
    }
  }

  return (
    <Row>
      <Button type="primary" onClick={claimToken}>
        Create account
      </Button>
    </Row>
  );
}
