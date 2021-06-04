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

export function HomeView(props: { height: number; setActivePage: any }) {
  props.setActivePage("/");
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
        <Col span={6}>
          <PixelArt
            src={anvilOne}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={anvilTwo}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={hammerOne}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={anvilThree}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={hammerTwo}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={rainbowShadesOne}
            alt={"An rainbow sunglasses NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={hammerThree}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
        <Col span={6}>
          <PixelArt
            src={anvilFour}
            alt={"An anvil NFT"}
            width={48}
            height={48}
            className={"home-pixel"}
          />
        </Col>
      </Row>
      <Title level={3} id={"algo-gen-unique"}>
        Algorithmically Generated and Unique
      </Title>
      <Paragraph className="home-text">
        The {LABELS.TOKEN_NAME} are {numberWithCommas(LABELS.MAX_SUPPLY)}{" "}
        algorithmically generated unique collectible assets. {LABELS.TOKEN_NAME}{" "}
        is located on{" "}
        <a href="https://explorer.solana.com/?cluster=devnet">Solana Devnet</a>{" "}
        enabling anyone with a Solana wallet to claim, collect and trade the
        assets. <Link onClick={() => wallet.connect()}>Connect</Link> a wallet
        to give it try.
      </Paragraph>
      <Title level={3} id={"faqs"}>
        Frequently Asked Questions
      </Title>
      <Title level={4} id={"faqs"}>
        What portion of the fees go to the artist?
      </Title>
      <Paragraph className="home-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lectus eros,
        sagittis a interdum ultricies, ultricies ut tellus. Proin at fermentum
        nisl. Aliquam erat volutpat. Sed vel ex blandit felis placerat rhoncus
        vitae et ligula. Aenean molestie gravida ligula, maximus ultrices velit
        fringilla id. Nam a augue sit amet mauris fermentum convallis. Morbi
        lorem quam, cursus et nibh sed, tempus pharetra nisi. Etiam sagittis
        ultricies dolor sit amet bibendum. Sed pretium, nibh ac semper
        fermentum, lectus sapien scelerisque mi, tristique condimentum felis
        augue ac turpis.
      </Paragraph>
      <Title level={4} id={"faqs"}>
        What will the proceeds be used for?
      </Title>
      <Paragraph className="home-text">
        Aenean nunc risus, porttitor eget justo vitae, porttitor fringilla
        libero. Phasellus gravida accumsan sem. Vestibulum condimentum mollis
        nulla, vitae dignissim mauris volutpat a. Duis ut enim justo. Vivamus
        bibendum lectus nec molestie auctor. Etiam aliquet elementum ex, at
        fringilla turpis varius a. Duis porttitor pulvinar pulvinar. Cras in
        fermentum mauris. Morbi ac nisl dignissim, pretium justo et, faucibus
        augue. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos. Praesent non finibus ante. Donec ornare
        rhoncus dui, vitae cursus neque.
      </Paragraph>
      <Title level={4} id={"faqs"}>
        Are {LABELS.TOKEN_NAME} used for anything beyond their artisic nature?
      </Title>
      <Paragraph className="home-text">
        Duis sed risus ex. Nam dignissim tempor mi, non tempus turpis pretium
        ut. Morbi porta interdum orci, quis blandit sem volutpat placerat. Morbi
        rhoncus risus vel facilisis convallis. Proin tempor, ligula at imperdiet
        tristique, metus eros feugiat arcu, at volutpat nunc ante vel tortor.
        Aliquam nulla justo, eleifend pharetra nisi at, efficitur porta ante.
        Nam vestibulum, diam ut consectetur dapibus, nisi tellus fermentum mi,
        eget vehicula enim nisi eget erat.
      </Paragraph>
      <Paragraph className="home-text">
        Duis sed risus ex. Nam dignissim tempor mi, non tempus turpis pretium
        ut. Morbi porta interdum orci, quis blandit sem volutpat placerat. Morbi
        rhoncus risus vel facilisis convallis. Proin tempor, ligula at imperdiet
        tristique, metus eros feugiat arcu, at volutpat nunc ante vel tortor.
        Aliquam nulla justo, eleifend pharetra nisi at, efficitur porta ante.
        Nam vestibulum, diam ut consectetur dapibus, nisi tellus fermentum mi,
        eget vehicula enim nisi eget erat.
      </Paragraph>
      <Paragraph className="home-text">
        Duis sed risus ex. Nam dignissim tempor mi, non tempus turpis pretium
        ut. Morbi porta interdum orci, quis blandit sem volutpat placerat. Morbi
        rhoncus risus vel facilisis convallis. Proin tempor, ligula at imperdiet
        tristique, metus eros feugiat arcu, at volutpat nunc ante vel tortor.
        Aliquam nulla justo, eleifend pharetra nisi at, efficitur porta ante.
        Nam vestibulum, diam ut consectetur dapibus, nisi tellus fermentum mi,
        eget vehicula enim nisi eget erat.
      </Paragraph>
    </div>
  );
}
