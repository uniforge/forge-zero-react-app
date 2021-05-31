import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useWallet } from "../components/WalletProvider";
import { Token } from "../types/types";
import { Breadcrumb, Layout, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { BeachCard } from "../components/BeachCard";

const { Content } = Layout;

const forgeAddress = new PublicKey(
  "91xgw1p2LNkgeLnSq4RgYLGN8Liy7khSxxJPuawBFgJ4"
);
// const userAddress = new PublicKey(
//   "FdG56qcR42XREhtNz8SQPYRdCVeTrexwskqizkY95P1Z"
// );

type AccountState = {
  nTokens: number;
  ownedTokens: [Token];
  authority: PublicKey | null;
  nativeTokenAddress: PublicKey | null;
};

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
              <BeachCard token={token} />
            </Col>
          );
        })}
    </Row>
  ) : (
    "Account does not exist"
  );
}

export function ListAccount(props: { height: number }) {
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
            setTokenAccount(account);
          })
          .catch((error) => {
            setTokenAccount(defaultAccountState);
          });
      }
    }
  }, [forgeClient, pubKey]);

  return (
    <Content className="site-layout" style={{ padding: "0 50px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>List Account</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: props.height - 254 }}
      >
        <div>{AccountCard(tokenAccount)}</div>
      </div>
    </Content>
  );
}
