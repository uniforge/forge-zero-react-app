import { Typography, Row, Col } from "antd";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { CreateAccount } from "./CreateAccount";
import { ClaimToken } from "./ClaimToken";
import { BeachCard } from "./BeachCard";
import { AccountState } from "../types";
import { LABELS } from "../constants";

const { Title, Paragraph, Text } = Typography;

function AccountCard(account: AccountState) {
  return account.authority !== null ? (
    <Row gutter={[{ xs: 0, sm: 16 }, 16]}>
      {account.ownedTokens
        .filter((token) => token.id !== 0)
        .sort((a, b) => {
          return a.id - b.id;
        })
        .map((token, index) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={index}>
              <BeachCard token={token} />
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
  const { tokenAccount } = useTokenAccount();

  return (
    <div>
      {tokenAccount ? (
        <div>
          <Row gutter={16} style={{ paddingTop: "1em", paddingBottom: "2em" }}>
            <Col span={24}>
              <Paragraph className="home-text">
                You have {tokenAccount.nTokens} {LABELS.TOKEN_NAME}s (each
                account holds up to {LABELS.MAX_TOKENS_PER_WALLET}). Each{" "}
                {LABELS.TOKEN_NAME} is algorithmically generated and unique, try
                claiming another for a change of scenery.
              </Paragraph>
            </Col>

            <ClaimToken
              getBalance={props.getBalance}
              getForge={props.getForge}
              balanceSol={props.balanceSol}
              disabled={tokenAccount.nTokens >= LABELS.MAX_TOKENS_PER_WALLET}
            />
          </Row>
          {AccountCard(tokenAccount)}
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
