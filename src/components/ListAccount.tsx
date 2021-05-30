import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useWallet } from "./WalletProvider";
import { Token } from "../types/types";
import { Row, Col } from "antd";
import { BeachCard } from "./BeachCard";

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
    <Row gutter={[{ xs: 0, sm: 16 }, 16]}>
      {account.ownedTokens
        .filter((token) => token.id != 0)
        .map((token) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6}>
              <BeachCard token={token} />
            </Col>
          );
        })}
    </Row>
  );
}

export function ListAccount() {
  const { wallet, forgeClient } = useWallet();
  const [tokenAccount, setTokenAccount] =
    useState<AccountState>(defaultAccountState);

  useEffect(() => {
    forgeClient.account.tokenAccount
      .associated(userAddress, forgeAddress)
      .then((account: any) => {
        setTokenAccount(account);
      });
  }, []);

  return <div>{AccountCard(tokenAccount)}</div>;
}
