import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { useHistory, generatePath } from "react-router-dom";
import { Typography, Input, Row, Col, Select } from "antd";
import { useForge } from "../contexts/ForgeProvider";
import { PublicKey } from "@solana/web3.js";
import { Token } from "../types";
import { SearchQuery } from "../components/SearchQuery";
import { TokenDisplay } from "../components/TokenDisplay";
import { LABELS, FORGE_ID } from "../constants";

const { Title } = Typography;
const { Search } = Input;

export function BrowseView(props: { height: number }) {
  let history = useHistory();
  const { forge } = useForge();
  // const [sortAsc, setSortAsc] = useState<boolean>(false);
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.explorerClusterSuffix,
      contentProvider: state.common.network.forgeContentProvider,
    };
  });

  const imgUriBase =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/";

  let tokens = new Array<Token>();

  if (forge?.maxSupply && forge?.supplyUnclaimed) {
    const maxTokenId = forge.maxSupply - forge.supplyUnclaimed;
    for (let i = 0; i < Math.min(20, maxTokenId); i++) {
      let curTokenId = maxTokenId - i;
      tokens.push({ id: curTokenId } as Token);
    }
  } else {
    tokens.push({ id: 0 } as Token);
  }

  const onSearch = (value: string) => {
    if (value !== "") {
      if (value.length === 44) {
        // Assume query is a pubkey
        const newPath = generatePath("/listAccount/:publickey", {
          publickey: value,
        });
        history.push(newPath);
      } else {
        // Assume it is a token id
        const newPath = generatePath("/tokenDetail/:tokenId", {
          tokenId: value,
        });
        history.push(newPath);
      }
    }
  };

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Row style={{ paddingBottom: "2.6em" }}>
        <Col flex="auto"></Col>
        <Col>
          <SearchQuery />
        </Col>
        <Col flex="auto"></Col>
      </Row>
      <Title level={2} style={{ paddingBottom: "0.5em" }}>
        Recently Forged {LABELS.TOKEN_NAME}s
      </Title>
      <TokenDisplay tokens={tokens} imgUrilBase={imgUriBase} />
    </div>
  );
}
