import { useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN, Program } from "@project-serum/anchor";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { useWallet } from "../contexts/WalletProvider";
import { useForge } from "../contexts/ForgeProvider";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { useExplorerQueryString, createWrappedNativeAccountTx } from "../utils";
import { UNIFORGE_PROGRAM_ID, FORGE_ID, LABELS } from "../constants";

notification.config({
  duration: 5,
  rtl: true,
  placement: "topLeft",
});

export function CreateAccount(props: {
  getBalance: any;
  getForge: any;
  balanceSol: number;
  network: string;
  contentProvider: string;
}) {
  const { forge } = useForge();
  const [artistFeeSol, setArtistFeeSol] = useState<number>(
    forge ? forge.minFeeSol : LABELS.MIN_FEE
  );
  const [creating, setCreating] = useState<boolean>(false);
  const { wallet, forgeClient } = useWallet();
  const { getTokenAccount } = useTokenAccount();
  const queryString = useExplorerQueryString();

  async function createAccount(
    wallet: Wallet,
    forgeClient: Program,
    queryString: string
  ) {
    setCreating(true);
    const connection = forgeClient.provider.connection;
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );

    // Initialize an account to pay the artist
    const newAccount = Keypair.generate();
    const forgeAccount = await forgeClient.state();
    const artistAddress = forgeAccount.artist.toBase58();
    const artistFeeLamports = artistFeeSol * LAMPORTS_PER_SOL;
    let signature: string = "";

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

      // Close out the native token account
      transaction.add(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          newAccount.publicKey,
          wallet.publicKey,
          wallet.publicKey,
          [wallet]
        )
      );

      // Attach transaction details
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      transaction.feePayer = wallet.publicKey;
      transaction.sign(...[newAccount]);

      // Here is the part that breaks... This method of signing using the
      // wallet works
      let allSigned = await wallet.signTransaction(transaction);
      signature = await connection.sendRawTransaction(allSigned.serialize());

      const finality = message.loading("Confirming your transaction", 0);
      await connection
        .confirmTransaction(signature, "singleGossip")
        .then(() => {
          finality();
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
    } catch (e) {
      console.warn(e.toString());
      if (signature !== "") {
        const url =
          "https://explorer.solana.com/tx/" + signature + "?" + queryString;
        notification.error({
          message:
            "Failed to claim a new " +
            LABELS.TOKEN_NAME +
            ", check the transaction to see if it succeded.",
          description: (
            <a href={url} target="_blank" rel="noreferrer">
              View transaction on explorer
            </a>
          ),
        });
      } else {
        notification.error({
          message: "Something went wrong claiming a " + LABELS.TOKEN_NAME,
        });
        console.error(signature);
      }
    }
    if (signature !== "") {
      try {
        const contentUpdate = message.loading(
          "Getting your new " + LABELS.TOKEN_NAME,
          0
        );
        await fetch(props.contentProvider, {
          method: "POST",
          body: JSON.stringify({
            network: props.network,
            forgeId: FORGE_ID.toBase58(),
            txSign: signature,
            programId: UNIFORGE_PROGRAM_ID.toBase58(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((resp) => {
          contentUpdate();
          if (!resp.ok) {
            console.warn("Request to update content availability failed");
            notification.warning({
              message:
                "Getting the metadata of your new " +
                LABELS.TOKEN_NAME +
                " failed. Try refreshing the page in a minute.",
            });
          } else {
            notification.success({
              message: "Enjoy your new " + LABELS.TOKEN_NAME,
            });
          }
        });
      } catch (e) {
        console.warn("Request to update content availability failed");
        console.warn(e);
      }
    }

    try {
      // Get the updated the account
      getTokenAccount();
      props.getBalance();
      props.getForge();
    } catch (e) {
      console.warn(e);
    }
    setCreating(false);
  }

  return (
    <Input.Group compact>
      <InputNumber
        style={{ width: "30%" }}
        size="large"
        defaultValue={artistFeeSol}
        min={forge ? forge.minFeeSol : LABELS.MIN_FEE}
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
        parser={(value) => value.replace(/Artist's fee: ???\s?|(,*)/g, "")}
        step={0.1}
        onPressEnter={(event) => {
          createAccount(wallet, forgeClient, queryString);
        }}
      />
      {props.balanceSol > 0 ? (
        <Button
          type="primary"
          onClick={() => {
            createAccount(wallet, forgeClient, queryString);
          }}
          size="large"
          loading={creating}
        >
          {LABELS.CREATE_ACCOUNT}
        </Button>
      ) : (
        <Tooltip title={LABELS.UNFUNDED} color="blue">
          <Button
            type="primary"
            disabled
            onClick={() => {
              createAccount(wallet, forgeClient, queryString);
            }}
            size="large"
          >
            {LABELS.CREATE_ACCOUNT}
          </Button>
        </Tooltip>
      )}
    </Input.Group>
  );
}
