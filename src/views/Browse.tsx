import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useWallet } from "../contexts/WalletProvider";
import { AccountState } from "../types";
import { Typography, Layout, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { BeachCard } from "../components/BeachCard";

const { Paragraph } = Typography;

const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);
// const userAddress = new PublicKey(
//   "FdG56qcR42XREhtNz8SQPYRdCVeTrexwskqizkY95P1Z"
// );

const defaultAccountState: AccountState = {
  nTokens: 0,
  ownedTokens: [{ id: 0, forSale: false, minBidLamports: new BN(0) }],
  authority: null,
  nativeTokenAddress: null,
};

function AccountCard(account: AccountState) {
  return account.authority !== null ? (
    <Row gutter={[{ xs: 0, sm: 16 }, 16]}>
      {account.ownedTokens
        .filter((token) => token.id !== 0)
        .map((token, index) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={index}>
              {/* <BeachCard token={token} /> */}
            </Col>
          );
        })}
    </Row>
  ) : (
    <Paragraph className="home-text">
      It looks like we are still working on this feature. Check back soon!
    </Paragraph>
  );
}

export function BrowseView(props: { height: number }) {
  const { forgeClient } = useWallet();
  let { pubKey } = useParams<{ pubKey: string }>();
  const [tokenAccount, setTokenAccount] =
    useState<AccountState>(defaultAccountState);

  useEffect(() => {
    let address: PublicKey | null = null;
    try {
      address = new PublicKey(pubKey);
    } catch {
      address = null;
    } finally {
      if (address !== null) {
        forgeClient.account.tokenAccount
          .associated(address, forgeAddress)
          .then((account: any) => {
            console.log("Doing something");
            setTokenAccount(account);
          })
          .catch(() => {
            setTokenAccount(defaultAccountState);
          });
      }
    }
  }, [forgeClient, pubKey]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <div>{AccountCard(tokenAccount)}</div>
    </div>
  );
}
