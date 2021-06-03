import { Typography, Row, Col } from "antd";
import { useWallet } from "../contexts/WalletProvider";
import { useForge } from "../contexts/ForgeProvider";
import { useCallback, useEffect, useState } from "react";
import { LABELS } from "../constants";
import { numberWithCommas } from "../utils";
import { PixelArt } from "../components/PixelArt";

import anvilOne from "../images/nft_anvil_1.png";
import anvilTwo from "../images/nft_anvil_2.png";
import anvilThree from "../images/nft_anvil_3.png";
import anvilFour from "../images/nft_anvil_4.png";
import hammerOne from "../images/nft_hammer_1.png";
import hammerTwo from "../images/nft_hammer_2.png";
import hammerThree from "../images/nft_hammer_3.png";
import rainbowShadesOne from "../images/nft_rainbowShades_1.png";

const { Title, Link, Paragraph } = Typography;

export function HomeView(props: { height: number }) {
  const { wallet, connection } = useWallet();
  const { getForge } = useForge();
  const [balanceSol, setBalanceSol] = useState<number>();

  const getBalance = useCallback(async () => {
    const balance = await connection.getBalance(wallet.publicKey);
    setBalanceSol(balance / 1e9);
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    if (wallet.publicKey) {
      getBalance();
    }
  }, [wallet.publicKey, setBalanceSol, getBalance]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Title level={1}>{LABELS.TOKEN_NAME}</Title>
      <Paragraph className="home-text">
        A collection of {numberWithCommas(LABELS.MAX_SUPPLY)} unique collectible
        and tradeable assets on the <a href="https://solana.com/">Solana</a>{" "}
        blockchain. {LABELS.TOKEN_NAME} serves as a test bed for a more general
        solution to the creation and management of digital assets. Using
        Uniforge's technology, any creator will be able to create a collection
        of works, set rights on each work, and issue prints of the work.
      </Paragraph>
      <Row gutter={[32, 32]} style={{ paddingBottom: "2em" }}>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={anvilOne}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={anvilTwo}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={hammerOne}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={anvilThree}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={hammerTwo}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={rainbowShadesOne}
            alt={"An rainbow sunglasses NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={hammerThree}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
        <Col className="home-pixel" span={6}>
          <PixelArt
            src={anvilFour}
            alt={"An anvil NFT"}
            width={48}
            height={48}
          />
        </Col>
      </Row>
      <Paragraph className="home-text">
        The {LABELS.TOKEN_NAME} are {numberWithCommas(LABELS.MAX_SUPPLY)}{" "}
        algorithmically generated unique collectible assets. {LABELS.TOKEN_NAME}{" "}
        is located on{" "}
        <a href="https://explorer.solana.com/?cluster=devnet">Solana Devnet</a>{" "}
        enabling anyone with a Solana wallet to claim, collect and trade the
        assets. <Link onClick={() => wallet.connect()}>Connect</Link> a wallet
        to give it try.
      </Paragraph>
    </div>
  );
}
