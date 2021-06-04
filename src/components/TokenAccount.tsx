import { useSelector } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";
import { State as StoreState } from "../store/reducer";
import { Typography, Row, Col } from "antd";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { CreateAccount } from "./CreateAccount";
import { ClaimToken } from "./ClaimToken";
import { BeachCard } from "./BeachCard";
import { NullBeachCard } from "./NullBeachCard";
import { AccountState } from "../types";
import { FORGE_ID, LABELS } from "../constants";

const { Title, Paragraph, Text } = Typography;

function AccountCard(account: AccountState, imgUrilBase: string) {
  return account.authority !== null ? (
    <Row gutter={[{ xs: 0, sm: 16 }, 16]}>
      {account.ownedTokens
        .filter((token) => token.id !== 0)
        .sort((a, b) => {
          return a.id - b.id;
        })
        .map((token) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={token.id}>
              <BeachCard token={token} imgUriBase={imgUrilBase} />
            </Col>
          );
        })}
      {account.ownedTokens
        .filter((token) => token.id === 0)
        .sort((a, b) => {
          return a.id - b.id;
        })
        .map((token, index) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={-1 * index}>
              <NullBeachCard />
            </Col>
          );
        })}
    </Row>
  ) : (
    <Text>Account does not exist</Text>
  );
}

export function TokenAccount(props: {
  getBalance: any;
  getForge: any;
  balanceSol: number;
}) {
  // let history = useHistory();
  const { tokenAccount } = useTokenAccount();
  const { network, contentProvider } = useSelector((state: StoreState) => {
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

  return (
    <div>
      {tokenAccount ? (
        <div>
          <Row gutter={16} style={{ paddingTop: "1em", paddingBottom: "2em" }}>
            <Col span={24}>
              <Paragraph className="home-text">
                Each {LABELS.TOKEN_NAME} is{" "}
                <Link to={{ pathname: "/", hash: "#algo-gen-unique" }}>
                  algorithmically generated and unique
                </Link>
                , click one to see the other side, or claim another for a change
                of scenery. You have {tokenAccount.nTokens} {LABELS.TOKEN_NAME}s
                (each account holds up to {LABELS.MAX_TOKENS_PER_WALLET}).
              </Paragraph>
            </Col>

            <ClaimToken
              getBalance={props.getBalance}
              getForge={props.getForge}
              balanceSol={props.balanceSol}
              disabled={tokenAccount.nTokens >= LABELS.MAX_TOKENS_PER_WALLET}
              network={network}
              contentProvider={contentProvider}
            />
          </Row>
          {AccountCard(tokenAccount, imgUriBase)}
        </div>
      ) : (
        <div>
          <Row gutter={16} style={{ paddingTop: "1em" }}>
            <Col span={24}>
              <Paragraph className="home-text">
                You don't have any {LABELS.TOKEN_NAME}s yet. Creating an account
                and claiming a {LABELS.TOKEN_NAME} requires paying a minimum fee
                of {LABELS.SOL_SYM + LABELS.MIN_FEE} to the artist. If all{" "}
                {LABELS.TOKEN_NAME}s have been claimed, you will have to buy one
                in the secondary market.
              </Paragraph>
            </Col>
          </Row>
          <br />
          <CreateAccount
            getBalance={props.getBalance}
            getForge={props.getForge}
            balanceSol={props.balanceSol}
          />
        </div>
      )}
    </div>
  );
}
