import { Typography, Row, Col } from "antd";
import { useWallet } from "../contexts/WalletProvider";
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
  const [balanceSol, setBalanceSol] = useState<number>();

  const getBalance = useCallback(async () => {
    const balance = await connection.getBalance(wallet.publicKey);
    setBalanceSol(balance / 1e9);
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    if (wallet.publicKey) {
      getBalance();
      console.log(balanceSol);
    }
  }, [wallet.publicKey, balanceSol, setBalanceSol, getBalance]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Title level={1}>{LABELS.TOKEN_NAME_PLURAL}</Title>
      <Paragraph className="home-text">
        A collection of {numberWithCommas(LABELS.MAX_SUPPLY)} unique, tradable,
        and composable assets on the <a href="https://solana.com/">Solana</a>{" "}
        blockchain. Each {LABELS.TOKEN_NAME} costs an Artist's fee of{" "}
        {LABELS.SOL_SYM}0.25,{" "}
        <strong>99.996% of which goes directly to the Artist</strong>, instead
        of gas fees, thanks to Solana's high performance and low cost design.
        Just as <a href="https://www.larvalabs.com/cryptopunks">CryptoPunks</a>{" "}
        served to guide digital ownership on Ethereum and the ERC-721 standard,{" "}
        {LABELS.TOKEN_NAME_PLURAL} explore the digital ownership experience on
        Solana.
      </Paragraph>
      <Paragraph className="home-text">
        {LABELS.TOKEN_NAME_PLURAL} are currently on Solana Devnet, enabling
        anyone with a Solana wallet to claim, collect, and trade{" "}
        {LABELS.TOKEN_NAME_PLURAL} for free.{" "}
        <Link onClick={() => wallet.connect()}>Connect</Link> a wallet to try it
        out. We will be launching on Mainnet shortly.
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
        What is a {LABELS.TOKEN_NAME}?
      </Title>
      <Paragraph className="home-text">
        Each {LABELS.TOKEN_NAME} is a digital asset, specifically a non-fungible
        token (NFT), the ownership of which is tracked on the Solana blockchain.
        Visually, a {LABELS.TOKEN_NAME} is a card consisting of a <em>cover</em>{" "}
        and a {LABELS.TOKEN_NAME} <em>beach scene</em> (Try clicking on the
        images above). The cover is generated from the block in which the{" "}
        {LABELS.TOKEN_NAME}
        was created. As a result, the time at which a {LABELS.TOKEN_NAME} is
        claimed affects the cover art, thus engaging the claimer in the creation
        process.
      </Paragraph>
      <Paragraph className="home-text">
        The beach scene is generated off-chain and randomly assigned to a given
        {LABELS.TOKEN_NAME} number. Each scene captures a different time of day
        at the beach and various happenings, some more rare than others. You can
        browse recently created {LABELS.TOKEN_NAME_PLURAL}{" "}
        <Link href="/browse">here</Link>. Be careful venturing too far into the
        water, here be monsters!
      </Paragraph>
      <Title level={3} id={"algo-gen-unique"}>
        How do I get a {LABELS.TOKEN_NAME}?
      </Title>
      <Paragraph className="home-text">
        Claiming a {LABELS.TOKEN_NAME} on Devnet requires a Solana wallet (we
        are currently integrated with{" "}
        <Link onClick={() => wallet.connect()}>Sollet.io</Link>).{" "}
        {LABELS.TOKEN_NAME_PLURAL} on Devnet has a built-in airdrop feature that
        enables you to get Sol to pay the fees. Claiming a{LABELS.TOKEN_NAME} on
        Mainnet requires actual Sol, a minimum of {LABELS.SOL_SYM}0.25, which
        can be acquired from most major exchanges, see a list of exchanges
        <a href="https://www.coingecko.com/en/coins/solana#markets">here</a>.
      </Paragraph>
      <Title level={3} id={"algo-gen-unique"}>
        How much of the fee goes to the Artist?
      </Title>
      <Paragraph className="home-text">
        <strong>
          99.996% of the {LABELS.SOL_SYM}0.25 minimum fee goes to the artist.
        </strong>{" "}
        This is in contrast to other networks where minting fees can easily
        account for 10-50% of the total cost to create the asset.
      </Paragraph>
      <Title level={3} id={"algo-gen-unique"}>
        What is the fee being used for?
      </Title>
      <Paragraph className="home-text">
        Solsets were created by an indie tech firm,{" "}
        <a href="https://uniforge.io">Uniforge</a>, to explore ways of reducing
        the costs of digital asset creation. The fees will be used to scale what
        we have learned in developing Solsets to all creators on Solana.
      </Paragraph>
      <Title level={3} id={"algo-gen-unique"}>
        Can I trade {LABELS.TOKEN_NAME_PLURAL}?
      </Title>
      <Paragraph className="home-text">
        Yes, our Solana program currently supports trading using an interface
        similar to ERC-721. We will be launching a web-based client to that
        portion of the program shortly.
      </Paragraph>
      <Title level={3} id={"algo-gen-unique"}>
        Are {LABELS.TOKEN_NAME_PLURAL} used for anything beyond their artistic
        value?
      </Title>
      <Paragraph className="home-text">
        We are currently working on a game involving the{" "}
        {LABELS.TOKEN_NAME_PLURAL} that will leverage composability and Solana's
        high transaction throughput. But, the wonderful thing about blockchain
        is that anyone can build an application that leverages{" "}
        {LABELS.TOKEN_NAME_PLURAL} in some way unimaginable to their original
        creators.
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
