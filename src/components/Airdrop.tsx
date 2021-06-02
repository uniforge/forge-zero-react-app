import { useCallback } from "react";
import { Button, message, notification } from "antd";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "../contexts/WalletProvider";
import { LABELS } from "../constants";

export function Airdrop(props: { getBalance: any }) {
  const { wallet, connection } = useWallet();

  const airdrop = useCallback(() => {
    if (!wallet.publicKey) {
      // Nothing to see here folks
      return;
    }

    // Make it rain (Make it shine since it's Sol?)
    connection
      .requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL)
      .then((txId) => {
        const hide = message.loading(LABELS.WAITING_FOR_CONF, 0);
        connection.confirmTransaction(txId, "confirmed").then(() => {
          hide();
          notification.success({
            message: LABELS.AIRDROP_SUCCESS,
            type: "success",
          });
          props.getBalance();
        });
      });
  }, [wallet.publicKey, connection, props]);

  return (
    <Button type="primary" onClick={airdrop}>
      {LABELS.AIRDROP_REQUEST}
    </Button>
  );
}
