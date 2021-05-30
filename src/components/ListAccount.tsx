import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "./WalletProvider";

const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);
const userAddress = new PublicKey(
  "FdG56qcR42XREhtNz8SQPYRdCVeTrexwskqizkY95P1Z"
);

export function ListAccount() {
  const { forgeClient } = useWallet();
  const [tokenAccount, setTokenAccount] = useState<any>(undefined);

  const accountData = useEffect(() => {
    forgeClient.account.tokenAccount
      .associated(userAddress, forgeAddress)
      .then((account: any) => {
        setTokenAccount(account.authority.toBase58());
        console.log(account);
      });
  }, []);

  return <div>{tokenAccount}</div>;
}
