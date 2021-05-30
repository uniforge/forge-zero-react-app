import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useWallet } from "./WalletProvider";
import { Token } from "../types/types";

const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);
const userAddress = new PublicKey(
  "FdG56qcR42XREhtNz8SQPYRdCVeTrexwskqizkY95P1Z"
);

function tokenFormatter(token: Token) {
  if (token.forSale) {
    return (
      "Token " +
      token.id +
      " is for sale with a minimum bid of ◎" +
      token.minBidLamports.toNumber() / 1e9
    );
  } else {
    return "Token " + token.id + " is not for sale.";
  }
}

type ListAccountProps = {
  account: PublicKey;
};

type AccountState = {
  nTokens: number;
  ownedTokens: [Token];
  authority: PublicKey;
  nativeTokenAddress: PublicKey;
};

const defaultAccountState: AccountState = {
  nTokens: 0,
  ownedTokens: [{ id: 0, forSale: false, minBidLamports: new BN(0) }],
  authority: new PublicKey("91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"),
  nativeTokenAddress: new PublicKey(
    "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
  ),
};

function AccountCard(account: AccountState) {
  return (
    <div>
      <h3>{account.authority.toBase58()}</h3>
      <ol>
        {account.ownedTokens.map((token) => {
          if (token.id != 0) {
            return <li>{tokenFormatter(token)}</li>;
          }
        })}
      </ol>
    </div>
  );
}

export function ListAccount() {
  const { forgeClient } = useWallet();
  const [tokenAccount, setTokenAccount] =
    useState<AccountState>(defaultAccountState);
  const [tokenAccountAddr, settokenAccountAddr] = useState<any>(undefined);
  const [tokenState, setTokenState] = useState<any>(undefined);

  useEffect(() => {
    forgeClient.account.tokenAccount
      .associated(userAddress, forgeAddress)
      .then((account: any) => {
        setTokenAccount(account);
        settokenAccountAddr(account.authority.toBase58());
        const aToken = account.ownedTokens[2];
        const minBidSol = aToken.minBidLamports / 1e9;
        setTokenState(tokenFormatter(aToken));
      });
  }, []);

  return <div>{AccountCard(tokenAccount)}</div>;
}
