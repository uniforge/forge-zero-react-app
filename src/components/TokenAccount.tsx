import { useSelector } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";
import { State as StoreState } from "../store/reducer";
import { Typography, Row, Col } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { CreateAccount } from "./CreateAccount";
import { ClaimToken } from "./ClaimToken";
import { TokenDisplay } from "./TokenDisplay";
import { FORGE_ID, LABELS } from "../constants";
import { useState } from "react";

const { Paragraph } = Typography;

function SortButton(props: { ascending: boolean; handleClick: any }) {
  return (
    <Col>
      {props.ascending ? (
        <SortAscendingOutlined
          style={{ fontSize: "2em" }}
          onClick={() => props.handleClick(false)}
        />
      ) : (
        <SortDescendingOutlined
          style={{ fontSize: "2em" }}
          onClick={() => props.handleClick(true)}
        />
      )}
    </Col>
  );
}

export function TokenAccount(props: {
  getBalance: any;
  getForge: any;
  balanceSol: number;
  unclaimedSupply: boolean;
}) {
  // let history = useHistory();
  const { tokenAccount } = useTokenAccount();
  const { network, contentProvider } = useSelector((state: StoreState) => {
    return {
      network: state.common.network.contentNetwork,
      contentProvider: state.common.network.forgeContentProvider,
    };
  });
  const [ascending, setAscending] = useState<boolean>(false);

  function handleSortClick(asc: boolean) {
    setAscending(asc);
  }

  const imgUriBase =
    "https://uniforge-public.s3.amazonaws.com/" +
    network +
    "/" +
    FORGE_ID.toBase58() +
    "/";

  return (
    <div>
      {tokenAccount ? (
        <div>
          {props.unclaimedSupply ? (
            <Row
              gutter={16}
              style={{ paddingTop: "1em", paddingBottom: "2em" }}
            >
              <Col span={24}>
                <Paragraph className="home-text">
                  You have {tokenAccount.nTokens} {LABELS.TOKEN_NAME_PLURAL}.
                  Each {LABELS.TOKEN_NAME} is{" "}
                  <Link to={{ pathname: "/", hash: "#algo-gen-unique" }}>
                    algorithmically generated and unique
                  </Link>
                  , click on one to see the other side, or claim another for a
                  change of scenery.
                </Paragraph>
              </Col>
              <ClaimToken
                getBalance={props.getBalance}
                getForge={props.getForge}
                balanceSol={props.balanceSol}
                disabled={
                  tokenAccount.nTokens >= tokenAccount.ownedTokens.length
                }
                network={network}
                contentProvider={contentProvider}
              />
            </Row>
          ) : (
            <Row
              gutter={16}
              style={{ paddingTop: "1em", paddingBottom: "2em" }}
            >
              <Col span={24}>
                <Paragraph className="home-text">
                  You have {tokenAccount.nTokens} {LABELS.TOKEN_NAME_PLURAL}.
                  Each {LABELS.TOKEN_NAME} is{" "}
                  <Link to={{ pathname: "/", hash: "#algo-gen-unique" }}>
                    algorithmically generated and unique
                  </Link>
                  , click on one to see the other side, or purchase one on the
                  secondary market.
                </Paragraph>
              </Col>
            </Row>
          )}
          <Row>
            <Col flex="auto"></Col>
            <SortButton ascending={ascending} handleClick={handleSortClick} />
          </Row>
          <TokenDisplay
            tokens={tokenAccount.ownedTokens}
            imgUrilBase={imgUriBase}
            ascending={ascending}
          />
        </div>
      ) : (
        <div>
          <Row gutter={16} style={{ paddingTop: "1em" }}>
            <Col span={24}>
              <Paragraph className="home-text">
                You don't have any {LABELS.TOKEN_NAME_PLURAL} yet. Creating an
                account and claiming a {LABELS.TOKEN_NAME} requires paying a
                minimum fee to the artist. If all {LABELS.TOKEN_NAME}s have been
                claimed, you will have to buy one in the secondary market.
              </Paragraph>
            </Col>
          </Row>
          <br />
          <CreateAccount
            getBalance={props.getBalance}
            getForge={props.getForge}
            balanceSol={props.balanceSol}
            network={network}
            contentProvider={contentProvider}
          />
        </div>
      )}
    </div>
  );
}
