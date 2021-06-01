import { useCallback } from "react";
import { Button, Typography, message, notification } from "antd";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "../contexts/WalletProvider";
import { LABELS } from "../constants";

const { Title, Text } = Typography;

export function Airdrop(props: { getBalance: any }) {
  const { wallet, connection } = useWallet();

  const airdrop = useCallback(() => {
    if (!wallet.publicKey) {
      return;
    }

    // let signature = await connection.sendRawTransaction(
    //   allSigned.serialize()
    // );

    // const hide = message.loading("Waiting for confirmations", 0);
    // await connection
    //   .confirmTransaction(signature, "singleGossip")
    //   .then(() => {
    //     hide();
    //   });

    let req = connection
      .requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL)
      .then((txId) => {
        const hide = message.loading(LABELS.WAITING_FOR_CONF, 0);
        connection.confirmTransaction(txId, "singleGossip").then(() => {
          hide();
          notification.success({
            message: LABELS.AIRDROP_SUCCESS,
            type: "success",
          });
          props.getBalance();
        });
      });
  }, [wallet.publicKey, connection]);

  return (
    <Button type="primary" onClick={airdrop}>
      {LABELS.AIRDROP_REQUEST}
    </Button>
  );
}
