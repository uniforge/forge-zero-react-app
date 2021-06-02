import { Typography, Row, Col } from "antd";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { CreateAccount } from "./CreateAccount";
import { ClaimToken } from "./ClaimToken";
import { BeachCard } from "./BeachCard";
import { AccountState } from "../types";

const { Title, Text } = Typography;

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

export function TokenAccount(props: { getBalance: any; getForge: any }) {
  const { tokenAccount } = useTokenAccount();

  return (
    <div>
      {tokenAccount ? (
        <div>
          <Title level={4}>Holdings</Title>
          <ClaimToken getBalance={props.getBalance} getForge={props.getForge} />
          <br />
          <Text>{"Number of tokens: " + tokenAccount.nTokens}</Text>
          <br />
          <div>{AccountCard(tokenAccount)}</div>
          <br />
        </div>
      ) : (
        <div>
          <Text>You don't have a Forge account, yet.</Text>
          <br />
          <CreateAccount
            getBalance={props.getBalance}
            getForge={props.getForge}
          />
        </div>
      )}
    </div>
  );
}
