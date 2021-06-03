import { useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Tooltip,
  message,
  notification,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN, Program } from "@project-serum/anchor";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "../contexts/WalletProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { useExplorerQueryString, createWrappedNativeAccountTx } from "../utils";
import { FORGE_ID, LABELS } from "../constants";

export function ClaimToken(props: {
  getBalance: any;
  getForge: any;
  balanceSol: number;
  disabled: boolean;
}) {
  const [artistFeeSol, setArtistFeeSol] = useState<number>(LABELS.MIN_FEE);
  const [claiming, setClaiming] = useState<boolean>(false);
  const { wallet, forgeClient } = useWallet();
  const { getTokenAccount } = useTokenAccount();
  const queryString = useExplorerQueryString();

  async function claimToken(
    wallet: Wallet,
    forgeClient: Program,
    queryString: string
  ) {
    setClaiming(true);
    const connection = forgeClient.provider.connection;
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );

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

      // Attempt to claim a token
      const accounts = {
        tokenAccount: accountAddress,
        authority: wallet.publicKey,
        from: newAccount.publicKey,
        artist: artistAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
      };

      // @ts-ignore
      const createAcctInst = await forgeClient.state["instruction"].claimToken(
        new BN(artistFeeLamports),
        {
          accounts,
        }
      );
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
        message: "Claimed a new token",
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
      console.warn(e.toString());
      notification.error({ message: "Failed to claim a new token account" });
    }
    setClaiming(false);
  }

  // return props.disabled ? (
  //   <Button type="primary" disabled>
  //     Claim a token
  //   </Button>
  // ) : (
  //   <Button
  //     type="primary"
  //     onClick={() => {
  //       claimToken(wallet, forgeClient, queryString);
  //     }}
  //     loading={claiming}
  //   >
  //     Claim a token
  //   </Button>
  // );
  return (
    <Input.Group compact>
      <InputNumber
        style={{ width: "30%" }}
        size="large"
        defaultValue={artistFeeSol}
        min={LABELS.MIN_FEE}
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
          claimToken(wallet, forgeClient, queryString);
        }}
      />
      {props.balanceSol > LABELS.MIN_FEE && !props.disabled ? (
        <Button
          type="primary"
          onClick={() => {
            claimToken(wallet, forgeClient, queryString);
          }}
          size="large"
          loading={claiming}
        >
          {LABELS.CLAIM_TOKEN}
        </Button>
      ) : (
        <Tooltip
          title={props.disabled ? LABELS.WALLET_FULL : LABELS.UNFUNDED}
          color="blue"
        >
          <Button
            type="primary"
            disabled
            onClick={() => {
              claimToken(wallet, forgeClient, queryString);
            }}
            size="large"
            loading={claiming}
          >
            {LABELS.CLAIM_TOKEN}
          </Button>
        </Tooltip>
      )}
    </Input.Group>
  );
}
