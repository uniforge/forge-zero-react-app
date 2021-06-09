import { Typography, Tooltip } from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

const { Title, Text, Link, Paragraph } = Typography;

export function TechView(props: { height: number; setActivePage?: any }) {
  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Title level={1}>Technical details</Title>
      <Title level={2}>On-chain data</Title>
      <Paragraph className="tech-text">
        Uniforge recognizes that each and every NFT project is unique, but has
        also identified some common patterns across projects. Looking at Solsets
        pecifically, each token (Solset) is part of a collection (Solsets), and
        the total number of tokens has a maximum supply. Additionally, creating
        a token and subsequent trading may require payment to the original
        artist; in the case of Solsets, creation requires ◎0.25 and secondary
        trading is subject to a fee of 5%. All of these constraints are set when
        a new collection is created on-chain.
      </Paragraph>
      <Title level={2}>Forge</Title>
      <Paragraph className="tech-text">
        In Uniforge lingo, a collection is created by a <em>Forge</em> and thus
        all the constraints are set in this account. While our React App
        provides a user-friendly of viewing the state of the forge, anyone can
        check it themselves using bare Solana tooling. Below, we detail how to
        do that yourself.
      </Paragraph>
      <Title level={3}>Schema</Title>
      <Paragraph className="tech-text">
        The schema for a <em>Forge</em> is shown below and enables anyone to
        unpack the on-chain data into a valid <em>Forge</em> object.{" "}
        <strong>Note, the first 8-bytes</strong> of all of our on-chain accounts
        is a discriminator to determine the account type.
      </Paragraph>
      <SyntaxHighlighter language="rust" style={github}>
        {`pub struct Forge {
    pub name: [u8; 64],
    pub symbol: [u8; 16],
    pub content_hash: [u8; 32],
    pub authority: Pubkey,
    pub max_supply: u16,
    pub supply_unclaimed: u16,
    pub artist: Pubkey,
    pub min_fee_lamports: u64,
    pub secondary_fee_bps: u64,
}`}
      </SyntaxHighlighter>

      <Paragraph className="tech-text">
        Let's go through the exercise of retrieving and unpacking a{" "}
        <em>Forge</em>. The public key for the program running Devnet Solsets is{" "}
        <Text code>ForgeZwShFswzeB2FDjRfbGQehFZRpAfQFoH65YG9WZT</Text>. When the
        Solsets collection was created, an account associated with this address
        was initialized for the project. This address is generated
        deterministically so that the program consistently uses the same state
        and anyone can find it (See{" "}
        <Link href="https://github.com/project-serum/anchor/blob/a8fd1e0abb9aac6b4185adce04968286f8a693f2/ts/src/utils/pubkey.ts#L48">
          here
        </Link>{" "}
        for details). For Solsets, this address is{" "}
        <Text code>7d6eEgkx3AKLEWPFm6D7PPFvMEhwLaKihqUdgcFmGNUA</Text>.
      </Paragraph>
      <Paragraph className="tech-text">
        Retrieve the state of that account,
      </Paragraph>
      <Title level={4}>Request:</Title>
      <SyntaxHighlighter language="bash" style={github}>
        {`curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      "7d6eEgkx3AKLEWPFm6D7PPFvMEhwLaKihqUdgcFmGNUA",
      {
        "encoding": "jsonParsed"
      }
    ]
  }
'`}
      </SyntaxHighlighter>
      <Title level={4}>
        Response{" "}
        <Text type="secondary">
          (This state changes as Solsets are claimed so your response will be
          different)
        </Text>
        :
      </Title>
      <SyntaxHighlighter language="json" style={github}>
        {`{
  "jsonrpc": "2.0",
  "result": {
    "context": {
      "slot": 61450160
    },
    "value": {
      "data": [
        "JzsQFXC44LdTb2xzZXRzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg8J+MhSAgICAgICAgICAgIOhf0yxJ3sULLFe/Hecf4oqOq1e5iW3tJaqWu4xyc3s7cTqgGAGVMdTeePxxe8v74OxiO7xMLUKZnbd43wM8QVAAIBgf+OXqQIoxrwybgb24hFj4bfzWu6+Wk/5f1zgsMAZUZ1GAsuYOAAAAAPQBAAAAAAAA",
        "base64"
      ],
      "executable": false,
      "lamports": 2310720,
      "owner": "ForgeZwShFswzeB2FDjRfbGQehFZRpAfQFoH65YG9WZT",
      "rentEpoch": 142
    }
  },
  "id": 1
}`}
      </SyntaxHighlighter>
      <Paragraph className="tech-text">
        The data value is primary piece of interest to us{" "}
        <strong>(note that this will change as people claim Solsets)</strong>.
        The data is base64 encoded, decoding it yields the following
        representation of the account. Hover over the various pieces to see what
        they represent, links for further translation are provided for the UTF-8
        properties.
      </Paragraph>
      <Title level={4}>Decoded data:</Title>
      <Text>
        <pre>
          <Tooltip color="blue" title="Account discriminator">
            <Text className="tech-attrs">27 3b 10 15 70 b8 e0 b7 </Text>
          </Tooltip>
          <Tooltip color="blue" title="Forge name (utf-8)">
            <Link
              href="https://onlineutf8tools.com/convert-hexadecimal-to-utf8?input=53%206f%206c%2073%2065%2074%2073%2020%2020%2020%2020%2020%2020%2020%2020%0A20%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%0A20%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%0A20%2020%2020"
              target="_blank"
              rel="noreferrer"
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              53 6f 6c 73 65 74 73 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
              20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
              20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
            </Link>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Forge symbol (utf-8)">
            <Link
              href="https://onlineutf8tools.com/convert-hexadecimal-to-utf8?input=f0%209f%208c%2085%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%2020%0A"
              target="_blank"
              rel="noreferrer"
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              f0 9f 8c 85 20 20 20 20 20 20 20 20 20 20 20 20
            </Link>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="Hash of the content associated with the forge"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              e8 5f d3 2c 49 de c5 0b 2c 57 bf 1d e7 1f e2 8a 8e ab 57 b9 89 6d
              ed 25 aa 96 bb 8c 72 73 7b 3b
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Authority's Pubkey">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              71 3a a0 18 01 95 31 d4 de 78 fc 71 7b cb fb e0 ec 62 3b bc 4c 2d
              42 99 9d b7 78 df 03 3c 41 50
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Max supply (little endian)">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              00 20
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Supply unclaimed (little endian)">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              18 1f
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Artist's Pubkey">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              f8 e5 ea 40 8a 31 af 0c 9b 81 bd b8 84 58 f8 6d fc d6 bb af 96 93
              fe 5f d7 38 2c 30 06 54 67 51{" "}
            </Text>
          </Tooltip>
          <Tooltip
            color="blue"
            title="Minimum Artist's fee in Lamports (little endian)"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              80 b2 e6 0e 00 00 00 00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="Secondary trading fee paid to the Artist in basis points (little endian)"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              f4 01 00 00 00 00 00 00
            </Text>
          </Tooltip>
        </pre>
      </Text>
      <Title level={2}>Accounts and non-fungible tokens</Title>
      <Paragraph className="tech-text">
        One of Uniforge's primary goals for Solsets was to minimize the cost of
        creating and trading tokens. On Solana, NFT creation{" "}
        <Link
          href="https://spl.solana.com/token#example-create-a-non-fungible-token"
          target="_blank"
          rel="noreferrer"
        >
          usually
        </Link>{" "}
        involves the following steps,
      </Paragraph>
      <Paragraph className="tech-text">
        <ol>
          <li>Create a mint with zero decimals to ensure an integer supply</li>
          <li>Create a new account on the mint</li>
          <li>Mint a single token to the new account</li>
          <li>Freeze the mint to prevent the creation of additional tokens</li>
        </ol>
      </Paragraph>
      <Paragraph className="tech-text">
        From a cost perspective, we can batch these instructions to avoid paying
        multiple transaction fees. But this process requires creating a mint
        account for every NFT and paying the requiste rent to keep that account
        alive. The total cost of creating an NFT via this process is roughly
        ◎0.00354 at the time of writing.
      </Paragraph>
      <Title level={3}>
        An alternative approach to non-fungible tokens on Solana
      </Title>
      <Paragraph className="tech-text">
        For many projects, associating the NFT with an integer such as a u8 or
        u16 is sufficient. CryptoPunks for example has just 10,000 unique
        tokens, a number comfortably within the range of a u16. If <em>i</em> is
        the punk id, then punk <em>i</em> is simply the piece of content at
        index <em>i</em> within an array of content. To commit to a specific
        random ordering of punks and ensure consensus about which punk is which,
        Larva Labs{" "}
        <Link href="https://github.com/larvalabs/cryptopunks/blob/11532167fa705ced569fc3206df0484f9027e1ee/contracts/CryptoPunksMarket.sol#L5">
          included the hash
        </Link>{" "}
        of this content array (a composite image of all punks) in their
        CryptoPunks contract.
      </Paragraph>
      <Paragraph className="tech-text">
        We adopted a similar approach for Solsets, and more broadly any project
        that fits this paradigm (note the content hash property on the Forge
        struct). Since there are only 8,192 unique Solsets, we represent each
        Solset by a u16. Additionally, each Solset can offered for sale, and if
        so, a minimum acceptable bid for the Solset can be specified. This leads
        to the following data structure for each token.
      </Paragraph>
      <SyntaxHighlighter language="rust" style={github}>
        {`pub struct Token {
    pub id: u16,
    pub for_sale: bool,
    pub min_bid_lamports: u64,
}`}
      </SyntaxHighlighter>

      <Paragraph className="tech-text">
        Rather than keep a global map from Solset number to the owner's public
        key, as is done for ERC-721 but would prevent parallel execution in the
        Solana runtime, for each user we create an account which "holds" their
        tokens. The cost of this approach is roughly ◎0.000126 per token at the
        time of writing (3.5% of the cost of the usual NFT creation process
        using the token program). It is worth noting that both approaches offer
        very low fiat costs; $0.142 and $0.00503, respectively, assuming $40 per
        Sol. We simply sought to leverage the ERC-721 design pattern to further
        reduce creation costs.
      </Paragraph>
      <Title level={3}>Token accounts</Title>
      <Paragraph className="tech-text">
        Now that we have covered how Uniforge represents NFTs, we can introduce
        the token account datastructure and unpack a live one from Devnet. The
        schema for a token account is presented below. For convience, we keep
        track of the number of token's in the account. Next is an array of{" "}
        <em>Token</em> structs, followed by the owner's public key and the
        native token account that they wish to use for reciept of any proceeds
        from selling tokens.
      </Paragraph>
      <SyntaxHighlighter language="rust" style={github}>
        {`pub struct TokenAccount {
    pub n_tokens: u16,
    pub owned_tokens: [Token; 32],
    pub authority: Pubkey,
    pub native_token_address: Pubkey,
}`}
      </SyntaxHighlighter>
      <Paragraph className="tech-text">
        Use the JSON RPC to request the state of an account,
      </Paragraph>
      <Title level={4}>Request:</Title>
      <SyntaxHighlighter language="bash" style={github}>
        {`curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      "5ACQMPvy7HxcSyqsqERYj6Yq36Gz52YRnd73g1bgE8XH",
      {
        "encoding": "jsonParsed"
      }
    ]
  }
'`}
      </SyntaxHighlighter>
      <Title level={4}>
        Response{" "}
        <Text type="secondary">
          (This state changes as Solsets are claimed or traded so your response
          will be different)
        </Text>
        :
      </Title>
      <SyntaxHighlighter language="json" style={github}>
        {`{
  "jsonrpc": "2.0",
  "result": {
    "context": {
      "slot": 61482193
    },
    "value": {
      "data": [
        "3IPsEJHOzzYCAN8AAP//////////4QAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+Cpv9hA2VyUlrzM6tiDS+MayuepYaQBWZlxJco5b0Ief3KD58ClvVwy6eyi/G8aFF0BjqFK6AadTbq5yXR/9o/g==",
        "base64"
      ],
      "executable": false,
      "lamports": 3862800,
      "owner": "ForgeZwShFswzeB2FDjRfbGQehFZRpAfQFoH65YG9WZT",
      "rentEpoch": 142
    }
  },
  "id": 1
}`}
      </SyntaxHighlighter>
      <Title level={4}>Decoded data:</Title>
      <Text>
        <pre>
          <Tooltip color="blue" title="Account discriminator">
            <Text className="tech-attrs">dc 83 ec 10 91 ce cf 36</Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Number of tokens owned">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              02 00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="The id of the first token in the account"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              df 00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="Whether the first token is offered for sale"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="The minimum acceptable bid for the first token in lamports"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              ff ff ff ff ff ff ff ff
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="The id of the second token in the account"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              e1 00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="Whether the second token is offered for sale"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              00
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="The minimum acceptable bid for the second token in lamports"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              ff ff ff ff ff ff ff ff
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Remaining space in account for tokens">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
              00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
            </Text>
          </Tooltip>{" "}
          <Tooltip color="blue" title="Authority's Pubkey">
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              be 0a 9b fd 84 0d 95 c9 49 6b cc ce ad 88 34 be 31 ac ae 7a 96 1a
              40 15 99 97 12 5c a3 96 f4 21
            </Text>
          </Tooltip>{" "}
          <Tooltip
            color="blue"
            title="Pubkey of native token account for proceeds from sales"
          >
            <Text
              className="tech-attrs"
              style={{ textDecoration: "none", color: "black" }}
            >
              e7 f7 28 3e 7c 0a 5b d5 c3 2e 9e ca 2f c6 f1 a1 45 d0 18 ea 14 ae
              80 69 d4 db ab 9c 97 47 ff 68 fe
            </Text>
          </Tooltip>
        </pre>
      </Text>
      <Paragraph className="tech-text">
        Arguably the most readily apparent limitation of this approach is the
        fixed number of tokens each account can hold. For Devnet Solsets, we
        chose a size of 32 tokens per account, but this is an arbitrary choice.
        Ultimately this affects the size of the upfornt cost of rent-exemption.
        There are many solutions that allow for owning more tokens such as
        paying for a larger account upfront, adding an attribute to the account
        layout which points to the "next" account, or creating associated
        accounts with deterministic seeds that increment.
      </Paragraph>
      <Title level={2}>Claiming a token and transfers</Title>
      <Paragraph className="tech-text">
        Now that the basic data structures are laid out, we can cover how the
        program mutates state when tokens are claimed or transfered between
        accounts. When a new token is claimed, the program checks whether all of
        the tokens have already been claimed. If there are any unclaimed tokens,
        then the program creates a new token, adds it to the user's account, and
        pays the artist. If all tokens have been claimed then the program
        throws.
      </Paragraph>
      <Paragraph className="tech-text">
        Transfers or trades involve mutating the accounts of both the seller and
        buyer. When a seller marks a token as being offered for sale, this
        enables anyone to purchase the token by paying the minimum fee specified
        by the seller. When this happens, the program checks that the token is
        indeed owned and offered for sale by the seller, the program then checks
        that the buyer has room for the token in their account, lastly it checks
        that the fee being paid is sufficient given the seller's asking price.
        If all these criteria are met, then the trade is able to occur.
      </Paragraph>
      <Title level={2}>Events</Title>
      <Paragraph className="tech-text">
        There are three events emitted by the program,
      </Paragraph>
      <Paragraph className="tech-text">
        <ol>
          <li>
            ForgeEvent - This event occurs whenever a new token is claimed
          </li>
          <li>
            OfferEvent - This event occurs whenever a token is offered for sale
          </li>
          <li>
            TransferEvent - This event occurs whenever a token is transferred
            between users
          </li>
        </ol>
      </Paragraph>
      <Paragraph className="tech-text">
        Anyone can subscribe to the program's logs, parse these events, and
        define their own logic that is triggered as a result. The specific
        structures are presented below and can be unpacked from the logs in a
        similar manner as was done above.
      </Paragraph>
      <SyntaxHighlighter language="rust" style={github}>
        {`pub struct ForgeEvent {
    pub token_id: u16,
    pub owner: Pubkey,
}

pub struct OfferEvent {
    pub token_id: u16,
    pub seller: Pubkey,
    pub min_bid_lamports: u64,
}

pub struct TransferEvent {
    pub token_id: u16,
    pub from: Pubkey,
    pub to: Pubkey,
}`}
      </SyntaxHighlighter>
    </div>
  );
}
