import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "./WalletProvider";

const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);
const userAddress = new PublicKey(
  "FdG56qcR42XREhtNz8SQPYRdCVeTrexwskqizkY95P1Z"
);

function Token(id: number, forSale: boolean, minBid: number) {
  if (forSale) {
    return "Token " + id + " is for sale with a minimum bid of ◎" + minBid;
  } else {
    return "Token " + id + " is not for sale.";
  }
}

export function ListAccount() {
  const { forgeClient } = useWallet();
  const [tokenAccount, setTokenAccount] = useState<any>(undefined);
  const [tokenState, setTokenState] = useState<any>(undefined);

  const accountData = useEffect(() => {
    forgeClient.account.tokenAccount
      .associated(userAddress, forgeAddress)
      .then((account: any) => {
        setTokenAccount(account.authority.toBase58());
        const aToken = account.ownedTokens[2];
        const minBidSol = aToken.minBidLamports / 1e9;
        setTokenState(Token(aToken.id, aToken.forSale, minBidSol));
        console.log(account);
      });
  }, []);

  return (
    <div>
      Wallet: {tokenAccount}
      <ol>
        <li>{tokenState}</li>
      </ol>
    </div>
  );
}
