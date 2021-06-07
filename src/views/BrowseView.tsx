import { useSelector } from "react-redux";
import { State as StoreState } from "../store/reducer";
import { Typography, Row, Col } from "antd";
import { useForge } from "../contexts/ForgeProvider";
import { Token } from "../types";
import { SearchQuery } from "../components/SearchQuery";
import { TokenDisplay } from "../components/TokenDisplay";
import { LABELS, FORGE_ID } from "../constants";

const { Title } = Typography;

export function BrowseView(props: { height: number }) {
  const { forge } = useForge();
  // const [sortAsc, setSortAsc] = useState<boolean>(false);
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.contentNetwork,
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

  if (forge) {
    const maxTokenId = forge.maxSupply - forge.supplyUnclaimed;
    for (let i = 0; i < Math.min(20, maxTokenId); i++) {
      let curTokenId = maxTokenId - i;
      tokens.push({ id: curTokenId } as Token);
    }
  } else {
    tokens.push({ id: 0 } as Token);
  }

  return (
    <div
      className="site-layout-background"
      style={{ padding: "5% 15%", minHeight: props.height - 162 }}
    >
      <Title level={1}>Browse and Search</Title>
      <Row style={{ paddingBottom: "2.6em", paddingTop: "1em" }}>
        <Col flex="auto"></Col>
        <Col>
          <SearchQuery />
        </Col>
        <Col flex="auto"></Col>
      </Row>
      <Title level={2} style={{ paddingBottom: "0.5em" }}>
        Recent {LABELS.TOKEN_NAME_PLURAL}
      </Title>
      <TokenDisplay
        tokens={tokens}
        imgUrilBase={imgUriBase}
        ascending={false}
      />
    </div>
  );
}
